import { Movie } from '../../types/movie';
import { StorageService } from './async-storage';

// Storage keys
const FAVORITES_KEY = 'favorites';

// Types for stored favorites
export interface FavoriteMovie extends Movie {
  addedAt: string; // ISO date string
}

export interface FavoritesData {
  movies: Record<number, FavoriteMovie>;
  lastUpdated: string;
}

/**
 * Service for managing movie favorites
 */
export class FavoritesService {
  /**
   * Get all favorites data
   */
  static async getFavorites(): Promise<FavoritesData> {
    const favorites = await StorageService.getItem<FavoritesData>(FAVORITES_KEY);
    
    if (!favorites) {
      return {
        movies: {},
        lastUpdated: new Date().toISOString(),
      };
    }
    
    return favorites;
  }

  /**
   * Add a movie to favorites
   * @param movie - Movie to add
   * @returns Promise<boolean> - Success status
   */
  static async addMovie(movie: Movie): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      
      const favoriteMovie: FavoriteMovie = {
        ...movie,
        addedAt: new Date().toISOString(),
      };
      
      favorites.movies[movie.id] = favoriteMovie;
      favorites.lastUpdated = new Date().toISOString();
      
      return await StorageService.setItem(FAVORITES_KEY, favorites);
    } catch (error) {
      console.error('FavoritesService.addMovie error:', error);
      return false;
    }
  }

  /**
   * Remove a movie from favorites by ID
   * @param movieId - Movie ID to remove
   * @returns Promise<boolean> - Success status
   */
  static async removeMovie(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      
      if (favorites.movies[movieId]) {
        delete favorites.movies[movieId];
        favorites.lastUpdated = new Date().toISOString();
        return await StorageService.setItem(FAVORITES_KEY, favorites);
      }
      
      return true; // Already not in favorites
    } catch (error) {
      console.error('FavoritesService.removeMovie error:', error);
      return false;
    }
  }

  /**
   * Check if a movie is in favorites
   * @param movieId - Movie ID to check
   * @returns Promise<boolean> - Whether movie is favorited
   */
  static async isMovieFavorite(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return !!favorites.movies[movieId];
    } catch (error) {
      console.error('FavoritesService.isMovieFavorite error:', error);
      return false;
    }
  }

  /**
   * Get all favorite movies as an array
   * @returns Promise<FavoriteMovie[]> - Array of favorite movies
   */
  static async getFavoriteMovies(): Promise<FavoriteMovie[]> {
    try {
      const favorites = await this.getFavorites();
      return Object.values(favorites.movies).sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    } catch (error) {
      console.error('FavoritesService.getFavoriteMovies error:', error);
      return [];
    }
  }

  /**
   * Get favorite movie IDs as an array
   * @returns Promise<number[]> - Array of favorite movie IDs
   */
  static async getFavoriteMovieIds(): Promise<number[]> {
    try {
      const favorites = await this.getFavorites();
      return Object.keys(favorites.movies).map(Number);
    } catch (error) {
      console.error('FavoritesService.getFavoriteMovieIds error:', error);
      return [];
    }
  }

  /**
   * Toggle movie favorite status
   * @param movie - Movie to toggle
   * @returns Promise<boolean> - New favorite status (true if added, false if removed)
   */
  static async toggleMovieFavorite(movie: Movie): Promise<boolean> {
    const isFavorite = await this.isMovieFavorite(movie.id);
    
    if (isFavorite) {
      await this.removeMovie(movie.id);
      return false;
    } else {
      await this.addMovie(movie);
      return true;
    }
  }

  /**
   * Clear all favorites
   * @returns Promise<boolean> - Success status
   */
  static async clearAllFavorites(): Promise<boolean> {
    try {
      const emptyFavorites: FavoritesData = {
        movies: {},
        lastUpdated: new Date().toISOString(),
      };
      
      return await StorageService.setItem(FAVORITES_KEY, emptyFavorites);
    } catch (error) {
      console.error('FavoritesService.clearAllFavorites error:', error);
      return false;
    }
  }

  /**
   * Get favorites count
   * @returns Promise<number> - Number of favorite movies
   */
  static async getFavoritesCount(): Promise<number> {
    try {
      const favorites = await this.getFavorites();
      return Object.keys(favorites.movies).length;
    } catch (error) {
      console.error('FavoritesService.getFavoritesCount error:', error);
      return 0;
    }
  }
}
