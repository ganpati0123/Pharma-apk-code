import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';
import { useSearchStore } from '../store/searchStore';
import { CATEGORY_ICONS, CATEGORY_COLORS, AI_CATEGORIES } from '../constants/categories';
import type { MediaItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QUICK_FILTERS = [
  { label: 'Photos', icon: 'camera', type: 'photo' },
  { label: 'Videos', icon: 'videocam', type: 'video' },
  { label: 'Favorites', icon: 'heart', type: 'favorites' },
  { label: 'Recent', icon: 'time', type: 'recent' },
];

export const SearchScreen: React.FC<{
  onImagePress?: (item: MediaItem, index: number) => void;
}> = ({ onImagePress }) => {
  const { colors, gridColumns } = useSettingsStore();
  const { assets } = useMediaStore();
  const { query, setQuery, searchResults, isSearching, recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const gap = 2;
  const itemSize = (SCREEN_WIDTH - gap * (gridColumns + 1)) / gridColumns;

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    assets.forEach((asset) => {
      const cat = asset.aiCategory || 'OTHER';
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [assets]);

  const filteredResults = useMemo(() => {
    let results = query.length > 0 ? searchResults : assets;

    if (activeFilter === 'photo') {
      results = results.filter((i) => i.mediaType === 'photo');
    } else if (activeFilter === 'video') {
      results = results.filter((i) => i.mediaType === 'video');
    } else if (activeFilter === 'favorites') {
      results = results.filter((i) => i.isFavorite);
    } else if (activeFilter === 'recent') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      results = results.filter((i) => i.creationTime > weekAgo);
    }

    if (activeCategory) {
      results = results.filter((i) => i.aiCategory === activeCategory);
    }

    return results;
  }, [query, searchResults, assets, activeFilter, activeCategory]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.length > 2) {
      addRecentSearch(text);
    }
  }, [setQuery, addRecentSearch]);

  const renderItem = useCallback(({ item, index }: { item: MediaItem; index: number }) => (
    <TouchableOpacity
      onPress={() => onImagePress?.(item, index)}
      style={{ width: itemSize, height: itemSize, margin: gap / 2 }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.gridImage} resizeMode="cover" />
      {item.aiCategory && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.aiCategory}</Text>
        </View>
      )}
    </TouchableOpacity>
  ), [itemSize, onImagePress, gap]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search photos, categories, tags..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={styles.filtersContent}>
        {QUICK_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.type}
            style={[
              styles.filterChip,
              { backgroundColor: activeFilter === filter.type ? colors.primary : colors.surface, borderColor: colors.border },
            ]}
            onPress={() => setActiveFilter(activeFilter === filter.type ? null : filter.type)}
          >
            <Ionicons name={filter.icon as any} size={16} color={activeFilter === filter.type ? '#FFF' : colors.textSecondary} />
            <Text style={[styles.filterText, { color: activeFilter === filter.type ? '#FFF' : colors.text }]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {query.length === 0 && !activeFilter && !activeCategory && (
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CATEGORIES</Text>
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 8).map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              >
                <Ionicons
                  name={(CATEGORY_ICONS[cat.name] || 'grid') as any}
                  size={24}
                  color={CATEGORY_COLORS[cat.name] || colors.primary}
                />
                <Text style={[styles.categoryName, { color: colors.text }]}>{cat.name}</Text>
                <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>{cat.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {(query.length > 0 || activeFilter || activeCategory) && (
        <>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {filteredResults.length} results
          </Text>
          <FlatList
            data={filteredResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={gridColumns}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filtersRow: { maxHeight: 48, marginTop: 8 },
  filtersContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterText: { fontSize: 13, fontWeight: '500' },
  categoriesSection: { padding: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: {
    width: (SCREEN_WIDTH - 62) / 4,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  categoryName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  categoryCount: { fontSize: 11 },
  resultsCount: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 13 },
  gridContent: { padding: 1, paddingBottom: 100 },
  gridImage: { width: '100%', height: '100%', borderRadius: 2 },
  badge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '600' },
});
