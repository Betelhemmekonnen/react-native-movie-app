import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Movie } from '@/types/movie';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface ContinueWatchingItem {
  id: number;
  movie: Movie | any; // Can be Movie or WatchlistMovie (which extends Movie)
  episode?: string; // e.g., "S2:E3" or "Continue"
  progress?: number; // 0-1
}

interface ContinueWatchingProps {
  items: ContinueWatchingItem[];
  onItemPress?: (item: ContinueWatchingItem) => void;
  onRemove?: (id: number) => void;
}

export function ContinueWatching({ items, onItemPress, onRemove }: ContinueWatchingProps) {
  const getImageUrl = (path: string | null) => {
    if (!path) return 'https://via.placeholder.com/500x750';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Continue watching</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onItemPress?.(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: getImageUrl(item.movie.poster_path) }}
              style={styles.poster}
              resizeMode="cover"
            />
            {item.movie.vote_average > 7 && (
              <View style={styles.hdBadge}>
                <ThemedText style={styles.hdText}>HD</ThemedText>
              </View>
            )}
            <View style={styles.infoContainer}>
              <View style={styles.playInfo}>
                <Ionicons name="play-circle" size={16} color={Colors.dark.accent} />
                <ThemedText style={styles.episodeText}>
                  {item.episode || 'Continue'}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onRemove?.(item.id);
                }}
                style={styles.removeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    paddingHorizontal: 16,
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
    backgroundColor: Colors.dark.cardBackground,
  },
  poster: {
    width: '100%',
    height: CARD_HEIGHT,
  },
  hdBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.dark.cardBackground,
  },
  playInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  episodeText: {
    fontSize: 12,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
});

