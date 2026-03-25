import type { Asset } from 'expo-media-library';

export interface MediaItem extends Asset {
  aiTags?: string[];
  aiCategory?: string;
  thumbnailUri?: string;
}

export interface Album {
  id: string;
  title: string;
  type: 'custom' | 'auto' | 'ai';
  coverUri?: string;
  count: number;
  assets?: MediaItem[];
}

export interface AITag {
  label: string;
  confidence: number;
}

export interface AIClassification {
  tags: AITag[];
  category: string;
}

export interface SearchFilters {
  query: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  mediaType?: 'photo' | 'video' | 'all';
}

export interface DateGroup {
  title: string;
  data: MediaItem[];
}

export interface EditorState {
  uri: string;
  rotation: number;
  cropRegion?: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  };
  filter?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  error: string;
  overlay: string;
  card: string;
  icon: string;
  tabBar: string;
  tabBarInactive: string;
}
