import React, { useState, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import type { MediaItem } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import {
  rotateImage,
  flipImage,
  FILTERS,
  type FilterType,
} from '../utils/imageEditor';

interface ImageEditorProps {
  item: MediaItem;
  onClose: () => void;
  onSave?: (newUri: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ item, onClose, onSave }) => {
  const colors = useSettingsStore((s) => s.colors);
  const [currentUri, setCurrentUri] = useState(item.uri);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [hasChanges, setHasChanges] = useState(false);

  const handleRotate = useCallback(async () => {
    setIsProcessing(true);
    try {
      const newRotation = (rotation + 90) % 360;
      const newUri = await rotateImage(item.uri, newRotation);
      setCurrentUri(newUri);
      setRotation(newRotation);
      setHasChanges(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to rotate image');
    } finally {
      setIsProcessing(false);
    }
  }, [item.uri, rotation]);

  const handleFlipH = useCallback(async () => {
    setIsProcessing(true);
    try {
      const newUri = await flipImage(currentUri, 'horizontal');
      setCurrentUri(newUri);
      setHasChanges(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to flip image');
    } finally {
      setIsProcessing(false);
    }
  }, [currentUri]);

  const handleFlipV = useCallback(async () => {
    setIsProcessing(true);
    try {
      const newUri = await flipImage(currentUri, 'vertical');
      setCurrentUri(newUri);
      setHasChanges(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to flip image');
    } finally {
      setIsProcessing(false);
    }
  }, [currentUri]);

  const handleFilterSelect = useCallback(
    (filter: FilterType) => {
      setSelectedFilter(filter);
      if (filter !== 'none') {
        setHasChanges(true);
      }
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    setIsProcessing(true);
    try {
      await MediaLibrary.saveToLibraryAsync(currentUri);
      Alert.alert('Saved', 'Image saved to library', [
        {
          text: 'OK',
          onPress: () => {
            onSave?.(currentUri);
            onClose();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    } finally {
      setIsProcessing(false);
    }
  }, [hasChanges, currentUri, onSave, onClose]);

  const handleReset = useCallback(() => {
    setCurrentUri(item.uri);
    setRotation(0);
    setSelectedFilter('none');
    setHasChanges(false);
  }, [item.uri]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View
        style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        <Pressable onPress={onClose} style={styles.topButton} hitSlop={8}>
          <Text style={[styles.topButtonText, { color: colors.text }]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Edit</Text>
        <Pressable
          onPress={handleSave}
          style={styles.topButton}
          disabled={isProcessing}
          hitSlop={8}
        >
          <Text
            style={[
              styles.topButtonText,
              { color: hasChanges ? colors.primary : colors.textSecondary },
            ]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: currentUri }}
          style={styles.preview}
          contentFit="contain"
        />
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterBar, { backgroundColor: colors.surface }]}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((filter) => (
          <Pressable
            key={filter.id}
            onPress={() => handleFilterSelect(filter.id)}
            style={[
              styles.filterItem,
              selectedFilter === filter.id && {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
          >
            <Image
              source={{ uri: item.uri }}
              style={styles.filterPreview}
              contentFit="cover"
            />
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    selectedFilter === filter.id
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Tools */}
      <View
        style={[styles.toolBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        <Pressable
          onPress={handleRotate}
          style={styles.toolButton}
          disabled={isProcessing}
        >
          <Ionicons name="refresh" size={24} color={colors.icon} />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
            Rotate
          </Text>
        </Pressable>
        <Pressable
          onPress={handleFlipH}
          style={styles.toolButton}
          disabled={isProcessing}
        >
          <Ionicons name="swap-horizontal" size={24} color={colors.icon} />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
            Flip H
          </Text>
        </Pressable>
        <Pressable
          onPress={handleFlipV}
          style={styles.toolButton}
          disabled={isProcessing}
        >
          <Ionicons name="swap-vertical" size={24} color={colors.icon} />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
            Flip V
          </Text>
        </Pressable>
        <Pressable
          onPress={handleReset}
          style={styles.toolButton}
          disabled={isProcessing || !hasChanges}
        >
          <Ionicons
            name="arrow-undo"
            size={24}
            color={hasChanges ? colors.icon : colors.textSecondary}
          />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
            Reset
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topButton: {
    padding: 8,
  },
  topButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    maxHeight: 100,
  },
  filterContent: {
    padding: 8,
    gap: 8,
  },
  filterItem: {
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  filterLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toolButton: {
    alignItems: 'center',
    padding: 8,
  },
  toolLabel: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default memo(ImageEditor);
