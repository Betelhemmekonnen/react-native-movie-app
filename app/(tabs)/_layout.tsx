import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =><IconSymbol size={28} name="house" color={color} />,
        }} 
      />
      <Tabs.Screen
        name="movie"
        options={{
          title: 'Movies',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="play" color={color} />,
        }}
      />

       <Tabs.Screen
        name="tv_series"
        options={{
          title: 'TV series',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="folder" color={color} />,
        }}
      />
      <Tabs.Screen
        name="watch_list"
        options={{
          title: 'Watch List',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bookmark" color={color} />,
        }}
      />

       <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="more" color={color} />,
        }}
      />
    
    </Tabs>
  );
}
