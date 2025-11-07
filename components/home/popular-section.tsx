import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Movie } from '@/types/movie';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.35;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

type FilterType = 'movie' | 'tv';

interface PopularSectionProps {
  movies: Movie[];
  filterType?: FilterType;
  onFilterChange?: (type: FilterType) => void;
}

export function PopularSection({
  movies,
  filterType = 'movie',
  onFilterChange,
}: PopularSectionProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>(filterType);

  const getImageUrl = (path: string | null) => {
    if (!path) return 'https://via.placeholder.com/500x750';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const handleFilterChange = (type: FilterType) => {
    setActiveFilter(type);
    onFilterChange?.(type);
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.sectionTitle}>Popular</ThemedText>
        <View style={styles.filters}>
          <TouchableOpacity
            onPress={() => handleFilterChange('movie')}
            style={[
              styles.filterButton,
              activeFilter === 'movie' && styles.activeFilterButton,
            ]}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === 'movie' && styles.activeFilterText,
              ]}
            >
              Movie
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilterChange('tv')}
            style={[
              styles.filterButton,
              activeFilter === 'tv' && styles.activeFilterButton,
            ]}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === 'tv' && styles.activeFilterText,
              ]}
            >
              Tv Series
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            style={styles.card}
            onPress={() => router.push(`/details/${movie.id}`)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: getImageUrl(movie.poster_path) }}
              style={styles.poster}
              resizeMode="cover"
            />
            {movie.vote_average > 7 && (
              <View style={styles.hdBadge}>
                <ThemedText style={styles.hdText}>HD</ThemedText>
              </View>
            )}
            <ThemedText style={styles.movieTitle} numberOfLines={2}>
              {movie.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  activeFilterButton: {
    // Active state styling
  },
  filterText: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.dark.secondaryAccent,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: CARD_HEIGHT,
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
  movieTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.text,
    marginTop: 8,
    textAlign: 'center',
  },
});

