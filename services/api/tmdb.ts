// services/api/tvApi.ts
const API_KEY = 'fd6254a194e5a064e27a9f3d730fe4f7';
const BASE_URL = 'https://api.themoviedb.org/3';

// TV Series Interfaces
export interface TVSeries {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview: string;
  backdrop_path: string | null;
  genre_ids?: number[];
  popularity: number;
  vote_count: number;
  original_language: string;
  original_name: string;
  origin_country: string[];
}

export interface TVSeriesDetails extends TVSeries {
  genres: Genre[];
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  last_air_date: string;
  homepage: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  episode_count: number;
  season_number: number;
  air_date: string;
  overview: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  air_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  still_path: string | null;
}

// API Functions
export const tvApi = {
  // Get popular TV series
  getPopular: async (): Promise<TVSeries[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching popular TV series:', error);
      return [];
    }
  },

  // Get top rated TV series
  getTopRated: async (): Promise<TVSeries[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching top rated TV series:', error);
      return [];
    }
  },

  // Get trending TV series
  getTrending: async (): Promise<TVSeries[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching trending TV series:', error);
      return [];
    }
  },

  // Search TV series
  searchTV: async (query: string): Promise<TVSeries[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching TV series:', error);
      return [];
    }
  },

  // Get TV series details
  getTVDetails: async (id: number): Promise<TVSeriesDetails | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching TV details:', error);
      return null;
    }
  },

  // Get season episodes
  getSeasonEpisodes: async (tvId: number, seasonNumber: number): Promise<Episode[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      return data.episodes || [];
    } catch (error) {
      console.error('Error fetching season episodes:', error);
      return [];
    }
  },
};