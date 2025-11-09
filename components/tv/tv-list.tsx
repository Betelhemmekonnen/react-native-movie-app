// components/tv/tv-list.tsx
import { TVSeries } from '@/types/tv';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TVGrid } from './tv-grid';

interface TVListProps {
  data: TVSeries[];
  onItemPress: (series: TVSeries) => void;
  title?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const TVList: React.FC<TVListProps> = ({ 
  data, 
  onItemPress, 
  title,
  refreshing = false,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <TVGrid
        series={data}
        onSeriesPress={onItemPress}
        refreshing={refreshing}
        onRefresh={onRefresh}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});