import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Movie } from '@/types/movie';
import { MovieCard } from './movie-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onMoviePress?: (movie: Movie) => void;
  emptyMessage?: string;
  showHD?: boolean;
  showRating?: boolean;
  numColumns?: number;
  cardSize?: 'small' | 'medium' | 'large';
}

export function MovieGrid({
  movies,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onMoviePress,
  emptyMessage = 'No movies found',
  showHD = true,
  showRating = false,
  numColumns = 3,
  cardSize = 'small',
}: MovieGridProps) {
  const renderItem: ListRenderItem<Movie> = ({ item }) => (
    <MovieCard
      movie={item}
      size={cardSize}
      showHD={showHD}
      showRating={showRating}
      onPress={onMoviePress}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
      </View>
    );
  };

  return (
    <FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.accent}
            colors={[Colors.dark.accent]}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={
        loading && movies.length > 0 ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={Colors.dark.accent} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9BA1A6',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

