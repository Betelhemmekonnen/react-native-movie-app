import {
  SearchResponse,
  TrendingResponse
} from '../../types/api';
import {
  Movie,
  MovieCredits,
  MovieDetails,
  MovieReviews,
  MovieVideos
} from '../../types/movie';

import {
  Season,
  TVSeries,
  TVSeriesDetails
} from '../../types/tv';

import { httpClient } from './http-client';

// API Functions
export const tmdbApi = {
    // Get trending movies
    getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week'): Promise<TrendingResponse<Movie>> => {
      return httpClient.get(`/trending/movie/${timeWindow}`);
    },
  
    // Get popular movies
    getPopularMovies: async (page: number = 1): Promise<SearchResponse<Movie>> => {
      return httpClient.get(`/movie/popular?page=${page}`);
    },
  
    // Get top rated movies
    getTopRatedMovies: async (page: number = 1): Promise<SearchResponse<Movie>> => {
      return httpClient.get(`/movie/top_rated?page=${page}`);
    },
  
    // Get movie details by ID
    getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
      return httpClient.get(`/movie/${movieId}`);
    },
  
    // Search movies
    searchMovies: async (query: string, page: number = 1): Promise<SearchResponse<Movie>> => {
      const encodedQuery = encodeURIComponent(query);
      return httpClient.get(`/search/movie?query=${encodedQuery}&page=${page}`);
    },
  
    // Get similar movies
    getSimilarMovies: async (movieId: number, page: number = 1): Promise<SearchResponse<Movie>> => {
      return httpClient.get(`/movie/${movieId}/similar?page=${page}`);
    },
  
    // Get movie recommendations
    getMovieRecommendations: async (movieId: number, page: number = 1): Promise<SearchResponse<Movie>> => {
      return httpClient.get(`/movie/${movieId}/recommendations?page=${page}`);
    },
  
    // Get movie credits
    getMovieCredits: async (movieId: number): Promise<MovieCredits> => {
      return httpClient.get(`/movie/${movieId}/credits`);
    },
  
    // Get movie videos (trailers, clips, etc.)
    getMovieVideos: async (movieId: number): Promise<MovieVideos> => {
      return httpClient.get(`/movie/${movieId}/videos`);
    },
  
    // Get movie reviews
    getMovieReviews: async (movieId: number, page: number = 1): Promise<MovieReviews> => {
      return httpClient.get(`/movie/${movieId}/reviews?page=${page}`);
    },
  
    // Get now playing movies
    getNowPlayingMovies: async (page: number = 1): Promise<SearchResponse<Movie>> => {
      return httpClient.get(`/movie/now_playing?page=${page}`);
    },
  
    // Get upcoming movies
    getUpcomingMovies: async (page: number = 1): Promise<SearchResponse<Movie>> => {
      return httpClient.get(`/movie/upcoming?page=${page}`);
    },
  // Get popular TV series
  getPopularTV: async (page: number = 1): Promise<SearchResponse<TVSeries>> => {
    return httpClient.get(`/tv/popular?page=${page}`);
  },

  // Get top rated TV series
  getTopRatedTV: async (page: number = 1): Promise<SearchResponse<TVSeries>> => {
    return httpClient.get(`/tv/top_rated?page=${page}`);
  },

  // Get trending TV series
  getTrendingTV: async (timeWindow: 'day' | 'week' = 'week'): Promise<TrendingResponse<TVSeries>> => {
    return httpClient.get(`/trending/tv/${timeWindow}`);
  },

  // Search TV series
  searchTV: async (query: string, page: number = 1): Promise<SearchResponse<TVSeries>> => {
    const encodedQuery = encodeURIComponent(query);
    return httpClient.get(`/search/tv?query=${encodedQuery}&page=${page}`);
  },

  // Get TV series details
  getTVDetails: async (id: number): Promise<TVSeriesDetails> => {
    return httpClient.get(`/tv/${id}`);
  },

  // Get season episodes
  getSeasonEpisodes: async (tvId: number, seasonNumber: number): Promise<Season> => {
    return httpClient.get(`/tv/${tvId}/season/${seasonNumber}`);
  },

  // Get TV series credits
  getTVCredits: async (tvId: number) => {
    return httpClient.get(`/tv/${tvId}/credits`);
  },

  // Get TV series videos
  getTVVideos: async (tvId: number) => {
    return httpClient.get(`/tv/${tvId}/videos`);
  },

  // Get TV series reviews
  getTVReviews: async (tvId: number, page: number = 1) => {
    return httpClient.get(`/tv/${tvId}/reviews?page=${page}`);
  },

  // Get similar TV series
  getSimilarTV: async (tvId: number, page: number = 1): Promise<SearchResponse<TVSeries>> => {
    return httpClient.get(`/tv/${tvId}/similar?page=${page}`);
  },

  // Get TV series recommendations
  getTVRecommendations: async (tvId: number, page: number = 1): Promise<SearchResponse<TVSeries>> => {
    return httpClient.get(`/tv/${tvId}/recommendations?page=${page}`);
  },

  // Get TV series on the air
  getOnTheAirTV: async (page: number = 1): Promise<SearchResponse<TVSeries>> => {
    return httpClient.get(`/tv/on_the_air?page=${page}`);
  },

  // Get TV series airing today
  getAiringTodayTV: async (page: number = 1): Promise<SearchResponse<TVSeries>> => {
    return httpClient.get(`/tv/airing_today?page=${page}`);
  },
};

export { TVSeries };

