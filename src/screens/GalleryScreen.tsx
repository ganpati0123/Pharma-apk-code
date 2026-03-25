import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMediaStore } from '../store/mediaStore';
import { useSettingsStore } from '../store/settingsStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useUIStore } from '../store/uiStore';
import { FavoritesButton } from '../components/FavoritesButton';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { DateSectionHeader } from '../components/DateSectionHeader';
import { SortOptionsSheet } from '../components/SortOptionsSheet';
import { BatchToolbar } from '../components/BatchToolbar';
import { ToastContainer } from '../components/ToastNotification';
import { sortItems, createTimelineSections } from '../utils/sorting';
import { useBatchOperations } from '../hooks/useBatchOperations';
import type { MediaItem, SortField, SortDirection } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GalleryScreen: React.FC<{
  onImagePress?: (item: MediaItem, index: number) => void;
}> = ({ onImagePress }) => {
  const { assets, isLoading, hasPermission, requestPermission, loadAssets } = useMediaStore();
  const { colors, gridColumns, cycleGridColumns } = useSettingsStore();
  const { isFavorite } = useFavoritesStore();
  const { addToast, showDateHeaders, showAIBadges, isSortSheetOpen, setSortSheetOpen } = useUIStore();

  const [refreshing, setRefreshing] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const scrollY = useRef(new Animated.Value(0)).current;
  const batchOps = useBatchOperations();

  const gap = 2;
  const itemSize = (SCREEN_WIDTH - gap * (gridColumns + 1)) / gridColumns;

  const sortedAssets = useMemo(() => {
    return sortItems(assets, sortField, sortDirection);
  }, [assets, sortField, sortDirection]);

  const timelineSections = useMemo(() => {
    return createTimelineSections(sortedAssets);
  }, [sortedAssets]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
    addToast({ type: 'success', message: 'Gallery refreshed', duration: 2000 });
  }, [loadAssets, addToast]);

  useEffect(() => {
    if (hasPermission === null) {
      requestPermission();
    } else if (hasPermission) {
      loadAssets();
    }
  }, [hasPermission, requestPermission, loadAssets]);

  const handleSortChange = useCallback((field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    setSortSheetOpen(false);
  }, [setSortSheetOpen]);

  const renderGridItem = useCallback(({ item, index }: { item: MediaItem; index: number }) => {
    const isItemSelected = batchOps.isSelected(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (batchOps.isSelectionMode) {
            batchOps.toggleItem(item.id);
          } else {
            onImagePress?.(item, index);
          }
        }}
        onLongPress={() => {
          if (!batchOps.isSelectionMode) {
            batchOps.enterSelectionMode();
            batchOps.toggleItem(item.id);
          }
        }}
        style={[
          { width: itemSize, height: itemSize, margin: gap / 2 },
          isItemSelected && styles.selectedItem,
        ]}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.gridImage}
          resizeMode="cover"
        />

        {showAIBadges && item.aiCategory && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>{item.aiCategory}</Text>
          </View>
        )}

        {item.mediaType === 'video' && (
          <View style={styles.videoBadge}>
            <Ionicons name="play" size={12} color="#FFF" />
            {item.duration && (
              <Text style={styles.durationText}>
                {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
              </Text>
            )}
          </View>
        )}

        {isFavorite(item.id) && (
          <View style={styles.favBadge}>
            <Ionicons name="heart" size={12} color="#FF4757" />
          </View>
        )}

        {batchOps.isSelectionMode && (
          <View style={[styles.selectionOverlay, isItemSelected && styles.selectedOverlay]}>
            <View style={[styles.checkbox, isItemSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              {isItemSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [itemSize, gap, batchOps, onImagePress, colors, showAIBadges, isFavorite]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  if (hasPermission === false) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed" size={64} color={colors.textSecondary} />
        <Text style={[styles.permissionTitle, { color: colors.text }]}>Permission Required</Text>
        <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
          We need access to your photos to display them in the gallery.
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && assets.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SkeletonLoader count={18} columns={gridColumns} showHeader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' || colors.background === '#121212' ? 'light-content' : 'dark-content'} />
      <ToastContainer />

      <Animated.View style={[styles.header, { backgroundColor: colors.surface, opacity: headerOpacity, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Gallery</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {assets.length} {assets.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setSortSheetOpen(true)}
            style={[styles.headerButton, { backgroundColor: colors.primaryLight }]}
          >
            <Ionicons name="swap-vertical" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={cycleGridColumns}
            style={[styles.headerButton, { backgroundColor: colors.primaryLight }]}
          >
            <Ionicons name="grid" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <FlatList
        data={sortedAssets}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={gridColumns}
        key={'grid-' + gridColumns}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        getItemLayout={(data, index) => ({
          length: itemSize + gap,
          offset: (itemSize + gap) * Math.floor(index / gridColumns),
          index,
        })}
      />

      {batchOps.isSelectionMode && (
        <BatchToolbar
          selectedCount={batchOps.selectedCount}
          onShare={() => addToast({ type: 'info', message: 'Share coming soon', duration: 2000 })}
          onDelete={() => addToast({ type: 'warning', message: 'Delete coming soon', duration: 2000 })}
          onFavorite={() => addToast({ type: 'success', message: 'Added to favorites', duration: 2000 })}
          onMove={() => addToast({ type: 'info', message: 'Move coming soon', duration: 2000 })}
          onCancel={batchOps.exitSelectionMode}
          onSelectAll={() => batchOps.selectAll(assets)}
        />
      )}

      <SortOptionsSheet
        visible={isSortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        currentField={sortField}
        currentDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: { padding: 1, paddingBottom: 100 },
  gridImage: { width: '100%', height: '100%', borderRadius: 2 },
  aiBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '600' },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  durationText: { color: '#FFF', fontSize: 10, fontWeight: '500' },
  favBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  selectedItem: { opacity: 0.7 },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  selectedOverlay: {
    backgroundColor: 'rgba(108,99,255,0.2)',
  },
  checkbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: { fontSize: 22, fontWeight: '700', marginTop: 16 },
  permissionText: { fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  permissionButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
