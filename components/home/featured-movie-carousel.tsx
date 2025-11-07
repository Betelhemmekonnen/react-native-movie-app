import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { Movie } from '@/types/movie';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_WIDTH = SCREEN_WIDTH * 0.75;
const SIDE_WIDTH = SCREEN_WIDTH * 0.6;

interface FeaturedMovieCarouselProps {
  movies: Movie[];
}

export function FeaturedMovieCarousel({ movies }: FeaturedMovieCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / FEATURED_WIDTH);
    setActiveIndex(index);
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return 'https://via.placeholder.com/500x750';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getBackdropUrl = (path: string | null) => {
    if (!path) return 'https://via.placeholder.com/1280x720';
    return `https://image.tmdb.org/t/p/w1280${path}`;
  };

  const formatGenres = (genreIds: number[]) => {
    // This would typically come from a genres context or API
    // For now, return a placeholder
    return 'Crime, Thriller, Drama';
  };

  if (movies.length === 0) {
    return null;
  }

  const featuredMovie = movies[activeIndex] || movies[0];

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={FEATURED_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map((movie, index) => (
          <View
            key={movie.id}
            style={[
              styles.movieContainer,
              {
                width: index === activeIndex ? FEATURED_WIDTH : SIDE_WIDTH,
                opacity: index === activeIndex ? 1 : 0.6,
              },
            ]}
          >
            <Image
              source={{ uri: getBackdropUrl(movie.backdrop_path) }}
              style={styles.backdropImage}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <ThemedText style={styles.movieTitleOverlay}>
                {movie.title.toUpperCase()}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Movie Details and Actions */}
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.movieTitle}>{featuredMovie.title}</ThemedText>
        <ThemedText style={styles.movieMeta}>
          Movie • {formatGenres(featuredMovie.genre_ids)}
        </ThemedText>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/details/${featuredMovie.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="information-circle" size={24} color="#9BA1A6" />
            </View>
            <ThemedText style={styles.actionButtonText}>Detail</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.watchNowButton}
            onPress={() => router.push(`/trailer/${featuredMovie.id}`)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.watchNowText}>WATCH NOW</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="bookmark-outline" size={24} color="#9BA1A6" />
            </View>
            <ThemedText style={styles.actionButtonText}>Add List</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - FEATURED_WIDTH) / 2,
  },
  movieContainer: {
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    height: 400,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  movieTitleOverlay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  movieMeta: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  watchNowButton: {
    flex: 2,
    backgroundColor: Colors.dark.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchNowText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1,
  },
});

