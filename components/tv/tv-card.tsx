// components/tv/tv-card.tsx
import { TVSeries } from '@/types/tv';
import React from 'react';
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
}

export const TVCard: React.FC<TVCardProps> = ({ series, onPress }) => {
  const imageUrl = series.poster_path 
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : 'https://via.placeholder.com/150x225/333/fff?text=No+Image';

  return (
    <TouchableOpacity
      style={styles.container}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    marginBottom: 20,
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
});