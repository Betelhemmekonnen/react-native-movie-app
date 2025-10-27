// components/tv/tv-details.tsx
import { useWatchlist } from '@/hooks/use-storage';
import { tmdbApi } from '@/services/api/tmdb';
import { Episode, TVSeriesDetails } from '@/types/tv';
import { Ionicons } from '@expo/vector-icons';
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
  const [activeTab, setActiveTab] = useState('Episodes');
  
  // Watchlist hook
  const { isInWatchlist, toggleWatchlist } = useWatchlist(seriesId);

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

  const handleToggleWatchlist = async () => {
    if (series) {
      await toggleWatchlist(series);
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
    ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333/fff?text=No+Image';

  const posterUrl = series.poster_path
    ? `https://image.tmdb.org/t/p/w342${series.poster_path}`
    : 'https://via.placeholder.com/342x513/333/fff?text=No+Poster';

  const tabs = ['Episodes', 'Overview', 'Casts', 'Related'];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Backdrop with Gradient Overlay */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: backdropUrl }}
            style={styles.backdrop}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />
          
          {/* Back Button & Cast Icon */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.castButton}>
              <Ionicons name="tv-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Poster & Title Section */}
        <View style={styles.headerSection}>
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.titleSection}>
            <Text style={styles.title}>{series.name}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="star" size={16} color="#e6ff00" />
              <Text style={styles.rating}>{series.vote_average?.toFixed(1)}</Text>
              <Text style={styles.voteCount}>({series.vote_count} voted)</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.year}>{series.first_air_date?.split('-')[0]}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.watchButton}>
            <Ionicons name="play" size={24} color="#000" />
            <Text style={styles.watchButtonText}>Watch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.episodeListButton}>
            <Ionicons name="list" size={24} color="#000" />
            <Text style={styles.episodeListButtonText}>Episode List</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem} onPress={handleToggleWatchlist}>
            <Ionicons 
              name={isInWatchlist ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isInWatchlist ? "#e6ff00" : "#fff"} 
            />
            <Text style={[styles.actionText, isInWatchlist && styles.actionTextActive]}>
              {isInWatchlist ? 'In List' : 'Add List'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="logo-youtube" size={24} color="#fff" />
            <Text style={styles.actionText}>Trailer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="flag-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Report</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Episodes' && (
          <View style={styles.tabContent}>
            {/* Season Selector */}
            <TouchableOpacity style={styles.seasonSelector}>
              <View>
                <Text style={styles.seasonTitle}>Season {selectedSeason}</Text>
                <Text style={styles.seasonSubtitle}>
                  {episodes.length} episodes / Released {series.first_air_date?.split('-')[0]}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Episodes List */}
            <EpisodeList 
              episodes={episodes} 
              seasonNumber={selectedSeason}
              onEpisodePress={onEpisodePress}
            />
          </View>
        )}

        {activeTab === 'Overview' && (
          <View style={styles.tabContent}>
            <Text style={styles.overviewText}>{series.overview}</Text>
            
            {/* Genres */}
            <View style={styles.genresContainer}>
              {series.genres?.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{series.status}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Seasons:</Text>
              <Text style={styles.infoValue}>{series.number_of_seasons}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Episodes:</Text>
              <Text style={styles.infoValue}>{series.number_of_episodes}</Text>
            </View>
          </View>
        )}

        {activeTab === 'Casts' && (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Cast information coming soon...</Text>
          </View>
        )}

        {activeTab === 'Related' && (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Related shows coming soon...</Text>
          </View>
        )}
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
  backdropContainer: {
    width: width,
    height: width * 0.6,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  castButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -60,
    zIndex: 5,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  titleSection: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  voteCount: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  metaDot: {
    color: '#888',
    fontSize: 14,
    marginHorizontal: 8,
  },
  year: {
    color: '#fff',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  watchButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e6ff00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  watchButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeListButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  episodeListButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  actionTextActive: {
    color: '#e6ff00',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    marginRight: 32,
    paddingBottom: 12,
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#e6ff00',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#e6ff00',
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  seasonSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  seasonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seasonSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  overviewText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    width: 100,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  comingSoon: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});