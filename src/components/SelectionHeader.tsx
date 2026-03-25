import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';

const SelectionHeader: React.FC = () => {
  const colors = useSettingsStore((s) => s.colors);
  const { selectedAssets, clearSelection, deleteSelected, isSelectionMode } =
    useMediaStore();

  if (!isSelectionMode) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.primary },
      ]}
    >
      <Pressable onPress={clearSelection} style={styles.button} hitSlop={8}>
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </Pressable>

      <Text style={styles.countText}>
        {selectedAssets.size} selected
      </Text>

      <Pressable onPress={deleteSelected} style={styles.button} hitSlop={8}>
        <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  button: {
    padding: 8,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default memo(SelectionHeader);
