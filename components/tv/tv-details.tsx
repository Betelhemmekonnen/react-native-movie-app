import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTVFavorites } from '@/hooks/use-tv-favorites';
import { useTVWatchlist } from '@/hooks/use-tv-watchlist';
import { tmdbApi } from '@/services/api/tmdb';
import { Creator, Episode, Network, ProductionCompany, TVSeriesDetails } from '@/types/tv';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { EpisodeList } from './episode-list';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BACKDROP_HEIGHT = SCREEN_HEIGHT * 0.4;

interface TVDetailsProps {
  seriesId: number;
  onBack?: () => void;
  onEpisodePress?: (episode: Episode) => void;
}

export const TVDetails: React.FC<TVDetailsProps> = ({ 
  seriesId, 
  onBack,
  onEpisodePress 
}) => {
  const [series, setSeries] = useState<TVSeriesDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  // Hooks for favorites and watchlist
  const { toggleFavorite, isFavorite: checkIsFavorite } = useTVFavorites();
  const { toggleWatchlist, isInWatchlist: checkIsInWatchlist } = useTVWatchlist();

  useEffect(() => {
    loadSeriesDetails();
  }, [seriesId]);

  useEffect(() => {
    if (series) {
      loadSeasonEpisodes();
      // Check favorite and watchlist status when series is loaded
      checkFavoriteStatus();
      checkWatchlistStatus();
    }
  }, [series, selectedSeason]);

  const loadSeriesDetails = async () => {
    try {
      setLoading(true);
      const seriesData = await tmdbApi.getTVDetails(seriesId);
      setSeries(seriesData);
    } catch (error) {
      console.error('Error loading series details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonEpisodes = async () => {
    try {
      const seasonData = await tmdbApi.getSeasonEpisodes(seriesId, selectedSeason);
      setEpisodes(seasonData.episodes || []);
    } catch (error) {
      console.error('Error loading episodes:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    if (seriesId) {
      try {
        const favorite = await checkIsFavorite(seriesId);
        setIsFavorite(favorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
  };

  const checkWatchlistStatus = async () => {
    if (seriesId) {
      try {
        const inWatchlist = await checkIsInWatchlist(seriesId);
        setIsInWatchlist(inWatchlist);
      } catch (error) {
        console.error('Error checking watchlist status:', error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (series) {
      const newStatus = await toggleFavorite(series);
      setIsFavorite(newStatus);
    }
  };

  const handleToggleWatchlist = async () => {
    if (series) {
      const newStatus = await toggleWatchlist(series);
      setIsInWatchlist(newStatus);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share TV series');
  };

  const formatGenres = () => {
    if (!series?.genres || series.genres.length === 0) return 'N/A';
    return series.genres.map((g) => g.name).join(', ');
  };

  const formatRuntime = (episodeCount: number) => {
    return `${episodeCount} episodes`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <ThemedText style={styles.loadingText}>Loading series details...</ThemedText>
      </View>
    );
  }

  if (!series) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.errorText}>Failed to load series details</ThemedText>
      </View>
    );
  }

  const backdropUrl = series.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333/fff?text=No+Image';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      <Image
        source={{ uri: backdropUrl }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <View style={styles.backdropOverlay} />
      
      {/* Back Button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      
      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite ? Colors.dark.accent : "#fff"} 
        />
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title and Basic Info */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>{series.name}</ThemedText>
          {series.tagline && (
            <ThemedText style={styles.tagline}>{series.tagline}</ThemedText>
          )}
          
          <View style={styles.metaRow}>
            {series.first_air_date && (
              <ThemedText style={styles.metaText}>
                {new Date(series.first_air_date).getFullYear()}
              </ThemedText>
            )}
            {series.episode_run_time && series.episode_run_time.length > 0 && (
              <>
                <ThemedText style={styles.metaSeparator}>•</ThemedText>
                <ThemedText style={styles.metaText}>
                  {formatRuntime(series.number_of_episodes)}
                </ThemedText>
              </>
            )}
            {series.genres && series.genres.length > 0 && (
              <>
                <ThemedText style={styles.metaSeparator}>•</ThemedText>
                <ThemedText style={styles.metaText}>
                  {series.genres[0].name}
                </ThemedText>
              </>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={Colors.dark.accent} />
            <ThemedText style={styles.rating}>
              {series.vote_average.toFixed(1)}
            </ThemedText>
            <ThemedText style={styles.voteCount}>
              ({series.vote_count.toLocaleString()} votes)
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Watch now')}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="play-circle" size={24} color={Colors.dark.accent} />
            </View>
            <ThemedText style={styles.actionButtonText}>Watch Now</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleWatchlist}
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
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="share-outline" size={24} color={Colors.dark.accent} />
            </View>
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Overview */}
        {series.overview && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
            <ThemedText style={styles.overview}>{series.overview}</ThemedText>
          </View>
        )}

        {/* Genres */}
        {series.genres && series.genres.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Genres</ThemedText>
            <View style={styles.genreContainer}>
              {series.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <ThemedText style={styles.genreText}>{genre.name}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Created By */}
        {series.created_by && series.created_by.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Created By</ThemedText>
            <ThemedText style={styles.detailValue}>
              {series.created_by.map((creator: Creator) => creator.name).join(', ')}
            </ThemedText>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Details</ThemedText>
          <View style={styles.detailsRow}>
            <ThemedText style={styles.detailLabel}>Status:</ThemedText>
            <ThemedText style={styles.detailValue}>{series.status}</ThemedText>
          </View>
          <View style={styles.detailsRow}>
            <ThemedText style={styles.detailLabel}>Seasons:</ThemedText>
            <ThemedText style={styles.detailValue}>{series.number_of_seasons}</ThemedText>
          </View>
          <View style={styles.detailsRow}>
            <ThemedText style={styles.detailLabel}>Episodes:</ThemedText>
            <ThemedText style={styles.detailValue}>{series.number_of_episodes}</ThemedText>
          </View>
          {series.networks && series.networks.length > 0 && (
            <View style={styles.detailsRow}>
              <ThemedText style={styles.detailLabel}>Network:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {series.networks.map((network: Network) => network.name).join(', ')}
              </ThemedText>
            </View>
          )}
          {series.production_companies && series.production_companies.length > 0 && (
            <View style={styles.detailsRow}>
              <ThemedText style={styles.detailLabel}>Production:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {series.production_companies.map((company: ProductionCompany) => company.name).join(', ')}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Season Selector */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Episodes</ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.seasonSelector}
          >
            {Array.from({ length: series.number_of_seasons }, (_, i) => i + 1).map((seasonNum) => (
              <TouchableOpacity
                key={seasonNum}
                style={[
                  styles.seasonButton,
                  selectedSeason === seasonNum && styles.seasonButtonActive
                ]}
                onPress={() => setSelectedSeason(seasonNum)}
              >
                <ThemedText style={[
                  styles.seasonButtonText,
                  selectedSeason === seasonNum && styles.seasonButtonTextActive
                ]}>
                  Season {seasonNum}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Episodes List */}
        <EpisodeList 
          episodes={episodes} 
          seasonNumber={selectedSeason}
          onEpisodePress={onEpisodePress}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.dark.text,
  },
  errorText: {
    color: Colors.dark.text,
    fontSize: 16,
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
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
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
  seasonSelector: {
    marginBottom: 16,
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBackground,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginRight: 8,
  },
  seasonButtonActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  seasonButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  seasonButtonTextActive: {
    color: '#fff',
  },
});