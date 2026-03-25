/**
 * Simple in-memory LRU cache for thumbnails and AI results.
 * Prevents memory crashes by evicting old entries.
 */

interface CacheEntry<T> {
  value: T;
  lastAccessed: number;
}

export class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;

  constructor(maxSize: number = 500) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastAccessed = Date.now();
      return entry.value;
    }
    return undefined;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }
    this.cache.set(key, { value, lastAccessed: Date.now() });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  private evict(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// Global cache instances
export const thumbnailCache = new LRUCache<string>(1000);
export const classificationCache = new LRUCache<{
  tags: string[];
  category: string;
}>(2000);
