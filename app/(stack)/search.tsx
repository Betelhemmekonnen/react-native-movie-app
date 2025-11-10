import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { useTVSearch } from '@/hooks/use-tv-search';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SearchBar } from '@/components/ui/search-bar';
import { MovieCard } from '@/components/movie/movie-card';
import { TVCard } from '@/components/tv/tv-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Movie } from '@/types/movie';
import { TVSeries } from '@/types/tv';

type SearchFilter = 'all' | 'movies' | 'tv';

interface SearchResultItem {
  id: number;
  type: 'movie' | 'tv';
  data: Movie | TVSeries;
}

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');

  const {
    searchResults: movieResults,
    searchLoading: movieLoading,
    searchError: movieError,
    searchMovies,
    clearSearchResults: clearMovieResults,
  } = useMovieContext();

  const {
    results: tvResults,
    loading: tvLoading,
    error: tvError,
    searchTV,
    clearResults: clearTVResults,
  } = useTVSearch();

  const isLoading = movieLoading || tvLoading;
  const hasError = movieError || tvError;

  useEffect(() => {
    // Clear results when component unmounts
    return () => {
      clearMovieResults();
      clearTVResults();
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim().length > 0) {
      const trimmedQuery = query.trim();
      // Search both movies and TV shows in parallel
      await Promise.all([
        searchMovies(trimmedQuery),
        searchTV(trimmedQuery),
      ]);
    } else {
      clearMovieResults();
      clearTVResults();
    }
  };

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length === 0) {
      clearMovieResults();
      clearTVResults();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearMovieResults();
    clearTVResults();
  };

  // Combine and filter results based on active filter
  const combinedResults = useMemo(() => {
    const results: SearchResultItem[] = [];

    if (activeFilter === 'all' || activeFilter === 'movies') {
      movieResults.forEach((movie) => {
        results.push({ id: movie.id, type: 'movie', data: movie });
      });
    }

    if (activeFilter === 'all' || activeFilter === 'tv') {
      tvResults.forEach((tv) => {
        results.push({ id: tv.id, type: 'tv', data: tv });
      });
    }

    return results;
  }, [movieResults, tvResults, activeFilter]);

  const hasResults = combinedResults.length > 0;
  const showEmptyState = searchQuery.length > 0 && !isLoading && !hasResults;

  const renderItem = ({ item }: { item: SearchResultItem }) => {
    if (item.type === 'movie') {
      const movie = item.data as Movie;
      return (
        <MovieCard
          movie={movie}
          size="medium"
          showHD={true}
          showRating={true}
          onPress={(movie) => router.push(`/details/${movie.id}`)}
        />
      );
    } else {
      const tv = item.data as TVSeries;
      return (
        <TVCard
          series={tv}
          onPress={(series) => router.push(`/tv/details/${series.id}` as any)}
          containerStyle={styles.tvCardContainer}
        />
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background },
      ]}
      edges={['top']}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>Search</ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search movies & TV shows..."
          value={searchQuery}
          onChangeText={handleChangeText}
          onSubmit={handleSearch}
          onClear={handleClear}
          autoFocus={true}
        />
      </View>

      {/* Filter Tabs */}
      {searchQuery.length > 0 && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === 'all' && styles.filterTextActive,
              ]}
            >
              All
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'movies' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('movies')}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === 'movies' && styles.filterTextActive,
              ]}
            >
              Movies ({movieResults.length})
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'tv' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('tv')}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === 'tv' && styles.filterTextActive,
              ]}
            >
              TV Shows ({tvResults.length})
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {isLoading && !hasResults ? (
          <LoadingSpinner message="Searching..." />
        ) : hasError ? (
          <ErrorMessage
            message={movieError || tvError || 'Failed to search'}
            onRetry={() => searchQuery && handleSearch(searchQuery)}
          />
        ) : hasResults ? (
          <FlatList
            data={combinedResults}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        ) : showEmptyState ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No results found for "{searchQuery}"
            </ThemedText>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Start typing to search for movies & TV shows
            </ThemedText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBackground,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  filterTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#9BA1A6',
    textAlign: 'center',
  },
  tvCardContainer: {
    width: (Dimensions.get('window').width - 48) / 2,
  },
});

