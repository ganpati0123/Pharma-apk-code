import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { usePermissions } from '../hooks/usePermissions';
import { useSearch } from '../hooks/useSearch';
import { useAI } from '../hooks/useAI';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import MediaGrid from '../components/MediaGrid';
import FullscreenViewer from '../components/FullscreenViewer';
import PermissionRequest from '../components/PermissionRequest';
import type { MediaItem } from '../types';

const MEDIA_TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'photo', label: 'Photos' },
  { id: 'video', label: 'Videos' },
];

const SearchScreen: React.FC = () => {
  const colors = useSettingsStore((s) => s.colors);
  const { hasPermission, requestPermission } = usePermissions();
  const {
    query,
    results,
    recentSearches,
    isSearching,
    handleSearch,
    handleSubmitSearch,
    setFilters,
    clearSearch,
  } = useSearch();

  const { suggestedTags } = useAI();
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleMediaTypeFilter = useCallback(
    (typeId: string) => {
      setSelectedMediaType(typeId);
      setFilters({ mediaType: typeId as 'photo' | 'video' | 'all' });
    },
    [setFilters]
  );

  const handleTagPress = useCallback(
    (tag: string) => {
      handleSearch(tag);
    },
    [handleSearch]
  );

  const handleItemPress = useCallback((_item: MediaItem, index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  if (hasPermission === null) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (hasPermission === false) {
    return <PermissionRequest onRequest={requestPermission} />;
  }

  const showResults = query.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
      </View>

      <SearchBar
        value={query}
        onChangeText={handleSearch}
        onSubmit={handleSubmitSearch}
        onClear={clearSearch}
        placeholder="Search by name, tag, or category..."
        autoFocus={false}
      />

      <FilterChips
        chips={MEDIA_TYPE_FILTERS}
        selectedId={selectedMediaType}
        onSelect={handleMediaTypeFilter}
      />

      {showResults ? (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </Text>
          <MediaGrid data={results} onItemPress={handleItemPress} />
        </View>
      ) : (
        <ScrollView style={styles.suggestionsContainer} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Searches
              </Text>
              {recentSearches.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearch(search)}
                  style={styles.recentItem}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[styles.recentText, { color: colors.text }]}
                  >
                    {search}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* AI Suggested Tags */}
          {suggestedTags.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={16} color="#FFD700" />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  AI Suggested Tags
                </Text>
              </View>
              <View style={styles.tagsGrid}>
                {suggestedTags.map((tag, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleTagPress(tag)}
                    style={[
                      styles.tagChip,
                      { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: colors.text }]}>
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Browse Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Browse by Category
            </Text>
            <View style={styles.categoriesGrid}>
              {[
                { icon: 'people', label: 'People', query: 'person' },
                { icon: 'leaf', label: 'Nature', query: 'nature' },
                { icon: 'restaurant', label: 'Food', query: 'food' },
                { icon: 'car', label: 'Vehicles', query: 'car' },
                { icon: 'paw', label: 'Animals', query: 'animal' },
                { icon: 'business', label: 'Buildings', query: 'building' },
                { icon: 'phone-portrait', label: 'Screenshots', query: 'screenshot' },
                { icon: 'document-text', label: 'Documents', query: 'document' },
              ].map((cat, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearch(cat.query)}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.categoryLabel, { color: colors.text }]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}

      <Modal
        visible={viewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        <FullscreenViewer
          items={results}
          initialIndex={viewerIndex}
          onClose={() => setViewerVisible(false)}
        />
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
    paddingBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
  },
  suggestionsContainer: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  recentText: {
    fontSize: 15,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '47%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});

export default SearchScreen;
