import type { AIClassification, AITag, DetectedFace, ImageQuality, ImageSentiment, DuplicateGroup, AIInsight, PhotoMemory, MediaItem } from '../types';
import { AI_LABELS, AI_CATEGORIES } from '../constants/categories';

/**
 * Advanced AI classification engine.
 * In production, this would integrate with TensorFlow.js or ML Kit.
 * The structure supports drop-in replacement with real ML models.
 */

const MOCK_LABELS: string[] = [
  'person', 'face', 'portrait', 'landscape', 'mountain', 'ocean',
  'food', 'meal', 'dog', 'cat', 'car', 'building', 'city',
  'sunset', 'beach', 'flower', 'tree', 'sky', 'selfie',
  'document', 'screenshot', 'text', 'nature', 'garden',
  'restaurant', 'cooking', 'bird', 'fish', 'bridge',
  'house', 'interior', 'bicycle', 'boat', 'cake', 'fruit',
  'travel', 'airport', 'sport', 'gym', 'art', 'painting',
  'night', 'party', 'concert', 'panorama', 'meme', 'funny',
  'coffee', 'drink', 'dessert', 'pizza', 'church', 'temple',
];

const SCENE_TYPES = [
  'indoor', 'outdoor', 'portrait', 'landscape', 'macro',
  'aerial', 'underwater', 'night', 'golden_hour', 'studio',
  'street', 'candid', 'action', 'still_life', 'abstract',
];

const COLOR_PALETTE = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#ADFF2F',
  '#00FF00', '#00CED1', '#1E90FF', '#0000FF', '#8A2BE2',
  '#FF1493', '#DC143C', '#000000', '#808080', '#FFFFFF',
  '#F5DEB3', '#D2691E', '#A0522D', '#228B22', '#4169E1',
];

const EMOTIONS: Array<'happy' | 'sad' | 'neutral' | 'surprised' | 'angry'> = [
  'happy', 'neutral', 'happy', 'surprised', 'neutral',
];

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const generatePerceptualHash = (uri: string, filename: string): string => {
  const hash = hashString(uri + filename);
  const hex = hash.toString(16).padStart(16, '0');
  return hex.substring(0, 16);
};

export const detectFaces = (uri: string, filename: string): DetectedFace[] => {
  const hash = hashString(filename + '_faces');
  const faceCount = hash % 5;
  const faces: DetectedFace[] = [];

  for (let i = 0; i < faceCount; i++) {
    const faceHash = hashString(filename + '_face_' + i);
    faces.push({
      id: 'face-' + faceHash.toString(16).substring(0, 8),
      boundingBox: {
        x: (faceHash % 60) + 10,
        y: (faceHash % 40) + 10,
        width: 15 + (faceHash % 20),
        height: 18 + (faceHash % 22),
      },
      confidence: 0.75 + (faceHash % 25) / 100,
      emotion: EMOTIONS[faceHash % EMOTIONS.length],
      age: 18 + (faceHash % 50),
      isSmiling: faceHash % 3 !== 0,
      eyesOpen: faceHash % 5 !== 0,
      landmarks: {
        leftEye: { x: (faceHash % 30) + 20, y: (faceHash % 20) + 25 },
        rightEye: { x: (faceHash % 30) + 50, y: (faceHash % 20) + 25 },
        nose: { x: (faceHash % 30) + 35, y: (faceHash % 20) + 40 },
        leftMouth: { x: (faceHash % 30) + 25, y: (faceHash % 20) + 55 },
        rightMouth: { x: (faceHash % 30) + 45, y: (faceHash % 20) + 55 },
      },
    });
  }

  return faces;
};

export const analyzeImageQuality = (uri: string, filename: string): ImageQuality => {
  const hash = hashString(filename + '_quality');
  return {
    sharpness: 0.3 + (hash % 70) / 100,
    brightness: 0.2 + (hash % 80) / 100,
    contrast: 0.3 + (hash % 70) / 100,
    noise: 0.1 + ((hash >> 4) % 40) / 100,
    overall: 0.4 + (hash % 60) / 100,
  };
};

