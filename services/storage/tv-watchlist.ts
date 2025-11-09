import { TVSeries } from '../../types/tv';
import { StorageService } from './async-storage';

// Storage keys
const TV_WATCHLIST_KEY = 'tv_watchlist';

// Types for stored TV watchlist
export interface WatchlistTVSeries extends TVSeries {
  addedAt: string; // ISO date string
}

export interface TVWatchlistData {
  tvSeries: Record<number, WatchlistTVSeries>;
  lastUpdated: string;
}

/**
 * Service for managing TV series watchlist
 */
export class TVWatchlistService {
  /**
   * Get all TV watchlist data
   */
  static async getWatchlist(): Promise<TVWatchlistData> {
    const watchlist = await StorageService.getItem<TVWatchlistData>(TV_WATCHLIST_KEY);
    
    if (!watchlist) {
      return {
        tvSeries: {},
        lastUpdated: new Date().toISOString(),
      };
    }
    
    return watchlist;
  }

  /**
   * Add a TV series to watchlist
   * @param tvSeries - TV series to add
   * @returns Promise<boolean> - Success status
   */
  static async addTVSeries(tvSeries: TVSeries): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      
      const watchlistTVSeries: WatchlistTVSeries = {
        ...tvSeries,
        addedAt: new Date().toISOString(),
      };
      
      watchlist.tvSeries[tvSeries.id] = watchlistTVSeries;
      watchlist.lastUpdated = new Date().toISOString();
      
      return await StorageService.setItem(TV_WATCHLIST_KEY, watchlist);
    } catch (error) {
      console.error('TVWatchlistService.addTVSeries error:', error);
      return false;
    }
  }

  /**
   * Remove a TV series from watchlist by ID
   * @param tvSeriesId - TV series ID to remove
   * @returns Promise<boolean> - Success status
   */
  static async removeTVSeries(tvSeriesId: number): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      
      if (watchlist.tvSeries[tvSeriesId]) {
        delete watchlist.tvSeries[tvSeriesId];
        watchlist.lastUpdated = new Date().toISOString();
        return await StorageService.setItem(TV_WATCHLIST_KEY, watchlist);
      }
      
      return true; // Already not in watchlist
    } catch (error) {
      console.error('TVWatchlistService.removeTVSeries error:', error);
      return false;
    }
  }

  /**
   * Check if a TV series is in watchlist
   * @param tvSeriesId - TV series ID to check
   * @returns Promise<boolean> - Whether TV series is in watchlist
   */
  static async isTVSeriesInWatchlist(tvSeriesId: number): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      return !!watchlist.tvSeries[tvSeriesId];
    } catch (error) {
      console.error('TVWatchlistService.isTVSeriesInWatchlist error:', error);
      return false;
    }
  }

  /**
   * Get all watchlist TV series as an array
   * @returns Promise<WatchlistTVSeries[]> - Array of watchlist TV series
   */
  static async getWatchlistTVSeries(): Promise<WatchlistTVSeries[]> {
    try {
      const watchlist = await this.getWatchlist();
      return Object.values(watchlist.tvSeries).sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    } catch (error) {
      console.error('TVWatchlistService.getWatchlistTVSeries error:', error);
      return [];
    }
  }

  /**
   * Get watchlist TV series IDs as an array
   * @returns Promise<number[]> - Array of watchlist TV series IDs
   */
  static async getWatchlistTVSeriesIds(): Promise<number[]> {
    try {
      const watchlist = await this.getWatchlist();
      return Object.keys(watchlist.tvSeries).map(Number);
    } catch (error) {
      console.error('TVWatchlistService.getWatchlistTVSeriesIds error:', error);
      return [];
    }
  }

  /**
   * Toggle TV series watchlist status
   * @param tvSeries - TV series to toggle
   * @returns Promise<boolean> - New watchlist status (true if added, false if removed)
   */
  static async toggleTVSeriesWatchlist(tvSeries: TVSeries): Promise<boolean> {
    const isInWatchlist = await this.isTVSeriesInWatchlist(tvSeries.id);
    
    if (isInWatchlist) {
      await this.removeTVSeries(tvSeries.id);
      return false;
    } else {
      await this.addTVSeries(tvSeries);
      return true;
    }
  }

  /**
   * Clear all TV watchlist
   * @returns Promise<boolean> - Success status
   */
  static async clearAllWatchlist(): Promise<boolean> {
    try {
      const emptyWatchlist: TVWatchlistData = {
        tvSeries: {},
        lastUpdated: new Date().toISOString(),
      };
      
      return await StorageService.setItem(TV_WATCHLIST_KEY, emptyWatchlist);
    } catch (error) {
      console.error('TVWatchlistService.clearAllWatchlist error:', error);
      return false;
    }
  }

  /**
   * Get TV watchlist count
   * @returns Promise<number> - Number of TV series in watchlist
   */
  static async getWatchlistCount(): Promise<number> {
    try {
      const watchlist = await this.getWatchlist();
      return Object.keys(watchlist.tvSeries).length;
    } catch (error) {
      console.error('TVWatchlistService.getWatchlistCount error:', error);
      return 0;
    }
  }
}

