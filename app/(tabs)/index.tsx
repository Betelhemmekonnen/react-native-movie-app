import { CategoryNavigation } from '@/components/home/category-navigation';
import { ContinueWatching } from '@/components/home/continue-watching';
import { FeaturedMovieCarousel } from '@/components/home/featured-movie-carousel';
import { Header } from '@/components/home/header';
import { LatestMoviesSection } from '@/components/home/latest-movies-section';
import { PopularSection } from '@/components/home/popular-section';
import { TrendingSection } from '@/components/home/trending-section';
import { ThemedText } from '@/components/themed-text';
import { ErrorMessage } from '@/components/ui/error-message';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Category = 'trending' | 'popular';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('trending');
  const [refreshing, setRefreshing] = useState(false);

  const {
    // Data
    trendingMovies,
    popularMovies,
    nowPlayingMovies,
    watchlist,

    // Loading states
    loadingTrending,
    loadingPopular,
    loadingNowPlaying,

    // Error states
    trendingError,
    popularError,
    nowPlayingError,

    // Methods
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchNowPlayingMovies,
    removeFromWatchlist,
  } = useMovieContext();

  // Fetch initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchTrendingMovies('day'),
          fetchPopularMovies(1),
          fetchNowPlayingMovies(1),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Create continue watching items from watchlist
  const continueWatchingItems = useMemo(() => {
    return watchlist.slice(0, 3).map((item, index) => ({
      id: item.id,
      movie: item as any, // WatchlistMovie extends Movie
      episode: index === 0 ? 'S2:E3' : index === 1 ? 'S3:E1' : 'Continue',
      progress: 0.5, // Placeholder progress
    }));
  }, [watchlist]);

  // Handle category change
  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchTrendingMovies('day'),
        fetchPopularMovies(1),
        fetchNowPlayingMovies(1),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTrendingMovies, fetchPopularMovies, fetchNowPlayingMovies]);

  // Handle continue watching item press
  const handleContinueWatchingPress = useCallback(
    (item: any) => {
      router.push(`/details/${item.movie.id}`);
    },
    [router]
  );

  // Handle remove from continue watching
  const handleRemoveContinueWatching = useCallback(
    async (id: number) => {
      await removeFromWatchlist(id);
    },
    [removeFromWatchlist]
  );

  // Handle view all trending
  const handleViewAllTrending = useCallback(() => {
    // Navigate to trending movies screen or show more
    console.log('View all trending');
  }, []);

  // Handle view all latest
  const handleViewAllLatest = useCallback(() => {
    // Navigate to latest movies screen or show more
    console.log('View all latest');
  }, []);

  // Check if we have any data loaded
  const hasData =
    trendingMovies.length > 0 ||
    popularMovies.length > 0 ||
    nowPlayingMovies.length > 0;

  // Check if we're in initial loading state
  const isInitialLoading =
    (loadingTrending && trendingMovies.length === 0) ||
    (loadingPopular && popularMovies.length === 0) ||
    (loadingNowPlaying && nowPlayingMovies.length === 0);

  // Check for errors
  const hasError = trendingError || popularError || nowPlayingError;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.dark.accent}
            colors={[Colors.dark.accent]}
          />
        }
      >
        {/* Header */}
        <Header />

        {/* Category Navigation */}
        <CategoryNavigation
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Initial Loading State */}
        {isInitialLoading && !hasData && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner message="Loading movies..." />
          </View>
        )}

        {/* Error State */}
        {hasError && !hasData && (
          <View style={styles.errorContainer}>
            <ErrorMessage
              message={
                trendingError || popularError || nowPlayingError || 'Failed to load movies'
              }
              onRetry={handleRefresh}
            />
          </View>
        )}

        {/* Content */}
        {hasData && (
          <>
            {/* Trending Category Content */}
            {activeCategory === 'trending' && (
              <>
                {/* Featured Movie Carousel - Only show if we have trending movies */}
                {trendingMovies.length > 0 && (
                  <FeaturedMovieCarousel movies={trendingMovies.slice(0, 5)} />
                )}

                {/* Continue Watching Section */}
                {continueWatchingItems.length > 0 && (
                  <ContinueWatching
                    items={continueWatchingItems}
                    onItemPress={handleContinueWatchingPress}
                    onRemove={handleRemoveContinueWatching}
                  />
                )}

                {/* Trending Section */}
                {loadingTrending && trendingMovies.length === 0 ? (
                  <View style={styles.sectionLoading}>
                    <ActivityIndicator size="small" color={Colors.dark.accent} />
                  </View>
                ) : trendingError ? (
                  <View style={styles.sectionError}>
                    <ThemedText style={styles.errorText}>
                      {trendingError}
                    </ThemedText>
                  </View>
                ) : (
                  <TrendingSection
                    movies={trendingMovies.slice(5, 20)}
                    onViewAll={handleViewAllTrending}
                  />
                )}
              </>
            )}

            {/* Popular Category Content */}
            {activeCategory === 'popular' && (
              <>
                {loadingPopular && popularMovies.length === 0 ? (
                  <View style={styles.sectionLoading}>
                    <ActivityIndicator size="small" color={Colors.dark.accent} />
                  </View>
                ) : popularError ? (
                  <View style={styles.sectionError}>
                    <ThemedText style={styles.errorText}>
                      {popularError}
                    </ThemedText>
                  </View>
                ) : (
                  <PopularSection movies={popularMovies.slice(0, 20)} />
                )}
              </>
            )}

            {/* Latest Movies Section - Always shown at the bottom */}
            {loadingNowPlaying && nowPlayingMovies.length === 0 ? (
              <View style={styles.sectionLoading}>
                <ActivityIndicator size="small" color={Colors.dark.accent} />
              </View>
            ) : nowPlayingError ? (
              <View style={styles.sectionError}>
                <ThemedText style={styles.errorText}>
                  {nowPlayingError}
                </ThemedText>
              </View>
            ) : (
              <LatestMoviesSection
                movies={nowPlayingMovies.slice(0, 20)}
                onViewAll={handleViewAllLatest}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    paddingVertical: 40,
  },
  errorContainer: {
    flex: 1,
    minHeight: 400,
    paddingVertical: 40,
  },
  sectionLoading: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionError: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF4444',
    textAlign: 'center',
  },
});