export const analyzeImageSentiment = (uri: string, filename: string): ImageSentiment => {
  const hash = hashString(filename + '_sentiment');
  const total = 100;
  const positive = 20 + (hash % 60);
  const negative = 5 + (hash % 20);
  const neutral = total - positive - negative;
  return {
    positive: positive / 100,
    negative: negative / 100,
    neutral: Math.max(0, neutral) / 100,
  };
};

export const extractDominantColors = (uri: string, filename: string): string[] => {
  const hash = hashString(filename + '_colors');
  const colorCount = 3 + (hash % 3);
  const colors: string[] = [];
  for (let i = 0; i < colorCount; i++) {
    colors.push(COLOR_PALETTE[(hash + i * 3) % COLOR_PALETTE.length]);
  }
  return colors;
};

export const detectSceneType = (uri: string, filename: string): string => {
  const hash = hashString(filename + '_scene');
  return SCENE_TYPES[hash % SCENE_TYPES.length];
};

export const detectTextContent = (uri: string, filename: string): string[] => {
  const hash = hashString(filename + '_ocr');
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes('screenshot') || lowerFilename.includes('doc') || lowerFilename.includes('text')) {
    const textSamples = ['Settings', 'Home Screen', 'Messages', 'Search results', 'Notification'];
    const count = 1 + (hash % 3);
    return textSamples.slice(0, count);
  }
  return [];
};

export const calculateAestheticScore = (quality: ImageQuality, tags: AITag[]): number => {
  let score = quality.overall * 0.4;
  score += quality.sharpness * 0.2;
  score += quality.contrast * 0.15;
  score += (1 - quality.noise) * 0.1;
  const hasInterestingSubject = tags.some((t) =>
    ['portrait', 'sunset', 'landscape', 'flower', 'nature'].includes(t.label) && t.confidence > 0.7
  );
  if (hasInterestingSubject) score += 0.15;
  return Math.min(1, Math.max(0, score));
};

export const classifyImage = async (
  uri: string,
  filename: string
): Promise<AIClassification> => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  const tags: AITag[] = [];
  const hash = hashString(filename + uri);
  const lowerFilename = filename.toLowerCase();

  if (lowerFilename.includes('screenshot') || lowerFilename.includes('screen_shot')) {
    tags.push({ label: 'screenshot', confidence: 0.98 });
    tags.push({ label: 'ui', confidence: 0.85 });
    const textContent = detectTextContent(uri, filename);
    const quality = analyzeImageQuality(uri, filename);
    return {
      tags,
      category: AI_CATEGORIES.SCREENSHOTS,
      sceneType: 'indoor',
      dominantColors: extractDominantColors(uri, filename),
      faces: [],
      objectCount: 1,
      quality,
      sentiment: analyzeImageSentiment(uri, filename),
      textContent,
      isScreenshot: true,
      isDuplicate: false,
      duplicateHash: generatePerceptualHash(uri, filename),
      aestheticScore: calculateAestheticScore(quality, tags),
    };
  }

  if (lowerFilename.includes('img_') || lowerFilename.includes('photo_')) {
    tags.push({ label: 'photo', confidence: 0.9 });
  }

  if (lowerFilename.includes('selfie') || lowerFilename.includes('front')) {
    tags.push({ label: 'selfie', confidence: 0.92 });
    tags.push({ label: 'person', confidence: 0.88 });
    const faces = detectFaces(uri, filename);
    const quality = analyzeImageQuality(uri, filename);
    return {
      tags,
      category: AI_CATEGORIES.SELFIES,
      sceneType: 'portrait',
      dominantColors: extractDominantColors(uri, filename),
      faces,
      objectCount: 1 + faces.length,
      quality,
      sentiment: analyzeImageSentiment(uri, filename),
      textContent: [],
      isScreenshot: false,
      isDuplicate: false,
      duplicateHash: generatePerceptualHash(uri, filename),
      aestheticScore: calculateAestheticScore(quality, tags),
    };
  }

  const numLabels = 2 + (hash % 4);
  for (let i = 0; i < numLabels; i++) {
    const labelIndex = (hash + i * 7) % MOCK_LABELS.length;
    const confidence = 0.6 + ((hash + i) % 35) / 100;
    tags.push({
      label: MOCK_LABELS[labelIndex],
      confidence: Math.min(confidence, 0.99),
    });
  }

  const category = determineCategoryFromTags(tags);
  const faces = detectFaces(uri, filename);
  const quality = analyzeImageQuality(uri, filename);
  const sceneType = detectSceneType(uri, filename);
  const dominantColors = extractDominantColors(uri, filename);
  const sentiment = analyzeImageSentiment(uri, filename);
  const textContent = detectTextContent(uri, filename);

  return {
    tags,
    category,
    sceneType,
    dominantColors,
    faces,
    objectCount: tags.length,
    quality,
    sentiment,
    textContent,
    isScreenshot: false,
    isDuplicate: false,
    duplicateHash: generatePerceptualHash(uri, filename),
    aestheticScore: calculateAestheticScore(quality, tags),
  };
};

