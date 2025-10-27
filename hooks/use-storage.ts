// hooks/use-storage.ts
import { WatchlistItem, watchlistService } from '@/services/storage/watchlist';
import { useCallback, useEffect, useState } from 'react';

export const useWatchlist = (seriesId?: number) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await watchlistService.getWatchlist();
      setWatchlist(data);
      
      if (seriesId) {
        const inList = data.some(item => item.id === seriesId);
        setIsInWatchlist(inList);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const addToWatchlist = useCallback(async (series: any) => {
    try {
      await watchlistService.addToWatchlist(series);
      await loadWatchlist();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  }, [loadWatchlist]);

  const removeFromWatchlist = useCallback(async (id: number) => {
    try {
      await watchlistService.removeFromWatchlist(id);
      await loadWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  }, [loadWatchlist]);

  const toggleWatchlist = useCallback(async (series: any) => {
    if (isInWatchlist) {
      await removeFromWatchlist(series.id);
    } else {
      await addToWatchlist(series);
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  return {
    watchlist,
    isInWatchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    refresh: loadWatchlist,
  };
};