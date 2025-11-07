import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/components/ui/custom-tab-bar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }} 
      />
      <Tabs.Screen
        name="movie"
        options={{
          title: 'Movies',
        }}
      />

       <Tabs.Screen
        name="tv_series"
        options={{
          title: 'TV Series',
        }}
      />
      <Tabs.Screen
        name="watch_list"
        options={{
          title: 'Watch List',
        }}
      />

       <Tabs.Screen
        name="more"
        options={{
          title: 'Favorites',
        }}
      />
    
    </Tabs>
  );
}
