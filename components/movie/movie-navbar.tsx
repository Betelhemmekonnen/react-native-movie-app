import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MovieNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFilterPress?: () => void;
}

export const MovieNavbar: React.FC<MovieNavbarProps> = ({
  activeTab,
  onTabChange,
  onFilterPress,
}) => {
  const router = useRouter();
  const tabs = ['Popular', 'Top Rated', 'Now Playing', 'Upcoming', 'Trending', 'Filter'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Movies</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Ionicons name="search" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
              tab === 'Filter' && styles.filterTab,
            ]}
            onPress={() => {
              if (tab === 'Filter' && onFilterPress) {
                onFilterPress();
              } else {
                onTabChange(tab);
              }
            }}
          >
            {tab === 'Filter' ? (
              <Ionicons
                name="filter"
                size={16}
                color={activeTab === tab ? '#000' : Colors.dark.text}
              />
            ) : (
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabsContainer: {
    marginTop: 8,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.dark.cardBackground,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.dark.secondaryAccent, // Yellowish color
  },
  filterTab: {
    minWidth: 50,
    paddingHorizontal: 16,
  },
  tabText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
});