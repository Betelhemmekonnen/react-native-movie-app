import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Import your custom context providers
import { FavoritesProvider } from '@/context/favorites-context';
import { MovieProvider } from '@/context/movie-context';
import { ThemeProvider as CustomThemeProvider } from '@/context/theme-context';
import { WatchlistProvider } from '@/context/watchlist-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // Wrap everything with your custom context providers
    <CustomThemeProvider>
      <FavoritesProvider>
        <WatchlistProvider>
          <MovieProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(stack)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </MovieProvider>
        </WatchlistProvider>
      </FavoritesProvider>
    </CustomThemeProvider>
  );
}