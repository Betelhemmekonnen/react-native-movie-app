import { MovieGrid } from '@/components/movie/movie-grid';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { Movie } from '@/types/movie';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FavoritesCategory = 'Movie' | 'TV Series';

export default function FavoritesTabScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FavoritesCategory>('Movie');
  const router = useRouter();

  const {
    favorites,
    favoriteIds,
    favoritesLoading,
    refreshFavorites,
  } = useMovieContext();

  // Convert favorites to Movie array for MovieGrid
  const favoriteMovies: Movie[] = favorites.map((item) => ({
    id: item.id,
    title: item.title,
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    release_date: item.release_date,
    vote_average: item.vote_average,
    vote_count: item.vote_count,
    adult: item.adult,
    genre_ids: item.genre_ids,
    original_language: item.original_language,
    original_title: item.original_title,
    popularity: item.popularity,
    video: item.video,
  }));

  // Refresh favorites on mount
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshFavorites();
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFavorites]);

  // Handle movie press
  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push(`/details/${movie.id}`);
    },
    [router]
  );

  // Handle category change
  const handleCategoryChange = useCallback((category: FavoritesCategory) => {
    setActiveCategory(category);
  }, []);

  const categories: FavoritesCategory[] = ['Movie', 'TV Series'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Favorites</ThemedText>
        <TouchableOpacity
          onPress={() => router.push('/search')}
          style={styles.searchButton}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryChange(category)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeCategory === category && styles.activeTabText,
              ]}
            >
              {category}
            </ThemedText>
            {activeCategory === category && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeCategory === 'Movie' && (
        <>
          {favoritesLoading && favoriteMovies.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.dark.accent} />
            </View>
          ) : favoriteMovies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyTitle}>Your favorites list is empty</ThemedText>
              <ThemedText style={styles.emptyText}>
                Start adding movies to your favorites by tapping the heart icon on any movie card.
              </ThemedText>
            </View>
          ) : (
            <MovieGrid
              movies={favoriteMovies}
              loading={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onMoviePress={handleMoviePress}
              numColumns={3}
              cardSize="small"
              showHD={true}
              showRating={false}
              emptyMessage="No favorite movies found"
            />
          )}
        </>
      )}

      {/* TV Series - Empty for now (user's friend's task) */}
      {activeCategory === 'TV Series' && (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>Coming soon</ThemedText>
          <ThemedText style={styles.emptyText}>
            TV Series favorites will be available soon.
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  searchButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tab: {
    position: 'relative',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9BA1A6',
  },
  activeTabText: {
    color: Colors.dark.secondaryAccent,
    fontWeight: 'bold',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.dark.secondaryAccent,
    borderRadius: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9BA1A6',
    textAlign: 'center',
    lineHeight: 24,
  },
});
