import React, { memo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';

interface AIProcessingBannerProps {
  isProcessing: boolean;
  progress: number;
  total: number;
}

const AIProcessingBanner: React.FC<AIProcessingBannerProps> = ({
  isProcessing,
  progress,
  total,
}) => {
  const colors = useSettingsStore((s) => s.colors);

  if (!isProcessing) return null;

  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.left}>
        <Ionicons name="sparkles" size={16} color="#FFD700" />
        <Text style={[styles.text, { color: colors.text }]}>
          AI analyzing photos...
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {percentage}%
        </Text>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: colors.primary,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 12,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 1,
  },
});

export default memo(AIProcessingBanner);
