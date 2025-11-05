import { useCallback, useEffect, useState } from 'react';
import { WatchlistMovie, WatchlistService } from '../services/storage/watchlist';
import { Movie } from '../types/movie';

interface UseWatchlistReturn {
	watchlist: WatchlistMovie[];
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

/**
 * Custom hook for managing movie watchlist
 * Provides methods to add, remove, toggle, and check watchlist status of movies
 */
export const useWatchlist = (): UseWatchlistReturn => {
	const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
	const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [watchlistCount, setWatchlistCount] = useState(0);

	/**
	 * Load watchlist from storage
	 */
	const loadWatchlist = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const watchlistMovies = await WatchlistService.getWatchlistMovies();
			const ids = await WatchlistService.getWatchlistMovieIds();
			const count = await WatchlistService.getWatchlistCount();

			setWatchlist(watchlistMovies);
			setWatchlistIds(ids);
			setWatchlistCount(count);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load watchlist';
			setError(errorMessage);
			console.error('Error loading watchlist:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Add a movie to watchlist
	 */
	const addToWatchlist = useCallback(async (movie: Movie): Promise<boolean> => {
		try {
			setError(null);
			const success = await WatchlistService.addMovie(movie);

			if (success) {
				// Refresh the watchlist
				await loadWatchlist();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to add to watchlist';
			setError(errorMessage);
			console.error('Error adding to watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	/**
	 * Remove a movie from watchlist
	 */
	const removeFromWatchlist = useCallback(async (movieId: number): Promise<boolean> => {
		try {
			setError(null);
			const success = await WatchlistService.removeMovie(movieId);

			if (success) {
				// Refresh the watchlist
				await loadWatchlist();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to remove from watchlist';
			setError(errorMessage);
			console.error('Error removing from watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	/**
	 * Toggle watchlist status of a movie
	 */
	const toggleWatchlist = useCallback(async (movie: Movie): Promise<boolean> => {
		try {
			setError(null);
			const isNowInWatchlist = await WatchlistService.toggleMovieWatchlist(movie);

			// Refresh the watchlist
			await loadWatchlist();

			return isNowInWatchlist;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to toggle watchlist';
			setError(errorMessage);
			console.error('Error toggling watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	/**
	 * Check if a movie is in watchlist
	 */
	const isInWatchlist = useCallback(async (movieId: number): Promise<boolean> => {
		try {
			setError(null);
			return await WatchlistService.isMovieInWatchlist(movieId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to check watchlist status';
			setError(errorMessage);
			console.error('Error checking watchlist status:', err);
			return false;
		}
	}, []);

	/**
	 * Refresh watchlist from storage
	 */
	const refreshWatchlist = useCallback(async () => {
		await loadWatchlist();
	}, [loadWatchlist]);

	/**
	 * Clear all watchlist
	 */
	const clearWatchlist = useCallback(async (): Promise<boolean> => {
		try {
			setError(null);
			const success = await WatchlistService.clearAllWatchlist();

			if (success) {
				// Refresh the watchlist
				await loadWatchlist();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to clear watchlist';
			setError(errorMessage);
			console.error('Error clearing watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	// Load watchlist on mount
	useEffect(() => {
		loadWatchlist();
	}, [loadWatchlist]);

	return {
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
};