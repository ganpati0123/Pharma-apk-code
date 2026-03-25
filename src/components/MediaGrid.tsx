import React, { useCallback, memo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import type { MediaItem } from '../types';
import MediaThumbnail from './MediaThumbnail';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';

interface MediaGridProps {
  data: MediaItem[];
  onItemPress: (item: MediaItem, index: number) => void;
  onEndReached?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  data,
  onItemPress,
  onEndReached,
  onRefresh,
  isLoading = false,
  isLoadingMore = false,
  isRefreshing = false,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const colors = useSettingsStore((s) => s.colors);
  const gridColumns = useSettingsStore((s) => s.gridColumns);
  const { selectedAssets, isSelectionMode, toggleSelection } = useMediaStore();

  const handleLongPress = useCallback(
    (item: MediaItem) => {
      toggleSelection(item.id);
    },
    [toggleSelection]
  );

  const handlePress = useCallback(
    (item: MediaItem, index: number) => {
      if (isSelectionMode) {
        toggleSelection(item.id);
      } else {
        onItemPress(item, index);
      }
    },
    [isSelectionMode, toggleSelection, onItemPress]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: MediaItem; index: number }) => (
      <MediaThumbnail
        item={item}
        index={index}
        onPress={handlePress}
        onLongPress={handleLongPress}
        isSelected={selectedAssets.has(item.id)}
        columns={gridColumns}
      />
    ),
    [handlePress, handleLongPress, selectedAssets, gridColumns]
  );

  const keyExtractor = useCallback((item: MediaItem) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<MediaItem> | null | undefined, index: number) => {
      const screenWidth =
        require('react-native').Dimensions.get('window').width;
      const spacing = 2;
      const itemSize = (screenWidth - spacing * (gridColumns + 1)) / gridColumns;
      return {
        length: itemSize + spacing,
        offset: (itemSize + spacing) * Math.floor(index / gridColumns),
        index,
      };
    },
    [gridColumns]
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading more...
        </Text>
      </View>
    );
  }, [isLoadingMore, colors]);

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading your gallery...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={gridColumns}
      key={`grid-${gridColumns}`}
      getItemLayout={getItemLayout}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      maxToRenderPerBatch={30}
      windowSize={11}
      initialNumToRender={30}
      removeClippedSubviews={true}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No media found
            </Text>
          </View>
        )
      }
      ListFooterComponent={renderFooter}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      contentContainerStyle={styles.gridContainer}
      style={{ backgroundColor: colors.background }}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: 1,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default memo(MediaGrid);
