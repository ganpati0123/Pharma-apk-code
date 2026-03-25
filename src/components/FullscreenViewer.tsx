import React, { useState, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import type { MediaItem } from '../types';
import { formatDate, formatTime } from '../utils/dateHelpers';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FullscreenViewerProps {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
  onEdit?: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void;
  onShare?: (item: MediaItem) => void;
}

const FullscreenImage: React.FC<{
  item: MediaItem;
  isActive: boolean;
}> = memo(({ item, isActive }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      if (isActive) {
        scale.value = savedScale.value * e.scale;
      }
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else if (scale.value > 4) {
        scale.value = withTiming(4);
        savedScale.value = 4;
      } else {
        savedScale.value = scale.value;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (isActive && scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      }
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          source={{ uri: item.uri }}
          style={styles.fullImage}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>
    </GestureDetector>
  );
});

FullscreenImage.displayName = 'FullscreenImage';

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  items,
  initialIndex,
  onClose,
  onEdit,
  onDelete,
  onShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);
  const currentItem = items[currentIndex];

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: MediaItem; index: number }) => (
      <Pressable
        style={styles.slideContainer}
        onPress={toggleControls}
      >
        <FullscreenImage item={item} isActive={index === currentIndex} />
      </Pressable>
    ),
    [currentIndex, toggleControls]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden={!showControls} />
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          decelerationRate="fast"
        />

        {showControls && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            {/* Top bar */}
            <View style={styles.topBar}>
              <Pressable onPress={onClose} style={styles.iconButton} hitSlop={8}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </Pressable>
              <View style={styles.topCenter}>
                <Text style={styles.counterText}>
                  {currentIndex + 1} / {items.length}
                </Text>
              </View>
              <View style={styles.topRight}>
                {onShare && (
                  <Pressable
                    onPress={() => onShare(currentItem)}
                    style={styles.iconButton}
                    hitSlop={8}
                  >
                    <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
              <View style={styles.infoSection}>
                <Text style={styles.filenameText} numberOfLines={1}>
                  {currentItem?.filename}
                </Text>
                {currentItem && (
                  <Text style={styles.dateText}>
                    {formatDate(currentItem.creationTime)} •{' '}
                    {formatTime(currentItem.creationTime)}
                  </Text>
                )}
                {currentItem?.aiTags && currentItem.aiTags.length > 0 && (
                  <Text style={styles.tagsText} numberOfLines={1}>
                    AI: {currentItem.aiTags.join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.actionBar}>
                {onEdit && (
                  <Pressable
                    onPress={() => onEdit(currentItem)}
                    style={styles.actionButton}
                    hitSlop={8}
                  >
                    <Ionicons name="create-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>
                )}
                {onDelete && (
                  <Pressable
                    onPress={() => onDelete(currentItem)}
                    style={styles.actionButton}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                    <Text style={[styles.actionText, { color: '#FF6B6B' }]}>
                      Delete
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topRight: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  infoSection: {
    marginBottom: 12,
  },
  filenameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  tagsText: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 4,
  },
});

export default memo(FullscreenViewer);
