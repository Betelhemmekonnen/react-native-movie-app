import { useCallback, useState } from 'react';
import { tmdbApi } from '../services/api/tmdb';
import { SearchResponse } from '../types/api';
import { TVSeries } from '../types/tv';

interface UseTVSearchReturn {
	results: TVSeries[];
	loading: boolean;
	error: string | null;
	searchTerm: string;
	page: number;
	totalPages: number;
	totalResults: number;
	hasMore: boolean;
	searchTV: (query: string, page?: number) => Promise<void>;
	loadMore: () => Promise<void>;
	clearResults: () => void;
}

/**
 * Custom hook for searching TV shows
 * Provides functionality to search TV shows by query with pagination support
 */
export const useTVSearch = (): UseTVSearchReturn => {
	const [results, setResults] = useState<TVSeries[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalResults, setTotalResults] = useState(0);

	/**
	 * Search TV shows by query
	 */
	const searchTV = useCallback(async (query: string, page: number = 1) => {
		// Don't search for empty queries
		if (!query.trim()) {
			setResults([]);
			setSearchTerm('');
			setPage(1);
			setTotalPages(0);
			setTotalResults(0);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response: SearchResponse<TVSeries> = await tmdbApi.searchTV(query, page);

			if (page === 1) {
				setResults(response.results);
			} else {
				setResults(prev => [...prev, ...response.results]);
			}

			setSearchTerm(query);
			setPage(page);
			setTotalPages(response.total_pages);
			setTotalResults(response.total_results);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to search TV shows';
			setError(errorMessage);
			console.error('Error searching TV shows:', err);

			// Clear results on error only if it's the first page
			if (page === 1) {
				setResults([]);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Load more search results
	 */
	const loadMore = useCallback(async () => {
		// Only load more if we're not on the last page
		if (page < totalPages && !loading) {
			await searchTV(searchTerm, page + 1);
		}
	}, [searchTV, searchTerm, page, totalPages, loading]);

	/**
	 * Clear search results
	 */
	const clearResults = useCallback(() => {
		setResults([]);
		setSearchTerm('');
		setPage(1);
		setTotalPages(0);
		setTotalResults(0);
		setError(null);
	}, []);

	// Determine if there are more results to load
	const hasMore = page < totalPages;

	return {
		results,
		loading,
		error,
		searchTerm,
		page,
		totalPages,
		totalResults,
		hasMore,
		searchTV,
		loadMore,
		clearResults,
	};
};

