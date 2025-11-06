import { useCallback, useState } from 'react';
import { tmdbApi } from '../services/api/tmdb';
import { SearchResponse, TrendingResponse } from '../types/api';
import { Season, TVSeries, TVSeriesDetails } from '../types/tv';

interface UseTVShowsReturn {
	// Data
	tvShows: TVSeries[];
	trendingTV: TVSeries[];
	popularTV: TVSeries[];
	topRatedTV: TVSeries[];
	onTheAirTV: TVSeries[];
	airingTodayTV: TVSeries[];
	selectedTVShow: TVSeriesDetails | null;
	seasonEpisodes: Season | null;

	// Loading states
	loading: boolean;
	loadingTrending: boolean;
	loadingPopular: boolean;
	loadingTopRated: boolean;
	loadingOnTheAir: boolean;
	loadingAiringToday: boolean;
	loadingTVShowDetails: boolean;
	loadingSeasonEpisodes: boolean;

	// Error states
	error: string | null;
	trendingError: string | null;
	popularError: string | null;
	topRatedError: string | null;
	onTheAirError: string | null;
	airingTodayError: string | null;
	tvShowDetailsError: string | null;
	seasonEpisodesError: string | null;

	// Pagination
	popularPage: number;
	topRatedPage: number;
	onTheAirPage: number;
	airingTodayPage: number;

	// Methods
	fetchTrendingTV: (timeWindow?: 'day' | 'week') => Promise<void>;
	fetchPopularTV: (page?: number) => Promise<void>;
	fetchTopRatedTV: (page?: number) => Promise<void>;
	fetchOnTheAirTV: (page?: number) => Promise<void>;
	fetchAiringTodayTV: (page?: number) => Promise<void>;
	fetchTVShowDetails: (tvId: number) => Promise<void>;
	fetchSeasonEpisodes: (tvId: number, seasonNumber: number) => Promise<void>;
	loadMorePopular: () => Promise<void>;
	loadMoreTopRated: () => Promise<void>;
	loadMoreOnTheAir: () => Promise<void>;
	loadMoreAiringToday: () => Promise<void>;
}

/**
 * Custom hook for managing TV show data
 * Provides access to trending, popular, top rated, on the air, and airing today TV shows
 * Also handles TV show details and season episodes fetching
 */
