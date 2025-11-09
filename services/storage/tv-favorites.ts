import { TVSeries } from '../../types/tv';
import { StorageService } from './async-storage';

// Storage keys
const TV_FAVORITES_KEY = 'tv_favorites';

// Types for stored TV favorites
export interface FavoriteTVSeries extends TVSeries {
  addedAt: string; // ISO date string
}

export interface TVFavoritesData {
  tvSeries: Record<number, FavoriteTVSeries>;
  lastUpdated: string;
}

/**
 * Service for managing TV series favorites
 */
export class TVFavoritesService {
  /**
   * Get all TV favorites data
   */
  static async getFavorites(): Promise<TVFavoritesData> {
    const favorites = await StorageService.getItem<TVFavoritesData>(TV_FAVORITES_KEY);
    
    if (!favorites) {
      return {
        tvSeries: {},
        lastUpdated: new Date().toISOString(),
      };
    }
    
    return favorites;
  }

  /**
   * Add a TV series to favorites
   * @param tvSeries - TV series to add
   * @returns Promise<boolean> - Success status
   */
  static async addTVSeries(tvSeries: TVSeries): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      
      const favoriteTVSeries: FavoriteTVSeries = {
        ...tvSeries,
        addedAt: new Date().toISOString(),
      };
      
      favorites.tvSeries[tvSeries.id] = favoriteTVSeries;
      favorites.lastUpdated = new Date().toISOString();
      
      return await StorageService.setItem(TV_FAVORITES_KEY, favorites);
    } catch (error) {
      console.error('TVFavoritesService.addTVSeries error:', error);
      return false;
    }
  }

  /**
   * Remove a TV series from favorites by ID
   * @param tvSeriesId - TV series ID to remove
   * @returns Promise<boolean> - Success status
   */
  static async removeTVSeries(tvSeriesId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      
      if (favorites.tvSeries[tvSeriesId]) {
        delete favorites.tvSeries[tvSeriesId];
        favorites.lastUpdated = new Date().toISOString();
        return await StorageService.setItem(TV_FAVORITES_KEY, favorites);
      }
      
      return true; // Already not in favorites
    } catch (error) {
      console.error('TVFavoritesService.removeTVSeries error:', error);
      return false;
    }
  }

  /**
   * Check if a TV series is in favorites
   * @param tvSeriesId - TV series ID to check
   * @returns Promise<boolean> - Whether TV series is favorited
   */
  static async isTVSeriesFavorite(tvSeriesId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return !!favorites.tvSeries[tvSeriesId];
    } catch (error) {
      console.error('TVFavoritesService.isTVSeriesFavorite error:', error);
      return false;
    }
  }

  /**
   * Get all favorite TV series as an array
   * @returns Promise<FavoriteTVSeries[]> - Array of favorite TV series
   */
  static async getFavoriteTVSeries(): Promise<FavoriteTVSeries[]> {
    try {
      const favorites = await this.getFavorites();
      return Object.values(favorites.tvSeries).sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    } catch (error) {
      console.error('TVFavoritesService.getFavoriteTVSeries error:', error);
      return [];
    }
  }

  /**
   * Get favorite TV series IDs as an array
   * @returns Promise<number[]> - Array of favorite TV series IDs
   */
  static async getFavoriteTVSeriesIds(): Promise<number[]> {
    try {
      const favorites = await this.getFavorites();
      return Object.keys(favorites.tvSeries).map(Number);
    } catch (error) {
      console.error('TVFavoritesService.getFavoriteTVSeriesIds error:', error);
      return [];
    }
  }

  /**
   * Toggle TV series favorite status
   * @param tvSeries - TV series to toggle
   * @returns Promise<boolean> - New favorite status (true if added, false if removed)
   */
  static async toggleTVSeriesFavorite(tvSeries: TVSeries): Promise<boolean> {
    const isFavorite = await this.isTVSeriesFavorite(tvSeries.id);
    
    if (isFavorite) {
      await this.removeTVSeries(tvSeries.id);
      return false;
    } else {
      await this.addTVSeries(tvSeries);
      return true;
    }
  }

  /**
   * Clear all TV favorites
   * @returns Promise<boolean> - Success status
   */
  static async clearAllFavorites(): Promise<boolean> {
    try {
      const emptyFavorites: TVFavoritesData = {
        tvSeries: {},
        lastUpdated: new Date().toISOString(),
      };
      
      return await StorageService.setItem(TV_FAVORITES_KEY, emptyFavorites);
    } catch (error) {
      console.error('TVFavoritesService.clearAllFavorites error:', error);
      return false;
    }
  }

  /**
   * Get TV favorites count
   * @returns Promise<number> - Number of favorite TV series
   */
  static async getFavoritesCount(): Promise<number> {
    try {
      const favorites = await this.getFavorites();
      return Object.keys(favorites.tvSeries).length;
    } catch (error) {
      console.error('TVFavoritesService.getFavoritesCount error:', error);
      return 0;
    }
  }
}

