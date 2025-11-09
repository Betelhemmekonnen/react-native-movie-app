import { useCallback, useEffect, useState } from 'react';
import { FavoriteTVSeries, TVFavoritesService } from '../services/storage/tv-favorites';
import { TVSeries } from '../types/tv';

interface UseTVFavoritesReturn {
	favorites: FavoriteTVSeries[];
	favoriteIds: number[];
	loading: boolean;
	error: string | null;
	addFavorite: (tvSeries: TVSeries) => Promise<boolean>;
	removeFavorite: (tvSeriesId: number) => Promise<boolean>;
	toggleFavorite: (tvSeries: TVSeries) => Promise<boolean>;
	isFavorite: (tvSeriesId: number) => Promise<boolean>;
	refreshFavorites: () => Promise<void>;
	clearAllFavorites: () => Promise<boolean>;
	favoritesCount: number;
}

/**
 * Custom hook for managing TV series favorites
 * Provides methods to add, remove, toggle, and check favorite status of TV series
 */
export const useTVFavorites = (): UseTVFavoritesReturn => {
	const [favorites, setFavorites] = useState<FavoriteTVSeries[]>([]);
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [favoritesCount, setFavoritesCount] = useState(0);

	/**
	 * Load favorites from storage
	 */
	const loadFavorites = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const favoriteTVSeries = await TVFavoritesService.getFavoriteTVSeries();
			const ids = await TVFavoritesService.getFavoriteTVSeriesIds();
			const count = await TVFavoritesService.getFavoritesCount();

			setFavorites(favoriteTVSeries);
			setFavoriteIds(ids);
			setFavoritesCount(count);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load TV favorites';
			setError(errorMessage);
			console.error('Error loading TV favorites:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Add a TV series to favorites
	 */
	const addFavorite = useCallback(async (tvSeries: TVSeries): Promise<boolean> => {
		try {
			setError(null);
			const success = await TVFavoritesService.addTVSeries(tvSeries);

			if (success) {
				// Refresh the favorites list
				await loadFavorites();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to add TV favorite';
			setError(errorMessage);
			console.error('Error adding TV favorite:', err);
			return false;
		}
	}, [loadFavorites]);

	/**
	 * Remove a TV series from favorites
	 */
	const removeFavorite = useCallback(async (tvSeriesId: number): Promise<boolean> => {
		try {
			setError(null);
			const success = await TVFavoritesService.removeTVSeries(tvSeriesId);

			if (success) {
				// Refresh the favorites list
				await loadFavorites();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to remove TV favorite';
			setError(errorMessage);
			console.error('Error removing TV favorite:', err);
			return false;
		}
	}, [loadFavorites]);

	/**
	 * Toggle favorite status of a TV series
	 */
	const toggleFavorite = useCallback(async (tvSeries: TVSeries): Promise<boolean> => {
		try {
			setError(null);
			const isNowFavorite = await TVFavoritesService.toggleTVSeriesFavorite(tvSeries);

			// Refresh the favorites list
			await loadFavorites();

			return isNowFavorite;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to toggle TV favorite';
			setError(errorMessage);
			console.error('Error toggling TV favorite:', err);
			return false;
		}
	}, [loadFavorites]);

	/**
	 * Check if a TV series is favorited
	 */
	const isFavorite = useCallback(async (tvSeriesId: number): Promise<boolean> => {
		try {
			setError(null);
			return await TVFavoritesService.isTVSeriesFavorite(tvSeriesId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to check TV favorite status';
			setError(errorMessage);
			console.error('Error checking TV favorite status:', err);
			return false;
		}
	}, []);

	/**
	 * Refresh favorites from storage
	 */
	const refreshFavorites = useCallback(async () => {
		await loadFavorites();
	}, [loadFavorites]);

	/**
	 * Clear all favorites
	 */
	const clearAllFavorites = useCallback(async (): Promise<boolean> => {
		try {
			setError(null);
			const success = await TVFavoritesService.clearAllFavorites();

			if (success) {
				// Refresh the favorites list
				await loadFavorites();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to clear TV favorites';
			setError(errorMessage);
			console.error('Error clearing TV favorites:', err);
			return false;
		}
	}, [loadFavorites]);

	// Load favorites on mount
	useEffect(() => {
		loadFavorites();
	}, [loadFavorites]);

	return {
		favorites,
		favoriteIds,
		loading,
		error,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		refreshFavorites,
		clearAllFavorites,
		favoritesCount,
	};
};

