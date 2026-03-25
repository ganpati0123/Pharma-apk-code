import { create } from 'zustand';
import type { MediaItem, SearchFilters } from '../types';

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: MediaItem[];
  recentSearches: string[];
  isSearching: boolean;

  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  search: (assets: MediaItem[]) => void;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
}

const matchesQuery = (asset: MediaItem, query: string): boolean => {
  const lowerQuery = query.toLowerCase();

  // Match filename
  if (asset.filename.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  // Match AI tags
  if (asset.aiTags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
    return true;
  }

  // Match AI category
  if (asset.aiCategory?.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  // Match media type
  if (asset.mediaType.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  return false;
};

const matchesDateRange = (
  asset: MediaItem,
  dateRange?: { start: Date; end: Date }
): boolean => {
  if (!dateRange) return true;
  const assetDate = new Date(asset.creationTime);
  return assetDate >= dateRange.start && assetDate <= dateRange.end;
};

const matchesMediaType = (
  asset: MediaItem,
  mediaType?: 'photo' | 'video' | 'all'
): boolean => {
  if (!mediaType || mediaType === 'all') return true;
  return asset.mediaType === mediaType;
};

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  filters: { query: '' },
  results: [],
  recentSearches: [],
  isSearching: false,

  setQuery: (query: string) => {
    set({ query, filters: { ...get().filters, query } });
  },

  setFilters: (newFilters: Partial<SearchFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  search: (assets: MediaItem[]) => {
    const { query, filters } = get();
    if (!query.trim() && !filters.dateRange && !filters.tags?.length) {
      set({ results: [], isSearching: false });
      return;
    }

    set({ isSearching: true });

    const filtered = assets.filter((asset) => {
      const queryMatch = !query.trim() || matchesQuery(asset, query);
      const dateMatch = matchesDateRange(asset, filters.dateRange);
      const typeMatch = matchesMediaType(asset, filters.mediaType);
      const tagMatch =
        !filters.tags?.length ||
        filters.tags.some((tag) =>
          asset.aiTags?.some((aiTag) =>
            aiTag.toLowerCase().includes(tag.toLowerCase())
          )
        );

      return queryMatch && dateMatch && typeMatch && tagMatch;
    });

    set({ results: filtered, isSearching: false });
  },

  clearSearch: () => {
    set({
      query: '',
      filters: { query: '' },
      results: [],
      isSearching: false,
    });
  },

  addRecentSearch: (query: string) => {
    if (!query.trim()) return;
    set((state) => {
      const recent = [
        query,
        ...state.recentSearches.filter((s) => s !== query),
      ].slice(0, 10);
      return { recentSearches: recent };
    });
  },
}));
