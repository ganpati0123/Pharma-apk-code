import { useCallback, useMemo } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import type { MediaItem } from '../types';

export const useFavorites = () => {
  const store = useFavoritesStore();

  const toggleFavorite = useCallback((item: MediaItem) => {
    store.toggleFavorite(item);
  }, [store]);

  const isFavorite = useCallback((id: string) => {
    return store.isFavorite(id);
  }, [store]);

  const addFavorite = useCallback((item: MediaItem) => {
    store.addFavorite(item);
  }, [store]);

  const removeFavorite = useCallback((id: string) => {
    store.removeFavorite(id);
  }, [store]);

  const bulkToggle = useCallback((items: MediaItem[], favorite: boolean) => {
    store.bulkToggleFavorite(items, favorite);
  }, [store]);

  const clearAll = useCallback(() => {
    store.clearAllFavorites();
  }, [store]);

  return useMemo(() => ({
    favorites: store.favorites,
    favoriteItems: store.favoriteItems,
    favoritesCount: store.favoritesCount,
    recentlyFavorited: store.recentlyFavorited,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    bulkToggle,
    clearAll,
    getRecentFavorites: store.getRecentFavorites,
    getFavoritesByCategory: store.getFavoritesByCategory,
  }), [store, toggleFavorite, isFavorite, addFavorite, removeFavorite, bulkToggle, clearAll]);
};
