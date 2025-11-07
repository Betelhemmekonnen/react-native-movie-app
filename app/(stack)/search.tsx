import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SearchBar } from '@/components/ui/search-bar';
import { MovieCard } from '@/components/movie/movie-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    searchResults,
    searchLoading,
    searchError,
    searchMovies,
    clearSearchResults,
  } = useMovieContext();

  useEffect(() => {
    // Clear results when component unmounts
    return () => {
      clearSearchResults();
    };
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim().length > 0) {
      searchMovies(query.trim());
    } else {
      clearSearchResults();
    }
  };

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length === 0) {
      clearSearchResults();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearSearchResults();
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
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={handleChangeText}
          onSubmit={handleSearch}
          onClear={handleClear}
          autoFocus={true}
        />
      </View>

      <View style={styles.content}>
        {searchLoading && searchResults.length === 0 ? (
          <LoadingSpinner message="Searching movies..." />
        ) : searchError ? (
          <ErrorMessage
            message={searchError}
            onRetry={() => searchQuery && handleSearch(searchQuery)}
          />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                size="medium"
                showHD={true}
                showRating={true}
                onPress={(movie) => router.push(`/details/${movie.id}`)}
              />
            )}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No movies found for "{searchQuery}"
            </ThemedText>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Start typing to search for movies
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
    paddingBottom: 16,
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
});

