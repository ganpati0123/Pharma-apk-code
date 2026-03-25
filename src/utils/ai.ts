import type { AIClassification, AITag } from '../types';
import { AI_LABELS, AI_CATEGORIES } from '../constants/categories';

/**
 * Mock AI classification engine.
 * In production, this would integrate with TensorFlow.js or ML Kit.
 * The structure supports drop-in replacement with real ML models.
 */

// Simulated label database for mock classification
const MOCK_LABELS: string[] = [
  'person', 'face', 'portrait', 'landscape', 'mountain', 'ocean',
  'food', 'meal', 'dog', 'cat', 'car', 'building', 'city',
  'sunset', 'beach', 'flower', 'tree', 'sky', 'selfie',
  'document', 'screenshot', 'text', 'nature', 'garden',
  'restaurant', 'cooking', 'bird', 'fish', 'bridge',
  'house', 'interior', 'bicycle', 'boat', 'cake', 'fruit',
];

/**
 * Generate a deterministic hash from a string.
 * Used for consistent mock AI results per image.
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Mock image classification.
 * Uses filename hashing for deterministic, consistent results.
 * Replace this function body with real ML inference for production.
 */
export const classifyImage = async (
  uri: string,
  filename: string
): Promise<AIClassification> => {
  // Simulate processing delay (would be real inference time)
  await new Promise((resolve) => setTimeout(resolve, 10));

  const tags: AITag[] = [];
  const hash = hashString(filename + uri);
  const lowerFilename = filename.toLowerCase();

  // Rule-based classification from filename
  if (lowerFilename.includes('screenshot') || lowerFilename.includes('screen_shot')) {
    tags.push({ label: 'screenshot', confidence: 0.98 });
    tags.push({ label: 'ui', confidence: 0.85 });
    return { tags, category: AI_CATEGORIES.SCREENSHOTS };
  }

  if (lowerFilename.includes('img_') || lowerFilename.includes('photo_')) {
    tags.push({ label: 'photo', confidence: 0.9 });
  }

  if (lowerFilename.includes('selfie') || lowerFilename.includes('front')) {
    tags.push({ label: 'selfie', confidence: 0.92 });
    tags.push({ label: 'person', confidence: 0.88 });
    return { tags, category: AI_CATEGORIES.SELFIES };
  }

  // Generate deterministic mock labels based on hash
  const numLabels = 2 + (hash % 3); // 2-4 labels per image
  for (let i = 0; i < numLabels; i++) {
    const labelIndex = (hash + i * 7) % MOCK_LABELS.length;
    const confidence = 0.6 + ((hash + i) % 35) / 100; // 0.60-0.95
    tags.push({
      label: MOCK_LABELS[labelIndex],
      confidence: Math.min(confidence, 0.99),
    });
  }

  // Determine category from tags
  const category = determineCategoryFromTags(tags);

  return { tags, category };
};

/**
 * Determine the AI category based on classified tags.
 */
const determineCategoryFromTags = (tags: AITag[]): string => {
  const tagLabels = tags.map((t) => t.label.toLowerCase());

  for (const [category, labels] of Object.entries(AI_LABELS)) {
    const matchCount = tagLabels.filter((tag) =>
      labels.some((label) => tag.includes(label) || label.includes(tag))
    ).length;
    if (matchCount > 0) {
      return category;
    }
  }

  return AI_CATEGORIES.OTHER;
};

/**
 * Batch classify multiple images.
 * Processes in chunks to avoid blocking the UI thread.
 */
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

    // Yield to UI thread between chunks
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return results;
};

/**
 * Search for images matching a tag query.
 */
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

/**
 * Get suggested search tags based on classified images.
 */
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
