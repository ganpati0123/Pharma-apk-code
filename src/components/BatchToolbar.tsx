import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';

interface BatchToolbarProps {
  selectedCount: number;
  onShare: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onMove: () => void;
  onCancel: () => void;
  onSelectAll: () => void;
}

export const BatchToolbar: React.FC<BatchToolbarProps> = ({
  selectedCount,
  onShare,
  onDelete,
  onFavorite,
  onMove,
  onCancel,
  onSelectAll,
}) => {
  const { colors } = useSettingsStore();

  if (selectedCount === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.countText, { color: colors.text }]}>
          {selectedCount} selected
        </Text>
        <TouchableOpacity onPress={onSelectAll}>
          <Text style={[styles.selectAllText, { color: colors.primary }]}>Select All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <ActionButton icon="share-outline" label="Share" color={colors.primary} onPress={onShare} textColor={colors.textSecondary} />
        <ActionButton icon="heart-outline" label="Favorite" color="#FF4757" onPress={onFavorite} textColor={colors.textSecondary} />
        <ActionButton icon="folder-outline" label="Move" color="#4CAF50" onPress={onMove} textColor={colors.textSecondary} />
        <ActionButton icon="trash-outline" label="Delete" color="#F44336" onPress={onDelete} textColor={colors.textSecondary} />
      </View>
    </View>
  );
};

const ActionButton: React.FC<{ icon: string; label: string; color: string; onPress: () => void; textColor: string }> = ({
  icon, label, color, onPress, textColor,
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <Text style={[styles.actionLabel, { color: textColor }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelButton: {
    padding: 4,
  },
  countText: {
    fontSize: 16,
    fontWeight: '700',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
