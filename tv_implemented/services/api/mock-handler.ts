// Mock response handler for when TMDB API key is not configured
import {
  createMockMovieResponse,
  createMockSeasonData,
  createMockTrendingResponse,
  createMockTVDetails,
  createMockTVResponse,
  mockMovies,
  mockTVSeries
} from './mock-data';

export const getMockResponse = async (endpoint: string): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Movie endpoints
  if (endpoint.includes('/movie/popular')) {
    return createMockMovieResponse(mockMovies);
  }
  
  if (endpoint.includes('/movie/top_rated')) {
    return createMockMovieResponse(mockMovies.sort((a, b) => b.vote_average - a.vote_average));
  }
  
  if (endpoint.includes('/movie/now_playing')) {
    return createMockMovieResponse(mockMovies);
  }
  
  if (endpoint.includes('/movie/upcoming')) {
    return createMockMovieResponse(mockMovies);
  }
  
  if (endpoint.includes('/trending/movie')) {
    return createMockTrendingResponse(mockMovies.sort((a, b) => b.popularity - a.popularity));
  }

  // TV Series endpoints
  if (endpoint.includes('/tv/popular')) {
    return createMockTVResponse(mockTVSeries);
  }
  
  if (endpoint.includes('/tv/top_rated')) {
    return createMockTVResponse(mockTVSeries.sort((a, b) => b.vote_average - a.vote_average));
  }
  
  if (endpoint.includes('/tv/airing_today')) {
    return createMockTVResponse(mockTVSeries);
  }
  
  if (endpoint.includes('/tv/on_the_air')) {
    return createMockTVResponse(mockTVSeries);
  }
  
  if (endpoint.includes('/trending/tv')) {
    return createMockTrendingResponse(mockTVSeries.sort((a, b) => b.popularity - a.popularity));
  }

  // Search endpoints
  if (endpoint.includes('/search/movie')) {
    return createMockMovieResponse(mockMovies);
  }
  
  if (endpoint.includes('/search/tv')) {
    return createMockTVResponse(mockTVSeries);
  }

  // TV Details endpoint - matches /tv/{id}
  if (endpoint.match(/\/tv\/\d+$/) && !endpoint.includes('/season')) {
    const tvId = parseInt(endpoint.match(/\/tv\/(\d+)$/)?.[1] || '1');
    const series = mockTVSeries.find(s => s.id === tvId) || mockTVSeries[0];
    return createMockTVDetails(series);
  }

  // Season Episodes endpoint - matches /tv/{id}/season/{season_number}
  if (endpoint.match(/\/tv\/\d+\/season\/\d+/)) {
    const seasonNumber = parseInt(endpoint.match(/\/season\/(\d+)/)?.[1] || '1');
    return createMockSeasonData(seasonNumber);
  }

  // Default fallback
  console.warn('⚠️ No mock data for endpoint:', endpoint);
  return {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  };
};
