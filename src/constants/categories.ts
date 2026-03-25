export const AI_CATEGORIES = {
  PEOPLE: 'People',
  NATURE: 'Nature',
  SCREENSHOTS: 'Screenshots',
  FOOD: 'Food',
  ANIMALS: 'Animals',
  ARCHITECTURE: 'Architecture',
  VEHICLES: 'Vehicles',
  DOCUMENTS: 'Documents',
  SELFIES: 'Selfies',
  OTHER: 'Other',
} as const;

export const AI_LABELS: Record<string, string[]> = {
  [AI_CATEGORIES.PEOPLE]: ['person', 'face', 'portrait', 'group', 'selfie', 'people', 'human'],
  [AI_CATEGORIES.NATURE]: ['landscape', 'mountain', 'ocean', 'forest', 'sky', 'sunset', 'sunrise', 'beach', 'flower', 'tree', 'lake', 'river', 'nature', 'garden'],
  [AI_CATEGORIES.SCREENSHOTS]: ['screenshot', 'screen', 'ui', 'text', 'interface'],
  [AI_CATEGORIES.FOOD]: ['food', 'meal', 'dish', 'restaurant', 'cooking', 'cake', 'fruit', 'vegetable'],
  [AI_CATEGORIES.ANIMALS]: ['dog', 'cat', 'bird', 'fish', 'animal', 'pet', 'wildlife'],
  [AI_CATEGORIES.ARCHITECTURE]: ['building', 'house', 'city', 'bridge', 'tower', 'interior', 'room', 'architecture'],
  [AI_CATEGORIES.VEHICLES]: ['car', 'bus', 'train', 'airplane', 'bicycle', 'motorcycle', 'boat', 'vehicle'],
  [AI_CATEGORIES.DOCUMENTS]: ['document', 'paper', 'receipt', 'card', 'letter', 'book', 'whiteboard'],
  [AI_CATEGORIES.SELFIES]: ['selfie', 'mirror', 'front_camera'],
};

export const CATEGORY_ICONS: Record<string, string> = {
  [AI_CATEGORIES.PEOPLE]: 'people',
  [AI_CATEGORIES.NATURE]: 'leaf',
  [AI_CATEGORIES.SCREENSHOTS]: 'phone-portrait',
  [AI_CATEGORIES.FOOD]: 'restaurant',
  [AI_CATEGORIES.ANIMALS]: 'paw',
  [AI_CATEGORIES.ARCHITECTURE]: 'business',
  [AI_CATEGORIES.VEHICLES]: 'car',
  [AI_CATEGORIES.DOCUMENTS]: 'document-text',
  [AI_CATEGORIES.SELFIES]: 'camera',
  [AI_CATEGORIES.OTHER]: 'images',
};