const determineCategoryFromTags = (tags: AITag[]): string => {
  const tagLabels = tags.map((t) => t.label.toLowerCase());

  for (const [category, labels] of Object.entries(AI_LABELS)) {
    const matchCount = tagLabels.filter((tag) =>
      (labels as string[]).some((label: string) => tag.includes(label) || label.includes(tag))
    ).length;
    if (matchCount > 0) {
      return category;
    }
  }

  return AI_CATEGORIES.OTHER;
};

export const batchClassify = async (
  items: Array<{ uri: string; filename: string }>,
  onProgress?: (processed: number, total: number) => void
): Promise<Map<string, AIClassification>> => {
  const results = new Map<string, AIClassification>();
  const chunkSize = 20;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map((item) => classifyImage(item.uri, item.filename))
    );

    chunk.forEach((item, index) => {
      results.set(item.uri, chunkResults[index]);
    });

    onProgress?.(Math.min(i + chunkSize, items.length), items.length);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return results;
};

export const searchByTag = (
  classifications: Map<string, AIClassification>,
  query: string
): string[] => {
  const lowerQuery = query.toLowerCase();
  const matchingUris: string[] = [];

  classifications.forEach((classification, uri) => {
    const hasMatch = classification.tags.some(
      (tag) =>
        tag.label.toLowerCase().includes(lowerQuery) &&
        tag.confidence > 0.5
    );
    if (hasMatch || classification.category.toLowerCase().includes(lowerQuery)) {
      matchingUris.push(uri);
    }
  });

  return matchingUris;
};

