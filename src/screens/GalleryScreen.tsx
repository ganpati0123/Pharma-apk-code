import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { usePermissions } from '../hooks/usePermissions';
import { useAI } from '../hooks/useAI';
import MediaGrid from '../components/MediaGrid';
import FullscreenViewer from '../components/FullscreenViewer';
import ImageEditor from '../components/ImageEditor';
import PermissionRequest from '../components/PermissionRequest';
import SelectionHeader from '../components/SelectionHeader';
import AIProcessingBanner from '../components/AIProcessingBanner';
import type { MediaItem } from '../types';

const GalleryScreen: React.FC = () => {
  const colors = useSettingsStore((s) => s.colors);
  const cycleGridColumns = useSettingsStore((s) => s.cycleGridColumns);
  const gridColumns = useSettingsStore((s) => s.gridColumns);
  const { hasPermission, requestPermission } = usePermissions();
  const { isSelectionMode } = useMediaStore();
  const {
    assets,
    totalCount,
    isLoading,
    isLoadingMore,
    handleEndReached,
    handleRefresh,
  } = useMediaLibrary();

  const { isProcessing, progress, totalToProcess, processAssets } = useAI();
  const [processedAssets, setProcessedAssets] = useState<MediaItem[]>([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [editorItem, setEditorItem] = useState<MediaItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Process AI tags when assets load
  useEffect(() => {
    if (assets.length > 0) {
      processAssets(assets).then(setProcessedAssets);
    }
  }, [assets, processAssets]);

  const displayAssets = processedAssets.length > 0 ? processedAssets : assets;

  const handleItemPress = useCallback((_item: MediaItem, index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerVisible(false);
  }, []);

  const handleEdit = useCallback((item: MediaItem) => {
    setViewerVisible(false);
    setEditorItem(item);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditorItem(null);
  }, []);

  const handleRefreshWithState = useCallback(async () => {
    setIsRefreshing(true);
    await handleRefresh();
    setIsRefreshing(false);
  }, [handleRefresh]);

  if (hasPermission === null) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (hasPermission === false) {
    return <PermissionRequest onRequest={requestPermission} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isSelectionMode ? (
        <SelectionHeader />
      ) : (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Gallery</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {totalCount.toLocaleString()} items
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={cycleGridColumns}
              style={styles.headerButton}
              hitSlop={8}
            >
              <Ionicons
                name={gridColumns === 2 ? 'grid' : gridColumns === 3 ? 'grid-outline' : 'apps'}
                size={22}
                color={colors.icon}
              />
            </Pressable>
          </View>
        </View>
      )}

      <AIProcessingBanner
        isProcessing={isProcessing}
        progress={progress}
        total={totalToProcess}
      />

      <MediaGrid
        data={displayAssets}
        onItemPress={handleItemPress}
        onEndReached={handleEndReached}
        onRefresh={handleRefreshWithState}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        isRefreshing={isRefreshing}
      />

      <Modal
        visible={viewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        <FullscreenViewer
          items={displayAssets}
          initialIndex={viewerIndex}
          onClose={handleCloseViewer}
          onEdit={handleEdit}
        />
      </Modal>

      <Modal
        visible={editorItem !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        {editorItem && (
          <ImageEditor item={editorItem} onClose={handleCloseEditor} />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 58 : 44,
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
});

export default GalleryScreen;