export const useTVShows = (): UseTVShowsReturn => {
	// TV show lists
	const [tvShows, setTVShows] = useState<TVSeries[]>([]);
	const [trendingTV, setTrendingTV] = useState<TVSeries[]>([]);
	const [popularTV, setPopularTV] = useState<TVSeries[]>([]);
	const [topRatedTV, setTopRatedTV] = useState<TVSeries[]>([]);
	const [onTheAirTV, setOnTheAirTV] = useState<TVSeries[]>([]);
	const [airingTodayTV, setAiringTodayTV] = useState<TVSeries[]>([]);
	const [selectedTVShow, setSelectedTVShow] = useState<TVSeriesDetails | null>(null);
	const [seasonEpisodes, setSeasonEpisodes] = useState<Season | null>(null);

	// Loading states
	const [loading, setLoading] = useState(false);
	const [loadingTrending, setLoadingTrending] = useState(false);
	const [loadingPopular, setLoadingPopular] = useState(false);
	const [loadingTopRated, setLoadingTopRated] = useState(false);
	const [loadingOnTheAir, setLoadingOnTheAir] = useState(false);
	const [loadingAiringToday, setLoadingAiringToday] = useState(false);
	const [loadingTVShowDetails, setLoadingTVShowDetails] = useState(false);
	const [loadingSeasonEpisodes, setLoadingSeasonEpisodes] = useState(false);

	// Error states
	const [error, setError] = useState<string | null>(null);
	const [trendingError, setTrendingError] = useState<string | null>(null);
	const [popularError, setPopularError] = useState<string | null>(null);
	const [topRatedError, setTopRatedError] = useState<string | null>(null);
	const [onTheAirError, setOnTheAirError] = useState<string | null>(null);
	const [airingTodayError, setAiringTodayError] = useState<string | null>(null);
	const [tvShowDetailsError, setTVShowDetailsError] = useState<string | null>(null);
	const [seasonEpisodesError, setSeasonEpisodesError] = useState<string | null>(null);

	// Pagination
	const [popularPage, setPopularPage] = useState(1);
	const [topRatedPage, setTopRatedPage] = useState(1);
	const [onTheAirPage, setOnTheAirPage] = useState(1);
	const [airingTodayPage, setAiringTodayPage] = useState(1);

	/**
	 * Fetch trending TV shows
	 */
	const fetchTrendingTV = useCallback(async (timeWindow: 'day' | 'week' = 'week') => {
		try {
			setLoadingTrending(true);
			setTrendingError(null);

			const response: TrendingResponse<TVSeries> = await tmdbApi.getTrendingTV(timeWindow);
			setTrendingTV(response.results);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trending TV shows';
			setTrendingError(errorMessage);
			console.error('Error fetching trending TV shows:', err);
		} finally {
			setLoadingTrending(false);
		}
	}, []);

	/**
	 * Fetch popular TV shows
	 */
	const fetchPopularTV = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingPopular(true);
			}
			setPopularError(null);

			const response: SearchResponse<TVSeries> = await tmdbApi.getPopularTV(page);

			if (page === 1) {
				setPopularTV(response.results);
			} else {
				setPopularTV(prev => [...prev, ...response.results]);
			}

			setPopularPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch popular TV shows';
			setPopularError(errorMessage);
			console.error('Error fetching popular TV shows:', err);
		} finally {
			if (page === 1) {
				setLoadingPopular(false);
			}
		}
	}, []);

	/**
	 * Fetch top rated TV shows
	 */
	const fetchTopRatedTV = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingTopRated(true);
			}
			setTopRatedError(null);

			const response: SearchResponse<TVSeries> = await tmdbApi.getTopRatedTV(page);

			if (page === 1) {
				setTopRatedTV(response.results);
			} else {
				setTopRatedTV(prev => [...prev, ...response.results]);
			}

			setTopRatedPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top rated TV shows';
			setTopRatedError(errorMessage);
			console.error('Error fetching top rated TV shows:', err);
		} finally {
			if (page === 1) {
				setLoadingTopRated(false);
			}
		}
	}, []);

	/**
	 * Fetch on the air TV shows
	 */
	const fetchOnTheAirTV = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingOnTheAir(true);
			}
			setOnTheAirError(null);

			const response: SearchResponse<TVSeries> = await tmdbApi.getOnTheAirTV(page);

			if (page === 1) {
				setOnTheAirTV(response.results);
			} else {
				setOnTheAirTV(prev => [...prev, ...response.results]);
			}

			setOnTheAirPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch on the air TV shows';
			setOnTheAirError(errorMessage);
			console.error('Error fetching on the air TV shows:', err);
		} finally {
			if (page === 1) {
				setLoadingOnTheAir(false);
			}
		}
	}, []);

	/**
	 * Fetch airing today TV shows
	 */
	const fetchAiringTodayTV = useCallback(async (page: number = 1) => {
		try {
			if (page === 1) {
				setLoadingAiringToday(true);
			}
			setAiringTodayError(null);

			const response: SearchResponse<TVSeries> = await tmdbApi.getAiringTodayTV(page);

			if (page === 1) {
				setAiringTodayTV(response.results);
			} else {
				setAiringTodayTV(prev => [...prev, ...response.results]);
			}

			setAiringTodayPage(page);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch airing today TV shows';
			setAiringTodayError(errorMessage);
			console.error('Error fetching airing today TV shows:', err);
		} finally {
			if (page === 1) {
				setLoadingAiringToday(false);
			}
		}
	}, []);

	/**
	 * Fetch TV show details by ID
	 */
	const fetchTVShowDetails = useCallback(async (tvId: number) => {
		try {
			setLoadingTVShowDetails(true);
			setTVShowDetailsError(null);

			const tvShowDetails: TVSeriesDetails = await tmdbApi.getTVDetails(tvId);
			setSelectedTVShow(tvShowDetails);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch TV show details';
			setTVShowDetailsError(errorMessage);
			console.error('Error fetching TV show details:', err);
		} finally {
			setLoadingTVShowDetails(false);
		}
	}, []);

	/**
	 * Fetch season episodes
	 */
	const fetchSeasonEpisodes = useCallback(async (tvId: number, seasonNumber: number) => {
		try {
			setLoadingSeasonEpisodes(true);
			setSeasonEpisodesError(null);

			const season: Season = await tmdbApi.getSeasonEpisodes(tvId, seasonNumber);
			setSeasonEpisodes(season);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch season episodes';
			setSeasonEpisodesError(errorMessage);
			console.error('Error fetching season episodes:', err);
		} finally {
			setLoadingSeasonEpisodes(false);
		}
	}, []);

	/**
	 * Load more popular TV shows
	 */
	const loadMorePopular = useCallback(async () => {
		await fetchPopularTV(popularPage + 1);
	}, [fetchPopularTV, popularPage]);

	/**
	 * Load more top rated TV shows
	 */
	const loadMoreTopRated = useCallback(async () => {
		await fetchTopRatedTV(topRatedPage + 1);
	}, [fetchTopRatedTV, topRatedPage]);

	/**
	 * Load more on the air TV shows
	 */
	const loadMoreOnTheAir = useCallback(async () => {
		await fetchOnTheAirTV(onTheAirPage + 1);
	}, [fetchOnTheAirTV, onTheAirPage]);

	/**
	 * Load more airing today TV shows
	 */
	const loadMoreAiringToday = useCallback(async () => {
		await fetchAiringTodayTV(airingTodayPage + 1);
	}, [fetchAiringTodayTV, airingTodayPage]);

	return {
		// Data
		tvShows,
		trendingTV,
		popularTV,
		topRatedTV,
		onTheAirTV,
		airingTodayTV,
		selectedTVShow,
		seasonEpisodes,

		// Loading states
		loading,
		loadingTrending,
		loadingPopular,
		loadingTopRated,
		loadingOnTheAir,
		loadingAiringToday,
		loadingTVShowDetails,
		loadingSeasonEpisodes,

		// Error states
		error,
		trendingError,
		popularError,
		topRatedError,
		onTheAirError,
		airingTodayError,
		tvShowDetailsError,
		seasonEpisodesError,

		// Pagination
		popularPage,
		topRatedPage,
		onTheAirPage,
		airingTodayPage,

		// Methods
		fetchTrendingTV,
		fetchPopularTV,
		fetchTopRatedTV,
		fetchOnTheAirTV,
		fetchAiringTodayTV,
		fetchTVShowDetails,
		fetchSeasonEpisodes,
		loadMorePopular,
		loadMoreTopRated,
		loadMoreOnTheAir,
		loadMoreAiringToday,
	};
};

