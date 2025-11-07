import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { MovieDetails, Cast, Crew } from '@/types/movie';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BACKDROP_HEIGHT = SCREEN_HEIGHT * 0.4;

interface MovieDetailsProps {
  movie: MovieDetails;
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  onWatchNow?: () => void;
  onAddToList?: () => void;
  onShare?: () => void;
  isInWatchlist?: boolean;
  isFavorite?: boolean;
}

export function MovieDetailsComponent({
  movie,
  credits,
  onWatchNow,
  onAddToList,
  onShare,
  isInWatchlist = false,
  isFavorite = false,
}: MovieDetailsProps) {
  const getImageUrl = (path: string | null, size: 'w500' | 'w1280' = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGenres = () => {
    if (!movie.genres || movie.genres.length === 0) return 'N/A';
    return movie.genres.map((g) => g.name).join(', ');
  };

  const topCast = credits?.cast.slice(0, 10) || [];
  const directors = credits?.crew.filter((c) => c.job === 'Director') || [];
  const writers = credits?.crew.filter((c) => c.job === 'Writer' || c.job === 'Screenplay') || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      <Image
        source={{ uri: getImageUrl(movie.backdrop_path, 'w1280') }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <View style={styles.backdropOverlay} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title and Basic Info */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>{movie.title}</ThemedText>
          {movie.tagline && (
            <ThemedText style={styles.tagline}>{movie.tagline}</ThemedText>
          )}
          
          <View style={styles.metaRow}>
            {movie.release_date && (
              <ThemedText style={styles.metaText}>
                {new Date(movie.release_date).getFullYear()}
              </ThemedText>
            )}
            {movie.runtime > 0 && (
              <>
                <ThemedText style={styles.metaSeparator}>•</ThemedText>
                <ThemedText style={styles.metaText}>
                  {formatRuntime(movie.runtime)}
                </ThemedText>
              </>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <>
                <ThemedText style={styles.metaSeparator}>•</ThemedText>
                <ThemedText style={styles.metaText}>
                  {movie.genres[0].name}
                </ThemedText>
              </>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={Colors.dark.accent} />
            <ThemedText style={styles.rating}>
              {movie.vote_average.toFixed(1)}
            </ThemedText>
            <ThemedText style={styles.voteCount}>
              ({movie.vote_count.toLocaleString()} votes)
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onWatchNow}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="play-circle" size={24} color={Colors.dark.accent} />
            </View>
            <ThemedText style={styles.actionButtonText}>Watch Now</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAddToList}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={Colors.dark.accent}
              />
            </View>
            <ThemedText style={styles.actionButtonText}>
              {isInWatchlist ? 'In List' : 'Add List'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onShare}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="share-outline" size={24} color={Colors.dark.accent} />
            </View>
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Overview */}
        {movie.overview && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
            <ThemedText style={styles.overview}>{movie.overview}</ThemedText>
          </View>
        )}

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Genres</ThemedText>
            <View style={styles.genreContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <ThemedText style={styles.genreText}>{genre.name}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cast */}
        {topCast.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Cast</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.castContainer}>
                {topCast.map((actor) => (
                  <View key={actor.id} style={styles.castItem}>
                    <Image
                      source={{ uri: getImageUrl(actor.profile_path) }}
                      style={styles.castImage}
                      resizeMode="cover"
                    />
                    <ThemedText style={styles.castName} numberOfLines={1}>
                      {actor.name}
                    </ThemedText>
                    <ThemedText style={styles.castCharacter} numberOfLines={1}>
                      {actor.character}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Crew */}
        {(directors.length > 0 || writers.length > 0) && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Crew</ThemedText>
            {directors.length > 0 && (
              <View style={styles.crewRow}>
                <ThemedText style={styles.crewLabel}>Director:</ThemedText>
                <ThemedText style={styles.crewValue}>
                  {directors.map((d) => d.name).join(', ')}
                </ThemedText>
              </View>
            )}
            {writers.length > 0 && (
              <View style={styles.crewRow}>
                <ThemedText style={styles.crewLabel}>Writer:</ThemedText>
                <ThemedText style={styles.crewValue}>
                  {writers.map((w) => w.name).join(', ')}
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Details</ThemedText>
          <View style={styles.detailsRow}>
            <ThemedText style={styles.detailLabel}>Status:</ThemedText>
            <ThemedText style={styles.detailValue}>{movie.status}</ThemedText>
          </View>
          {movie.budget > 0 && (
            <View style={styles.detailsRow}>
              <ThemedText style={styles.detailLabel}>Budget:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatCurrency(movie.budget)}
              </ThemedText>
            </View>
          )}
          {movie.revenue > 0 && (
            <View style={styles.detailsRow}>
              <ThemedText style={styles.detailLabel}>Revenue:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatCurrency(movie.revenue)}
              </ThemedText>
            </View>
          )}
          {movie.production_countries && movie.production_countries.length > 0 && (
            <View style={styles.detailsRow}>
              <ThemedText style={styles.detailLabel}>Country:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {movie.production_countries.map((c) => c.name).join(', ')}
              </ThemedText>
            </View>
          )}
          {movie.spoken_languages && movie.spoken_languages.length > 0 && (
            <View style={styles.detailsRow}>
              <ThemedText style={styles.detailLabel}>Language:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {movie.spoken_languages.map((l) => l.english_name).join(', ')}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backdrop: {
    width: SCREEN_WIDTH,
    height: BACKDROP_HEIGHT,
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BACKDROP_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    padding: 16,
    marginTop: -40,
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#9BA1A6',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  metaSeparator: {
    fontSize: 14,
    color: '#9BA1A6',
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.accent,
  },
  voteCount: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
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
    color: Colors.dark.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.dark.text,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.dark.cardBackground,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  genreText: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  castContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  castItem: {
    width: 100,
    alignItems: 'center',
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  castName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  castCharacter: {
    fontSize: 12,
    color: '#9BA1A6',
    textAlign: 'center',
  },
  crewRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  crewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginRight: 8,
  },
  crewValue: {
    fontSize: 14,
    color: '#9BA1A6',
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#9BA1A6',
    flex: 1,
  },
});

