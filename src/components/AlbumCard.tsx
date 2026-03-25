import React, { memo } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Album } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { CATEGORY_ICONS } from '../constants/categories';

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
  size?: 'small' | 'medium' | 'large';
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onPress,
  size = 'medium',
}) => {
  const colors = useSettingsStore((s) => s.colors);

  const dimensions = {
    small: { width: 100, height: 100 },
    medium: { width: 160, height: 160 },
    large: { width: '100%' as const, height: 200 },
  };

  const dim = dimensions[size];
  const iconName = (CATEGORY_ICONS[album.title] || 'images') as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable
      onPress={() => onPress(album)}
      style={[
        styles.container,
        {
          width: dim.width,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.coverContainer, { height: dim.height }]}>
        {album.coverUri ? (
          <Image
            source={{ uri: album.coverUri }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={[
              styles.placeholderCover,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Ionicons name={iconName} size={40} color={colors.textSecondary} />
          </View>
        )}
        {album.type === 'ai' && (
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color="#FFD700" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {album.title}
        </Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {album.count} {album.count === 1 ? 'item' : 'items'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    margin: 6,
  },
  coverContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default memo(AlbumCard);
