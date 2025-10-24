// app/tv_series.tsx
import { TVNavbar } from '@/components/tv/top-bar';
import { TVDetails } from '@/components/tv/tv-details';
import { TVList } from '@/components/tv/tv-list';
import { TVSeries, tvApi } from '@/services/api/tmdb';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function TVSeriesScreen() {
  const [popularTV, setPopularTV] = useState<TVSeries[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TVSeries[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVSeries[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<TVSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTVSeries();
  }, []);

  const loadTVSeries = async () => {
    try {
      setLoading(true);
      const [popular, topRated, trending] = await Promise.all([
        tvApi.getPopular(),
        tvApi.getTopRated(),
        tvApi.getTrending(),
      ]);
      
      setPopularTV(popular);
      setTopRatedTV(topRated);
      setTrendingTV(trending);
    } catch (error) {
      console.error('Error loading TV series:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTVSeries();
  };

  const handleSeriesPress = (series: TVSeries) => {
    setSelectedSeries(series);
  };

  const handleBack = () => {
    setSelectedSeries(null);
  };

  const handleEpisodePress = (episode: any) => {
    console.log('Episode pressed:', episode.name);
    // Handle episode playback
  };

  if (selectedSeries) {
    return (
      <TVDetails 
        seriesId={selectedSeries.id}
        onBack={handleBack}
        onEpisodePress={handleEpisodePress}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading TV Series...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TVNavbar title="TV Series" onFilterPress={() => console.log('Filter pressed')} />
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }
      >
        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <TVList 
            data={trendingTV.slice(0, 6)} 
            onItemPress={handleSeriesPress}
          />
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📺 Popular Series</Text>
          <TVList 
            data={popularTV} 
            onItemPress={handleSeriesPress}
          />
        </View>

        {/* Top Rated Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Top Rated</Text>
          <TVList 
            data={topRatedTV} 
            onItemPress={handleSeriesPress}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});