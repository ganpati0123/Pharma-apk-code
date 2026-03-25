import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';
import type { ThemeMode } from '../types';

const THEME_OPTIONS: Array<{ id: ThemeMode; label: string; icon: string }> = [
  { id: 'light', label: 'Light', icon: 'sunny' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'phone-portrait' },
];

const GRID_OPTIONS = [
  { columns: 2, label: 'Large' },
  { columns: 3, label: 'Medium' },
  { columns: 4, label: 'Compact' },
];

const SettingsScreen: React.FC = () => {
  const colors = useSettingsStore((s) => s.colors);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const gridColumns = useSettingsStore((s) => s.gridColumns);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setGridColumns = useSettingsStore((s) => s.setGridColumns);
  const totalCount = useMediaStore((s) => s.totalCount);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.appInfoHeader}>
            <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="images" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.appName, { color: colors.text }]}>
                AI Gallery
              </Text>
              <Text
                style={[styles.appVersion, { color: colors.textSecondary }]}
              >
                Version 1.0.0
              </Text>
            </View>
          </View>
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {totalCount.toLocaleString()}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.textSecondary }]}
              >
                Total Media
              </Text>
            </View>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {THEME_OPTIONS.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => setThemeMode(option.id)}
                style={[
                  styles.optionRow,
                  index < THEME_OPTIONS.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={option.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={colors.icon}
                  />
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {option.label}
                  </Text>
                </View>
                {themeMode === option.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Grid Layout Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Grid Layout
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {GRID_OPTIONS.map((option, index) => (
              <Pressable
                key={option.columns}
                onPress={() => setGridColumns(option.columns)}
                style={[
                  styles.optionRow,
                  index < GRID_OPTIONS.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name="grid"
                    size={22}
                    color={colors.icon}
                  />
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {option.label} ({option.columns} columns)
                  </Text>
                </View>
                {gridColumns === option.columns && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* AI Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            AI Features
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="sparkles" size={22} color="#FFD700" />
                <View>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    Auto Classification
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Automatically tag and categorize photos
                  </Text>
                </View>
              </View>
              <Switch
                value={true}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={colors.primary}
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.optionRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
              <View style={styles.optionLeft}>
                <Ionicons name="information-circle" size={22} color={colors.icon} />
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  Built with Expo & React Native
                </Text>
              </View>
            </View>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="logo-react" size={22} color="#61DAFB" />
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  AI-powered photo organization
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
  },
  appVersion: {
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  bottomPadding: {
    height: 100,
  },
});

export default SettingsScreen;
