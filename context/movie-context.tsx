import React, { createContext, ReactNode, useContext } from 'react';
import { useFavorites } from '../hooks/use-favorites';
import { useMovies } from '../hooks/use-movies';
import { useSearch } from '../hooks/use-search';
import { useWatchlist } from '../hooks/use-watchlist';
import { Movie, MovieDetails } from '../types/movie';

// Define the context value type
interface MovieContextType {
	// Movie data from useMovies hook
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

	// Movie data methods
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

	// Favorites from useFavorites hook
	favorites: import('../services/storage/favorites').FavoriteMovie[];
	favoriteIds: number[];
	favoritesLoading: boolean;
	favoritesError: string | null;
	addFavorite: (movie: Movie) => Promise<boolean>;
	removeFavorite: (movieId: number) => Promise<boolean>;
	toggleFavorite: (movie: Movie) => Promise<boolean>;
	isFavorite: (movieId: number) => Promise<boolean>;
	refreshFavorites: () => Promise<void>;
	clearAllFavorites: () => Promise<boolean>;
	favoritesCount: number;

	// Watchlist from useWatchlist hook
	watchlist: import('../services/storage/watchlist').WatchlistMovie[];
	watchlistIds: number[];
	watchlistLoading: boolean;
	watchlistError: string | null;
	addToWatchlist: (movie: Movie) => Promise<boolean>;
	removeFromWatchlist: (movieId: number) => Promise<boolean>;
	toggleWatchlist: (movie: Movie) => Promise<boolean>;
	isInWatchlist: (movieId: number) => Promise<boolean>;
	refreshWatchlist: () => Promise<void>;
	clearWatchlist: () => Promise<boolean>;
	watchlistCount: number;

	// Search from useSearch hook
	searchResults: Movie[];
	searchLoading: boolean;
	searchError: string | null;
	searchTerm: string;
	searchPage: number;
	searchTotalPages: number;
	searchTotalResults: number;
	hasMoreSearchResults: boolean;
	searchMovies: (query: string, page?: number) => Promise<void>;
	loadMoreSearchResults: () => Promise<void>;
	clearSearchResults: () => void;
}

// Create the context with default values
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Create a provider component
export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Use all the movie-related hooks
	const {
		// Movie data
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
	} = useMovies();

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
	} = useFavorites();

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
	} = useWatchlist();

	const {
		// Search
		results: searchResults,
		loading: searchLoading,
		error: searchError,
		searchTerm,
		page: searchPage,
		totalPages: searchTotalPages,
		totalResults: searchTotalResults,
		hasMore: hasMoreSearchResults,
		searchMovies,
		loadMore: loadMoreSearchResults,
		clearResults: clearSearchResults,
	} = useSearch();

	// Provide all the values to the context
	const contextValue: MovieContextType = {
		// Movie data
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

		// Movie data methods
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

		// Search
		searchResults,
		searchLoading,
		searchError,
		searchTerm,
		searchPage,
		searchTotalPages,
		searchTotalResults,
		hasMoreSearchResults,
		searchMovies,
		loadMoreSearchResults,
		clearSearchResults,
	};

	return (
		<MovieContext.Provider value={contextValue}>
			{children}
		</MovieContext.Provider>
	);
};

// Create a custom hook to use the movie context
export const useMovieContext = (): MovieContextType => {
	const context = useContext(MovieContext);

	if (context === undefined) {
		throw new Error('useMovieContext must be used within a MovieProvider');
	}

	return context;
};