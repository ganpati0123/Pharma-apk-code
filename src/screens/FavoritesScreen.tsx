import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useMediaStore } from '../store/mediaStore';
import { FavoritesButton } from '../components/FavoritesButton';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { DateSectionHeader } from '../components/DateSectionHeader';
import type { MediaItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FavoritesScreen: React.FC = () => {
  const { colors, gridColumns } = useSettingsStore();
  const { favoriteItems, favoritesCount } = useFavoritesStore();
  const { assets } = useMediaStore();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const gap = 2;
  const itemSize = (SCREEN_WIDTH - gap * (gridColumns + 1)) / gridColumns;

  const sortedFavorites = useMemo(() => {
    return [...favoriteItems].sort((a, b) => b.creationTime - a.creationTime);
  }, [favoriteItems]);

  const groupedByDate = useMemo(() => {
    const groups: Array<{ title: string; data: MediaItem[] }> = [];
    const dateMap = new Map<string, MediaItem[]>();

    sortedFavorites.forEach((item) => {
      const date = new Date(item.creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const group = dateMap.get(key) || [];
      group.push(item);
      dateMap.set(key, group);
    });

    dateMap.forEach((data, title) => {
      groups.push({ title, data });
    });

    return groups;
  }, [sortedFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  const renderItem = useCallback(({ item }: { item: MediaItem }) => {
    if (viewMode === 'list') {
      return (
        <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
          <Image source={{ uri: item.uri }} style={styles.listThumbnail} />
          <View style={styles.listInfo}>
            <Text style={[styles.listFilename, { color: colors.text }]} numberOfLines={1}>
              {item.filename}
            </Text>
            <Text style={[styles.listDate, { color: colors.textSecondary }]}>
              {new Date(item.creationTime).toLocaleDateString()}
            </Text>
            {item.aiCategory && (
              <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>{item.aiCategory}</Text>
              </View>
            )}
          </View>
          <FavoritesButton item={item} size={22} />
        </View>
      );
    }

    return (
      <View style={{ width: itemSize, height: itemSize, margin: gap / 2 }}>
        <Image
          source={{ uri: item.uri }}
          style={styles.gridImage}
          resizeMode="cover"
        />
        <View style={styles.gridOverlay}>
          <FavoritesButton item={item} size={18} showBackground />
        </View>
        {item.mediaType === 'video' && (
          <View style={styles.videoBadge}>
            <Ionicons name="play" size={12} color="#FFF" />
          </View>
        )}
      </View>
    );
  }, [viewMode, itemSize, colors, gap]);

  if (favoritesCount === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="heart" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Tap the heart icon on any photo to add it to your favorites collection.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {favoritesCount} {favoritesCount === 1 ? 'photo' : 'photos'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={[styles.viewToggle, { backgroundColor: colors.primaryLight }]}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedFavorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? gridColumns : 1}
        key={viewMode + '-' + gridColumns}
        contentContainerStyle={viewMode === 'grid' ? styles.gridContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  gridOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  listThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  listInfo: {
    flex: 1,
  },
  listFilename: {
    fontSize: 15,
    fontWeight: '600',
  },
  listDate: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
