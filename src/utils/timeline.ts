import type { MediaItem, TimelineEvent, TimelineSection } from '../types';

export const generateTimelineEvents = (items: MediaItem[]): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const sorted = [...items].sort((a, b) => a.creationTime - b.creationTime);

  if (sorted.length === 0) return events;

  // First photo event
  events.push({
    id: 'event-first-photo',
    type: 'milestone',
    title: 'First Photo',
    description: 'Your gallery journey began!',
    date: sorted[0].creationTime,
    icon: 'camera',
    color: '#6C63FF',
  });

  // Milestone events
  const milestones = [10, 50, 100, 500, 1000, 5000];
  milestones.forEach((count) => {
    if (sorted.length >= count) {
      events.push({
        id: 'event-milestone-' + count,
        type: 'milestone',
        title: count + ' Photos!',
        description: 'You reached ' + count + ' photos in your gallery.',
        date: sorted[count - 1].creationTime,
        icon: 'trophy',
        color: '#FFD700',
      });
    }
  });

  // Monthly summary events
  const monthGroups = new Map<string, MediaItem[]>();
  sorted.forEach((item) => {
    const d = new Date(item.creationTime);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const group = monthGroups.get(key) || [];
    group.push(item);
    monthGroups.set(key, group);
  });

  monthGroups.forEach((monthItems, key) => {
    const parts = key.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    events.push({
      id: 'event-month-' + key,
      type: 'summary',
      title: monthName,
      description: monthItems.length + ' photos captured this month.',
      date: new Date(year, month, 15).getTime(),
      icon: 'calendar',
      color: '#4CAF50',
      metadata: {
        count: monthItems.length,
        coverUri: monthItems[0].uri,
      },
    });
  });

  // Burst events (many photos in short time)
  for (let i = 0; i < sorted.length - 5; i++) {
    const timeSpan = sorted[i + 5].creationTime - sorted[i].creationTime;
    if (timeSpan < 60 * 60 * 1000) { // 6+ photos in 1 hour
      events.push({
        id: 'event-burst-' + i,
        type: 'burst',
        title: 'Photo Burst',
        description: 'You took multiple photos in a short time!',
        date: sorted[i].creationTime,
        icon: 'flash',
        color: '#FF9800',
      });
      i += 5; // Skip ahead to avoid duplicate burst events
    }
  }

  return events.sort((a, b) => b.date - a.date);
};

export const getTimelineRange = (items: MediaItem[]): { start: number; end: number } => {
  if (items.length === 0) {
    return { start: Date.now(), end: Date.now() };
  }

  const dates = items.map((i) => i.creationTime);
  return {
    start: Math.min(...dates),
    end: Math.max(...dates),
  };
};

export const getPhotosPerDay = (items: MediaItem[]): Map<string, number> => {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const date = new Date(item.creationTime).toISOString().split('T')[0];
    counts.set(date, (counts.get(date) || 0) + 1);
  });

  return counts;
};

export const getPhotosPerMonth = (items: MediaItem[]): Map<string, number> => {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const d = new Date(item.creationTime);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return counts;
};

export const getMostActiveDay = (items: MediaItem[]): { date: string; count: number } | null => {
  const perDay = getPhotosPerDay(items);
  let maxDay: string | null = null;
  let maxCount = 0;

  perDay.forEach((count, date) => {
    if (count > maxCount) {
      maxCount = count;
      maxDay = date;
    }
  });

  return maxDay ? { date: maxDay, count: maxCount } : null;
};

export const getLongestStreak = (items: MediaItem[]): number => {
  const perDay = getPhotosPerDay(items);
  const sortedDays = Array.from(perDay.keys()).sort();

  let maxStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
  }

  return maxStreak;
};

export const getWeekdayDistribution = (items: MediaItem[]): number[] => {
  const distribution = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

  items.forEach((item) => {
    const day = new Date(item.creationTime).getDay();
    distribution[day]++;
  });

  return distribution;
};

export const getHourlyDistribution = (items: MediaItem[]): number[] => {
  const distribution = new Array(24).fill(0);

  items.forEach((item) => {
    const hour = new Date(item.creationTime).getHours();
    distribution[hour]++;
  });

  return distribution;
};
