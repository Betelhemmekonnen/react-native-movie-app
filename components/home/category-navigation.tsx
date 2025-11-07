import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Category = 'trending' | 'popular';

interface CategoryNavigationProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryNavigation({ activeCategory, onCategoryChange }: CategoryNavigationProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onCategoryChange('trending')}
        style={styles.tab}
        activeOpacity={0.7}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeCategory === 'trending' && styles.activeTabText,
          ]}
        >
          Trending
        </ThemedText>
        {activeCategory === 'trending' && <View style={styles.underline} />}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onCategoryChange('popular')}
        style={styles.tab}
        activeOpacity={0.7}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeCategory === 'popular' && styles.activeTabText,
          ]}
        >
          Popular
        </ThemedText>
        {activeCategory === 'popular' && <View style={styles.underline} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 24,
  },
  tab: {
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#9BA1A6',
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.dark.accent,
    borderRadius: 1,
  },
});

