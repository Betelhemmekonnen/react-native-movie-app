import { MovieGrid } from '@/components/movie/movie-grid';
import { Colors } from '@/constants/theme';
import { useMovieContext } from '@/context/movie-context';
import { tmdbApi } from '@/services/api/tmdb';
import { Movie, MovieCredits, MovieDetails } from '@/types/movie';
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

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const movieId = parseInt(id || '0', 10);

  // Hide header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'similar' | 'recommended'>('similar');

  const {
    favoriteIds,
    watchlistIds,
    toggleFavorite,
    toggleWatchlist,
  } = useMovieContext();

  const isFavorite = favoriteIds.includes(movieId);
  const isInWatchlist = watchlistIds.includes(movieId);

  useEffect(() => {
    if (movieId) {
      loadMovieDetails();
    }
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieData, creditsData, similarData, recommendedData] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieCredits(movieId),
        tmdbApi.getSimilarMovies(movieId, 1),
        tmdbApi.getMovieRecommendations(movieId, 1),
      ]);

      setMovie(movieData);
      setCredits(creditsData);
      setSimilarMovies(similarData.results);
      setRecommendedMovies(recommendedData.results);
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (movie) {
      await toggleFavorite(movie);
    }
  };

  const handleWatchlistPress = async () => {
    if (movie) {
      await toggleWatchlist(movie);
    }
  };

  const handleWatchNow = () => {
    router.push(`/trailer/${movieId}`);
  };

  const handleMoviePress = (selectedMovie: Movie) => {
    router.replace(`/details/${selectedMovie.id}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load movie details</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : 'https://via.placeholder.com/780x439/333/fff?text=No+Image';

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const topCast = credits?.cast.slice(0, 10) || [];
  const directors = credits?.crew.filter((c) => c.job === 'Director') || [];
  const writers = credits?.crew.filter((c) => c.job === 'Writer' || c.job === 'Screenplay') || [];

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

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>
              {movie.release_date?.split('-')[0]}
            </Text>
            {movie.runtime > 0 && (
              <>
                <Text style={styles.metaText}>•</Text>
                <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
              </>
            )}
          </View>

          <Text style={styles.overview}>{movie.overview}</Text>

          {/* Genres */}
          <View style={styles.genresContainer}>
            {movie.genres?.map((genre) => (
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
                  {topCast.map((actor) => (
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

          {/* Crew */}
          {(directors.length > 0 || writers.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Crew</Text>
              {directors.length > 0 && (
                <View style={styles.crewRow}>
                  <Text style={styles.crewLabel}>Director:</Text>
                  <Text style={styles.crewValue}>
                    {directors.map((d) => d.name).join(', ')}
                  </Text>
                </View>
              )}
              {writers.length > 0 && (
                <View style={styles.crewRow}>
                  <Text style={styles.crewLabel}>Writer:</Text>
                  <Text style={styles.crewValue}>
                    {writers.map((w) => w.name).join(', ')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Similar/Recommended Movies Selector */}
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

            {/* Movies Grid */}
            {activeSection === 'similar' && similarMovies.length > 0 && (
              <MovieGrid
                movies={similarMovies}
                numColumns={3}
                cardSize="small"
                showHD={true}
                showRating={false}
                onMoviePress={handleMoviePress}
                emptyMessage="No similar movies found"
              />
            )}

            {activeSection === 'recommended' && recommendedMovies.length > 0 && (
              <MovieGrid
                movies={recommendedMovies}
                numColumns={3}
                cardSize="small"
                showHD={true}
                showRating={false}
                onMoviePress={handleMoviePress}
                emptyMessage="No recommendations found"
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
  crewRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  crewLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    width: 80,
  },
  crewValue: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
});

