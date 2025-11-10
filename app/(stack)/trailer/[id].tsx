import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { tmdbApi } from '@/services/api/tmdb';
import { MovieVideos, Video } from '@/types/movie';
import { Colors } from '@/constants/theme';

export default function TrailerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const movieId = parseInt(id || '0', 10);

  const [videos, setVideos] = useState<MovieVideos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (movieId) {
      loadTrailers();
    }
  }, [movieId]);

  const loadTrailers = async () => {
    try {
      setLoading(true);
      setError(null);
      const videosData = await tmdbApi.getMovieVideos(movieId);
      setVideos(videosData);

      // Find the first official trailer, or the first trailer, or the first video
      const trailer = videosData.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      ) || videosData.results.find((v) => v.type === 'Trailer') || videosData.results[0];

      if (trailer) {
        setSelectedVideo(trailer);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trailers');
      console.error('Error loading trailers:', err);
    } finally {
      setLoading(false);
    }
  };

  const openInYouTube = async (videoKey: string) => {
    const url = `https://www.youtube.com/watch?v=${videoKey}`;
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch (err) {
      // Fallback to Linking if WebBrowser fails
      Linking.openURL(url).catch((error) => {
        console.error('Failed to open YouTube:', error);
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
          <Text style={styles.loadingText}>Loading trailer...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !videos || videos.results.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Ionicons name="videocam-off" size={64} color="#666" />
          <Text style={styles.errorText}>
            {error || 'No trailers available for this movie'}
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonLarge}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trailer</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {selectedVideo ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={80} color={Colors.dark.accent} />
              <Text style={styles.videoPlaceholderText}>Tap to watch trailer</Text>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{selectedVideo.name}</Text>
              {selectedVideo.official && (
                <View style={styles.officialBadge}>
                  <Text style={styles.officialText}>Official</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.youtubeButton}
              onPress={() => openInYouTube(selectedVideo.key)}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-youtube" size={24} color="#fff" />
              <Text style={styles.youtubeButtonText}>Watch on YouTube</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {videos && videos.results.length > 1 && (
          <View style={styles.videoList}>
            <Text style={styles.sectionTitle}>More Videos</Text>
            {videos.results.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={[
                  styles.videoItem,
                  selectedVideo?.id === video.id && styles.videoItemActive,
                ]}
                onPress={() => setSelectedVideo(video)}
              >
                <Ionicons name="play-circle" size={24} color={Colors.dark.accent} />
                <View style={styles.videoItemInfo}>
                  <Text style={styles.videoItemTitle}>{video.name}</Text>
                  <Text style={styles.videoItemType}>
                    {video.type} {video.official && '• Official'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonLarge: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  videoContainer: {
    padding: 16,
  },
  videoPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  officialBadge: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
  officialText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  youtubeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoList: {
    padding: 16,
    maxHeight: 300,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 8,
  },
  videoItemActive: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  videoItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  videoItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoItemType: {
    color: '#999',
    fontSize: 12,
  },
});

