// components/tv/tv-list.tsx
import { TVSeries } from '@/types/tv';
import React from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TVCard } from './tv-card';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;

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
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View style={[
            styles.itemContainer,
            index % NUM_COLUMNS !== NUM_COLUMNS - 1 && styles.itemSpacing
          ]}>
            <TVCard series={item} onPress={onItemPress} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={["#fff"]}
            />
          ) : undefined
        }
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
  listContent: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flex: 1 / NUM_COLUMNS,
  },
  itemSpacing: {
    marginRight: 8,
  },
});