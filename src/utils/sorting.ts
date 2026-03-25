import type { MediaItem, SortOrder, SortField, SortDirection, TimelineSection } from '../types';

export const sortItems = (
  items: MediaItem[],
  field: SortField,
  direction: SortDirection
): MediaItem[] => {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'date':
        comparison = a.creationTime - b.creationTime;
        break;
      case 'name':
        comparison = a.filename.localeCompare(b.filename);
        break;
      case 'size':
        comparison = (a.width * a.height) - (b.width * b.height);
        break;
      case 'type':
        comparison = a.mediaType.localeCompare(b.mediaType);
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'category':
        comparison = (a.aiCategory || '').localeCompare(b.aiCategory || '');
        break;
      default:
        comparison = a.creationTime - b.creationTime;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

export const applySortOrder = (items: MediaItem[], sortOrder: SortOrder): MediaItem[] => {
  return sortItems(items, sortOrder.field, sortOrder.direction);
};

export const groupByDate = (items: MediaItem[]): Map<string, MediaItem[]> => {
  const groups = new Map<string, MediaItem[]>();

  items.forEach((item) => {
    const date = new Date(item.creationTime);
    const key = date.toISOString().split('T')[0];
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  });

  return groups;
};

export const groupByMonth = (items: MediaItem[]): Map<string, MediaItem[]> => {
  const groups = new Map<string, MediaItem[]>();

  items.forEach((item) => {
    const date = new Date(item.creationTime);
    const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  });

  return groups;
};

export const groupByYear = (items: MediaItem[]): Map<string, MediaItem[]> => {
  const groups = new Map<string, MediaItem[]>();

  items.forEach((item) => {
    const date = new Date(item.creationTime);
    const key = String(date.getFullYear());
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  });

  return groups;
};

export const groupByCategory = (items: MediaItem[]): Map<string, MediaItem[]> => {
  const groups = new Map<string, MediaItem[]>();

  items.forEach((item) => {
    const category = item.aiCategory || 'OTHER';
    const group = groups.get(category) || [];
    group.push(item);
    groups.set(category, group);
  });

  return groups;
};

export const createTimelineSections = (items: MediaItem[]): TimelineSection[] => {
  const grouped = groupByDate(items);
  const sections: TimelineSection[] = [];

  grouped.forEach((groupItems, dateKey) => {
    const date = new Date(dateKey);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let title: string;
    if (isToday) {
      title = 'Today';
    } else if (isYesterday) {
      title = 'Yesterday';
    } else if (date.getFullYear() === now.getFullYear()) {
      title = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    } else {
      title = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    sections.push({
      date: dateKey,
      title,
      items: groupItems,
      itemCount: groupItems.length,
    });
  });

  return sections.sort((a, b) => b.date.localeCompare(a.date));
};

export const filterByDateRange = (
  items: MediaItem[],
  startDate: number,
  endDate: number
): MediaItem[] => {
  return items.filter((item) => item.creationTime >= startDate && item.creationTime <= endDate);
};

export const filterByMediaType = (
  items: MediaItem[],
  type: 'photo' | 'video' | 'all'
): MediaItem[] => {
  if (type === 'all') return items;
  return items.filter((item) => item.mediaType === type);
};

export const filterByCategory = (
  items: MediaItem[],
  categories: string[]
): MediaItem[] => {
  if (categories.length === 0) return items;
  return items.filter((item) => categories.includes(item.aiCategory || 'OTHER'));
};

export const filterFavorites = (items: MediaItem[]): MediaItem[] => {
  return items.filter((item) => item.isFavorite);
};

export const searchItems = (items: MediaItem[], query: string): MediaItem[] => {
  const lowerQuery = query.toLowerCase();
  return items.filter((item) => {
    if (item.filename.toLowerCase().includes(lowerQuery)) return true;
    if (item.aiCategory?.toLowerCase().includes(lowerQuery)) return true;
    if (item.aiTags?.some((tag) => tag.label.toLowerCase().includes(lowerQuery))) return true;
    return false;
  });
};
