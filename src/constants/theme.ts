import type { ThemeColors } from '../types';

export const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#EEEEEE',
  surfaceElevated: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42E0',
  secondary: '#FF6B9D',
  secondaryLight: '#FF8FB3',
  accent: '#FFD700',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  error: '#FF4444',
  errorLight: '#FFE0E0',
  success: '#00C853',
  successLight: '#E0FFE0',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  icon: '#333333',
  iconSecondary: '#888888',
  tabBar: '#FFFFFF',
  tabBarInactive: '#999999',
  shimmer: '#E0E0E0',
  shimmerHighlight: '#F5F5F5',
  gradient: ['#6C63FF', '#FF6B9D', '#FFD700'],
  shadow: 'rgba(0,0,0,0.1)',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2A2A2A',
  surfaceElevated: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textTertiary: '#777777',
  primary: '#8B85FF',
  primaryLight: '#A9A4FF',
  primaryDark: '#6C63FF',
  secondary: '#FF6B9D',
  secondaryLight: '#FF8FB3',
  accent: '#FFD700',
  border: '#333333',
  borderLight: '#2A2A2A',
  error: '#FF6B6B',
  errorLight: '#3D1F1F',
  success: '#69F0AE',
  successLight: '#1B3D2F',
  warning: '#FFB74D',
  warningLight: '#3D2E1F',
  info: '#64B5F6',
  infoLight: '#1F2D3D',
  overlay: 'rgba(0,0,0,0.8)',
  overlayLight: 'rgba(0,0,0,0.4)',
  card: '#1E1E1E',
  cardElevated: '#2A2A2A',
  icon: '#CCCCCC',
  iconSecondary: '#888888',
  tabBar: '#1E1E1E',
  tabBarInactive: '#666666',
  shimmer: '#2A2A2A',
  shimmerHighlight: '#3A3A3A',
  gradient: ['#8B85FF', '#FF6B9D', '#FFD700'],
  shadow: 'rgba(0,0,0,0.3)',
};

export const amoledTheme: ThemeColors = {
  background: '#000000',
  surface: '#0A0A0A',
  surfaceVariant: '#151515',
  surfaceElevated: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  textTertiary: '#888888',
  primary: '#8B85FF',
  primaryLight: '#A9A4FF',
  primaryDark: '#6C63FF',
  secondary: '#FF6B9D',
  secondaryLight: '#FF8FB3',
  accent: '#FFD700',
  border: '#222222',
  borderLight: '#1A1A1A',
  error: '#FF6B6B',
  errorLight: '#2D1010',
  success: '#69F0AE',
  successLight: '#102D1F',
  warning: '#FFB74D',
  warningLight: '#2D1F10',
  info: '#64B5F6',
  infoLight: '#101F2D',
  overlay: 'rgba(0,0,0,0.9)',
  overlayLight: 'rgba(0,0,0,0.5)',
  card: '#0A0A0A',
  cardElevated: '#151515',
  icon: '#DDDDDD',
  iconSecondary: '#999999',
  tabBar: '#000000',
  tabBarInactive: '#555555',
  shimmer: '#151515',
  shimmerHighlight: '#252525',
  gradient: ['#8B85FF', '#FF6B9D', '#FFD700'],
  shadow: 'rgba(0,0,0,0.5)',
};

export const GRID_COLUMNS = {
  compact: 5,
  normal: 3,
  large: 2,
  single: 1,
} as const;

export const THUMBNAIL_QUALITY = 0.7;
export const PAGE_SIZE = 100;
export const ANIMATION_DURATION = 300;
export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};
export const HAPTIC_LIGHT = 'light';
export const HAPTIC_MEDIUM = 'medium';
export const HAPTIC_HEAVY = 'heavy';
export const MAX_ZOOM = 5;
export const MIN_ZOOM = 1;
export const DOUBLE_TAP_ZOOM = 2.5;
export const SWIPE_THRESHOLD = 50;
export const LONG_PRESS_DURATION = 500;

export const GRADIENT_PRESETS = {
  sunrise: ['#FF512F', '#F09819'],
  ocean: ['#2193b0', '#6dd5ed'],
  forest: ['#11998e', '#38ef7d'],
  sunset: ['#ee9ca7', '#ffdde1'],
  night: ['#0F2027', '#203A43', '#2C5364'],
  candy: ['#D585FF', '#00FFEE'],
  fire: ['#f12711', '#f5af19'],
  royal: ['#141E30', '#243B55'],
  neon: ['#00F260', '#0575E6'],
  purple: ['#6C63FF', '#A855F7'],
};
