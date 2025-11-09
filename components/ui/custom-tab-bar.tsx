import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Icon mapping
          const getIconName = (routeName: string) => {
            switch (routeName) {
              case 'index':
                return 'home';
              case 'movie':
              case 'movies':
                return 'play-circle';
              case 'tv_series':
                return 'folder';
              case 'watch_list':
              case 'watchlist':
                return 'bookmark';
              case 'more':
                return 'heart';
              default:
                return 'ellipse';
            }
          };

          const iconName = getIconName(route.name);
          const iconColor = isFocused
            ? '#000'
            : (isDark ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault);
          const textColor = isFocused
            ? '#000'
            : (isDark ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault);

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && styles.activeIconContainer,
                ]}
              >
                <Ionicons
                  name={iconName as any}
                  size={24}
                  color={isFocused ? '#000' : iconColor}
                />
              </View>
              <ThemedText
                style={[
                  styles.label,
                  { color: isFocused ? '#000' : textColor },
                ]}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.dark.background,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    height: Platform.OS === 'ios' ? 80 : 70,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: Colors.dark.secondaryAccent, // Yellowish color
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});