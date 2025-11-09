import { useCallback, useEffect, useState } from 'react';
import { TVWatchlistService, WatchlistTVSeries } from '../services/storage/tv-watchlist';
import { TVSeries } from '../types/tv';

interface UseTVWatchlistReturn {
	watchlist: WatchlistTVSeries[];
	watchlistIds: number[];
	loading: boolean;
	error: string | null;
	addToWatchlist: (tvSeries: TVSeries) => Promise<boolean>;
	removeFromWatchlist: (tvSeriesId: number) => Promise<boolean>;
	toggleWatchlist: (tvSeries: TVSeries) => Promise<boolean>;
	isInWatchlist: (tvSeriesId: number) => Promise<boolean>;
	refreshWatchlist: () => Promise<void>;
	clearWatchlist: () => Promise<boolean>;
	watchlistCount: number;
}

/**
 * Custom hook for managing TV series watchlist
 * Provides methods to add, remove, toggle, and check watchlist status of TV series
 */
export const useTVWatchlist = (): UseTVWatchlistReturn => {
	const [watchlist, setWatchlist] = useState<WatchlistTVSeries[]>([]);
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

			const watchlistTVSeries = await TVWatchlistService.getWatchlistTVSeries();
			const ids = await TVWatchlistService.getWatchlistTVSeriesIds();
			const count = await TVWatchlistService.getWatchlistCount();

			setWatchlist(watchlistTVSeries);
			setWatchlistIds(ids);
			setWatchlistCount(count);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load TV watchlist';
			setError(errorMessage);
			console.error('Error loading TV watchlist:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Add a TV series to watchlist
	 */
	const addToWatchlist = useCallback(async (tvSeries: TVSeries): Promise<boolean> => {
		try {
			setError(null);
			const success = await TVWatchlistService.addTVSeries(tvSeries);

			if (success) {
				// Refresh the watchlist
				await loadWatchlist();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to add to TV watchlist';
			setError(errorMessage);
			console.error('Error adding to TV watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	/**
	 * Remove a TV series from watchlist
	 */
	const removeFromWatchlist = useCallback(async (tvSeriesId: number): Promise<boolean> => {
		try {
			setError(null);
			const success = await TVWatchlistService.removeTVSeries(tvSeriesId);

			if (success) {
				// Refresh the watchlist
				await loadWatchlist();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to remove from TV watchlist';
			setError(errorMessage);
			console.error('Error removing from TV watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	/**
	 * Toggle watchlist status of a TV series
	 */
	const toggleWatchlist = useCallback(async (tvSeries: TVSeries): Promise<boolean> => {
		try {
			setError(null);
			const isNowInWatchlist = await TVWatchlistService.toggleTVSeriesWatchlist(tvSeries);

			// Refresh the watchlist
			await loadWatchlist();

			return isNowInWatchlist;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to toggle TV watchlist';
			setError(errorMessage);
			console.error('Error toggling TV watchlist:', err);
			return false;
		}
	}, [loadWatchlist]);

	/**
	 * Check if a TV series is in watchlist
	 */
	const isInWatchlist = useCallback(async (tvSeriesId: number): Promise<boolean> => {
		try {
			setError(null);
			return await TVWatchlistService.isTVSeriesInWatchlist(tvSeriesId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to check TV watchlist status';
			setError(errorMessage);
			console.error('Error checking TV watchlist status:', err);
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
			const success = await TVWatchlistService.clearAllWatchlist();

			if (success) {
				// Refresh the watchlist
				await loadWatchlist();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to clear TV watchlist';
			setError(errorMessage);
			console.error('Error clearing TV watchlist:', err);
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

