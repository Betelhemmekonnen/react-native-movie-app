// components/tv/episode-list.tsx
import { Episode } from '@/types/tv';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface EpisodeListProps {
  episodes: Episode[];
  seasonNumber: number;
  onEpisodePress?: (episode: Episode) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodes, 
  seasonNumber, 
  onEpisodePress 
}) => {
  const renderEpisodeItem = (item: Episode, index: number) => {
    const imageUrl = item.still_path 
      ? `https://image.tmdb.org/t/p/w400${item.still_path}`
      : 'https://via.placeholder.com/300x169/333/fff?text=No+Image';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.episodeContainer}
        onPress={() => onEpisodePress?.(item)}
        activeOpacity={0.7}
      >
        <View style={styles.episodeNumber}>
          <Text style={styles.episodeNumberText}>{index + 1}</Text>
        </View>
        
        <Image
          source={{ uri: imageUrl }}
          style={styles.episodeImage}
          resizeMode="cover"
        />
        
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle} numberOfLines={2}>
            {item.name || `Episode ${index + 1}`}
          </Text>
          <Text style={styles.episodeOverview} numberOfLines={3}>
            {item.overview || 'No description available.'}
          </Text>
          <Text style={styles.episodeMeta}>
            {item.runtime ? `${item.runtime} min • ` : ''}
            ⭐ {item.vote_average?.toFixed(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!episodes || episodes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No episodes available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {episodes.map((episode, index) => renderEpisodeItem(episode, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  seasonTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  episodeContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  episodeNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  episodeNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeImage: {
    width: 120,
    height: 68,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  episodeOverview: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },
  episodeMeta: {
    color: '#888',
    fontSize: 11,
  },
});