import { useState, useCallback, useRef } from 'react';
import type { MediaItem } from '../types';
import { batchClassify, getSuggestedTags } from '../utils/ai';
import { classificationCache } from '../utils/cache';
import type { AIClassification } from '../types';

interface AIState {
  isProcessing: boolean;
  progress: number;
  totalToProcess: number;
  suggestedTags: string[];
  processAssets: (assets: MediaItem[]) => Promise<MediaItem[]>;
  getTagsForAsset: (uri: string) => string[];
  getCategoryForAsset: (uri: string) => string | undefined;
}

export const useAI = (): AIState => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const classificationsRef = useRef(new Map<string, AIClassification>());

  const processAssets = useCallback(
    async (assets: MediaItem[]): Promise<MediaItem[]> => {
      // Skip already classified assets
      const unprocessed = assets.filter(
        (a) => !classificationCache.has(a.uri)
      );

      if (unprocessed.length === 0) {
        return assets.map((asset) => {
          const cached = classificationCache.get(asset.uri);
          return {
            ...asset,
            aiTags: cached?.tags || [],
            aiCategory: cached?.category,
          };
        });
      }

      setIsProcessing(true);
      setTotalToProcess(unprocessed.length);
      setProgress(0);

      try {
        const results = await batchClassify(
          unprocessed.map((a) => ({ uri: a.uri, filename: a.filename })),
          (processed, total) => {
            setProgress(processed);
            setTotalToProcess(total);
          }
        );

        // Cache results
        results.forEach((classification, uri) => {
          classificationCache.set(uri, {
            tags: classification.tags.map((t) => t.label),
            category: classification.category,
          });
          classificationsRef.current.set(uri, classification);
        });

        // Update suggested tags
        const tags = getSuggestedTags(classificationsRef.current);
        setSuggestedTags(tags);

        // Return updated assets
        return assets.map((asset) => {
          const cached = classificationCache.get(asset.uri);
          return {
            ...asset,
            aiTags: cached?.tags || [],
            aiCategory: cached?.category,
          };
        });
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const getTagsForAsset = useCallback((uri: string): string[] => {
    return classificationCache.get(uri)?.tags || [];
  }, []);

  const getCategoryForAsset = useCallback(
    (uri: string): string | undefined => {
      return classificationCache.get(uri)?.category;
    },
    []
  );

  return {
    isProcessing,
    progress,
    totalToProcess,
    suggestedTags,
    processAssets,
    getTagsForAsset,
    getCategoryForAsset,
  };
};