export const getSuggestedTags = (
  classifications: Map<string, AIClassification>
): string[] => {
  const tagCounts = new Map<string, number>();

  classifications.forEach((classification) => {
    classification.tags.forEach((tag) => {
      if (tag.confidence > 0.7) {
        const count = tagCounts.get(tag.label) || 0;
        tagCounts.set(tag.label, count + 1);
      }
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([label]) => label);
};

export const detectDuplicates = (
  items: MediaItem[],
  classifications: Map<string, AIClassification>
): DuplicateGroup[] => {
  const hashGroups = new Map<string, MediaItem[]>();

  items.forEach((item) => {
    const classification = classifications.get(item.uri);
    if (classification?.duplicateHash) {
      const truncatedHash = classification.duplicateHash.substring(0, 8);
      const group = hashGroups.get(truncatedHash) || [];
      group.push(item);
      hashGroups.set(truncatedHash, group);
    }
  });

  const duplicateGroups: DuplicateGroup[] = [];

  hashGroups.forEach((groupItems, hash) => {
    if (groupItems.length > 1) {
      const sorted = [...groupItems].sort((a, b) => {
        const qualityA = classifications.get(a.uri)?.quality?.overall ?? 0;
        const qualityB = classifications.get(b.uri)?.quality?.overall ?? 0;
        return qualityB - qualityA;
      });

      const totalSize = sorted.reduce((sum, item) => sum + (item.width * item.height * 3), 0);
      const bestSize = sorted[0].width * sorted[0].height * 3;

      duplicateGroups.push({
        id: 'dup-' + hash,
        items: sorted,
        bestItem: sorted[0],
        similarity: 0.85 + (hashString(hash) % 15) / 100,
        spaceSaved: totalSize - bestSize,
      });
    }
  });

  return duplicateGroups;
};

export const generateInsights = (
  items: MediaItem[],
  classifications: Map<string, AIClassification>
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const now = Date.now();

  const categoryCount = new Map<string, number>();
  classifications.forEach((c) => {
    const count = categoryCount.get(c.category) || 0;
    categoryCount.set(c.category, count + 1);
  });

  const topCategory = Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      id: 'insight-top-category',
      type: 'trend',
      title: 'You love ' + topCategory[0] + '!',
      description: topCategory[1] + ' of your photos are in the ' + topCategory[0] + ' category.',
      icon: 'trending-up',
      color: '#6C63FF',
      priority: 8,
      createdAt: now,
    });
  }

  let totalQuality = 0;
  let qualityCount = 0;
  classifications.forEach((c) => {
    if (c.quality) {
      totalQuality += c.quality.overall;
      qualityCount++;
    }
  });

  if (qualityCount > 0) {
    const avgQuality = totalQuality / qualityCount;
    insights.push({
      id: 'insight-quality',
      type: 'quality',
      title: avgQuality > 0.7 ? 'Great photo quality!' : 'Room for improvement',
      description: 'Your average photo quality score is ' + Math.round(avgQuality * 100) + '%.',
      icon: avgQuality > 0.7 ? 'star' : 'bulb',
      color: avgQuality > 0.7 ? '#FFD700' : '#FF9800',
      priority: 6,
      createdAt: now,
    });
  }

  let totalFaces = 0;
  classifications.forEach((c) => {
    totalFaces += c.faces?.length ?? 0;
  });

  if (totalFaces > 0) {
    insights.push({
      id: 'insight-faces',
      type: 'suggestion',
      title: totalFaces + ' faces detected',
      description: 'AI has detected ' + totalFaces + ' faces across your photos.',
      icon: 'people',
      color: '#FF6B9D',
      priority: 7,
      createdAt: now,
    });
  }

  const totalSize = items.reduce((sum, item) => sum + (item.width * item.height * 3), 0);
  const sizeInMB = totalSize / (1024 * 1024);

  insights.push({
    id: 'insight-storage',
    type: 'storage',
    title: 'Storage overview',
    description: 'Your gallery uses approximately ' + Math.round(sizeInMB) + ' MB of storage across ' + items.length + ' items.',
    icon: 'pie-chart',
    color: '#2196F3',
    priority: 5,
    createdAt: now,
  });

  if (items.length > 10) {
    insights.push({
      id: 'insight-streak',
      type: 'achievement',
      title: items.length + '+ photos collected!',
      description: 'You have built an impressive gallery with ' + items.length + ' photos and videos.',
      icon: 'trophy',
      color: '#FFD700',
      priority: 4,
      createdAt: now,
    });
  }

  const duplicates = detectDuplicates(items, classifications);
  if (duplicates.length > 0) {
    const totalDuplicates = duplicates.reduce((sum, g) => sum + g.items.length - 1, 0);
    insights.push({
      id: 'insight-duplicates',
      type: 'duplicate',
      title: totalDuplicates + ' potential duplicates found',
      description: 'We found ' + duplicates.length + ' groups of similar photos.',
      icon: 'copy',
      color: '#FF5722',
      actionLabel: 'Review Duplicates',
      priority: 9,
      createdAt: now,
    });
  }

  const photosByHour = new Map<number, number>();
  items.forEach((item) => {
    const hour = new Date(item.creationTime).getHours();
    photosByHour.set(hour, (photosByHour.get(hour) || 0) + 1);
  });

  const peakHour = Array.from(photosByHour.entries()).sort((a, b) => b[1] - a[1])[0];
  if (peakHour) {
    const hourStr = peakHour[0] < 12
      ? (peakHour[0] || 12) + ' AM'
      : (peakHour[0] === 12 ? 12 : peakHour[0] - 12) + ' PM';
    insights.push({
      id: 'insight-peak-time',
      type: 'trend',
      title: 'Peak photography hour: ' + hourStr,
      description: 'You take most of your photos around ' + hourStr + '.',
      icon: 'time',
      color: '#00BCD4',
      priority: 3,
      createdAt: now,
    });
  }

  return insights.sort((a, b) => b.priority - a.priority);
};

