import type { ThemeColors } from '../types';

export const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#EEEEEE',
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  border: '#E0E0E0',
  error: '#FF4444',
  overlay: 'rgba(0,0,0,0.5)',
  card: '#FFFFFF',
  icon: '#333333',
  tabBar: '#FFFFFF',
  tabBarInactive: '#999999',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  primary: '#8B85FF',
  primaryLight: '#A9A4FF',
  border: '#333333',
  error: '#FF6B6B',
  overlay: 'rgba(0,0,0,0.8)',
  card: '#1E1E1E',
  icon: '#CCCCCC',
  tabBar: '#1E1E1E',
  tabBarInactive: '#666666',
};

export const GRID_COLUMNS = {
  compact: 4,
  normal: 3,
  large: 2,
} as const;

export const THUMBNAIL_QUALITY = 0.7;
export const PAGE_SIZE = 100;
export const ANIMATION_DURATION = 300;
