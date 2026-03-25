import { useEffect, useCallback } from 'react';
import { useMediaStore } from '../store/mediaStore';
import { useAlbumStore } from '../store/albumStore';

export const useMediaLibrary = () => {
  const {
    assets,
    hasNextPage,
    totalCount,
    isLoading,
    isLoadingMore,
    hasPermission,
    loadInitialMedia,
    loadMoreMedia,
    refreshMedia,
  } = useMediaStore();

  const { loadAlbums, loadAutoAlbums, generateAIAlbums, generateDateGroups } =
    useAlbumStore();

  useEffect(() => {
    if (hasPermission) {
      loadInitialMedia();
      loadAlbums();
      loadAutoAlbums();
    }
  }, [hasPermission, loadInitialMedia, loadAlbums, loadAutoAlbums]);

  useEffect(() => {
    if (assets.length > 0) {
      generateDateGroups(assets);
      generateAIAlbums(assets);
    }
  }, [assets, generateDateGroups, generateAIAlbums]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMoreMedia();
    }
  }, [hasNextPage, isLoadingMore, loadMoreMedia]);

  const handleRefresh = useCallback(async () => {
    await refreshMedia();
  }, [refreshMedia]);

  return {
    assets,
    totalCount,
    isLoading,
    isLoadingMore,
    hasNextPage,
    handleEndReached,
    handleRefresh,
  };
};
