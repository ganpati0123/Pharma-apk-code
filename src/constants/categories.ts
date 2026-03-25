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
  TRAVEL: 'Travel',
  SPORTS: 'Sports',
  ART: 'Art & Design',
  NIGHTLIFE: 'Night & Low Light',
  PANORAMA: 'Panoramas',
  MEMES: 'Memes & Fun',
  OTHER: 'Other',
} as const;

export const AI_LABELS: Record<string, string[]> = {
  [AI_CATEGORIES.PEOPLE]: ['person', 'face', 'portrait', 'group', 'selfie', 'people', 'human', 'crowd', 'family', 'friends'],
  [AI_CATEGORIES.NATURE]: ['landscape', 'mountain', 'ocean', 'forest', 'sky', 'sunset', 'sunrise', 'beach', 'flower', 'tree', 'lake', 'river', 'nature', 'garden', 'waterfall', 'desert', 'snow', 'rain', 'cloud'],
  [AI_CATEGORIES.SCREENSHOTS]: ['screenshot', 'screen', 'ui', 'text', 'interface', 'notification', 'chat'],
  [AI_CATEGORIES.FOOD]: ['food', 'meal', 'dish', 'restaurant', 'cooking', 'cake', 'fruit', 'vegetable', 'coffee', 'drink', 'dessert', 'pizza', 'burger'],
  [AI_CATEGORIES.ANIMALS]: ['dog', 'cat', 'bird', 'fish', 'animal', 'pet', 'wildlife', 'horse', 'butterfly', 'insect', 'rabbit'],
  [AI_CATEGORIES.ARCHITECTURE]: ['building', 'house', 'city', 'bridge', 'tower', 'interior', 'room', 'architecture', 'monument', 'church', 'temple', 'mosque', 'castle'],
  [AI_CATEGORIES.VEHICLES]: ['car', 'bus', 'train', 'airplane', 'bicycle', 'motorcycle', 'boat', 'vehicle', 'truck', 'helicopter', 'ship'],
  [AI_CATEGORIES.DOCUMENTS]: ['document', 'paper', 'receipt', 'card', 'letter', 'book', 'whiteboard', 'note', 'handwriting', 'certificate'],
  [AI_CATEGORIES.SELFIES]: ['selfie', 'mirror', 'front_camera'],
  [AI_CATEGORIES.TRAVEL]: ['travel', 'airport', 'hotel', 'landmark', 'tourist', 'vacation', 'passport', 'luggage', 'map'],
  [AI_CATEGORIES.SPORTS]: ['sport', 'gym', 'fitness', 'running', 'swimming', 'football', 'basketball', 'tennis', 'yoga', 'hiking'],
  [AI_CATEGORIES.ART]: ['art', 'painting', 'drawing', 'sketch', 'design', 'graffiti', 'sculpture', 'illustration', 'craft'],
  [AI_CATEGORIES.NIGHTLIFE]: ['night', 'dark', 'neon', 'party', 'club', 'concert', 'fireworks', 'stars', 'moon'],
  [AI_CATEGORIES.PANORAMA]: ['panorama', 'wide', 'landscape_wide', 'vista', 'horizon'],
  [AI_CATEGORIES.MEMES]: ['meme', 'funny', 'comic', 'cartoon', 'sticker', 'emoji'],
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
  [AI_CATEGORIES.TRAVEL]: 'airplane',
  [AI_CATEGORIES.SPORTS]: 'fitness',
  [AI_CATEGORIES.ART]: 'color-palette',
  [AI_CATEGORIES.NIGHTLIFE]: 'moon',
  [AI_CATEGORIES.PANORAMA]: 'resize',
  [AI_CATEGORIES.MEMES]: 'happy',
  [AI_CATEGORIES.OTHER]: 'images',
};

export const CATEGORY_COLORS: Record<string, string> = {
  [AI_CATEGORIES.PEOPLE]: '#FF6B9D',
  [AI_CATEGORIES.NATURE]: '#4CAF50',
  [AI_CATEGORIES.SCREENSHOTS]: '#2196F3',
  [AI_CATEGORIES.FOOD]: '#FF9800',
  [AI_CATEGORIES.ANIMALS]: '#8BC34A',
  [AI_CATEGORIES.ARCHITECTURE]: '#607D8B',
  [AI_CATEGORIES.VEHICLES]: '#F44336',
  [AI_CATEGORIES.DOCUMENTS]: '#795548',
  [AI_CATEGORIES.SELFIES]: '#E91E63',
  [AI_CATEGORIES.TRAVEL]: '#00BCD4',
  [AI_CATEGORIES.SPORTS]: '#FF5722',
  [AI_CATEGORIES.ART]: '#9C27B0',
  [AI_CATEGORIES.NIGHTLIFE]: '#3F51B5',
  [AI_CATEGORIES.PANORAMA]: '#009688',
  [AI_CATEGORIES.MEMES]: '#FFEB3B',
  [AI_CATEGORIES.OTHER]: '#9E9E9E',
};

export const SCENE_TYPES = [
  'indoor', 'outdoor', 'portrait', 'landscape', 'macro',
  'aerial', 'underwater', 'night', 'golden_hour', 'studio',
  'street', 'candid', 'action', 'still_life', 'abstract',
] as const;

export const EMOTION_LABELS: Record<string, string> = {
  happy: 'Happy',
  sad: 'Sad',
  neutral: 'Neutral',
  surprised: 'Surprised',
  angry: 'Angry',
  disgusted: 'Disgusted',
  fearful: 'Fearful',
};

export const QUALITY_LABELS = {
  excellent: { min: 0.8, label: 'Excellent', color: '#4CAF50' },
  good: { min: 0.6, label: 'Good', color: '#8BC34A' },
  average: { min: 0.4, label: 'Average', color: '#FF9800' },
  poor: { min: 0.2, label: 'Poor', color: '#FF5722' },
  bad: { min: 0, label: 'Bad', color: '#F44336' },
} as const;
