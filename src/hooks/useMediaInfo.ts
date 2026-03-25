import { useMemo } from 'react';
import type { MediaItem, ExifData } from '../types';
import {
  formatFileSize,
  formatDate,
  formatTime,
  formatRelativeDate,
  getMediaDimensions,
  getAspectRatio,
  getMegapixels,
  estimateFileSize,
  getMockExifData,
} from '../utils/mediaInfo';

export interface MediaInfoResult {
  dimensions: string;
  aspectRatio: string;
  megapixels: string;
  fileSize: string;
  fileSizeBytes: number;
  dateCreated: string;
  timeCreated: string;
  relativeDate: string;
  isVideo: boolean;
  isPhoto: boolean;
  exifData: ExifData;
  mediaType: string;
  filename: string;
}

export const useMediaInfo = (item: MediaItem | null): MediaInfoResult | null => {
  return useMemo(() => {
    if (!item) return null;

    const fileSizeBytes = estimateFileSize(item);

    return {
      dimensions: getMediaDimensions(item),
      aspectRatio: getAspectRatio(item.width, item.height),
      megapixels: getMegapixels(item.width, item.height),
      fileSize: formatFileSize(fileSizeBytes),
      fileSizeBytes,
      dateCreated: formatDate(item.creationTime),
      timeCreated: formatTime(item.creationTime),
      relativeDate: formatRelativeDate(item.creationTime),
      isVideo: item.mediaType === 'video',
      isPhoto: item.mediaType === 'photo',
      exifData: getMockExifData(item),
      mediaType: item.mediaType,
      filename: item.filename,
    };
  }, [item]);
};
