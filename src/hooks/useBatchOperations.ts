import { useState, useCallback } from 'react';
import type { MediaItem, BatchOperation } from '../types';
import { useUIStore } from '../store/uiStore';

export const useBatchOperations = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const { setBatchOperation, updateBatchProgress, addToast } = useUIStore();

  const enterSelectionMode = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  }, []);

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((items: MediaItem[]) => {
    setSelectedItems(new Set(items.map((i) => i.id)));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedItems.has(id);
  }, [selectedItems]);

  const runBatchOperation = useCallback(async (
    type: string,
    items: MediaItem[],
    processor: (item: MediaItem, index: number) => Promise<void>
  ) => {
    const operation: BatchOperation = {
      id: 'batch-' + Date.now(),
      type: type as BatchOperation['type'],
      itemCount: items.length,
      progress: 0,
      status: 'running',
      startedAt: Date.now(),
    };

    setBatchOperation(operation);

    try {
      for (let i = 0; i < items.length; i++) {
        await processor(items[i], i);
        updateBatchProgress(i + 1);
      }

      addToast({
        type: 'success',
        message: type + ' completed for ' + items.length + ' items',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to ' + type + ' some items',
        duration: 5000,
      });
    } finally {
      setTimeout(() => setBatchOperation(null), 2000);
    }
  }, [setBatchOperation, updateBatchProgress, addToast]);

  return {
    selectedItems,
    selectedCount: selectedItems.size,
    isSelectionMode,
    enterSelectionMode,
    exitSelectionMode,
    toggleItem,
    selectAll,
    deselectAll,
    isSelected,
    runBatchOperation,
  };
};
