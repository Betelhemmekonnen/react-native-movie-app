# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🎬 React Native Movie App

A modern movie and TV series browsing app built with React Native, Expo, and the TMDB API.

## Get started

### 1. Install dependencies

   ```bash
   npm install
   ```

### 2. Setup TMDB API

   1. Get your API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api)
   2. Create a `.env` file in the root directory:
      ```bash
      cp .env.example .env
      ```
   3. Add your API key to `.env`:
      ```
      EXPO_PUBLIC_TMDB_API_KEY=your_api_key_here
      ```

### 3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.




for Service/api  



## **The Syntax Used in This Code:**
This is using an **object with methods** approach:

```typescript
export const tmdbApi = {
  // These are methods inside an objectmn
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week') => {
    return httpClient.get(`/trending/movie/${timeWindow}`);
  },
  
  getPopularMovies: async (page: number = 1) => {
    return httpClient.get(`/movie/popular?page=${page}`);
  }
};
```

## **Breaking It Down:**

### **1. Object Creation:**
```typescript
export const tmdbApi = {
  // properties/methods go here
};
```
This creates an object called `tmdbApi` that contains multiple functions as properties.

### **2. Method Syntax:**
```typescript
getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week') => {
  // function body
}
```
- `getTrendingMovies:` - This is a **property name** (the function name)
- `:` - Separates the property name from its value
- `async (...) => { ... }` - The value is an arrow function

## **Equivalent in Your Familiar Syntax:**

```typescript
// Instead of the object approach, you could write them as separate functions:

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return httpClient.get(`/trending/movie/${timeWindow}`);
}

export async function getPopularMovies(page: number = 1) {
  return httpClient.get(`/movie/popular?page=${page}`);
}

export async function getTopRatedMovies(page: number = 1) {
  return httpClient.get(`/movie/top_rated?page=${page}`);
}
// ... and so on for each function
```

## **Why Use This Approach?**

### **Benefits:**
1. **Organization**: All related functions are grouped in one object
2. **Namespacing**: You call them as `tmdbApi.getTrendingMovies()` instead of individual imports
3. **Clean Imports**: Only need to import one object instead of many functions

### **Usage Difference:**
```typescript
// With separate functions (your familiar way):
import { getTrendingMovies, getPopularMovies } from './api';

getTrendingMovies('day');
getPopularMovies(1);

// With the object approach (this code):
import { tmdbApi } from './api';

tmdbApi.getTrendingMovies('day');
tmdbApi.getPopularMovies(1);
```

## **Converting to Your Preferred Syntax:**

If you want to rewrite it in the syntax you're familiar with:

```typescript
// Get trending movies
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TrendingResponse<Movie>> {
  return httpClient.get(`/trending/movie/${timeWindow}`);
}

// Get popular movies  
export async function getPopularMovies(page: number = 1): Promise<SearchResponse<Movie>> {
  return httpClient.get(`/movie/popular?page=${page}`);
}

// Get top rated movies
export async function getTopRatedMovies(page: number = 1): Promise<SearchResponse<Movie>> {
  return httpClient.get(`/movie/top_rated?page=${page}`);
}

// ... and so on for each function
```

Both approaches work - it's mostly about coding style and organization preference!
