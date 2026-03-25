import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';

interface DateSectionHeaderProps {
  title: string;
  subtitle?: string;
  itemCount: number;
  onPress?: () => void;
  showChevron?: boolean;
}

export const DateSectionHeader: React.FC<DateSectionHeaderProps> = ({
  title,
  subtitle,
  itemCount,
  onPress,
  showChevron = false,
}) => {
  const { colors } = useSettingsStore();

  const content = (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontSize: 13,
  },
});
