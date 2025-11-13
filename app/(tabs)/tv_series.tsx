// app/tv_series.tsx
import { TVNavbar } from '@/components/tv/top-bar';
import { TVDetails } from '@/components/tv/tv-details';
import { TVList } from '@/components/tv/tv-list';
import { Colors } from '@/constants/theme';
import { useTVContext } from '@/context/tv-context';
import { Episode, TVSeries } from '@/types/tv';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

export default function TVSeriesScreen() {
  const [activeTab, setActiveTab] = useState('Latest');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  const {
    trendingTV,
    popularTV,
    airingTodayTV,
    loadingTrending,
    loadingPopular,
    loadingAiringToday,
    fetchTrendingTV,
    fetchPopularTV,
    fetchAiringTodayTV,
  } = useTVContext();

  // Get the current TV shows list based on active tab
  const getCurrentTVShows = (): TVSeries[] => {
    switch (activeTab) {
      case 'Latest':
        return airingTodayTV;
      case 'Trending':
        return trendingTV;
      case 'Popular':
        return popularTV;
      default:
        return airingTodayTV;
    }
  };

  const getCurrentLoading = (): boolean => {
    switch (activeTab) {
      case 'Latest':
        return loadingAiringToday;
      case 'Trending':
        return loadingTrending;
      case 'Popular':
        return loadingPopular;
      default:
        return loadingAiringToday;
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'Latest':
        fetchAiringTodayTV(1);
        break;
      case 'Trending':
        fetchTrendingTV();
        break;
      case 'Popular':
        fetchPopularTV(1);
        break;
    }
  }, [activeTab, fetchAiringTodayTV, fetchTrendingTV, fetchPopularTV]);

  const onRefresh = async () => {
    setRefreshing(true);
    switch (activeTab) {
      case 'Latest':
        await fetchAiringTodayTV(1);
        break;
      case 'Trending':
        await fetchTrendingTV();
        break;
      case 'Popular':
        await fetchPopularTV(1);
        break;
    }
    setRefreshing(false);
  };

  const handleSeriesPress = (series: TVSeries) => {
    setSelectedSeriesId(series.id);
  };

  const handleBackPress = () => {
    setSelectedSeriesId(null);
  };

  const handleEpisodePress = (episode: Episode) => {
    // Navigate to episode details or show episode info
    // For now, we'll show an alert with episode info
    // You can implement a full episode player screen later
    if (selectedSeriesId) {
      // Show episode details in a modal or navigate to episode screen
      Alert.alert(
        episode.name || 'Episode',
        `${episode.overview || 'No description available'}\n\nRating: ⭐ ${episode.vote_average?.toFixed(1) || 'N/A'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'Filter') {
      // Filter functionality can be added here if needed
      // For now, we'll just ignore it
      return;
    } else {
      setActiveTab(tab);
    }
  };

  const tvShows = getCurrentTVShows();
  const loading = getCurrentLoading();

  // Show TV Details if a series is selected
  if (selectedSeriesId) {
    return (
      <TVDetails
        seriesId={selectedSeriesId}
        onBack={handleBackPress}
        onEpisodePress={handleEpisodePress}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Navigation Bar */}
      <TVNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Loading Indicator */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
        </View>
      ) : (
        /* TV Series List */
        <TVList 
          data={tvShows} 
          onItemPress={handleSeriesPress}
          refreshing={refreshing}
          onRefresh={onRefresh}
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