# AI Gallery App

A high-end, AI-integrated mobile gallery application built with React Native and Expo. Features intelligent photo organization, smart search, and a polished modern UI.

## Features

- **Smart Gallery** — Fast grid layout with virtualized scrolling for 10k+ images
- **AI Classification** — Automatic image tagging and categorization (People, Nature, Food, etc.)
- **Intelligent Search** — Search by filename, date, AI tags, or category
- **Album System** — Auto albums (Screenshots, Camera, Downloads), AI albums, date groups, and custom albums
- **Fullscreen Viewer** — Swipe navigation with pinch-to-zoom using react-native-gesture-handler + reanimated
- **Image Editor** — Rotate, flip, and apply filters
- **Dark Mode** — Full dark/light/system theme support
- **Performance Optimized** — FlatList virtualization, LRU caching, lazy loading, and thumbnail-first loading

## Tech Stack

- React Native + Expo SDK 52
- TypeScript
- Expo Router (file-based navigation)
- Zustand (state management)
- expo-image (high-performance image rendering)
- react-native-gesture-handler + react-native-reanimated (gestures & animations)
- expo-media-library (device media access)
- expo-image-manipulator (image editing)

## Getting Started

```bash
npm install
npx expo start
```

## Project Structure

```
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Gallery tab
│   ├── albums.tsx          # Albums tab
│   ├── search.tsx          # Search tab
│   └── settings.tsx        # Settings tab
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AIProcessingBanner.tsx
│   │   ├── AlbumCard.tsx
│   │   ├── FilterChips.tsx
│   │   ├── FullscreenViewer.tsx
│   │   ├── ImageEditor.tsx
│   │   ├── MediaGrid.tsx
│   │   ├── MediaThumbnail.tsx
│   │   ├── PermissionRequest.tsx
│   │   ├── SearchBar.tsx
│   │   └── SelectionHeader.tsx
│   ├── constants/          # Theme colors, AI categories
│   ├── hooks/              # Custom React hooks
│   │   ├── useAI.ts
│   │   ├── useMediaLibrary.ts
│   │   ├── usePermissions.ts
│   │   └── useSearch.ts
│   ├── screens/            # Screen components
│   │   ├── AlbumsScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/              # Zustand state stores
│   │   ├── albumStore.ts
│   │   ├── mediaStore.ts
│   │   ├── searchStore.ts
│   │   └── settingsStore.ts
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
│       ├── ai.ts           # AI classification engine (mock, production-ready structure)
│       ├── cache.ts        # LRU cache implementation
│       ├── dateHelpers.ts  # Date formatting utilities
│       └── imageEditor.ts  # Image manipulation helpers
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## AI Integration

The AI classification system uses a mock engine with deterministic results based on filename hashing. The architecture is designed for drop-in replacement with real ML models:

- Replace `src/utils/ai.ts` → `classifyImage()` with TensorFlow.js or ML Kit inference
- The `batchClassify()` function processes images in chunks to avoid UI thread blocking
- Classification results are cached in an LRU cache to prevent redundant processing

## Performance

- **FlatList virtualization** with `windowSize`, `maxToRenderPerBatch`, and `removeClippedSubviews`
- **expo-image** with memory-disk caching and recycling keys
- **LRU cache** (configurable size) prevents memory crashes on large libraries
- **Pagination** loads 100 items per page with infinite scroll
- **Debounced search** (300ms) for real-time filtering
