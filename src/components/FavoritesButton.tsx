import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore } from '../store/favoritesStore';
import { useSettingsStore } from '../store/settingsStore';
import type { MediaItem } from '../types';

interface FavoritesButtonProps {
  item: MediaItem;
  size?: number;
  style?: object;
  showBackground?: boolean;
}

export const FavoritesButton: React.FC<FavoritesButtonProps> = ({
  item,
  size = 24,
  style,
  showBackground = false,
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { colors } = useSettingsStore();
  const isFav = isFavorite(item.id);

  const handlePress = useCallback(() => {
    toggleFavorite(item);
  }, [item, toggleFavorite]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        showBackground && {
          backgroundColor: colors.overlay,
          borderRadius: size,
          padding: 6,
        },
        style,
      ]}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name={isFav ? 'heart' : 'heart-outline'}
        size={size}
        color={isFav ? '#FF4757' : colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
