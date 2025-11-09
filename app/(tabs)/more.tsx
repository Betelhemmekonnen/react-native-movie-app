import { MovieGrid } from '@/components/movie/movie-grid';
import { ThemedText } from '@/components/themed-text';
import { TVGrid } from '@/components/tv/tv-grid';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { useTVContext } from '@/context/tv-context';
import { Movie } from '@/types/movie';
import { TVSeries } from '@/types/tv';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

  const {
    favorites: tvFavorites,
    favoriteIds: tvFavoriteIds,
    favoritesLoading: tvFavoritesLoading,
    refreshFavorites: refreshTVFavorites,
  } = useTVContext();

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

  // Convert TV favorites to TVSeries array
  const favoriteTVSeries: TVSeries[] = tvFavorites.map((item) => ({
    id: item.id,
    name: item.name,
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    first_air_date: item.first_air_date,
    vote_average: item.vote_average,
    vote_count: item.vote_count,
    genre_ids: item.genre_ids,
    original_language: item.original_language,
    original_name: item.original_name,
    popularity: item.popularity,
    origin_country: item.origin_country,
  }));

  // Refresh favorites when tab is focused
  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
      refreshTVFavorites();
    }, [refreshFavorites, refreshTVFavorites])
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (activeCategory === 'Movie') {
        await refreshFavorites();
      } else {
        await refreshTVFavorites();
      }
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    } finally {
      setRefreshing(false);
    }
  }, [activeCategory, refreshFavorites, refreshTVFavorites]);

  // Handle movie press
  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push(`/details/${movie.id}`);
    },
    [router]
  );

  // Handle TV series press
  const handleTVSeriesPress = useCallback(
    (series: TVSeries) => {
      router.push(`/tv/details/${series.id}` as any);
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

      {activeCategory === 'TV Series' && (
        <>
          {tvFavoritesLoading && favoriteTVSeries.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.dark.accent} />
            </View>
          ) : favoriteTVSeries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyTitle}>Your TV favorites list is empty</ThemedText>
              <ThemedText style={styles.emptyText}>
                Start adding TV series to your favorites by tapping the heart icon on any TV series card.
              </ThemedText>
            </View>
          ) : (
            <TVGrid
              series={favoriteTVSeries}
              loading={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onSeriesPress={handleTVSeriesPress}
              numColumns={3}
              emptyMessage="No favorite TV series found"
            />
          )}
        </>
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
    color: Colors.dark.tabIconDefault,
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
    color: Colors.dark.tabIconDefault,
    textAlign: 'center',
    lineHeight: 24,
  },
});