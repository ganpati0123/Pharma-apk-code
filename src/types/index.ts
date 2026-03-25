import type { Asset } from 'expo-media-library';

// ============================================================
// CORE MEDIA TYPES
// ============================================================

export interface MediaItem extends Asset {
  aiTags?: string[];
  aiCategory?: string;
  thumbnailUri?: string;
  isFavorite?: boolean;
  rating?: number;
  location?: MediaLocation;
  faces?: DetectedFace[];
  sceneType?: string;
  colorPalette?: string[];
  duplicateGroupId?: string;
  exifData?: ExifData;
  editHistory?: EditHistoryEntry[];
  addedToAlbums?: string[];
  viewCount?: number;
  lastViewedAt?: number;
}

export interface MediaLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  city?: string;
  country?: string;
  address?: string;
}

export interface ExifData {
  make?: string;
  model?: string;
  focalLength?: number;
  aperture?: number;
  iso?: number;
  exposureTime?: string;
  flash?: boolean;
  whiteBalance?: string;
  orientation?: number;
  software?: string;
  dateTimeOriginal?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  colorSpace?: string;
  pixelWidth?: number;
  pixelHeight?: number;
  megapixels?: number;
}

// ============================================================
// ALBUM TYPES
// ============================================================

export interface Album {
  id: string;
  title: string;
  type: 'custom' | 'auto' | 'ai' | 'smart' | 'location' | 'people';
  coverUri?: string;
  count: number;
  assets?: MediaItem[];
  description?: string;
  createdAt?: number;
  updatedAt?: number;
  sortOrder?: SortOrder;
  icon?: string;
  color?: string;
}

export interface SmartAlbum extends Album {
  type: 'smart';
  rules: SmartAlbumRule[];
}

export interface SmartAlbumRule {
  field: 'aiCategory' | 'aiTags' | 'mediaType' | 'creationTime' | 'fileSize' | 'duration' | 'rating';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: string | number | string[] | [number, number];
}

// ============================================================
// AI & CLASSIFICATION TYPES
// ============================================================

export interface AITag {
  label: string;
  confidence: number;
}

export interface AIClassification {
  tags: AITag[];
  category: string;
  sceneType?: string;
  dominantColors?: string[];
  faces?: DetectedFace[];
  objectCount?: number;
  quality?: ImageQuality;
  sentiment?: ImageSentiment;
  textContent?: string[];
  isScreenshot?: boolean;
  isDuplicate?: boolean;
  duplicateHash?: string;
  aestheticScore?: number;
}

