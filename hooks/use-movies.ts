import { useCallback, useEffect, useState } from 'react';
import { tmdbApi } from '../services/api/tmdb';
import { SearchResponse, TrendingResponse } from '../types/api';
import { Movie, MovieDetails } from '../types/movie';

interface UseMoviesReturn {
	// Data
	movies: Movie[];
	trendingMovies: Movie[];
	popularMovies: Movie[];
	topRatedMovies: Movie[];
	nowPlayingMovies: Movie[];
	upcomingMovies: Movie[];
	selectedMovie: MovieDetails | null;

	// Loading states
	loading: boolean;
	loadingTrending: boolean;
	loadingPopular: boolean;
	loadingTopRated: boolean;
	loadingNowPlaying: boolean;
	loadingUpcoming: boolean;
	loadingMovieDetails: boolean;

	// Error states
	error: string | null;
	trendingError: string | null;
	popularError: string | null;
	topRatedError: string | null;
	nowPlayingError: string | null;
	upcomingError: string | null;
	movieDetailsError: string | null;

	// Pagination
	popularPage: number;
	topRatedPage: number;
	nowPlayingPage: number;
	upcomingPage: number;

	// Methods
	fetchTrendingMovies: (timeWindow?: 'day' | 'week') => Promise<void>;
	fetchPopularMovies: (page?: number) => Promise<void>;
	fetchTopRatedMovies: (page?: number) => Promise<void>;
	fetchNowPlayingMovies: (page?: number) => Promise<void>;
	fetchUpcomingMovies: (page?: number) => Promise<void>;
	fetchMovieDetails: (movieId: number) => Promise<void>;
	loadMorePopular: () => Promise<void>;
	loadMoreTopRated: () => Promise<void>;
	loadMoreNowPlaying: () => Promise<void>;
	loadMoreUpcoming: () => Promise<void>;
}

/**
 * Custom hook for managing movie data
 * Provides access to trending, popular, top rated, now playing, and upcoming movies
 * Also handles movie details fetching
 */
