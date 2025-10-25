// API-related type definitions

// Base API response structure
export interface ApiResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
  }
  
  // Search and list responses
  export interface SearchResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
  }
  
  // Trending response (same structure as search)
  export interface TrendingResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
  }
  
  // API error response
  export interface ApiError {
	status_code: number;
	status_message: string;
	success: boolean;
  }
  
  // API request parameters
  export interface SearchParams {
	query: string;
	page?: number;
	language?: string;
	include_adult?: boolean;
	region?: string;
	year?: number;
	primary_release_year?: number;
  }
  
  export interface MovieListParams {
	page?: number;
	language?: string;
	region?: string;
  }
  
  export interface TrendingParams {
	time_window?: 'day' | 'week';
	page?: number;
	language?: string;
  }
  
  // API endpoints configuration
  export interface ApiEndpoints {
	baseUrl: string;
	endpoints: {
	  trending: string;
	  popular: string;
	  topRated: string;
	  nowPlaying: string;
	  upcoming: string;
	  search: string;
	  movieDetails: string;
	  movieCredits: string;
	  movieVideos: string;
	  movieReviews: string;
	  similarMovies: string;
	  recommendations: string;
	};
  }
  
  // HTTP client configuration
  export interface HttpClientConfig {
	baseUrl: string;
	apiKey: string;
	timeout?: number;
	retries?: number;
  }
  
  // API service methods
  export interface MovieApiService {
	getTrendingMovies: (timeWindow?: 'day' | 'week', page?: number) => Promise<TrendingResponse<any>>;
	getPopularMovies: (page?: number) => Promise<SearchResponse<any>>;
	getTopRatedMovies: (page?: number) => Promise<SearchResponse<any>>;
	getNowPlayingMovies: (page?: number) => Promise<SearchResponse<any>>;
	getUpcomingMovies: (page?: number) => Promise<SearchResponse<any>>;
	searchMovies: (query: string, page?: number) => Promise<SearchResponse<any>>;
	getMovieDetails: (movieId: number) => Promise<any>;
	getMovieCredits: (movieId: number) => Promise<any>;
	getMovieVideos: (movieId: number) => Promise<any>;
	getMovieReviews: (movieId: number, page?: number) => Promise<any>;
	getSimilarMovies: (movieId: number, page?: number) => Promise<SearchResponse<any>>;
	getMovieRecommendations: (movieId: number, page?: number) => Promise<SearchResponse<any>>;
  }
  
  // Cache configuration
  export interface CacheConfig {
	enabled: boolean;
	ttl: number; // Time to live in milliseconds
	maxSize: number; // Maximum number of cached items
  }
  
  // Request configuration
  export interface RequestConfig {
	timeout?: number;
	retries?: number;
	cache?: CacheConfig;
	headers?: Record<string, string>;
  }
  
  // Response metadata
  export interface ResponseMetadata {
	timestamp: number;
	cacheHit: boolean;
	requestTime: number;
	status: number;
  }
  