// components/tv/tv-navbar.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TVNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFilterPress?: () => void;
}

export const TVNavbar: React.FC<TVNavbarProps> = ({
  activeTab,
  onTabChange,
  onFilterPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Latest', 'Trending', 'Popular', 'Filter'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TV Series</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search TV series..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
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
              onPress={() => onTabChange(tab)}
            >
              {tab === 'Filter' ? (
                <Ionicons name="filter" size={16} color={activeTab === tab ? '#000' : '#fff'} />
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a1a1a',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginLeft: 16,
  },
  searchInput: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#333',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  filterTab: {
    minWidth: 50,
    paddingHorizontal: 16,
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000',
  },
});