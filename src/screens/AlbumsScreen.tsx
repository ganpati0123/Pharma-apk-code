import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useAlbumStore } from '../store/albumStore';
import { usePermissions } from '../hooks/usePermissions';
import AlbumCard from '../components/AlbumCard';
import MediaGrid from '../components/MediaGrid';
import FullscreenViewer from '../components/FullscreenViewer';
import PermissionRequest from '../components/PermissionRequest';
import type { Album, MediaItem } from '../types';

const AlbumsScreen: React.FC = () => {
  const colors = useSettingsStore((s) => s.colors);
  const { hasPermission, requestPermission } = usePermissions();
  const {
    albums,
    autoAlbums,
    aiAlbums,
    dateGroups,
    createCustomAlbum,
    getAlbumAssets,
  } = useAlbumStore();

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumAssets, setAlbumAssets] = useState<MediaItem[]>([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const handleAlbumPress = useCallback(
    async (album: Album) => {
      if (album.assets) {
        setAlbumAssets(album.assets);
        setSelectedAlbum(album);
      } else {
        const assets = await getAlbumAssets(album.id);
        setAlbumAssets(assets);
        setSelectedAlbum(album);
      }
    },
    [getAlbumAssets]
  );

  const handleBackToAlbums = useCallback(() => {
    setSelectedAlbum(null);
    setAlbumAssets([]);
  }, []);

  const handleItemPress = useCallback((_item: MediaItem, index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  const handleCreateAlbum = useCallback(() => {
    if (newAlbumName.trim()) {
      createCustomAlbum(newAlbumName.trim(), []);
      setNewAlbumName('');
      setShowCreateDialog(false);
    }
  }, [newAlbumName, createCustomAlbum]);

  if (hasPermission === null) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (hasPermission === false) {
    return <PermissionRequest onRequest={requestPermission} />;
  }

  // Album detail view
  if (selectedAlbum) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Pressable onPress={handleBackToAlbums} style={styles.backButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.icon} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {selectedAlbum.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {selectedAlbum.count} items
            </Text>
          </View>
        </View>
        <MediaGrid data={albumAssets} onItemPress={handleItemPress} />

        <Modal
          visible={viewerVisible}
          animationType="fade"
          presentationStyle="fullScreen"
          statusBarTranslucent
        >
          <FullscreenViewer
            items={albumAssets}
            initialIndex={viewerIndex}
            onClose={() => setViewerVisible(false)}
          />
        </Modal>
      </View>
    );
  }

  // Albums list view
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Albums</Text>
        <Pressable
          onPress={() => setShowCreateDialog(true)}
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          hitSlop={8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>New Album</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Albums */}
        {aiAlbums.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles" size={18} color="#FFD700" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                AI Categories
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {aiAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPress={handleAlbumPress}
                  size="medium"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Auto Albums */}
        {autoAlbums.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Smart Albums
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {autoAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPress={handleAlbumPress}
                  size="medium"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Date Groups */}
        {dateGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              By Date
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {dateGroups.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPress={handleAlbumPress}
                  size="medium"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Custom Albums */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            My Albums
          </Text>
          {albums.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPress={handleAlbumPress}
                  size="medium"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyAlbums}>
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                No custom albums yet. Tap "New Album" to create one.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Album Dialog */}
      <Modal visible={showCreateDialog} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View
            style={[
              styles.dialog,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.dialogTitle, { color: colors.text }]}>
              New Album
            </Text>
            <TextInput
              style={[
                styles.dialogInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
              placeholder="Album name"
              placeholderTextColor={colors.textSecondary}
              value={newAlbumName}
              onChangeText={setNewAlbumName}
              autoFocus
            />
            <View style={styles.dialogActions}>
              <Pressable
                onPress={() => {
                  setShowCreateDialog(false);
                  setNewAlbumName('');
                }}
                style={styles.dialogButton}
              >
                <Text
                  style={[styles.dialogButtonText, { color: colors.textSecondary }]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCreateAlbum}
                style={[styles.dialogButton, { backgroundColor: colors.primary, borderRadius: 8 }]}
              >
                <Text style={[styles.dialogButtonText, { color: '#FFFFFF' }]}>
                  Create
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  backButton: {
    padding: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    marginBottom: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  emptyAlbums: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  dialogInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dialogButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dialogButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AlbumsScreen;
