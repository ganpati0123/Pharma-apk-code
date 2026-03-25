import { useEffect, useCallback, useRef } from 'react';
import { useSearchStore } from '../store/searchStore';
import { useMediaStore } from '../store/mediaStore';

export const useSearch = () => {
  const {
    query,
    filters,
    results,
    recentSearches,
    isSearching,
    setQuery,
    setFilters,
    search,
    clearSearch,
    addRecentSearch,
  } = useSearchStore();

  const { assets } = useMediaStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (searchQuery.trim()) {
          search(assets);
        }
      }, 300);
    },
    [assets, search]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debouncedSearch]);

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
    },
    [setQuery]
  );

  const handleSubmitSearch = useCallback(() => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      search(assets);
    }
  }, [query, addRecentSearch, search, assets]);

  return {
    query,
    filters,
    results,
    recentSearches,
    isSearching,
    handleSearch,
    handleSubmitSearch,
    setFilters,
    clearSearch,
  };
};
