import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import type { SortField, SortDirection } from '../types';

interface SortOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  currentField: SortField;
  currentDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

const SORT_OPTIONS: Array<{ field: SortField; label: string; icon: string }> = [
  { field: 'date', label: 'Date', icon: 'calendar' },
  { field: 'name', label: 'Name', icon: 'text' },
  { field: 'size', label: 'Size', icon: 'resize' },
  { field: 'type', label: 'Type', icon: 'image' },
  { field: 'category', label: 'Category', icon: 'grid' },
];

export const SortOptionsSheet: React.FC<SortOptionsSheetProps> = ({
  visible,
  onClose,
  currentField,
  currentDirection,
  onSortChange,
}) => {
  const { colors } = useSettingsStore();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.text }]}>Sort By</Text>

          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.field}
              style={[
                styles.option,
                currentField === option.field && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => {
                const newDirection = currentField === option.field && currentDirection === 'desc' ? 'asc' : 'desc';
                onSortChange(option.field, newDirection);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon as any} size={20} color={currentField === option.field ? colors.primary : colors.textSecondary} />
                <Text style={[styles.optionText, { color: currentField === option.field ? colors.primary : colors.text }]}>
                  {option.label}
                </Text>
              </View>
              {currentField === option.field && (
                <Ionicons
                  name={currentDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                  size={18}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
