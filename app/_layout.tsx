import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GalleryScreen } from '../src/screens/GalleryScreen';
import { AlbumsScreen } from '../src/screens/AlbumsScreen';
import { SearchScreen } from '../src/screens/SearchScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { FavoritesScreen } from '../src/screens/FavoritesScreen';
import { AIInsightsScreen } from '../src/screens/AIInsightsScreen';
import { FullscreenViewer } from '../src/components/FullscreenViewer';
import { ImageEditor } from '../src/components/ImageEditor';
import { OnboardingOverlay } from '../src/components/OnboardingOverlay';
import { ToastContainer } from '../src/components/ToastNotification';
import { useSettingsStore } from '../src/store/settingsStore';
import { useEditorStore } from '../src/store/editorStore';
import type { MediaItem } from '../src/types';

type TabName = 'gallery' | 'search' | 'favorites' | 'albums' | 'insights' | 'settings';

interface TabConfig {
  name: TabName;
  icon: string;
  activeIcon: string;
  label: string;
}

const TABS: TabConfig[] = [
  { name: 'gallery', icon: 'images-outline', activeIcon: 'images', label: 'Gallery' },
  { name: 'search', icon: 'search-outline', activeIcon: 'search', label: 'Search' },
  { name: 'favorites', icon: 'heart-outline', activeIcon: 'heart', label: 'Favorites' },
  { name: 'albums', icon: 'folder-outline', activeIcon: 'folder', label: 'Albums' },
  { name: 'insights', icon: 'sparkles-outline', activeIcon: 'sparkles', label: 'AI' },
  { name: 'settings', icon: 'settings-outline', activeIcon: 'settings', label: 'Settings' },
];

export default function RootLayout() {
  const { colors } = useSettingsStore();
  const { isEditing, editorState, closeEditor } = useEditorStore();
  const [activeTab, setActiveTab] = useState<TabName>('gallery');
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allImages, setAllImages] = useState<MediaItem[]>([]);

  const handleImagePress = useCallback((item: MediaItem, index: number) => {
    setSelectedImage(item);
    setSelectedIndex(index);
    setAllImages((prev) => prev);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'gallery':
        return <GalleryScreen onImagePress={handleImagePress} />;
      case 'search':
        return <SearchScreen onImagePress={handleImagePress} />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'albums':
        return <AlbumsScreen />;
      case 'insights':
        return <AIInsightsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <GalleryScreen onImagePress={handleImagePress} />;
    }
  };

  const isDarkMode = colors.background === '#000000' || colors.background === '#121212' || colors.background === '#1A1A2E';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <OnboardingOverlay />
      <ToastContainer />

      <View style={styles.content}>{renderScreen()}</View>

      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={(isActive ? tab.activeIcon : tab.icon) as any}
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : colors.textSecondary },
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedImage && (
        <FullscreenViewer
          item={selectedImage}
          items={allImages}
          initialIndex={selectedIndex}
          onClose={handleCloseViewer}
        />
      )}

      {isEditing && editorState && (
        <ImageEditor
          uri={editorState.uri}
          onSave={(uri: string) => closeEditor()}
          onClose={closeEditor}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 28,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