export const generateMemories = (items: MediaItem[]): PhotoMemory[] => {
  const memories: PhotoMemory[] = [];
  const now = new Date();

  const todayMonth = now.getMonth();
  const todayDate = now.getDate();
  const onThisDayItems = items.filter((item) => {
    const d = new Date(item.creationTime);
    return d.getMonth() === todayMonth && d.getDate() === todayDate && d.getFullYear() < now.getFullYear();
  });

  if (onThisDayItems.length > 0) {
    memories.push({
      id: 'memory-on-this-day',
      title: 'On This Day',
      subtitle: onThisDayItems.length + ' memories from past years',
      items: onThisDayItems,
      coverUri: onThisDayItems[0].uri,
      type: 'onThisDay',
      date: now.getTime(),
      color: '#6C63FF',
      icon: 'calendar',
    });
  }

  const recentItems = items
    .filter((item) => now.getTime() - item.creationTime < 7 * 24 * 60 * 60 * 1000)
    .slice(0, 20);

  if (recentItems.length > 3) {
    memories.push({
      id: 'memory-recent-highlights',
      title: 'Recent Highlights',
      subtitle: 'Best of the last 7 days',
      items: recentItems,
      coverUri: recentItems[0].uri,
      type: 'recentHighlights',
      date: now.getTime(),
      color: '#FF6B9D',
      icon: 'sparkles',
    });
  }

  const monthGroups = new Map<string, MediaItem[]>();
  items.forEach((item) => {
    const d = new Date(item.creationTime);
    const key = d.getFullYear() + '-' + d.getMonth();
    const group = monthGroups.get(key) || [];
    group.push(item);
    monthGroups.set(key, group);
  });

  monthGroups.forEach((monthItems, key) => {
    if (monthItems.length >= 10) {
      const parts = key.split('-').map(Number);
      const year = parts[0];
      const month = parts[1];
      const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const bestItems = monthItems.slice(0, 15);
      memories.push({
        id: 'memory-best-of-' + key,
        title: 'Best of ' + monthName,
        subtitle: monthItems.length + ' photos',
        items: bestItems,
        coverUri: bestItems[0].uri,
        type: 'bestOf',
        date: new Date(year, month).getTime(),
        color: '#4CAF50',
        icon: 'star',
      });
    }
  });

  return memories.slice(0, 10);
};

export const getSmartSuggestions = (
  items: MediaItem[],
  classifications: Map<string, AIClassification>
): string[] => {
  const suggestions: string[] = [];

  if (items.length > 100) {
    suggestions.push('Create albums to organize your growing collection');
  }

  const screenshotCount = items.filter((i) => i.aiCategory === AI_CATEGORIES.SCREENSHOTS).length;
  if (screenshotCount > 20) {
    suggestions.push('You have ' + screenshotCount + ' screenshots. Consider cleaning them up.');
  }

  let blurryCount = 0;
  classifications.forEach((c) => {
    if (c.quality && c.quality.sharpness < 0.4) blurryCount++;
  });
  if (blurryCount > 5) {
    suggestions.push(blurryCount + ' photos appear blurry. Review and delete to save space.');
  }

  const hasFavorites = items.some((i) => i.isFavorite);
  if (!hasFavorites && items.length > 10) {
    suggestions.push('Start marking your favorite photos for easy access');
  }

  suggestions.push('Enable cloud backup to keep your memories safe');
  return suggestions;
};
