import React, { createContext, ReactNode, useContext } from 'react';
import { useWatchlist } from '../hooks/use-watchlist';
import { Movie } from '../types/movie';

// Define the context value type
interface WatchlistContextType {
	watchlist: import('../services/storage/watchlist').WatchlistMovie[];
	watchlistIds: number[];
	loading: boolean;
	error: string | null;
	addToWatchlist: (movie: Movie) => Promise<boolean>;
	removeFromWatchlist: (movieId: number) => Promise<boolean>;
	toggleWatchlist: (movie: Movie) => Promise<boolean>;
	isInWatchlist: (movieId: number) => Promise<boolean>;
	refreshWatchlist: () => Promise<void>;
	clearWatchlist: () => Promise<boolean>;
	watchlistCount: number;
}

// Create the context with default values
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// Create a provider component
export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const {
		watchlist,
		watchlistIds,
		loading,
		error,
		addToWatchlist,
		removeFromWatchlist,
		toggleWatchlist,
		isInWatchlist,
		refreshWatchlist,
		clearWatchlist,
		watchlistCount,
	} = useWatchlist();

	// Provide all the values to the context
	const contextValue: WatchlistContextType = {
		watchlist,
		watchlistIds,
		loading,
		error,
		addToWatchlist,
		removeFromWatchlist,
		toggleWatchlist,
		isInWatchlist,
		refreshWatchlist,
		clearWatchlist,
		watchlistCount,
	};

	return (
		<WatchlistContext.Provider value={contextValue}>
			{children}
		</WatchlistContext.Provider>
	);
};

// Create a custom hook to use the watchlist context
export const useWatchlistContext = (): WatchlistContextType => {
	const context = useContext(WatchlistContext);

	if (context === undefined) {
		throw new Error('useWatchlistContext must be used within a WatchlistProvider');
	}

	return context;
};