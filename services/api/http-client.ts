const BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
export const httpClient = {
  get: async (endpoint: string) => {
    const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
};
