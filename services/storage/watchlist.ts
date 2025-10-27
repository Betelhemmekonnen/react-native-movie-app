// services/storage/watchlist.ts
import { TVSeries, TVSeriesDetails } from '@/types/tv';
import { storage, STORAGE_KEYS } from './async-storage';

export interface WatchlistItem {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview: string;
  backdrop_path: string | null;
  addedAt: number; // timestamp
}

export const watchlistService = {
  async getWatchlist(): Promise<WatchlistItem[]> {
    const watchlist = await storage.getItem<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST);
    return watchlist || [];
  },

  async addToWatchlist(series: TVSeries | TVSeriesDetails): Promise<void> {
    const watchlist = await this.getWatchlist();
    
    // Check if already in watchlist
    const exists = watchlist.some(item => item.id === series.id);
    if (exists) {
      return;
    }

    const newItem: WatchlistItem = {
      id: series.id,
      name: series.name,
      poster_path: series.poster_path,
      vote_average: series.vote_average,
      first_air_date: series.first_air_date,
      overview: series.overview,
      backdrop_path: series.backdrop_path,
      addedAt: Date.now(),
    };

    const updatedWatchlist = [newItem, ...watchlist];
    await storage.setItem(STORAGE_KEYS.WATCHLIST, updatedWatchlist);
  },

  async removeFromWatchlist(seriesId: number): Promise<void> {
    const watchlist = await this.getWatchlist();
    const filtered = watchlist.filter(item => item.id !== seriesId);
    await storage.setItem(STORAGE_KEYS.WATCHLIST, filtered);
  },

  async isInWatchlist(seriesId: number): Promise<boolean> {
    const watchlist = await this.getWatchlist();
    return watchlist.some(item => item.id === seriesId);
  },

  async clearWatchlist(): Promise<void> {
    await storage.setItem(STORAGE_KEYS.WATCHLIST, []);
  },
};