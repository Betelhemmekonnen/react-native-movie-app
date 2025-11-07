import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

export function Header() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const accentColor = isDark ? Colors.dark.accent : Colors.light.tint;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.leftSection}>
        {/* Logo - Using a stylized S/lightning bolt icon */}
        <View style={styles.logoContainer}>
          <ThemedText style={[styles.logoText, { color: accentColor }]}>S</ThemedText>
        </View>
        <ThemedText style={styles.appName}>OnStream</ThemedText>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => router.push('/search')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});

