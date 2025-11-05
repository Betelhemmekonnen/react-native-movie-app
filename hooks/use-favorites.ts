import { useCallback, useEffect, useState } from 'react';
import { FavoriteMovie, FavoritesService } from '../services/storage/favorites';
import { Movie } from '../types/movie';

interface UseFavoritesReturn {
	favorites: FavoriteMovie[];
	favoriteIds: number[];
	loading: boolean;
	error: string | null;
	addFavorite: (movie: Movie) => Promise<boolean>;
	removeFavorite: (movieId: number) => Promise<boolean>;
	toggleFavorite: (movie: Movie) => Promise<boolean>;
	isFavorite: (movieId: number) => Promise<boolean>;
	refreshFavorites: () => Promise<void>;
	clearAllFavorites: () => Promise<boolean>;
	favoritesCount: number;
}

/**
 * Custom hook for managing movie favorites
 * Provides methods to add, remove, toggle, and check favorite status of movies
 */
export const useFavorites = (): UseFavoritesReturn => {
	const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
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

			const favoriteMovies = await FavoritesService.getFavoriteMovies();
			const ids = await FavoritesService.getFavoriteMovieIds();
			const count = await FavoritesService.getFavoritesCount();

			setFavorites(favoriteMovies);
			setFavoriteIds(ids);
			setFavoritesCount(count);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load favorites';
			setError(errorMessage);
			console.error('Error loading favorites:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Add a movie to favorites
	 */
	const addFavorite = useCallback(async (movie: Movie): Promise<boolean> => {
		try {
			setError(null);
			const success = await FavoritesService.addMovie(movie);

			if (success) {
				// Refresh the favorites list
				await loadFavorites();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to add favorite';
			setError(errorMessage);
			console.error('Error adding favorite:', err);
			return false;
		}
	}, [loadFavorites]);

	/**
	 * Remove a movie from favorites
	 */
	const removeFavorite = useCallback(async (movieId: number): Promise<boolean> => {
		try {
			setError(null);
			const success = await FavoritesService.removeMovie(movieId);

			if (success) {
				// Refresh the favorites list
				await loadFavorites();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to remove favorite';
			setError(errorMessage);
			console.error('Error removing favorite:', err);
			return false;
		}
	}, [loadFavorites]);

	/**
	 * Toggle favorite status of a movie
	 */
	const toggleFavorite = useCallback(async (movie: Movie): Promise<boolean> => {
		try {
			setError(null);
			const isNowFavorite = await FavoritesService.toggleMovieFavorite(movie);

			// Refresh the favorites list
			await loadFavorites();

			return isNowFavorite;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to toggle favorite';
			setError(errorMessage);
			console.error('Error toggling favorite:', err);
			return false;
		}
	}, [loadFavorites]);

	/**
	 * Check if a movie is favorited
	 */
	const isFavorite = useCallback(async (movieId: number): Promise<boolean> => {
		try {
			setError(null);
			return await FavoritesService.isMovieFavorite(movieId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to check favorite status';
			setError(errorMessage);
			console.error('Error checking favorite status:', err);
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
			const success = await FavoritesService.clearAllFavorites();

			if (success) {
				// Refresh the favorites list
				await loadFavorites();
			}

			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to clear favorites';
			setError(errorMessage);
			console.error('Error clearing favorites:', err);
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