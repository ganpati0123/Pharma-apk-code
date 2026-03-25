import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaStore } from '../store/mediaStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { calculateStorageInfo, formatFileSize } from '../utils/mediaInfo';
import type { ThemeMode } from '../types';

const THEME_OPTIONS: Array<{ mode: ThemeMode; label: string; icon: string }> = [
  { mode: 'light', label: 'Light', icon: 'sunny' },
  { mode: 'dark', label: 'Dark', icon: 'moon' },
  { mode: 'amoled', label: 'AMOLED', icon: 'contrast' },
  { mode: 'system', label: 'System', icon: 'phone-portrait' },
];

interface SettingRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  color?: string;
  value?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  colors: any;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon, label, subtitle, color, value, onToggle, onPress, rightElement, colors,
}) => {
  const content = (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: (color || colors.primary) + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color || colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#FFF"
        />
      )}
      {rightElement}
      {onPress && !onToggle && !rightElement && (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }
  return content;
};

export const SettingsScreen: React.FC = () => {
  const settings = useSettingsStore();
  const { assets } = useMediaStore();
  const { favoritesCount } = useFavoritesStore();
  const { colors } = settings;

  const storageInfo = calculateStorageInfo(assets);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Customize your gallery experience</Text>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.themeGrid, { backgroundColor: colors.surface }]}>
          {THEME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.themeOption,
                settings.themeMode === option.mode && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => settings.setThemeMode(option.mode)}
            >
              <Ionicons
                name={option.icon as any}
                size={22}
                color={settings.themeMode === option.mode ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.themeLabel,
                { color: settings.themeMode === option.mode ? colors.primary : colors.textSecondary },
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Gallery Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>GALLERY</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SettingRow icon="grid" label="Grid Columns" subtitle={'Currently ' + settings.gridColumns + ' columns'} onPress={settings.cycleGridColumns} colors={colors} />
          <SettingRow icon="image" label="High Quality Thumbnails" subtitle="Uses more memory" value={settings.highQualityThumbnails} onToggle={settings.toggleHighQualityThumbnails} colors={colors} />
          <SettingRow icon="calendar" label="Show Date Headers" value={settings.showMetadata} onToggle={settings.toggleShowMetadata} colors={colors} />
          <SettingRow icon="trash" label="Confirm Before Delete" value={settings.confirmDelete} onToggle={settings.toggleConfirmDelete} colors={colors} color="#F44336" />
        </View>
      </View>

      {/* AI Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI FEATURES</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SettingRow icon="sparkles" label="Auto Classification" subtitle="Automatically categorize photos" value={settings.autoClassify} onToggle={settings.toggleAutoClassify} colors={colors} color="#6C63FF" />
          <SettingRow icon="pricetag" label="Show AI Badges" subtitle="Display category tags on photos" value={settings.showAIBadges} onToggle={settings.toggleShowAIBadges} colors={colors} color="#6C63FF" />
          <SettingRow icon="people" label="Face Recognition" subtitle="Detect and group faces" value={settings.faceRecognition} onToggle={settings.toggleFaceRecognition} colors={colors} color="#FF6B9D" />
          <SettingRow icon="copy" label="Duplicate Detection" subtitle="Find similar photos" value={settings.duplicateDetection} onToggle={settings.toggleDuplicateDetection} colors={colors} color="#FF9800" />
          <SettingRow icon="bulb" label="Smart Suggestions" subtitle="Get AI-powered tips" value={settings.smartSuggestions} onToggle={settings.toggleSmartSuggestions} colors={colors} color="#4CAF50" />
          <SettingRow icon="heart" label="Photo Memories" subtitle="On This Day and highlights" value={settings.photoMemories} onToggle={settings.togglePhotoMemories} colors={colors} color="#E91E63" />
        </View>
      </View>

      {/* Interaction Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>INTERACTION</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SettingRow icon="radio-button-on" label="Haptic Feedback" value={settings.hapticEnabled} onToggle={settings.toggleHaptic} colors={colors} />
          <SettingRow icon="flash" label="Animations" value={settings.animationsEnabled} onToggle={settings.toggleAnimations} colors={colors} />
          <SettingRow icon="play" label="Auto-Play Videos" value={settings.autoPlayVideos} onToggle={settings.toggleAutoPlayVideos} colors={colors} />
        </View>
      </View>

      {/* Storage Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STORAGE</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SettingRow icon="images" label="Photos" rightElement={<Text style={[styles.storageValue, { color: colors.textSecondary }]}>{storageInfo.photoCount} ({formatFileSize(storageInfo.photoSize)})</Text>} colors={colors} />
          <SettingRow icon="videocam" label="Videos" rightElement={<Text style={[styles.storageValue, { color: colors.textSecondary }]}>{storageInfo.videoCount} ({formatFileSize(storageInfo.videoSize)})</Text>} colors={colors} />
          <SettingRow icon="heart" label="Favorites" rightElement={<Text style={[styles.storageValue, { color: colors.textSecondary }]}>{favoritesCount}</Text>} colors={colors} color="#FF4757" />
          <SettingRow icon="server" label="Total Storage" rightElement={<Text style={[styles.storageValue, { color: colors.textSecondary }]}>{formatFileSize(storageInfo.totalSize)}</Text>} colors={colors} color="#2196F3" />
        </View>
      </View>

      {/* About Section */}
      <View style={[styles.section, { marginBottom: 100 }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SettingRow icon="information-circle" label="Version" rightElement={<Text style={[styles.storageValue, { color: colors.textSecondary }]}>2.0.0 Pro</Text>} colors={colors} />
          <SettingRow icon="code-slash" label="Built with" rightElement={<Text style={[styles.storageValue, { color: colors.textSecondary }]}>React Native + AI</Text>} colors={colors} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: { borderRadius: 16, overflow: 'hidden' },
  themeGrid: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 8,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeLabel: { fontSize: 12, fontWeight: '600' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  settingSubtitle: { fontSize: 12, marginTop: 1 },
  storageValue: { fontSize: 14, fontWeight: '500' },
});
