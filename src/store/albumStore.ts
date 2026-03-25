import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import type { Album, MediaItem } from '../types';
import { AI_CATEGORIES } from '../constants/categories';

interface AlbumState {
  albums: Album[];
  autoAlbums: Album[];
  aiAlbums: Album[];
  dateGroups: Album[];
  isLoading: boolean;

  loadAlbums: () => Promise<void>;
  loadAutoAlbums: () => Promise<void>;
  generateAIAlbums: (assets: MediaItem[]) => void;
  generateDateGroups: (assets: MediaItem[]) => void;
  createCustomAlbum: (title: string, assetIds: string[]) => Promise<void>;
  getAlbumAssets: (albumId: string) => Promise<MediaItem[]>;
}

const getDateGroupTitle = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'This Week';
  if (diffDays <= 30) return 'This Month';
  if (diffDays <= 90) return 'Last 3 Months';
  if (diffDays <= 365) return 'This Year';

  return date.getFullYear().toString();
};

export const useAlbumStore = create<AlbumState>((set) => ({
  albums: [],
  autoAlbums: [],
  aiAlbums: [],
  dateGroups: [],
  isLoading: false,

  loadAlbums: async () => {
    set({ isLoading: true });
    try {
      const albumsList = await MediaLibrary.getAlbumsAsync();
      const albums: Album[] = albumsList.map((album) => ({
        id: album.id,
        title: album.title,
        type: 'custom' as const,
        count: album.assetCount,
      }));
      set({ albums, isLoading: false });
    } catch (error) {
      console.error('Error loading albums:', error);
      set({ isLoading: false });
    }
  },

  loadAutoAlbums: async () => {
    try {
      const smartAlbumNames = ['Camera', 'Screenshots', 'Downloads', 'Favorites'];
      const autoAlbums: Album[] = [];

      for (const name of smartAlbumNames) {
        const album = await MediaLibrary.getAlbumAsync(name);
        if (album) {
          autoAlbums.push({
            id: album.id,
            title: album.title,
            type: 'auto',
            count: album.assetCount,
          });
        }
      }
      set({ autoAlbums });
    } catch (error) {
      console.error('Error loading auto albums:', error);
    }
  },

  generateAIAlbums: (assets: MediaItem[]) => {
    const categoryMap: Record<string, MediaItem[]> = {};

    Object.values(AI_CATEGORIES).forEach((cat) => {
      categoryMap[cat] = [];
    });

    assets.forEach((asset) => {
      const category = asset.aiCategory || AI_CATEGORIES.OTHER;
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(asset);
    });

    // Also detect screenshots by filename
    assets.forEach((asset) => {
      const filename = asset.filename.toLowerCase();
      if (
        filename.includes('screenshot') ||
        filename.includes('screen_shot') ||
        filename.includes('screen shot')
      ) {
        if (!categoryMap[AI_CATEGORIES.SCREENSHOTS].find((a) => a.id === asset.id)) {
          categoryMap[AI_CATEGORIES.SCREENSHOTS].push(asset);
        }
      }
    });

    const aiAlbums: Album[] = Object.entries(categoryMap)
      .filter(([, items]) => items.length > 0)
      .map(([category, items]) => ({
        id: `ai-${category.toLowerCase().replace(/\s/g, '-')}`,
        title: category,
        type: 'ai' as const,
        count: items.length,
        coverUri: items[0]?.uri,
        assets: items,
      }));

    set({ aiAlbums });
  },

  generateDateGroups: (assets: MediaItem[]) => {
    const groups: Record<string, MediaItem[]> = {};

    assets.forEach((asset) => {
      const date = new Date(asset.creationTime);
      const groupTitle = getDateGroupTitle(date);
      if (!groups[groupTitle]) {
        groups[groupTitle] = [];
      }
      groups[groupTitle].push(asset);
    });

    const dateGroups: Album[] = Object.entries(groups).map(([title, items]) => ({
      id: `date-${title.toLowerCase().replace(/\s/g, '-')}`,
      title,
      type: 'auto' as const,
      count: items.length,
      coverUri: items[0]?.uri,
      assets: items,
    }));

    set({ dateGroups });
  },

  createCustomAlbum: async (title: string, assetIds: string[]) => {
    try {
      const album = await MediaLibrary.createAlbumAsync(title);
      if (assetIds.length > 0) {
        const assets = await Promise.all(
          assetIds.map((id) => MediaLibrary.getAssetInfoAsync(id))
        );
        await MediaLibrary.addAssetsToAlbumAsync(
          assets.map((a) => a.id),
          album,
          false
        );
      }
      set((state) => ({
        albums: [
          ...state.albums,
          {
            id: album.id,
            title: album.title,
            type: 'custom' as const,
            count: assetIds.length,
          },
        ],
      }));
    } catch (error) {
      console.error('Error creating album:', error);
    }
  },

  getAlbumAssets: async (albumId: string): Promise<MediaItem[]> => {
    try {
      const result = await MediaLibrary.getAssetsAsync({
        album: albumId,
        first: 1000,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      return result.assets.map((asset) => ({
        ...asset,
        aiTags: [],
        aiCategory: undefined,
        thumbnailUri: asset.uri,
      }));
    } catch (error) {
      console.error('Error loading album assets:', error);
      return [];
    }
  },
}));
