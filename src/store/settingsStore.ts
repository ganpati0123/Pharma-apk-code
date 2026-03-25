import { create } from 'zustand';
import { Appearance } from 'react-native';
import type { ThemeMode, ThemeColors } from '../types';
import { lightTheme, darkTheme, GRID_COLUMNS } from '../constants/theme';

interface SettingsState {
  themeMode: ThemeMode;
  gridColumns: number;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  setGridColumns: (columns: number) => void;
  cycleGridColumns: () => void;
  resolveTheme: () => void;
}

const getResolvedColors = (mode: ThemeMode): ThemeColors => {
  if (mode === 'system') {
    const systemScheme = Appearance.getColorScheme();
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  themeMode: 'system',
  gridColumns: GRID_COLUMNS.normal,
  colors: getResolvedColors('system'),

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
}));
