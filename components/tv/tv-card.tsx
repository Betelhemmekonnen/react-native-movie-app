import { Colors } from '@/constants/theme';
import { useTVContext } from '@/context/tv-context';
import { TVSeries } from '@/types/tv';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;

interface TVCardProps {
  series: TVSeries;
  onPress: (series: TVSeries) => void;
  containerStyle?: any;
}

export const TVCard: React.FC<TVCardProps> = ({ series, onPress, containerStyle }) => {
  const { favoriteIds, watchlistIds, toggleFavorite, toggleWatchlist } = useTVContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  const imageUrl = series.poster_path 
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : 'https://via.placeholder.com/150x225/333/fff?text=No+Image';

  // Check if series is in favorites/watchlist
  useEffect(() => {
    setIsFavorite(favoriteIds.includes(series.id));
    setIsInWatchlist(watchlistIds.includes(series.id));
  }, [favoriteIds, watchlistIds, series.id]);

  // Handle favorite toggle
  const handleFavoritePress = async (e: any) => {
    e.stopPropagation();
    await toggleFavorite(series);
  };

  // Handle watchlist toggle
  const handleWatchlistPress = async (e: any) => {
    e.stopPropagation();
    await toggleWatchlist(series);
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onPress(series)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>
        {series.name}
      </Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>⭐ {series.vote_average?.toFixed(1)}</Text>
      </View>
      
      {/* Action Buttons Overlay */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? Colors.dark.secondaryAccent : '#fff'} // Yellowish color instead of red
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleWatchlistPress}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isInWatchlist ? Colors.dark.secondaryAccent : '#fff'} // Yellowish color instead of red
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    marginBottom: 20,
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
    marginTop: 4,
    alignItems: 'center',
  },
  rating: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.7,
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});