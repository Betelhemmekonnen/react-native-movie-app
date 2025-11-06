// components/tv/tv-details.tsx
import { tmdbApi } from '@/services/api/tmdb';
import { Episode, TVSeriesDetails } from '@/types/tv';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { EpisodeList } from './episode-list';

const { width } = Dimensions.get('window');

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

  useEffect(() => {
    loadSeriesDetails();
  }, [seriesId]);

  useEffect(() => {
    if (series) {
      loadSeasonEpisodes();
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading series details...</Text>
      </View>
    );
  }

  if (!series) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load series details</Text>
      </View>
    );
  }

  const backdropUrl = series.backdrop_path 
    ? `https://image.tmdb.org/t/p/w780${series.backdrop_path}`
    : 'https://via.placeholder.com/780x439/333/fff?text=No+Image';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Backdrop Image */}
        <Image
          source={{ uri: backdropUrl }}
          style={styles.backdrop}
          resizeMode="cover"
        />

        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Series Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{series.name}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.rating}>⭐ {series.vote_average?.toFixed(1)}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>
              {series.first_air_date?.split('-')[0]}
            </Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>
              {series.number_of_seasons} Season{series.number_of_seasons !== 1 ? 's' : ''}
            </Text>
          </View>

          <Text style={styles.overview}>{series.overview}</Text>

          {/* Genres */}
          <View style={styles.genresContainer}>
            {series.genres?.map((genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Season Selector */}
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
                <Text style={[
                  styles.seasonButtonText,
                  selectedSeason === seasonNum && styles.seasonButtonTextActive
                ]}>
                  Season {seasonNum}
                </Text>
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
      </ScrollView>
    </View>
  );
};

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
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  backdrop: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
    position: 'absolute',
    top: 0,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: width * 0.5625 - 40,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  metaText: {
    color: '#ccc',
    fontSize: 14,
    marginHorizontal: 6,
  },
  overview: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  seasonSelector: {
    marginBottom: 16,
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
  },
  seasonButtonActive: {
    backgroundColor: '#e50914',
  },
  seasonButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  seasonButtonTextActive: {
    color: '#fff',
  },
});