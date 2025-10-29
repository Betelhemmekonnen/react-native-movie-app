// app/(tabs)/tv_series.tsx
import { TVNavbar } from '@/components/tv/top-bar';
import { TVDetails } from '@/components/tv/tv-details';
import { TVList } from '@/components/tv/tv-list';
import { tmdbApi } from '@/services/api/tmdb';
import { Episode, TVSeries } from '@/types/tv';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

export default function TVSeriesScreen() {
  const [activeTab, setActiveTab] = useState('Latest');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tvShows, setTvShows] = useState<TVSeries[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  // Fetch TV shows based on active tab
  const fetchTVShows = async () => {
    try {
      setLoading(true);
      let data: TVSeries[] = [];

      switch (activeTab) {
        case 'Latest':
          const latestResponse = await tmdbApi.getAiringTodayTV(1);
          data = latestResponse.results;
          break;
        case 'Trending':
          const trendingResponse = await tmdbApi.getTrendingTV('week');
          data = trendingResponse.results;
          break;
        case 'Popular':
          const popularResponse = await tmdbApi.getPopularTV(1);
          data = popularResponse.results;
          break;
        default:
          const defaultResponse = await tmdbApi.getAiringTodayTV(1);
          data = defaultResponse.results;
      }

      setTvShows(data);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows();
  }, [activeTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTVShows();
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={["#fff"]}
            />
          }
        >
          <TVList 
            data={tvShows} 
            onItemPress={handleSeriesPress}
          />
        </ScrollView>
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
