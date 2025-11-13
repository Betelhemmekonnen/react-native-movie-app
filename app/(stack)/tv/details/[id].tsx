import { MovieGrid } from '@/components/movie/movie-grid';
import { Colors } from '@/constants/theme';
import { useTVContext } from '@/context/tv-context';
import { tmdbApi } from '@/services/api/tmdb';
import { Cast, TVSeries, TVSeriesCredits, TVSeriesDetails } from '@/types/tv';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function TVDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const tvId = parseInt(id || '0', 10);

  // Hide header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [tvSeries, setTVSeries] = useState<TVSeriesDetails | null>(null);
  const [credits, setCredits] = useState<TVSeriesCredits | null>(null);
  const [similarTV, setSimilarTV] = useState<TVSeries[]>([]);
  const [recommendedTV, setRecommendedTV] = useState<TVSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'similar' | 'recommended'>('similar');

  const {
    favoriteIds,
    watchlistIds,
    toggleFavorite,
    toggleWatchlist,
  } = useTVContext();

  const isFavorite = favoriteIds.includes(tvId);
  const isInWatchlist = watchlistIds.includes(tvId);

  useEffect(() => {
    if (tvId) {
      loadTVDetails();
    }
  }, [tvId]);

  const loadTVDetails = async () => {
    try {
      setLoading(true);
      const [tvData, creditsData, similarData, recommendedData] = await Promise.all([
        tmdbApi.getTVDetails(tvId),
        tmdbApi.getTVCredits(tvId),
        tmdbApi.getSimilarTV(tvId, 1),
        tmdbApi.getTVRecommendations(tvId, 1),
      ]);

      setTVSeries(tvData);
      setCredits(creditsData);
      setSimilarTV(similarData.results);
      setRecommendedTV(recommendedData.results);
    } catch (error) {
      console.error('Error loading TV details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (tvSeries) {
      await toggleFavorite(tvSeries);
    }
  };

  const handleWatchlistPress = async () => {
    if (tvSeries) {
      await toggleWatchlist(tvSeries);
    }
  };

  const handleWatchNow = async () => {
    // Navigate to first episode or show trailer
    if (tvSeries && tvSeries.number_of_seasons > 0) {
      // Try to get the first episode of the first season
      try {
        const seasonData = await tmdbApi.getSeasonEpisodes(tvId, 1);
        if (seasonData.episodes && seasonData.episodes.length > 0) {
          const firstEpisode = seasonData.episodes[0];
          // Navigate to episode details or player
          // For now, we'll show episode info
          router.push({
            pathname: '/tv/details/[id]',
            params: { 
              id: tvId.toString(),
              season: '1',
              episode: firstEpisode.episode_number.toString(),
            },
          });
        } else {
          // If no episodes, try to show trailer
          router.push(`/trailer/${tvId}`);
        }
      } catch (error) {
        console.error('Error loading first episode:', error);
        // Fallback to trailer
        router.push(`/trailer/${tvId}`);
      }
    } else {
      // If no seasons, try trailer
      router.push(`/trailer/${tvId}`);
    }
  };

  const handleTVPress = (selectedTV: TVSeries) => {
    router.replace(`/tv/details/${selectedTV.id}` as any);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <Text style={styles.loadingText}>Loading TV series details...</Text>
      </View>
    );
  }

  if (!tvSeries) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load TV series details</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropUrl = tvSeries.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${tvSeries.backdrop_path}`
    : 'https://via.placeholder.com/780x439/333/fff?text=No+Image';

  const formatRuntime = (episodeCount: number) => {
    return `${episodeCount} episodes`;
  };

  const topCast = credits?.cast.slice(0, 10) || [];
  const creators = tvSeries.created_by || [];

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: backdropUrl }}
            style={styles.backdrop}
            resizeMode="cover"
          />
          {/* Gradient overlay at top */}
          <View style={styles.backdropOverlay} />
        </View>

        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={handleFavoritePress}
                  style={styles.headerActionButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isFavorite ? '#FF4444' : '#fff'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleWatchlistPress}
                  style={styles.headerActionButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={isInWatchlist ? Colors.dark.accent : '#fff'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* TV Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{tvSeries.name}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.rating}>⭐ {tvSeries.vote_average?.toFixed(1)}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>
              {tvSeries.first_air_date?.split('-')[0]}
            </Text>
            {tvSeries.number_of_episodes > 0 && (
              <>
                <Text style={styles.metaText}>•</Text>
                <Text style={styles.metaText}>{formatRuntime(tvSeries.number_of_episodes)}</Text>
              </>
            )}
          </View>

          <Text style={styles.overview}>{tvSeries.overview}</Text>

          {/* Genres */}
          <View style={styles.genresContainer}>
            {tvSeries.genres?.map((genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.watchNowButton}
              onPress={handleWatchNow}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={24} color="#000" />
              <Text style={styles.watchNowText}>WATCH NOW</Text>
            </TouchableOpacity>
          </View>

          {/* Cast */}
          {topCast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.castContainer}>
                  {topCast.map((actor: Cast) => (
                    <View key={actor.id} style={styles.castItem}>
                      <Image
                        source={{
                          uri: actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : 'https://via.placeholder.com/185x278',
                        }}
                        style={styles.castImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.castName} numberOfLines={1}>
                        {actor.name}
                      </Text>
                      <Text style={styles.castCharacter} numberOfLines={1}>
                        {actor.character}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Creators */}
          {creators.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Created By</Text>
              <Text style={styles.creatorsText}>
                {creators.map((c) => c.name).join(', ')}
              </Text>
            </View>
          )}

          {/* Similar/Recommended TV Selector */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSelector}>
                <TouchableOpacity
                  style={[
                    styles.sectionButton,
                    activeSection === 'similar' && styles.sectionButtonActive,
                  ]}
                  onPress={() => setActiveSection('similar')}
                >
                  <Text
                    style={[
                      styles.sectionButtonText,
                      activeSection === 'similar' && styles.sectionButtonTextActive,
                    ]}
                  >
                    Similar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sectionButton,
                    activeSection === 'recommended' && styles.sectionButtonActive,
                  ]}
                  onPress={() => setActiveSection('recommended')}
                >
                  <Text
                    style={[
                      styles.sectionButtonText,
                      activeSection === 'recommended' && styles.sectionButtonTextActive,
                    ]}
                  >
                    Recommended
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TV Grid */}
            {activeSection === 'similar' && similarTV.length > 0 && (
              <MovieGrid
                movies={similarTV as unknown as any[]} // Type assertion for compatibility
                numColumns={3}
                cardSize="small"
                showHD={true}
                showRating={false}
                onMoviePress={handleTVPress as any} // Type assertion for compatibility
                emptyMessage="No similar TV series found"
                scrollEnabled={false}
              />
            )}

            {activeSection === 'recommended' && recommendedTV.length > 0 && (
              <MovieGrid
                movies={recommendedTV as unknown as any[]} // Type assertion for compatibility
                numColumns={3}
                cardSize="small"
                showHD={true}
                showRating={false}
                onMoviePress={handleTVPress as any} // Type assertion for compatibility
                emptyMessage="No recommendations found"
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    marginTop: 0,
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
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  backdropContainer: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
    position: 'relative',
    marginTop: 0,
    paddingTop: 0,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  safeAreaHeader: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 0,
    padding: 16,
    paddingTop: 0,
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
  actionButtonsContainer: {
    marginBottom: 24,
  },
  watchNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  watchNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  sectionButtonActive: {
    backgroundColor: Colors.dark.accent,
  },
  sectionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionButtonTextActive: {
    color: '#000',
    fontWeight: 'bold',
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
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  castCharacter: {
    color: '#ccc',
    fontSize: 11,
    textAlign: 'center',
  },
  creatorsText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});