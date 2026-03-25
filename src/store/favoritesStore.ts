import { create } from 'zustand';
import type { MediaItem } from '../types';

interface FavoritesState {
  favorites: Set<string>;
  favoriteItems: MediaItem[];
  recentlyFavorited: MediaItem[];
  favoritesCount: number;
  isLoaded: boolean;

  toggleFavorite: (item: MediaItem) => void;
  addFavorite: (item: MediaItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteItems: (allAssets: MediaItem[]) => MediaItem[];
  clearAllFavorites: () => void;
  bulkToggleFavorite: (items: MediaItem[], favorite: boolean) => void;
  getRecentFavorites: (limit?: number) => MediaItem[];
  getFavoritesByCategory: (category: string) => MediaItem[];
  setLoaded: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: new Set<string>(),
  favoriteItems: [],
  recentlyFavorited: [],
  favoritesCount: 0,
  isLoaded: false,

  toggleFavorite: (item: MediaItem) => {
    const { favorites, favoriteItems, recentlyFavorited } = get();
    const newFavorites = new Set(favorites);
    let newFavoriteItems: MediaItem[];
    let newRecentlyFavorited: MediaItem[];

    if (newFavorites.has(item.id)) {
      newFavorites.delete(item.id);
      newFavoriteItems = favoriteItems.filter((f) => f.id !== item.id);
      newRecentlyFavorited = recentlyFavorited.filter((f) => f.id !== item.id);
    } else {
      newFavorites.add(item.id);
      const favItem = { ...item, isFavorite: true };
      newFavoriteItems = [favItem, ...favoriteItems];
      newRecentlyFavorited = [favItem, ...recentlyFavorited].slice(0, 20);
    }

    set({
      favorites: newFavorites,
      favoriteItems: newFavoriteItems,
      recentlyFavorited: newRecentlyFavorited,
      favoritesCount: newFavorites.size,
    });
  },

  addFavorite: (item: MediaItem) => {
    const { favorites, favoriteItems, recentlyFavorited } = get();
    if (favorites.has(item.id)) return;

    const newFavorites = new Set(favorites);
    newFavorites.add(item.id);
    const favItem = { ...item, isFavorite: true };

    set({
      favorites: newFavorites,
      favoriteItems: [favItem, ...favoriteItems],
      recentlyFavorited: [favItem, ...recentlyFavorited].slice(0, 20),
      favoritesCount: newFavorites.size,
    });
  },

  removeFavorite: (id: string) => {
    const { favorites, favoriteItems, recentlyFavorited } = get();
    const newFavorites = new Set(favorites);
    newFavorites.delete(id);

    set({
      favorites: newFavorites,
      favoriteItems: favoriteItems.filter((f) => f.id !== id),
      recentlyFavorited: recentlyFavorited.filter((f) => f.id !== id),
      favoritesCount: newFavorites.size,
    });
  },

  isFavorite: (id: string) => {
    return get().favorites.has(id);
  },

  getFavoriteItems: (allAssets: MediaItem[]) => {
    const { favorites } = get();
    return allAssets.filter((a) => favorites.has(a.id)).map((a) => ({
      ...a,
      isFavorite: true,
    }));
  },

  clearAllFavorites: () => {
    set({
      favorites: new Set<string>(),
      favoriteItems: [],
      recentlyFavorited: [],
      favoritesCount: 0,
    });
  },

  bulkToggleFavorite: (items: MediaItem[], favorite: boolean) => {
    const { favorites, favoriteItems } = get();
    const newFavorites = new Set(favorites);
    let newFavoriteItems = [...favoriteItems];

    items.forEach((item) => {
      if (favorite) {
        newFavorites.add(item.id);
        if (!newFavoriteItems.find((f) => f.id === item.id)) {
          newFavoriteItems.push({ ...item, isFavorite: true });
        }
      } else {
        newFavorites.delete(item.id);
        newFavoriteItems = newFavoriteItems.filter((f) => f.id !== item.id);
      }
    });

    set({
      favorites: newFavorites,
      favoriteItems: newFavoriteItems,
      favoritesCount: newFavorites.size,
    });
  },

  getRecentFavorites: (limit = 10) => {
    return get().recentlyFavorited.slice(0, limit);
  },

  getFavoritesByCategory: (category: string) => {
    return get().favoriteItems.filter((item) => item.aiCategory === category);
  },

  setLoaded: () => {
    set({ isLoaded: true });
  },
}));
