
// app/(tabs)/watch_list.tsx
import { TVDetails } from '@/components/tv/tv-details';
import { useWatchlist } from '@/hooks/use-storage';
import { WatchlistItem } from '@/services/storage/watchlist';
import { Episode } from '@/types/tv';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;

export default function WatchList() {
  const { watchlist, loading, removeFromWatchlist, refresh } = useWatchlist();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  // Refresh watchlist when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleRemove = async (id: number) => {
    await removeFromWatchlist(id);
  };

  const handleSeriesPress = (item: WatchlistItem) => {
    setSelectedSeriesId(item.id);
  };

  const handleBackPress = () => {
    setSelectedSeriesId(null);
    refresh(); // Refresh in case user removed from watchlist in details
  };

  const handleEpisodePress = (episode: Episode) => {
    console.log('Episode pressed:', episode.name);
    // TODO: Navigate to episode player or details
  };

  const renderItem = ({ item }: { item: WatchlistItem }) => {
    const imageUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/150x225/333/fff?text=No+Image';

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => handleSeriesPress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#e6ff00" />
          <Text style={styles.rating}>{item.vote_average?.toFixed(1)}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent card press when removing
            handleRemove(item.id);
          }}
        >
          <Ionicons name="close-circle" size={24} color="#ff4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={80} color="#555" />
      <Text style={styles.emptyTitle}>Your Watch List is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Add TV series to your watch list to see them here
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e6ff00" />
        <Text style={styles.loadingText}>Loading your watch list...</Text>
      </View>
    );
  }

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watch List</Text>
        <Text style={styles.headerSubtitle}>
          {watchlist.length} {watchlist.length === 1 ? 'series' : 'series'}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={watchlist}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id ? item.id.toString() : `watchlist-${index}`}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e6ff00"
            colors={['#e6ff00']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: ITEM_WIDTH,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: ITEM_WIDTH * 1.5,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  rating: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.7,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});