export interface DetectedFace {
  id: string;
  boundingBox: BoundingBox;
  confidence: number;
  landmarks?: FaceLandmarks;
  personId?: string;
  personName?: string;
  emotion?: FaceEmotion;
  age?: number;
  gender?: string;
  isSmiling?: boolean;
  eyesOpen?: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmarks {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  nose: { x: number; y: number };
  leftMouth: { x: number; y: number };
  rightMouth: { x: number; y: number };
}

export type FaceEmotion = 'happy' | 'sad' | 'neutral' | 'surprised' | 'angry' | 'disgusted' | 'fearful';

export interface ImageQuality {
  sharpness: number;
  brightness: number;
  contrast: number;
  noise: number;
  overall: number;
}

export interface ImageSentiment {
  positive: number;
  negative: number;
  neutral: number;
}

export interface DuplicateGroup {
  id: string;
  items: MediaItem[];
  bestItem: MediaItem;
  similarity: number;
  spaceSaved: number;
}

export interface AIInsight {
  id: string;
  type: 'storage' | 'memory' | 'suggestion' | 'trend' | 'achievement' | 'quality' | 'duplicate';
  title: string;
  description: string;
  icon: string;
  color: string;
  actionLabel?: string;
  actionData?: Record<string, unknown>;
  priority: number;
  createdAt: number;
  dismissed?: boolean;
}

export interface PhotoMemory {
  id: string;
  title: string;
  subtitle: string;
  items: MediaItem[];
  coverUri: string;
  type: 'onThisDay' | 'bestOf' | 'people' | 'places' | 'recentHighlights' | 'yearInReview';
  date: number;
  color: string;
  icon: string;
}

// ============================================================
// SEARCH & FILTER TYPES
// ============================================================

export interface SearchFilters {
  query: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  mediaType?: 'photo' | 'video' | 'all';
  minRating?: number;
  categories?: string[];
  sortBy?: SortField;
  sortOrder?: SortDirection;
  onlyFavorites?: boolean;
  minQuality?: number;
  hasLocation?: boolean;
  hasFaces?: boolean;
  colorFilter?: string;
}

export type SortField = 'date' | 'name' | 'size' | 'type' | 'rating' | 'quality' | 'views';
export type SortDirection = 'asc' | 'desc';
export type SortOrder = `${SortField}_${SortDirection}`;

export interface DateGroup {
  title: string;
  data: MediaItem[];
  dateKey: string;
  count: number;
}

// ============================================================
// EDITOR TYPES
// ============================================================

export interface EditorState {
  uri: string;
  originalUri: string;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  cropRegion?: CropRegion;
  filter?: string;
  adjustments: ImageAdjustments;
  overlays: EditorOverlay[];
  undoStack: EditorAction[];
  redoStack: EditorAction[];
  activePreset?: CropPreset;
  isDirty: boolean;
}

export interface CropRegion {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export interface CropPreset {
  id: string;
  label: string;
  icon: string;
  aspectRatio: number | null;
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  sharpness: number;
  highlights: number;
  shadows: number;
  vignette: number;
  grain: number;
  fade: number;
  tint: number;
  exposure: number;
}

export interface EditorOverlay {
  id: string;
  type: 'text' | 'sticker' | 'drawing';
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  content: string;
  color?: string;
  fontSize?: number;
}

export interface EditorAction {
  type: 'rotate' | 'flip' | 'crop' | 'filter' | 'adjust' | 'overlay' | 'reset';
  timestamp: number;
  previousState: Partial<EditorState>;
  description: string;
}

export interface EditHistoryEntry {
  action: string;
  timestamp: number;
  beforeUri: string;
  afterUri: string;
}

// ============================================================
// THEME TYPES
// ============================================================

export type ThemeMode = 'light' | 'dark' | 'system' | 'amoled';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  border: string;
  borderLight: string;
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
  overlay: string;
  overlayLight: string;
  card: string;
  cardElevated: string;
  icon: string;
  iconSecondary: string;
  tabBar: string;
  tabBarInactive: string;
  shimmer: string;
  shimmerHighlight: string;
  gradient: string[];
  shadow: string;
}

// ============================================================
// UI STATE TYPES
// ============================================================

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
}

export type ViewMode = 'grid' | 'timeline' | 'map' | 'stories';

export interface SortOption {
  id: SortField;
  label: string;
  icon: string;
}

export interface BatchOperation {
  type: 'delete' | 'share' | 'move' | 'copy' | 'favorite' | 'unfavorite' | 'tag' | 'export' | 'compress';
  itemCount: number;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  error?: string;
}

export interface StorageInfo {
  totalSpace: number;
  usedSpace: number;
  freeSpace: number;
  mediaSpace: number;
  photoCount: number;
  videoCount: number;
  duplicateSpace: number;
  averagePhotoSize: number;
  averageVideoSize: number;
  largestFile: MediaItem | null;
  oldestFile: MediaItem | null;
  newestFile: MediaItem | null;
}

export interface GalleryStats {
  totalPhotos: number;
  totalVideos: number;
  totalSize: number;
  favoriteCount: number;
  albumCount: number;
  aiTagCount: number;
  categoryDistribution: Record<string, number>;
  monthlyDistribution: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
  averageQuality: number;
  duplicateCount: number;
  faceCount: number;
  locationCount: number;
  storageBreakdown: {
    photos: number;
    videos: number;
    screenshots: number;
    other: number;
  };
}

// ============================================================
// TIMELINE TYPES
// ============================================================

export interface TimelineSection {
  id: string;
  title: string;
  subtitle?: string;
  data: MediaItem[];
  type: 'day' | 'week' | 'month' | 'year';
  startDate: number;
  endDate: number;
  photoCount: number;
  videoCount: number;
  highlights?: MediaItem[];
  location?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: number;
  items: MediaItem[];
  type: 'trip' | 'event' | 'milestone' | 'regular';
  location?: string;
  tags?: string[];
}

// ============================================================
// ANIMATION TYPES
// ============================================================

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
}

export interface GestureConfig {
  enabled: boolean;
  minScale: number;
  maxScale: number;
  doubleTapScale: number;
  panEnabled: boolean;
  pinchEnabled: boolean;
  rotationEnabled: boolean;
  flingEnabled: boolean;
}
