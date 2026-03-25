import React, { memo } from 'react';
import { StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  selectedId,
  onSelect,
}) => {
  const colors = useSettingsStore((s) => s.colors);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {chips.map((chip) => {
        const isActive = chip.id === selectedId;
        return (
          <Pressable
            key={chip.id}
            onPress={() => onSelect(chip.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? colors.primary
                  : colors.surfaceVariant,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default memo(FilterChips);
