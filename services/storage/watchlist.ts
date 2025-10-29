import { Movie } from '../../types/movie';
import { StorageService } from './async-storage';

// Storage keys
const WATCHLIST_KEY = 'watchlist';

// Types for stored watchlist
export interface WatchlistMovie extends Movie {
  addedAt: string; // ISO date string
}

export interface WatchlistData {
  movies: Record<number, WatchlistMovie>;
  lastUpdated: string;
}

/**
 * Service for managing movie watchlist
 */
export class WatchlistService {
  /**
   * Get all watchlist data
   */
  static async getWatchlist(): Promise<WatchlistData> {
    const watchlist = await StorageService.getItem<WatchlistData>(WATCHLIST_KEY);
    
    if (!watchlist) {
      return {
        movies: {},
        lastUpdated: new Date().toISOString(),
      };
    }
    
    return watchlist;
  }

  /**
   * Add a movie to watchlist
   * @param movie - Movie to add
   * @returns Promise<boolean> - Success status
   */
  static async addMovie(movie: Movie): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      
      const watchlistMovie: WatchlistMovie = {
        ...movie,
        addedAt: new Date().toISOString(),
      };
      
      watchlist.movies[movie.id] = watchlistMovie;
      watchlist.lastUpdated = new Date().toISOString();
      
      return await StorageService.setItem(WATCHLIST_KEY, watchlist);
    } catch (error) {
      console.error('WatchlistService.addMovie error:', error);
      return false;
    }
  }

  /**
   * Remove a movie from watchlist by ID
   * @param movieId - Movie ID to remove
   * @returns Promise<boolean> - Success status
   */
  static async removeMovie(movieId: number): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      
      if (watchlist.movies[movieId]) {
        delete watchlist.movies[movieId];
        watchlist.lastUpdated = new Date().toISOString();
        return await StorageService.setItem(WATCHLIST_KEY, watchlist);
      }
      
      return true; // Already not in watchlist
    } catch (error) {
      console.error('WatchlistService.removeMovie error:', error);
      return false;
    }
  }

  /**
   * Check if a movie is in watchlist
   * @param movieId - Movie ID to check
   * @returns Promise<boolean> - Whether movie is in watchlist
   */
  static async isMovieInWatchlist(movieId: number): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      return !!watchlist.movies[movieId];
    } catch (error) {
      console.error('WatchlistService.isMovieInWatchlist error:', error);
      return false;
    }
  }

  /**
   * Get all watchlist movies as an array
   * @returns Promise<WatchlistMovie[]> - Array of watchlist movies
   */
  static async getWatchlistMovies(): Promise<WatchlistMovie[]> {
    try {
      const watchlist = await this.getWatchlist();
      return Object.values(watchlist.movies).sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    } catch (error) {
      console.error('WatchlistService.getWatchlistMovies error:', error);
      return [];
    }
  }

  /**
   * Get watchlist movie IDs as an array
   * @returns Promise<number[]> - Array of watchlist movie IDs
   */
  static async getWatchlistMovieIds(): Promise<number[]> {
    try {
      const watchlist = await this.getWatchlist();
      return Object.keys(watchlist.movies).map(Number);
    } catch (error) {
      console.error('WatchlistService.getWatchlistMovieIds error:', error);
      return [];
    }
  }

  /**
   * Toggle movie watchlist status
   * @param movie - Movie to toggle
   * @returns Promise<boolean> - New watchlist status (true if added, false if removed)
   */
  static async toggleMovieWatchlist(movie: Movie): Promise<boolean> {
    const isInWatchlist = await this.isMovieInWatchlist(movie.id);
    
    if (isInWatchlist) {
      await this.removeMovie(movie.id);
      return false;
    } else {
      await this.addMovie(movie);
      return true;
    }
  }

  /**
   * Clear all watchlist
   * @returns Promise<boolean> - Success status
   */
  static async clearAllWatchlist(): Promise<boolean> {
    try {
      const emptyWatchlist: WatchlistData = {
        movies: {},
        lastUpdated: new Date().toISOString(),
      };
      
      return await StorageService.setItem(WATCHLIST_KEY, emptyWatchlist);
    } catch (error) {
      console.error('WatchlistService.clearAllWatchlist error:', error);
      return false;
    }
  }

  /**
   * Get watchlist count
   * @returns Promise<number> - Number of movies in watchlist
   */
  static async getWatchlistCount(): Promise<number> {
    try {
      const watchlist = await this.getWatchlist();
      return Object.keys(watchlist.movies).length;
    } catch (error) {
      console.error('WatchlistService.getWatchlistCount error:', error);
      return 0;
    }
  }
}
