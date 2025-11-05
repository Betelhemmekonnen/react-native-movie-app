import { useCallback, useState } from 'react';
import { tmdbApi } from '../services/api/tmdb';
import { SearchResponse } from '../types/api';
import { Movie } from '../types/movie';

interface UseSearchReturn {
	results: Movie[];
	loading: boolean;
	error: string | null;
	searchTerm: string;
	page: number;
	totalPages: number;
	totalResults: number;
	hasMore: boolean;
	searchMovies: (query: string, page?: number) => Promise<void>;
	loadMore: () => Promise<void>;
	clearResults: () => void;
}

/**
 * Custom hook for searching movies
 * Provides functionality to search movies by query with pagination support
 */
export const useSearch = (): UseSearchReturn => {
	const [results, setResults] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalResults, setTotalResults] = useState(0);

	/**
	 * Search movies by query
	 */
	const searchMovies = useCallback(async (query: string, page: number = 1) => {
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

			const response: SearchResponse<Movie> = await tmdbApi.searchMovies(query, page);

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
			const errorMessage = err instanceof Error ? err.message : 'Failed to search movies';
			setError(errorMessage);
			console.error('Error searching movies:', err);

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
			await searchMovies(searchTerm, page + 1);
		}
	}, [searchMovies, searchTerm, page, totalPages, loading]);

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
		searchMovies,
		loadMore,
		clearResults,
	};
};