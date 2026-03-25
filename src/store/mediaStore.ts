import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import type { MediaItem } from '../types';
import { PAGE_SIZE } from '../constants/theme';

interface MediaState {
  assets: MediaItem[];
  hasNextPage: boolean;
  endCursor: string | undefined;
  totalCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasPermission: boolean | null;
  selectedAssets: Set<string>;
  isSelectionMode: boolean;

  requestPermission: () => Promise<boolean>;
  loadInitialMedia: () => Promise<void>;
  loadMoreMedia: () => Promise<void>;
  refreshMedia: () => Promise<void>;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  setSelectionMode: (mode: boolean) => void;
  deleteSelected: () => Promise<void>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  assets: [],
  hasNextPage: false,
  endCursor: undefined,
  totalCount: 0,
  isLoading: false,
  isLoadingMore: false,
  hasPermission: null,
  selectedAssets: new Set(),
  isSelectionMode: false,

  requestPermission: async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    set({ hasPermission: granted });
    return granted;
  },

  loadInitialMedia: async () => {
    const { hasPermission } = get();
    if (!hasPermission) return;

    set({ isLoading: true });
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: PAGE_SIZE,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      const mediaItems: MediaItem[] = result.assets.map((asset) => ({
        ...asset,
        aiTags: [],
        aiCategory: undefined,
        thumbnailUri: asset.uri,
      }));

      set({
        assets: mediaItems,
        hasNextPage: result.hasNextPage,
        endCursor: result.endCursor,
        totalCount: result.totalCount,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading media:', error);
      set({ isLoading: false });
    }
  },

  loadMoreMedia: async () => {
    const { hasNextPage, endCursor, isLoadingMore, hasPermission } = get();
    if (!hasNextPage || isLoadingMore || !hasPermission) return;

    set({ isLoadingMore: true });
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: PAGE_SIZE,
        after: endCursor,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      const newItems: MediaItem[] = result.assets.map((asset) => ({
        ...asset,
        aiTags: [],
        aiCategory: undefined,
        thumbnailUri: asset.uri,
      }));

      set((state) => ({
        assets: [...state.assets, ...newItems],
        hasNextPage: result.hasNextPage,
        endCursor: result.endCursor,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.error('Error loading more media:', error);
      set({ isLoadingMore: false });
    }
  },

  refreshMedia: async () => {
    set({
      assets: [],
      hasNextPage: false,
      endCursor: undefined,
      totalCount: 0,
    });
    await get().loadInitialMedia();
  },

  toggleSelection: (id: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedAssets);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return {
        selectedAssets: newSelected,
        isSelectionMode: newSelected.size > 0,
      };
    });
  },

  clearSelection: () => {
    set({ selectedAssets: new Set(), isSelectionMode: false });
  },

  setSelectionMode: (mode: boolean) => {
    set({
      isSelectionMode: mode,
      selectedAssets: mode ? get().selectedAssets : new Set(),
    });
  },

  deleteSelected: async () => {
    const { selectedAssets, assets } = get();
    const idsToDelete = Array.from(selectedAssets);

    try {
      await MediaLibrary.deleteAssetsAsync(idsToDelete);
      set({
        assets: assets.filter((a) => !selectedAssets.has(a.id)),
        selectedAssets: new Set(),
        isSelectionMode: false,
      });
    } catch (error) {
      console.error('Error deleting assets:', error);
    }
  },
}));
