const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";

// Read API key from environment variable
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || '';

// Check if API key is configured
const isApiKeyConfigured = API_KEY && API_KEY !== 'YOUR_API_KEY_HERE' && API_KEY.length > 20;

if (!isApiKeyConfigured) {
  console.warn(
    '⚠️ TMDB API Key is not configured!\n' +
    '📝 Please configure your API key to fetch real data\n' +
    '\nTo use real TMDB data:\n' +
    '1. Get your API key from: https://www.themoviedb.org/settings/api\n' +
    '2. Create a .env file in the root directory\n' +
    '3. Add: EXPO_PUBLIC_TMDB_API_KEY=your_key_here\n' +
    '4. Restart the Expo development server with: npx expo start --clear'
  );
} else {
  console.log('✅ TMDB API Key configured - Using real API data!');
}

export const httpClient = {
  get: async (endpoint: string) => {
    if (!isApiKeyConfigured) {
      throw new Error(
        'TMDB API Key is not configured. Please set EXPO_PUBLIC_TMDB_API_KEY in your .env file.'
      );
    }

    const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`;

    console.log('🌐 Fetching from TMDB:', endpoint);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    return response.json();
  },
};
