import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useAlbumStore } from '../store/albumStore';
import { useMediaStore } from '../store/mediaStore';
import type { Album, MediaItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALBUM_GAP = 12;
const ALBUM_SIZE = (SCREEN_WIDTH - 48 - ALBUM_GAP) / 2;

export const AlbumsScreen: React.FC<{
  onAlbumPress?: (album: Album) => void;
  onImagePress?: (item: MediaItem, index: number) => void;
}> = ({ onAlbumPress, onImagePress }) => {
  const { colors } = useSettingsStore();
  const { albums, createAlbum } = useAlbumStore();
  const { assets } = useMediaStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const albumsWithCovers = useMemo(() => {
    return albums.map((album) => {
      const albumAssets = assets.filter((a) => album.assetIds.includes(a.id));
      return {
        ...album,
        coverUri: albumAssets.length > 0 ? albumAssets[0].uri : undefined,
        itemCount: albumAssets.length,
        assets: albumAssets,
      };
    });
  }, [albums, assets]);

  const smartAlbums = useMemo(() => {
    const videos = assets.filter((a) => a.mediaType === 'video');
    const recent = assets.filter((a) => Date.now() - a.creationTime < 7 * 24 * 60 * 60 * 1000);
    const screenshots = assets.filter((a) => a.aiCategory === 'SCREENSHOTS');

    return [
      { id: 'smart-recent', name: 'Recent', icon: 'time', color: '#6C63FF', count: recent.length, assets: recent },
      { id: 'smart-videos', name: 'Videos', icon: 'videocam', color: '#FF6B9D', count: videos.length, assets: videos },
      { id: 'smart-screenshots', name: 'Screenshots', icon: 'phone-portrait', color: '#4CAF50', count: screenshots.length, assets: screenshots },
    ];
  }, [assets]);

  const handleCreateAlbum = useCallback(() => {
    if (newAlbumName.trim()) {
      createAlbum(newAlbumName.trim());
      setNewAlbumName('');
      setShowCreateModal(false);
    }
  }, [newAlbumName, createAlbum]);

  const renderAlbumItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.albumCard, { backgroundColor: colors.surface }]}
      onPress={() => onAlbumPress?.(item)}
      activeOpacity={0.8}
    >
      {item.coverUri ? (
        <Image source={{ uri: item.coverUri }} style={styles.albumCover} />
      ) : (
        <View style={[styles.albumPlaceholder, { backgroundColor: colors.border }]}>
          <Ionicons name="images" size={32} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.albumInfo}>
        <Text style={[styles.albumName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.albumCount, { color: colors.textSecondary }]}>{item.itemCount} items</Text>
      </View>
    </TouchableOpacity>
  ), [colors, onAlbumPress]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Albums</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {albums.length} albums
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.createText}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Smart Albums */}
            <View style={styles.smartSection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>SMART ALBUMS</Text>
              <View style={styles.smartGrid}>
                {smartAlbums.map((album) => (
                  <TouchableOpacity
                    key={album.id}
                    style={[styles.smartCard, { backgroundColor: album.color + '15', borderColor: album.color + '30' }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={album.icon as any} size={24} color={album.color} />
                    <Text style={[styles.smartName, { color: colors.text }]}>{album.name}</Text>
                    <Text style={[styles.smartCount, { color: colors.textSecondary }]}>{album.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.textSecondary, paddingHorizontal: 16 }]}>MY ALBUMS</Text>
          </>
        }
        data={albumsWithCovers}
        renderItem={renderAlbumItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.albumRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="folder-open" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No albums yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Tap + to create your first album</Text>
          </View>
        }
      />

      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Album</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Album name"
              placeholderTextColor={colors.textSecondary}
              value={newAlbumName}
              onChangeText={setNewAlbumName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={styles.modalCancel}>
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateAlbum}
                style={[styles.modalCreate, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  createText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  smartSection: { padding: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  smartGrid: { flexDirection: 'row', gap: 10 },
  smartCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  smartName: { fontSize: 13, fontWeight: '600' },
  smartCount: { fontSize: 12 },
  albumRow: { paddingHorizontal: 16, gap: ALBUM_GAP },
  listContent: { paddingBottom: 100 },
  albumCard: {
    width: ALBUM_SIZE,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: ALBUM_GAP,
  },
  albumCover: { width: '100%', height: ALBUM_SIZE, borderRadius: 14 },
  albumPlaceholder: {
    width: '100%',
    height: ALBUM_SIZE,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumInfo: { padding: 10 },
  albumName: { fontSize: 15, fontWeight: '600' },
  albumCount: { fontSize: 12, marginTop: 2 },
  emptyState: { alignItems: 'center', padding: 40, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 14 },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: { width: '80%', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalCancel: { padding: 10 },
  modalCancelText: { fontSize: 15, fontWeight: '500' },
  modalCreate: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  modalCreateText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
