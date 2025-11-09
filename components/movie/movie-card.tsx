import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { Movie } from '@/types/movie';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
  showHD?: boolean;
  showRating?: boolean;
  onPress?: (movie: Movie) => void;
  showActions?: boolean;
}

export function MovieCard({
  movie,
  size = 'medium',
  showHD = true,
  showRating = false,
  onPress,
  showActions = true,
}: MovieCardProps) {
  const router = useRouter();
  const { favoriteIds, watchlistIds, toggleFavorite, toggleWatchlist } = useMovieContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Check if movie is in favorites/watchlist
  useEffect(() => {
    setIsFavorite(favoriteIds.includes(movie.id));
    setIsInWatchlist(watchlistIds.includes(movie.id));
  }, [favoriteIds, watchlistIds, movie.id]);

  const getImageUrl = (path: string | null) => {
    if (!path) return 'https://via.placeholder.com/500x750';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: SCREEN_WIDTH * 0.25, height: SCREEN_WIDTH * 0.375 };
      case 'large':
        return { width: SCREEN_WIDTH * 0.45, height: SCREEN_WIDTH * 0.675 };
      default: // medium
        return { width: SCREEN_WIDTH * 0.35, height: SCREEN_WIDTH * 0.525 };
    }
  };

  const { width, height } = getCardDimensions();

  const handlePress = () => {
    if (onPress) {
      onPress(movie);
    } else {
      router.push(`/details/${movie.id}`);
    }
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Handle favorite toggle
  const handleFavoritePress = async (e: any) => {
    e.stopPropagation();
    await toggleFavorite(movie);
  };

  // Handle watchlist toggle
  const handleWatchlistPress = async (e: any) => {
    e.stopPropagation();
    await toggleWatchlist(movie);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getImageUrl(movie.poster_path) }}
        style={[styles.poster, { width, height }]}
        resizeMode="cover"
      />
      
      {showHD && movie.vote_average > 7 && (
        <View style={styles.hdBadge}>
          <ThemedText style={styles.hdText}>HD</ThemedText>
        </View>
      )}

      {showRating && (
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={Colors.dark.accent} />
          <ThemedText style={styles.ratingText}>
            {formatRating(movie.vote_average)}
          </ThemedText>
        </View>
      )}

      {/* Action Buttons Overlay */}
      {showActions && (
        <View style={[styles.actionButtons, showRating && styles.actionButtonsWithRating]}>
          <TouchableOpacity
            onPress={handleFavoritePress}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? Colors.dark.secondaryAccent : Colors.dark.text} // Yellowish color instead of red
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
              color={isInWatchlist ? Colors.dark.secondaryAccent : Colors.dark.text} // Yellowish color instead of red
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoContainer}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {movie.title}
        </ThemedText>
        {movie.release_date && (
          <ThemedText style={styles.releaseDate}>
            {new Date(movie.release_date).getFullYear()}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.dark.cardBackground,
  },
  poster: {
    borderRadius: 8,
  },
  hdBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hdText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.dark.accent,
  },
  infoContainer: {
    padding: 8,
    backgroundColor: Colors.dark.cardBackground,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  actionButtonsWithRating: {
    top: 40, // Move down if rating badge is shown
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