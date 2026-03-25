import React, { memo } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { MediaItem } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { formatDuration } from '../utils/dateHelpers';

interface MediaThumbnailProps {
  item: MediaItem;
  index: number;
  onPress: (item: MediaItem, index: number) => void;
  onLongPress?: (item: MediaItem) => void;
  isSelected?: boolean;
  columns: number;
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  item,
  index,
  onPress,
  onLongPress,
  isSelected = false,
  columns,
}) => {
  const colors = useSettingsStore((s) => s.colors);
  const screenWidth = Dimensions.get('window').width;
  const spacing = 2;
  const itemSize = (screenWidth - spacing * (columns + 1)) / columns;

  return (
    <Pressable
      onPress={() => onPress(item, index)}
      onLongPress={() => onLongPress?.(item)}
      style={[
        styles.container,
        {
          width: itemSize,
          height: itemSize,
          margin: spacing / 2,
        },
      ]}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        recyclingKey={item.id}
        cachePolicy="memory-disk"
      />

      {item.mediaType === 'video' && (
        <View style={styles.videoBadge}>
          <Ionicons name="play" size={12} color="#FFFFFF" />
          {item.duration > 0 && (
            <Text style={styles.durationText}>
              {formatDuration(item.duration)}
            </Text>
          )}
        </View>
      )}

      {isSelected && (
        <View style={[styles.selectionOverlay, { borderColor: colors.primary }]}>
          <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
        </View>
      )}

      {item.aiTags && item.aiTags.length > 0 && (
        <View style={styles.aiIndicator}>
          <Ionicons name="sparkles" size={10} color="#FFD700" />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600',
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(100,100,255,0.2)',
    borderWidth: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 4,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 2,
  },
});

export default memo(MediaThumbnail);
