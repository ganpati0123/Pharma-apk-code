import type { MediaItem, ExifData, StorageInfo, GalleryStats } from '../types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return hrs + ':' + mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  }
  return mins + ':' + secs.toString().padStart(2, '0');
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeDate = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return minutes + ' min ago';
  if (hours < 24) return hours + 'h ago';
  if (days < 7) return days + 'd ago';
  if (weeks < 4) return weeks + 'w ago';
  if (months < 12) return months + 'mo ago';
  return years + 'y ago';
};

export const getMediaDimensions = (item: MediaItem): string => {
  return item.width + ' x ' + item.height;
};

export const getAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return (width / divisor) + ':' + (height / divisor);
};

export const getMegapixels = (width: number, height: number): string => {
  const mp = (width * height) / 1000000;
  return mp.toFixed(1) + ' MP';
};

export const estimateFileSize = (item: MediaItem): number => {
  const isVideo = item.mediaType === 'video';
  if (isVideo) {
    return item.width * item.height * (item.duration || 1) * 0.1;
  }
  return item.width * item.height * 3;
};

export const getMockExifData = (item: MediaItem): ExifData => {
  const hash = simpleHash(item.id);
  const cameras = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Google Pixel 8', 'Canon EOS R5', 'Sony A7IV'];
  const lenses = ['28mm f/1.8', '50mm f/1.4', '24-70mm f/2.8', '35mm f/1.4', '85mm f/1.8'];

  return {
    camera: cameras[hash % cameras.length],
    lens: lenses[(hash >> 4) % lenses.length],
    focalLength: (24 + (hash % 60)) + 'mm',
    aperture: 'f/' + (1.4 + (hash % 16) * 0.2).toFixed(1),
    shutterSpeed: '1/' + (30 + hash % 8000),
    iso: (100 + (hash % 32) * 100).toString(),
    flash: hash % 3 === 0,
    whiteBalance: hash % 2 === 0 ? 'Auto' : 'Daylight',
    meteringMode: hash % 2 === 0 ? 'Matrix' : 'Center-weighted',
    exposureCompensation: ((hash % 7) - 3) * 0.3,
  };
};

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const calculateStorageInfo = (items: MediaItem[]): StorageInfo => {
  let totalSize = 0;
  let photoSize = 0;
  let videoSize = 0;
  let photoCount = 0;
  let videoCount = 0;

  items.forEach((item) => {
    const size = estimateFileSize(item);
    totalSize += size;
    if (item.mediaType === 'video') {
      videoSize += size;
      videoCount++;
    } else {
      photoSize += size;
      photoCount++;
    }
  });

  return {
    totalSize,
    usedSize: totalSize,
    freeSize: 64 * 1024 * 1024 * 1024 - totalSize,
    photoSize,
    videoSize,
    photoCount,
    videoCount,
    cacheSize: Math.floor(totalSize * 0.1),
    thumbnailSize: Math.floor(totalSize * 0.05),
  };
};

export const calculateGalleryStats = (items: MediaItem[]): GalleryStats => {
  const totalItems = items.length;
  const photos = items.filter((i) => i.mediaType === 'photo');
  const videos = items.filter((i) => i.mediaType === 'video');
  const favorites = items.filter((i) => i.isFavorite);

  const categoryBreakdown: Record<string, number> = {};
  items.forEach((item) => {
    const cat = item.aiCategory || 'OTHER';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  });

  const dates = items.map((i) => i.creationTime).sort();
  const oldestItem = dates.length > 0 ? dates[0] : Date.now();
  const newestItem = dates.length > 0 ? dates[dates.length - 1] : Date.now();

  const totalVideoDuration = videos.reduce((sum, v) => sum + (v.duration || 0), 0);
  const storageInfo = calculateStorageInfo(items);

  return {
    totalItems,
    totalPhotos: photos.length,
    totalVideos: videos.length,
    totalFavorites: favorites.length,
    totalAlbums: 0,
    totalSize: storageInfo.totalSize,
    categoryBreakdown,
    oldestItem,
    newestItem,
    averagePhotosPerDay: totalItems > 0 ? totalItems / Math.max(1, (newestItem - oldestItem) / (24 * 60 * 60 * 1000)) : 0,
    totalVideoDuration,
    storageBreakdown: {
      photos: storageInfo.photoSize,
      videos: storageInfo.videoSize,
      cache: storageInfo.cacheSize,
      thumbnails: storageInfo.thumbnailSize,
    },
  };
};