export const useMovies = (): UseMoviesReturn => {
	// Movie lists
	const [movies, setMovies] = useState<Movie[]>([]);
	const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
	const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
	const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
	const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
	const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
	const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);

	// Loading states
	const [loading, setLoading] = useState(false);
	const [loadingTrending, setLoadingTrending] = useState(false);
	const [loadingPopular, setLoadingPopular] = useState(false);
	const [loadingTopRated, setLoadingTopRated] = useState(false);
	const [loadingNowPlaying, setLoadingNowPlaying] = useState(false);
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);
	const [loadingMovieDetails, setLoadingMovieDetails] = useState(false);

	// Error states
	const [error, setError] = useState<string | null>(null);
	const [trendingError, setTrendingError] = useState<string | null>(null);
	const [popularError, setPopularError] = useState<string | null>(null);
	const [topRatedError, setTopRatedError] = useState<string | null>(null);
	const [nowPlayingError, setNowPlayingError] = useState<string | null>(null);
	const [upcomingError, setUpcomingError] = useState<string | null>(null);
	const [movieDetailsError, setMovieDetailsError] = useState<string | null>(null);

	// Pagination
	const [popularPage, setPopularPage] = useState(1);
	const [topRatedPage, setTopRatedPage] = useState(1);
	const [nowPlayingPage, setNowPlayingPage] = useState(1);
	const [upcomingPage, setUpcomingPage] = useState(1);

	/**
	 * Fetch trending movies
	 */
	const fetchTrendingMovies = useCallback(async (timeWindow: 'day' | 'week' = 'week') => {
		try {
			setLoadingTrending(true);
			setTrendingError(null);

			const response: TrendingResponse<Movie> = await tmdbApi.getTrendingMovies(timeWindow);
			setTrendingMovies(response.results);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trending movies';
			setTrendingError(errorMessage);
			console.error('Error fetching trending movies:', err);
		} finally {
			setLoadingTrending(false);
		}
	}, []);

	/**
	 * Fetch popular movies
	 */
	const fetchPopularMovies = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingPopular(true);
			}
			setPopularError(null);

			const response: SearchResponse<Movie> = await tmdbApi.getPopularMovies(page);

			if (page === 1) {
				setPopularMovies(response.results);
			} else {
				setPopularMovies(prev => [...prev, ...response.results]);
			}

			setPopularPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch popular movies';
			setPopularError(errorMessage);
			console.error('Error fetching popular movies:', err);
		} finally {
			if (page === 1) {
				setLoadingPopular(false);
			}
		}
	}, []);

	/**
	 * Fetch top rated movies
	 */
	const fetchTopRatedMovies = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingTopRated(true);
			}
			setTopRatedError(null);

			const response: SearchResponse<Movie> = await tmdbApi.getTopRatedMovies(page);

			if (page === 1) {
				setTopRatedMovies(response.results);
			} else {
				setTopRatedMovies(prev => [...prev, ...response.results]);
			}

			setTopRatedPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top rated movies';
			setTopRatedError(errorMessage);
			console.error('Error fetching top rated movies:', err);
		} finally {
			if (page === 1) {
				setLoadingTopRated(false);
			}
		}
	}, []);

	/**
	 * Fetch now playing movies
	 */
	const fetchNowPlayingMovies = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingNowPlaying(true);
			}
			setNowPlayingError(null);

			const response: SearchResponse<Movie> = await tmdbApi.getNowPlayingMovies(page);

			if (page === 1) {
				setNowPlayingMovies(response.results);
			} else {
				setNowPlayingMovies(prev => [...prev, ...response.results]);
			}

			setNowPlayingPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch now playing movies';
			setNowPlayingError(errorMessage);
			console.error('Error fetching now playing movies:', err);
		} finally {
			if (page === 1) {
				setLoadingNowPlaying(false);
			}
		}
	}, []);

	/**
	 * Fetch upcoming movies
	 */
	const fetchUpcomingMovies = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingUpcoming(true);
			}
			setUpcomingError(null);

			const response: SearchResponse<Movie> = await tmdbApi.getUpcomingMovies(page);

			if (page === 1) {
				setUpcomingMovies(response.results);
			} else {
				setUpcomingMovies(prev => [...prev, ...response.results]);
			}

			setUpcomingPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming movies';
			setUpcomingError(errorMessage);
			console.error('Error fetching upcoming movies:', err);
		} finally {
			if (page === 1) {
				setLoadingUpcoming(false);
			}
		}
	}, []);

	/**
	 * Fetch movie details by ID
	 */
	const fetchMovieDetails = useCallback(async (movieId: number) => {
		try {
			setLoadingMovieDetails(true);
			setMovieDetailsError(null);

			const movieDetails: MovieDetails = await tmdbApi.getMovieDetails(movieId);
			setSelectedMovie(movieDetails);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movie details';
			setMovieDetailsError(errorMessage);
			console.error('Error fetching movie details:', err);
		} finally {
			setLoadingMovieDetails(false);
		}
	}, []);

	/**
	 * Load more popular movies
	 */
	const loadMorePopular = useCallback(async () => {
		await fetchPopularMovies(popularPage + 1);
	}, [fetchPopularMovies, popularPage]);

	/**
	 * Load more top rated movies
	 */
	const loadMoreTopRated = useCallback(async () => {
		await fetchTopRatedMovies(topRatedPage + 1);
	}, [fetchTopRatedMovies, topRatedPage]);

	/**
	 * Load more now playing movies
	 */
	const loadMoreNowPlaying = useCallback(async () => {
		await fetchNowPlayingMovies(nowPlayingPage + 1);
	}, [fetchNowPlayingMovies, nowPlayingPage]);

	/**
	 * Load more upcoming movies
	 */
	const loadMoreUpcoming = useCallback(async () => {
		await fetchUpcomingMovies(upcomingPage + 1);
	}, [fetchUpcomingMovies, upcomingPage]);

	// Initial data fetching
	useEffect(() => {
		fetchTrendingMovies();
		fetchPopularMovies(1);
		fetchTopRatedMovies(1);
		fetchNowPlayingMovies(1);
		fetchUpcomingMovies(1);
	}, [fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies, fetchUpcomingMovies]);

	return {
		// Data
		movies,
		trendingMovies,
		popularMovies,
		topRatedMovies,
		nowPlayingMovies,
		upcomingMovies,
		selectedMovie,

		// Loading states
		loading,
		loadingTrending,
		loadingPopular,
		loadingTopRated,
		loadingNowPlaying,
		loadingUpcoming,
		loadingMovieDetails,

		// Error states
		error,
		trendingError,
		popularError,
		topRatedError,
		nowPlayingError,
		upcomingError,
		movieDetailsError,

		// Pagination
		popularPage,
		topRatedPage,
		nowPlayingPage,
		upcomingPage,

		// Methods
		fetchTrendingMovies,
		fetchPopularMovies,
		fetchTopRatedMovies,
		fetchNowPlayingMovies,
		fetchUpcomingMovies,
		fetchMovieDetails,
		loadMorePopular,
		loadMoreTopRated,
		loadMoreNowPlaying,
		loadMoreUpcoming,
	};
};