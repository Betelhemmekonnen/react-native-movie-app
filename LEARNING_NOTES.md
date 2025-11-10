# React Native Movie App - Complete Learning Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Components Architecture](#components-architecture)
4. [State Management with Context API](#state-management-with-context-api)
5. [Screens Implementation](#screens-implementation)
6. [Navigation System](#navigation-system)
7. [API Integration](#api-integration)
8. [Styling & Theming](#styling--theming)
9. [Best Practices](#best-practices)
10. [Key Concepts Learned](#key-concepts-learned)

---

## 🎯 Project Overview

**What We Built:**
A complete React Native movie streaming app (similar to OnStream) with:
- Movie browsing and discovery
- Favorites and Watchlist functionality
- Movie details pages
- Search functionality
- Dark theme with lime green accents

**Tech Stack:**
- React Native with Expo
- TypeScript
- Expo Router (file-based routing)
- Context API (state management)
- TMDB API (movie data)

---

## 📁 Project Structure

```
react-native-movie-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── movie.tsx     # Movies screen
│   │   ├── watch_list.tsx # Watchlist screen
│   │   └── more.tsx      # Favorites screen
│   └── (stack)/           # Stack navigation screens
│       └── details/[id].tsx # Movie details screen
├── components/            # Reusable components
│   ├── home/             # Home screen components
│   ├── movie/            # Movie-related components
│   ├── tv/               # TV series components (not your task)
│   └── ui/               # Generic UI components
├── context/              # Context providers
│   ├── movie-context.tsx # Main movie state management
│   ├── favorites-context.tsx
│   └── watchlist-context.tsx
├── hooks/                # Custom hooks
├── services/             # API services
│   └── api/
│       └── tmdb.ts       # TMDB API client
├── types/                # TypeScript type definitions
└── constants/            # Constants (theme, etc.)
```

---

## 🧩 Components Architecture

### 1. **UI Components** (`components/ui/`)

#### **LoadingSpinner**
```typescript
// Purpose: Show loading state
// Usage: When fetching data from API
// Props: message (optional)
```

**What You Learned:**
- Creating reusable UI components
- Conditional rendering
- ActivityIndicator usage

#### **ErrorMessage**
```typescript
// Purpose: Display error messages
// Usage: When API calls fail
// Props: message, onRetry
```

**What You Learned:**
- Error handling UI
- Retry functionality
- User feedback patterns

#### **SearchBar**
```typescript
// Purpose: Search input with icon
// Usage: Search screen, headers
// Props: value, onChangeText, onClear
```

**What You Learned:**
- Controlled inputs
- Icon integration (Ionicons)
- Input styling

#### **CustomTabBar**
```typescript
// Purpose: Custom bottom navigation bar
// Usage: Bottom tab navigation
// Features: Icons, labels, active states
```

**What You Learned:**
- Custom navigation components
- Icon mapping
- Active state styling
- Tab bar customization

---

### 2. **Home Screen Components** (`components/home/`)

#### **Header Component**
```typescript
// Location: components/home/header.tsx
// Purpose: App header with logo and actions
// Features:
//   - OnStream logo (green 'S' icon)
//   - App name
//   - Search icon
//   - Settings icon
```

**Key Concepts:**
- **SafeAreaView**: Handles device safe areas (notch, status bar)
- **Flexbox Layout**: `flexDirection: 'row'`, `justifyContent: 'space-between'`
- **TouchableOpacity**: Makes elements tappable
- **Ionicons**: Icon library integration

**Code Pattern:**
```typescript
<View style={styles.container}>
  <View style={styles.leftSection}>
    {/* Logo and app name */}
  </View>
  <View style={styles.rightSection}>
    {/* Action buttons */}
  </View>
</View>
```

#### **CategoryNavigation Component**
```typescript
// Purpose: Switch between Trending/Popular
// Features:
//   - Two tabs (Trending, Popular)
//   - Active state with underline
//   - Callback on tab change
```

**Key Concepts:**
- **State Management**: `useState` for active category
- **Conditional Styling**: Active vs inactive states
- **Callback Props**: `onCategoryChange` function
- **Underline Indicator**: Absolute positioning

**Pattern Learned:**
```typescript
const [activeCategory, setActiveCategory] = useState<'trending' | 'popular'>('trending');

// Conditional styling
style={[
  styles.tabText,
  activeCategory === 'trending' && styles.activeTabText
]}
```

#### **FeaturedMovieCarousel Component**
```typescript
// Purpose: Large featured movie display
// Features:
//   - Horizontal scrollable carousel
//   - Large backdrop images
//   - Action buttons (Detail, Watch Now, Add List)
//   - Movie title overlay
```

**Key Concepts:**
- **ScrollView**: Horizontal scrolling
- **Paging**: `pagingEnabled`, `snapToInterval`
- **Image Handling**: Backdrop images from TMDB
- **Action Buttons**: Multiple CTAs in a row
- **Overlay**: Text over images

**Advanced Pattern:**
```typescript
// Scroll tracking
const handleScroll = (event: any) => {
  const offsetX = event.nativeEvent.contentOffset.x;
  const index = Math.round(offsetX / FEATURED_WIDTH);
  setActiveIndex(index);
};

// Dynamic sizing
const FEATURED_WIDTH = SCREEN_WIDTH * 0.75;
const SIDE_WIDTH = SCREEN_WIDTH * 0.6;
```

#### **ContinueWatching Component**
```typescript
// Purpose: Show recently watched items
// Features:
//   - Horizontal list
//   - Poster images
//   - Episode info (S2:E3, Continue)
//   - Remove button
```

**Key Concepts:**
- **Data Transformation**: Converting watchlist to display format
- **Horizontal Lists**: ScrollView with horizontal prop
- **Card Layout**: Fixed width cards
- **Remove Functionality**: Callback with stopPropagation

#### **TrendingSection / PopularSection / LatestMoviesSection**
```typescript
// Purpose: Display movie lists horizontally
// Features:
//   - Section title
//   - "View all" button
//   - Horizontal scrollable movie cards
//   - HD badges
```

**Key Concepts:**
- **Reusable Components**: Same pattern for different sections
- **Props Pattern**: `movies`, `onViewAll`, `onMoviePress`
- **Card Grid**: Fixed width cards in horizontal scroll
- **Badge System**: HD indicator for high-rated movies

---

### 3. **Movie Components** (`components/movie/`)

#### **MovieCard Component**
```typescript
// Purpose: Display individual movie
// Features:
//   - Poster image
//   - HD badge
//   - Rating badge (optional)
//   - Favorite button
//   - Watchlist button
//   - Multiple sizes (small, medium, large)
```

**Key Concepts:**
- **Component Props**: Flexible props for different use cases
- **Size Variants**: `size?: 'small' | 'medium' | 'large'`
- **Conditional Rendering**: Show/hide badges based on props
- **Action Buttons**: Favorite and watchlist toggles
- **TouchableOpacity**: Navigate on press

**Props Pattern:**
```typescript
interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
  showHD?: boolean;
  showRating?: boolean;
  showActions?: boolean;
  onPress?: (movie: Movie) => void;
}
```

#### **MovieGrid Component**
```typescript
// Purpose: Display movies in grid layout
// Features:
//   - Configurable columns (numColumns)
//   - Pull-to-refresh
//   - Infinite scroll (onEndReached)
//   - Loading states
//   - Empty states
```

**Key Concepts:**
- **FlatList**: Efficient list rendering
- **Grid Layout**: `numColumns` prop
- **RefreshControl**: Pull-to-refresh functionality
- **Pagination**: `onEndReached` for infinite scroll
- **Loading States**: Show spinner while loading more

**Advanced Pattern:**
```typescript
<FlatList
  data={movies}
  numColumns={3}
  renderItem={({ item }) => <MovieCard movie={item} />}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
  onEndReached={onEndReached}
  onEndReachedThreshold={0.5}
/>
```

#### **MovieNavbar Component**
```typescript
// Purpose: Category navigation for movies screen
// Features:
//   - Multiple categories (Popular, Top Rated, etc.)
//   - Active tab indicator
//   - Horizontal scrollable tabs
```

**Key Concepts:**
- **Tab Navigation**: Similar to CategoryNavigation but for movies
- **Scrollable Tabs**: When tabs exceed screen width
- **Active State**: Visual feedback for selected tab

---

## 🔄 State Management with Context API

### **MovieContext** (`context/movie-context.tsx`)

**Purpose:** Central state management for all movie data

**What It Manages:**
1. **Movie Lists:**
   - Trending movies
   - Popular movies
   - Top rated movies
   - Now playing movies
   - Upcoming movies

2. **Loading States:**
   - Separate loading state for each list
   - Prevents UI flickering

3. **Error States:**
   - Error messages for failed API calls
   - Allows retry functionality

4. **Favorites & Watchlist:**
   - Favorite movies list
   - Watchlist movies list
   - Toggle functions

**Key Concepts Learned:**

#### **1. Context Creation**
```typescript
// Create context
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Provider component
export function MovieProvider({ children }: { children: React.ReactNode }) {
  // State and logic here
  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

// Custom hook
export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within MovieProvider');
  }
  return context;
}
```

#### **2. State Management Pattern**
```typescript
// Multiple related states
const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
const [loadingTrending, setLoadingTrending] = useState(false);
const [trendingError, setTrendingError] = useState<string | null>(null);

// Fetch function
const fetchTrendingMovies = useCallback(async (timeWindow: 'day' | 'week') => {
  try {
    setLoadingTrending(true);
    setTrendingError(null);
    const data = await tmdbApi.getTrendingMovies(timeWindow);
    setTrendingMovies(data.results);
  } catch (error) {
    setTrendingError(error.message);
  } finally {
    setLoadingTrending(false);
  }
}, []);
```

#### **3. useCallback Hook**
```typescript
// Why useCallback?
// - Prevents function recreation on every render
// - Optimizes child component re-renders
// - Required for useEffect dependencies

const fetchMovies = useCallback(async () => {
  // Function logic
}, [dependencies]);
```

#### **4. Local Storage Integration**
```typescript
// AsyncStorage for persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save favorites
await AsyncStorage.setItem('favorites', JSON.stringify(favorites));

// Load favorites
const stored = await AsyncStorage.getItem('favorites');
const favorites = stored ? JSON.parse(stored) : [];
```

---

## 📱 Screens Implementation

### **1. Home Screen** (`app/(tabs)/index.tsx`)

**Purpose:** Main landing page with featured content

**Structure:**
```
Home Screen
├── Header (logo, search, settings)
├── Category Navigation (Trending/Popular)
├── Featured Movie Carousel (if Trending)
├── Continue Watching
├── Trending Section (if Trending active)
├── Popular Section (if Popular active)
└── Latest Movies (always shown)
```

**Key Concepts:**

#### **Conditional Rendering**
```typescript
{activeCategory === 'trending' && (
  <>
    <FeaturedMovieCarousel movies={trendingMovies} />
    <ContinueWatching items={continueWatchingItems} />
    <TrendingSection movies={trendingMovies} />
  </>
)}
```

#### **Loading States**
```typescript
// Initial loading
{isInitialLoading && !hasData && (
  <LoadingSpinner message="Loading movies..." />
)}

// Section loading
{loadingTrending && trendingMovies.length === 0 ? (
  <ActivityIndicator />
) : (
  <TrendingSection movies={trendingMovies} />
)}
```

#### **Error Handling**
```typescript
{hasError && !hasData && (
  <ErrorMessage
    message={trendingError || popularError}
    onRetry={handleRefresh}
  />
)}
```

#### **Pull-to-Refresh**
```typescript
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  }
>
```

**What You Learned:**
- Screen composition from components
- State management across components
- Loading and error state handling
- User interaction patterns

---

### **2. Movie Screen** (`app/(tabs)/movie.tsx`)

**Purpose:** Browse movies by category

**Structure:**
```
Movie Screen
├── MovieNavbar (category tabs)
└── MovieGrid (movies in grid)
```

**Key Concepts:**

#### **Dynamic Data Loading**
```typescript
// Get current movies based on active tab
const getCurrentMovies = useCallback((): Movie[] => {
  switch (activeTab) {
    case 'Popular':
      return popularMovies;
    case 'Top Rated':
      return topRatedMovies;
    // ... other cases
  }
}, [activeTab, popularMovies, topRatedMovies]);
```

#### **Memoization**
```typescript
// useMemo: Cache computed values
const currentMovies = useMemo(() => getCurrentMovies(), [getCurrentMovies]);

// useCallback: Cache functions
const handleCategoryChange = useCallback((tab: MovieCategory) => {
  setActiveTab(tab);
  fetchMoviesForCategory(tab);
}, []);
```

#### **Infinite Scroll**
```typescript
const handleEndReached = useCallback(() => {
  if (!currentLoading && hasMore) {
    loadMoreMovies();
  }
}, [currentLoading, hasMore, loadMoreMovies]);
```

**What You Learned:**
- Tab-based navigation
- Dynamic content loading
- Performance optimization (memoization)
- Pagination patterns

---

### **3. Watchlist Screen** (`app/(tabs)/watch_list.tsx`)

**Purpose:** Display saved movies to watch later

**Structure:**
```
Watchlist Screen
├── Header (title, search icon)
├── Category Tabs (Movie, TV Series, Trakt)
└── MovieGrid (watchlist movies)
```

**Key Concepts:**

#### **Tab Navigation Pattern**
```typescript
const [activeCategory, setActiveCategory] = useState<'Movie' | 'TV Series' | 'Trakt'>('Movie');

// Render tabs
{categories.map((category) => (
  <TouchableOpacity
    onPress={() => handleCategoryChange(category)}
    style={[styles.tab, activeCategory === category && styles.activeTab]}
  >
    <Text>{category}</Text>
    {activeCategory === category && <View style={styles.underline} />}
  </TouchableOpacity>
))}
```

#### **Conditional Content**
```typescript
{activeCategory === 'Movie' && (
  <MovieGrid movies={watchlistMovies} />
)}

{activeCategory === 'TV Series' && (
  <View>
    <Text>Coming soon</Text>
  </View>
)}
```

**What You Learned:**
- Tab-based filtering
- Empty state handling
- Data persistence (AsyncStorage)
- Category-based content display

---

### **4. Favorites Screen** (`app/(tabs)/more.tsx`)

**Purpose:** Display favorite movies

**Structure:** Same as Watchlist but for favorites

**Key Concepts:**
- Same patterns as Watchlist
- Reusable component structure
- Consistent UI/UX

---

### **5. Movie Details Screen** (`app/(stack)/details/[id].tsx`)

**Purpose:** Show detailed information about a movie

**Structure:**
```
Details Screen
├── Backdrop Image (full width)
├── Header (back button, favorite, watchlist)
├── Movie Info
│   ├── Title
│   ├── Rating & Meta
│   ├── Overview
│   ├── Genres
│   └── Action Buttons
├── Cast Section (horizontal scroll)
├── Crew Section
└── Similar/Recommended Movies
```

**Key Concepts:**

#### **Dynamic Routes**
```typescript
// Expo Router dynamic route
// File: app/(stack)/details/[id].tsx
// URL: /details/123

const { id } = useLocalSearchParams<{ id: string }>();
const movieId = parseInt(id || '0', 10);
```

#### **Multiple API Calls**
```typescript
// Parallel API calls
const [movieData, creditsData, similarData, recommendedData] = await Promise.all([
  tmdbApi.getMovieDetails(movieId),
  tmdbApi.getMovieCredits(movieId),
  tmdbApi.getSimilarMovies(movieId, 1),
  tmdbApi.getMovieRecommendations(movieId, 1),
]);
```

#### **ScrollView with Fixed Header**
```typescript
<ScrollView>
  <Image style={styles.backdrop} />
  <View style={styles.headerContainer}>
    {/* Fixed header overlay */}
  </View>
  <View style={styles.infoContainer}>
    {/* Scrollable content */}
  </View>
</ScrollView>
```

#### **Absolute Positioning**
```typescript
// Header over backdrop
header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}
```

**What You Learned:**
- Dynamic routing
- Complex layouts (overlays, absolute positioning)
- Multiple data fetching
- Navigation patterns
- Image handling (backdrop, posters, cast)

---

## 🧭 Navigation System

### **Expo Router (File-based Routing)**

**Key Concepts:**

#### **1. Tab Navigation** (`app/(tabs)/`)
```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Home' }} />
  <Tabs.Screen name="movie" options={{ title: 'Movies' }} />
  <Tabs.Screen name="watch_list" options={{ title: 'Watch List' }} />
  <Tabs.Screen name="more" options={{ title: 'Favorites' }} />
</Tabs>
```

#### **2. Stack Navigation** (`app/(stack)/`)
```typescript
// app/(stack)/_layout.tsx
<Stack>
  <Stack.Screen
    name="details/[id]"
    options={{ headerShown: false }}
  />
</Stack>
```

#### **3. Navigation Hooks**
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate
router.push('/details/123');
router.replace('/details/123');
router.back();
```

**What You Learned:**
- File-based routing
- Nested navigation (tabs + stack)
- Dynamic routes
- Navigation hooks

---

## 🌐 API Integration

### **TMDB API Service** (`services/api/tmdb.ts`)

**Structure:**
```typescript
export const tmdbApi = {
  getTrendingMovies: async (timeWindow) => { ... },
  getPopularMovies: async (page) => { ... },
  getMovieDetails: async (movieId) => { ... },
  getMovieCredits: async (movieId) => { ... },
  // ... more methods
};
```

**Key Concepts:**

#### **1. HTTP Client**
```typescript
// services/api/http-client.ts
const httpClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    return response.json();
  },
};
```

#### **2. Error Handling**
```typescript
try {
  const data = await tmdbApi.getMovies();
  setMovies(data.results);
} catch (error) {
  setError(error.message);
  console.error('API Error:', error);
}
```

#### **3. Image URLs**
```typescript
// TMDB image base URL
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Different sizes
const posterUrl = `${IMAGE_BASE_URL}w500${poster_path}`;
const backdropUrl = `${IMAGE_BASE_URL}w1280${backdrop_path}`;
```

**What You Learned:**
- API service organization
- Error handling patterns
- Image URL construction
- Async/await patterns

---

## 🎨 Styling & Theming

### **Theme System** (`constants/theme.ts`)

**Structure:**
```typescript
export const Colors = {
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    tint: '#32CD32', // Lime green
    accent: '#32CD32',
    secondaryAccent: '#ADFF2F',
    cardBackground: '#1A1A1A',
    border: '#2A2A2A',
  },
};
```

**Key Concepts:**

#### **1. StyleSheet API**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
});
```

#### **2. Flexbox Layout**
```typescript
// Container
container: {
  flex: 1,              // Take available space
  flexDirection: 'row', // Horizontal layout
  justifyContent: 'space-between', // Space items
  alignItems: 'center', // Center vertically
}
```

#### **3. Responsive Design**
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.35; // 35% of screen width
```

#### **4. Platform-Specific Styles**
```typescript
import { Platform } from 'react-native';

paddingTop: Platform.OS === 'ios' ? 50 : 20,
```

**What You Learned:**
- Theme organization
- Flexbox layout system
- Responsive design patterns
- Platform-specific styling

---

## ✅ Best Practices

### **1. Component Organization**
- ✅ Separate components by feature
- ✅ Reusable UI components in `components/ui/`
- ✅ Feature-specific components in feature folders
- ✅ One component per file

### **2. TypeScript Usage**
- ✅ Define interfaces for all props
- ✅ Type all function parameters
- ✅ Use type inference where appropriate
- ✅ Avoid `any` type

### **3. State Management**
- ✅ Use Context API for global state
- ✅ Local state for component-specific data
- ✅ Separate loading/error states
- ✅ Use `useCallback` for functions passed as props

### **4. Performance Optimization**
- ✅ `useMemo` for expensive computations
- ✅ `useCallback` for function props
- ✅ `FlatList` for long lists
- ✅ Image optimization (appropriate sizes)

### **5. Code Organization**
- ✅ Clear file structure
- ✅ Consistent naming conventions
- ✅ Comments for complex logic
- ✅ Separation of concerns

---

## 🎓 Key Concepts Learned

### **React Native Fundamentals**
1. **Components**: Building reusable UI pieces
2. **Props**: Passing data to components
3. **State**: Managing component data
4. **Hooks**: `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext`
5. **Styling**: StyleSheet, Flexbox, responsive design

### **Navigation**
1. **Expo Router**: File-based routing
2. **Tab Navigation**: Bottom tabs
3. **Stack Navigation**: Screen stacking
4. **Dynamic Routes**: Parameter-based routes

### **State Management**
1. **Context API**: Global state management
2. **Local State**: Component-level state
3. **AsyncStorage**: Data persistence
4. **Loading States**: User feedback

### **API Integration**
1. **HTTP Requests**: Fetch API
2. **Error Handling**: Try-catch patterns
3. **Async/Await**: Asynchronous operations
4. **Image Handling**: URL construction

### **UI/UX Patterns**
1. **Loading States**: Spinners, skeletons
2. **Error States**: Error messages, retry
3. **Empty States**: Helpful messages
4. **Pull-to-Refresh**: User-initiated refresh
5. **Infinite Scroll**: Pagination

---

## 📝 Summary

**Today You Built:**
1. ✅ Complete component library (UI, Movie, Home components)
2. ✅ State management system (Context API)
3. ✅ Multiple screens (Home, Movies, Watchlist, Favorites, Details)
4. ✅ Navigation system (Tabs + Stack)
5. ✅ API integration (TMDB)
6. ✅ Theming system
7. ✅ Favorites & Watchlist functionality

**Skills Developed:**
- React Native component development
- TypeScript usage
- State management patterns
- Navigation patterns
- API integration
- UI/UX design implementation
- Performance optimization

**Next Steps to Learn:**
- Testing (Jest, React Native Testing Library)
- Animation (Reanimated, Animated API)
- Performance monitoring
- Error tracking (Sentry)
- Offline support
- Push notifications

---

## 🚀 Quick Reference

### **Common Patterns**

#### **Component with Props**
```typescript
interface ComponentProps {
  data: DataType;
  onPress?: () => void;
}

export function Component({ data, onPress }: ComponentProps) {
  return <View>...</View>;
}
```

#### **Context Usage**
```typescript
const { data, loading, error, fetchData } = useMovieContext();
```

#### **Navigation**
```typescript
const router = useRouter();
router.push('/screen');
```

#### **API Call**
```typescript
const data = await tmdbApi.getMovies();
```

#### **Loading State**
```typescript
{loading ? <ActivityIndicator /> : <Content />}
```

---

**Congratulations on building a complete React Native app! 🎉**

This project demonstrates real-world React Native development patterns and best practices. Keep practicing and building more features!

