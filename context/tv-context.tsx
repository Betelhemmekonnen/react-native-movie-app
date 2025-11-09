import React, { createContext, ReactNode, useContext } from 'react';
import { useTVFavorites } from '../hooks/use-tv-favorites';
import { useTVShows } from '../hooks/use-tv-shows';
import { useTVWatchlist } from '../hooks/use-tv-watchlist';
import { TVSeries, TVSeriesDetails } from '../types/tv';

// Define the context value type
interface TVContextType {
	// TV data from useTVShows hook
	trendingTV: TVSeries[];
	popularTV: TVSeries[];
	airingTodayTV: TVSeries[];
	selectedTVShow: TVSeriesDetails | null;

	// Loading states
	loadingTrending: boolean;
	loadingPopular: boolean;
	loadingAiringToday: boolean;
	loadingTVShowDetails: boolean;

	// Error states
	trendingError: string | null;
	popularError: string | null;
	airingTodayError: string | null;
	tvShowDetailsError: string | null;

	// Pagination
	popularPage: number;
	airingTodayPage: number;

	// TV data methods
	fetchTrendingTV: (timeWindow?: 'day' | 'week') => Promise<void>;
	fetchPopularTV: (page?: number) => Promise<void>;
	fetchAiringTodayTV: (page?: number) => Promise<void>;
	fetchTVShowDetails: (tvId: number) => Promise<void>;
	loadMorePopular: () => Promise<void>;
	loadMoreAiringToday: () => Promise<void>;

	// Favorites from useTVFavorites hook
	favorites: import('../services/storage/tv-favorites').FavoriteTVSeries[];
	favoriteIds: number[];
	favoritesLoading: boolean;
	favoritesError: string | null;
	addFavorite: (tvSeries: TVSeries) => Promise<boolean>;
	removeFavorite: (tvSeriesId: number) => Promise<boolean>;
	toggleFavorite: (tvSeries: TVSeries) => Promise<boolean>;
	isFavorite: (tvSeriesId: number) => Promise<boolean>;
	refreshFavorites: () => Promise<void>;
	clearAllFavorites: () => Promise<boolean>;
	favoritesCount: number;

	// Watchlist from useTVWatchlist hook
	watchlist: import('../services/storage/tv-watchlist').WatchlistTVSeries[];
	watchlistIds: number[];
	watchlistLoading: boolean;
	watchlistError: string | null;
	addToWatchlist: (tvSeries: TVSeries) => Promise<boolean>;
	removeFromWatchlist: (tvSeriesId: number) => Promise<boolean>;
	toggleWatchlist: (tvSeries: TVSeries) => Promise<boolean>;
	isInWatchlist: (tvSeriesId: number) => Promise<boolean>;
	refreshWatchlist: () => Promise<void>;
	clearWatchlist: () => Promise<boolean>;
	watchlistCount: number;
}

// Create the context with default values
const TVContext = createContext<TVContextType | undefined>(undefined);

// Create a provider component
export const TVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Use all the TV-related hooks
	const {
		// TV data
		trendingTV,
		popularTV,
		airingTodayTV,
		selectedTVShow,

		// Loading states
		loadingTrending,
		loadingPopular,
		loadingAiringToday,
		loadingTVShowDetails,

		// Error states
		trendingError,
		popularError,
		airingTodayError,
		tvShowDetailsError,

		// Pagination
		popularPage,
		airingTodayPage,

		// Methods
		fetchTrendingTV,
		fetchPopularTV,
		fetchAiringTodayTV,
		fetchTVShowDetails,
		loadMorePopular,
		loadMoreAiringToday,
	} = useTVShows();

	const {
		// Favorites
		favorites,
		favoriteIds,
		loading: favoritesLoading,
		error: favoritesError,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		refreshFavorites,
		clearAllFavorites,
		favoritesCount,
	} = useTVFavorites();

	const {
		// Watchlist
		watchlist,
		watchlistIds,
		loading: watchlistLoading,
		error: watchlistError,
		addToWatchlist,
		removeFromWatchlist,
		toggleWatchlist,
		isInWatchlist,
		refreshWatchlist,
		clearWatchlist,
		watchlistCount,
	} = useTVWatchlist();

	// Provide all the values to the context
	const contextValue: TVContextType = {
		// TV data
		trendingTV,
		popularTV,
		airingTodayTV,
		selectedTVShow,

		// Loading states
		loadingTrending,
		loadingPopular,
		loadingAiringToday,
		loadingTVShowDetails,

		// Error states
		trendingError,
		popularError,
		airingTodayError,
		tvShowDetailsError,

		// Pagination
		popularPage,
		airingTodayPage,

		// TV data methods
		fetchTrendingTV,
		fetchPopularTV,
		fetchAiringTodayTV,
		fetchTVShowDetails,
		loadMorePopular,
		loadMoreAiringToday,

		// Favorites
		favorites,
		favoriteIds,
		favoritesLoading,
		favoritesError,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		refreshFavorites,
		clearAllFavorites,
		favoritesCount,

		// Watchlist
		watchlist,
		watchlistIds,
		watchlistLoading,
		watchlistError,
		addToWatchlist,
		removeFromWatchlist,
		toggleWatchlist,
		isInWatchlist,
		refreshWatchlist,
		clearWatchlist,
		watchlistCount,
	};

	return (
		<TVContext.Provider value={contextValue}>
			{children}
		</TVContext.Provider>
	);
};

// Create a custom hook to use the TV context
export const useTVContext = (): TVContextType => {
	const context = useContext(TVContext);

	if (context === undefined) {
		throw new Error('useTVContext must be used within a TVProvider');
	}

	return context;
};