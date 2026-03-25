import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';
import { StatsCard } from '../components/StatsCard';
import { generateInsights, generateMemories, getSmartSuggestions } from '../utils/ai';
import { calculateGalleryStats, calculateStorageInfo, formatFileSize } from '../utils/mediaInfo';
import { getHourlyDistribution, getWeekdayDistribution, getLongestStreak } from '../utils/timeline';
import type { AIInsight, PhotoMemory, MediaItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InsightCard: React.FC<{ insight: AIInsight; colors: any }> = ({ insight, colors }) => (
  <View style={[cardStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <View style={[cardStyles.iconContainer, { backgroundColor: insight.color + '20' }]}>
      <Ionicons name={insight.icon as any} size={24} color={insight.color} />
    </View>
    <View style={cardStyles.content}>
      <Text style={[cardStyles.title, { color: colors.text }]}>{insight.title}</Text>
      <Text style={[cardStyles.description, { color: colors.textSecondary }]}>{insight.description}</Text>
      {insight.actionLabel && (
        <TouchableOpacity style={[cardStyles.actionButton, { backgroundColor: insight.color }]}>
          <Text style={cardStyles.actionText}>{insight.actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const MemoryCard: React.FC<{ memory: PhotoMemory; colors: any }> = ({ memory, colors }) => (
  <View style={[memStyles.card, { backgroundColor: memory.color }]}>
    <Image source={{ uri: memory.coverUri }} style={memStyles.cover} blurRadius={2} />
    <View style={memStyles.overlay}>
      <Ionicons name={memory.icon as any} size={28} color="#FFF" />
      <Text style={memStyles.title}>{memory.title}</Text>
      <Text style={memStyles.subtitle}>{memory.subtitle}</Text>
    </View>
  </View>
);

export const AIInsightsScreen: React.FC = () => {
  const { colors } = useSettingsStore();
  const { assets, classifications } = useMediaStore();
  const [activeTab, setActiveTab] = useState<'insights' | 'memories' | 'stats'>('insights');

  const insights = useMemo(() => {
    return generateInsights(assets, classifications);
  }, [assets, classifications]);

  const memories = useMemo(() => {
    return generateMemories(assets);
  }, [assets]);

  const suggestions = useMemo(() => {
    return getSmartSuggestions(assets, classifications);
  }, [assets, classifications]);

  const stats = useMemo(() => {
    return calculateGalleryStats(assets);
  }, [assets]);

  const storageInfo = useMemo(() => {
    return calculateStorageInfo(assets);
  }, [assets]);

  const streak = useMemo(() => {
    return getLongestStreak(assets);
  }, [assets]);

  const hourlyDist = useMemo(() => {
    return getHourlyDistribution(assets);
  }, [assets]);

  const weekdayDist = useMemo(() => {
    return getWeekdayDistribution(assets);
  }, [assets]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const tabs = [
    { key: 'insights', label: 'Insights', icon: 'bulb' },
    { key: 'memories', label: 'Memories', icon: 'heart' },
    { key: 'stats', label: 'Statistics', icon: 'bar-chart' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>AI Insights</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Powered by on-device AI analysis
        </Text>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.key ? colors.primary : colors.textSecondary}
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.key ? colors.primary : colors.textSecondary },
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'insights' && (
          <>
            {suggestions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Smart Suggestions</Text>
                {suggestions.map((suggestion, index) => (
                  <View key={index} style={[styles.suggestionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="bulb-outline" size={20} color="#FFD700" />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} colors={colors} />
              ))}
            </View>
          </>
        )}

        {activeTab === 'memories' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Photo Memories</Text>
            {memories.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memoriesScroll}>
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} colors={colors} />
                ))}
              </ScrollView>
            ) : (
              <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
                <Ionicons name="images-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Keep taking photos to unlock memories!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'stats' && (
          <>
            <View style={styles.statsGrid}>
              <StatsCard title="Total" value={stats.totalItems} icon="images" color="#6C63FF" />
              <StatsCard title="Photos" value={stats.totalPhotos} icon="camera" color="#4CAF50" />
            </View>
            <View style={styles.statsGrid}>
              <StatsCard title="Videos" value={stats.totalVideos} icon="videocam" color="#FF6B9D" />
              <StatsCard title="Favorites" value={stats.totalFavorites} icon="heart" color="#FF4757" />
            </View>
            <View style={styles.statsGrid}>
              <StatsCard title="Storage" value={formatFileSize(stats.totalSize)} icon="server" color="#2196F3" />
              <StatsCard title="Streak" value={streak + 'd'} icon="flame" color="#FF9800" />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Activity</Text>
              <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.barChart}>
                  {weekdayDist.map((count, index) => {
                    const maxCount = Math.max(...weekdayDist, 1);
                    const height = (count / maxCount) * 100;
                    return (
                      <View key={index} style={styles.barContainer}>
                        <View style={[styles.bar, { height, backgroundColor: colors.primary }]} />
                        <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{dayNames[index]}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
              {Object.entries(stats.categoryBreakdown).slice(0, 8).map(([category, count]) => {
                const percentage = Math.round((count / Math.max(stats.totalItems, 1)) * 100);
                return (
                  <View key={category} style={[styles.categoryRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category}</Text>
                    <View style={styles.categoryBar}>
                      <View style={[styles.categoryFill, { width: percentage + '%', backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  tabBar: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  suggestionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  memoriesScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: { fontSize: 14, textAlign: 'center' },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: { alignItems: 'center', gap: 4 },
  bar: { width: 28, borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 11, fontWeight: '500' },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  categoryName: { fontSize: 14, fontWeight: '500', width: 100 },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryFill: { height: '100%', borderRadius: 4 },
  categoryCount: { fontSize: 13, fontWeight: '600', width: 40, textAlign: 'right' },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  description: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  actionText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});

const memStyles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.65,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
});
