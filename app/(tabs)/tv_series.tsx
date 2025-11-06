// app/tv_series.tsx
import { TVNavbar } from '@/components/tv/top-bar';
import { TVDetails } from '@/components/tv/tv-details';
import { TVList } from '@/components/tv/tv-list';
import { useTVShows } from '@/hooks/use-tv-shows';
import { Episode, TVSeries } from '@/types/tv';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
  } = useTVShows();

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
    console.log('Episode pressed:', episode.name);
    // Navigate to episode player or details
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'Filter') {
      console.log('Open filter modal');
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
          <ActivityIndicator size="large" color="#e50914" />
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
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});