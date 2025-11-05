import { useCallback, useState } from 'react';
import { StorageService } from '../services/storage/async-storage';

interface UseStorageReturn<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	getItem: (key: string) => Promise<T | null>;
	setItem: (key: string, value: T) => Promise<boolean>;
	removeItem: (key: string) => Promise<boolean>;
	clearAll: () => Promise<boolean>;
}

/**
 * Custom hook for managing AsyncStorage operations
 * Provides a generic interface for storing and retrieving data
 */
export const useStorage = <T>(): UseStorageReturn<T> => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Get an item from storage
	 */
	const getItem = useCallback(async (key: string): Promise<T | null> => {
		try {
			setLoading(true);
			setError(null);

			const value = await StorageService.getItem<T>(key);
			setData(value);
			return value;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to get item from storage';
			setError(errorMessage);
			console.error('Error getting item from storage:', err);
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Set an item in storage
	 */
	const setItem = useCallback(async (key: string, value: T): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);

			const success = await StorageService.setItem<T>(key, value);
			if (success) {
				setData(value);
			}
			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to set item in storage';
			setError(errorMessage);
			console.error('Error setting item in storage:', err);
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Remove an item from storage
	 */
	const removeItem = useCallback(async (key: string): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);

			const success = await StorageService.removeItem(key);
			if (success) {
				setData(null);
			}
			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from storage';
			setError(errorMessage);
			console.error('Error removing item from storage:', err);
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Clear all items from storage
	 */
	const clearAll = useCallback(async (): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);

			const success = await StorageService.clear();
			if (success) {
				setData(null);
			}
			return success;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to clear storage';
			setError(errorMessage);
			console.error('Error clearing storage:', err);
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		data,
		loading,
		error,
		getItem,
		setItem,
		removeItem,
		clearAll,
	};
};