import { MovieGrid } from '@/components/movie/movie-grid';
import { MovieNavbar } from '@/components/movie/movie-navbar';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { Movie } from '@/types/movie';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

type MovieCategory = 'Popular' | 'Top Rated' | 'Now Playing' | 'Upcoming' | 'Trending';

export default function MovieTabScreen() {
  const [activeTab, setActiveTab] = useState<MovieCategory>('Popular');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const {
    // Data
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    trendingMovies,

    // Loading states
    loadingPopular,
    loadingTopRated,
    loadingNowPlaying,
    loadingUpcoming,
    loadingTrending,

    // Methods
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTrendingMovies,
    loadMorePopular,
    loadMoreTopRated,
    loadMoreNowPlaying,
    loadMoreUpcoming,
  } = useMovieContext();

  // Get current movies list based on active tab
  const getCurrentMovies = useCallback((): Movie[] => {
    switch (activeTab) {
      case 'Popular':
        return popularMovies;
      case 'Top Rated':
        return topRatedMovies;
      case 'Now Playing':
        return nowPlayingMovies;
      case 'Upcoming':
        return upcomingMovies;
      case 'Trending':
        return trendingMovies;
      default:
        return popularMovies;
    }
  }, [activeTab, popularMovies, topRatedMovies, nowPlayingMovies, upcomingMovies, trendingMovies]);

  // Get current loading state
  const getCurrentLoading = useCallback((): boolean => {
    switch (activeTab) {
      case 'Popular':
        return loadingPopular;
      case 'Top Rated':
        return loadingTopRated;
      case 'Now Playing':
        return loadingNowPlaying;
      case 'Upcoming':
        return loadingUpcoming;
      case 'Trending':
        return loadingTrending;
      default:
        return loadingPopular;
    }
  }, [activeTab, loadingPopular, loadingTopRated, loadingNowPlaying, loadingUpcoming, loadingTrending]);

  // Fetch data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      switch (activeTab) {
        case 'Popular':
          if (popularMovies.length === 0) {
            await fetchPopularMovies(1);
          }
          break;
        case 'Top Rated':
          if (topRatedMovies.length === 0) {
            await fetchTopRatedMovies(1);
          }
          break;
        case 'Now Playing':
          if (nowPlayingMovies.length === 0) {
            await fetchNowPlayingMovies(1);
          }
          break;
        case 'Upcoming':
          if (upcomingMovies.length === 0) {
            await fetchUpcomingMovies(1);
          }
          break;
        case 'Trending':
          if (trendingMovies.length === 0) {
            await fetchTrendingMovies('day');
          }
          break;
      }
    };

    fetchData();
  }, [
    activeTab,
    popularMovies.length,
    topRatedMovies.length,
    nowPlayingMovies.length,
    upcomingMovies.length,
    trendingMovies.length,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTrendingMovies,
  ]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      switch (activeTab) {
        case 'Popular':
          await fetchPopularMovies(1);
          break;
        case 'Top Rated':
          await fetchTopRatedMovies(1);
          break;
        case 'Now Playing':
          await fetchNowPlayingMovies(1);
          break;
        case 'Upcoming':
          await fetchUpcomingMovies(1);
          break;
        case 'Trending':
          await fetchTrendingMovies('day');
          break;
      }
    } catch (error) {
      console.error('Error refreshing movies:', error);
    } finally {
      setRefreshing(false);
    }
  }, [
    activeTab,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTrendingMovies,
  ]);

  // Handle end reached (infinite scroll)
  const handleEndReached = useCallback(() => {
    const loading = getCurrentLoading();
    if (!loading) {
      switch (activeTab) {
        case 'Popular':
          loadMorePopular();
          break;
        case 'Top Rated':
          loadMoreTopRated();
          break;
        case 'Now Playing':
          loadMoreNowPlaying();
          break;
        case 'Upcoming':
          loadMoreUpcoming();
          break;
        case 'Trending':
          // Trending doesn't have loadMore, so we don't do anything
          break;
      }
    }
  }, [activeTab, getCurrentLoading, loadMorePopular, loadMoreTopRated, loadMoreNowPlaying, loadMoreUpcoming]);

  // Handle movie press
  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push(`/details/${movie.id}`);
    },
    [router]
  );

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'Filter') {
      console.log('Open filter modal');
      // You can implement filter modal here
    } else {
      setActiveTab(tab as MovieCategory);
    }
  }, []);

  const currentMovies = getCurrentMovies();
  const loading = getCurrentLoading();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Navigation Bar */}
      <MovieNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Loading Indicator */}
      {loading && !refreshing && currentMovies.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
        </View>
      ) : (
        /* Movie Grid */
        <MovieGrid
          movies={currentMovies}
          loading={loading && currentMovies.length > 0}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleEndReached}
          onMoviePress={handleMoviePress}
          numColumns={3}
          cardSize="small"
          showHD={true}
          showRating={false}
          emptyMessage="No movies found"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
});