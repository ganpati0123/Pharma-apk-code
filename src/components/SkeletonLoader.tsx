import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

interface SkeletonLoaderProps {
  count?: number;
  columns?: number;
  showHeader?: boolean;
  type?: 'grid' | 'list' | 'card';
}

const SkeletonItem: React.FC<{ width: number; height: number; borderRadius?: number; colors: any }> = ({
  width, height, borderRadius = 8, colors,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.shimmer || colors.border,
          opacity,
        },
      ]}
    />
  );
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 12,
  columns = 3,
  showHeader = true,
  type = 'grid',
}) => {
  const { colors } = useSettingsStore();
  const screenWidth = Dimensions.get('window').width;
  const gap = 2;
  const itemSize = (screenWidth - gap * (columns + 1)) / columns;

  if (type === 'list') {
    return (
      <View style={styles.listContainer}>
        {showHeader && (
          <View style={styles.headerSkeleton}>
            <SkeletonItem width={150} height={20} colors={colors} />
            <SkeletonItem width={80} height={16} colors={colors} />
          </View>
        )}
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={styles.listItem}>
            <SkeletonItem width={60} height={60} borderRadius={8} colors={colors} />
            <View style={styles.listItemContent}>
              <SkeletonItem width={180} height={16} colors={colors} />
              <SkeletonItem width={120} height={12} colors={colors} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (type === 'card') {
    return (
      <View style={styles.cardContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={[styles.card, { backgroundColor: colors.surface }]}>
            <SkeletonItem width={screenWidth - 32} height={200} borderRadius={12} colors={colors} />
            <View style={styles.cardContent}>
              <SkeletonItem width={200} height={18} colors={colors} />
              <SkeletonItem width={150} height={14} colors={colors} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.headerSkeleton}>
          <SkeletonItem width={200} height={24} colors={colors} />
          <SkeletonItem width={100} height={16} colors={colors} />
        </View>
      )}
      <View style={styles.grid}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={{ margin: gap / 2 }}>
            <SkeletonItem width={itemSize} height={itemSize} borderRadius={4} colors={colors} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  listItemContent: {
    gap: 6,
  },
  cardContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 12,
    gap: 6,
  },
});
