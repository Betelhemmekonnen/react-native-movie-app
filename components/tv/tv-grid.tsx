import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { TVSeries } from '@/types/tv';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import { TVCard } from './tv-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TVGridProps {
  series: TVSeries[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onSeriesPress?: (series: TVSeries) => void;
  emptyMessage?: string;
  numColumns?: number;
}

export function TVGrid({
  series,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onSeriesPress,
  emptyMessage = 'No TV series found',
  numColumns = 3,
}: TVGridProps) {
  const renderItem: ListRenderItem<TVSeries> = ({ item }) => (
    <TVCard
      series={item}
      onPress={onSeriesPress || (() => {})}
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
      data={series}
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
        loading && series.length > 0 ? (
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