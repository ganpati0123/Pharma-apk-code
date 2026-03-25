import { create } from 'zustand';
import { Appearance } from 'react-native';
import type { ThemeMode, ThemeColors } from '../types';
import { lightTheme, darkTheme, amoledTheme, GRID_COLUMNS } from '../constants/theme';

interface SettingsState {
  themeMode: ThemeMode;
  gridColumns: number;
  colors: ThemeColors;
  autoClassify: boolean;
  showAIBadges: boolean;
  highQualityThumbnails: boolean;
  showMetadata: boolean;
  confirmDelete: boolean;
  hapticEnabled: boolean;
  animationsEnabled: boolean;
  autoPlayVideos: boolean;
  cloudBackup: boolean;
  storageOptimization: boolean;
  faceRecognition: boolean;
  smartSuggestions: boolean;
  duplicateDetection: boolean;
  photoMemories: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setGridColumns: (columns: number) => void;
  cycleGridColumns: () => void;
  resolveTheme: () => void;
  toggleAutoClassify: () => void;
  toggleShowAIBadges: () => void;
  toggleHighQualityThumbnails: () => void;
  toggleShowMetadata: () => void;
  toggleConfirmDelete: () => void;
  toggleHaptic: () => void;
  toggleAnimations: () => void;
  toggleAutoPlayVideos: () => void;
  toggleCloudBackup: () => void;
  toggleStorageOptimization: () => void;
  toggleFaceRecognition: () => void;
  toggleSmartSuggestions: () => void;
  toggleDuplicateDetection: () => void;
  togglePhotoMemories: () => void;
}

const getResolvedColors = (mode: ThemeMode): ThemeColors => {
  if (mode === 'system') {
    const systemScheme = Appearance.getColorScheme();
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }
  if (mode === 'amoled') return amoledTheme;
  return mode === 'dark' ? darkTheme : lightTheme;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  themeMode: 'system',
  gridColumns: GRID_COLUMNS.normal,
  colors: getResolvedColors('system'),
  autoClassify: true,
  showAIBadges: true,
  highQualityThumbnails: false,
  showMetadata: true,
  confirmDelete: true,
  hapticEnabled: true,
  animationsEnabled: true,
  autoPlayVideos: false,
  cloudBackup: false,
  storageOptimization: false,
  faceRecognition: true,
  smartSuggestions: true,
  duplicateDetection: true,
  photoMemories: true,

  setThemeMode: (mode: ThemeMode) => {
    set({
      themeMode: mode,
      colors: getResolvedColors(mode),
    });
  },

  setGridColumns: (columns: number) => {
    set({ gridColumns: columns });
  },

  cycleGridColumns: () => {
    const current = get().gridColumns;
    const values: number[] = [GRID_COLUMNS.large, GRID_COLUMNS.normal, GRID_COLUMNS.compact];
    const currentIndex = values.indexOf(current);
    const nextIndex = (currentIndex + 1) % values.length;
    set({ gridColumns: values[nextIndex] });
  },

  resolveTheme: () => {
    const mode = get().themeMode;
    set({ colors: getResolvedColors(mode) });
  },

  toggleAutoClassify: () => set((s) => ({ autoClassify: !s.autoClassify })),
  toggleShowAIBadges: () => set((s) => ({ showAIBadges: !s.showAIBadges })),
  toggleHighQualityThumbnails: () => set((s) => ({ highQualityThumbnails: !s.highQualityThumbnails })),
  toggleShowMetadata: () => set((s) => ({ showMetadata: !s.showMetadata })),
  toggleConfirmDelete: () => set((s) => ({ confirmDelete: !s.confirmDelete })),
  toggleHaptic: () => set((s) => ({ hapticEnabled: !s.hapticEnabled })),
  toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
  toggleAutoPlayVideos: () => set((s) => ({ autoPlayVideos: !s.autoPlayVideos })),
  toggleCloudBackup: () => set((s) => ({ cloudBackup: !s.cloudBackup })),
  toggleStorageOptimization: () => set((s) => ({ storageOptimization: !s.storageOptimization })),
  toggleFaceRecognition: () => set((s) => ({ faceRecognition: !s.faceRecognition })),
  toggleSmartSuggestions: () => set((s) => ({ smartSuggestions: !s.smartSuggestions })),
  toggleDuplicateDetection: () => set((s) => ({ duplicateDetection: !s.duplicateDetection })),
  togglePhotoMemories: () => set((s) => ({ photoMemories: !s.photoMemories })),
}));
