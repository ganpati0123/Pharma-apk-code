import { create } from 'zustand';
import type { EditorState, EditorAction, ImageAdjustments, CropRegion, CropPreset } from '../types';

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  sharpness: 0,
  highlights: 0,
  shadows: 0,
  vignette: 0,
  grain: 0,
  fade: 0,
  tint: 0,
  exposure: 0,
};

export const CROP_PRESETS: CropPreset[] = [
  { id: 'free', label: 'Free', icon: 'crop', aspectRatio: null },
  { id: 'square', label: '1:1', icon: 'square', aspectRatio: 1 },
  { id: '4:3', label: '4:3', icon: 'tablet-landscape', aspectRatio: 4 / 3 },
  { id: '3:4', label: '3:4', icon: 'tablet-portrait', aspectRatio: 3 / 4 },
  { id: '16:9', label: '16:9', icon: 'tv', aspectRatio: 16 / 9 },
  { id: '9:16', label: '9:16', icon: 'phone-portrait', aspectRatio: 9 / 16 },
  { id: '3:2', label: '3:2', icon: 'image', aspectRatio: 3 / 2 },
  { id: '2:3', label: '2:3', icon: 'image-outline', aspectRatio: 2 / 3 },
  { id: '5:4', label: '5:4', icon: 'albums', aspectRatio: 5 / 4 },
  { id: 'golden', label: 'Golden', icon: 'star', aspectRatio: 1.618 },
];

export const FILTER_PRESETS = [
  { id: 'none', label: 'Original', intensity: 0 },
  { id: 'vivid', label: 'Vivid', intensity: 0.8 },
  { id: 'dramatic', label: 'Dramatic', intensity: 0.7 },
  { id: 'mono', label: 'Mono', intensity: 1.0 },
  { id: 'silvertone', label: 'Silvertone', intensity: 0.6 },
  { id: 'noir', label: 'Noir', intensity: 0.9 },
  { id: 'fade', label: 'Fade', intensity: 0.5 },
  { id: 'chrome', label: 'Chrome', intensity: 0.7 },
  { id: 'process', label: 'Process', intensity: 0.6 },
  { id: 'transfer', label: 'Transfer', intensity: 0.8 },
  { id: 'instant', label: 'Instant', intensity: 0.7 },
  { id: 'tonal', label: 'Tonal', intensity: 0.5 },
  { id: 'sepia', label: 'Sepia', intensity: 0.6 },
  { id: 'vintage', label: 'Vintage', intensity: 0.7 },
  { id: 'cool', label: 'Cool', intensity: 0.5 },
  { id: 'warm', label: 'Warm', intensity: 0.5 },
  { id: 'cinematic', label: 'Cinematic', intensity: 0.8 },
  { id: 'retro', label: 'Retro', intensity: 0.7 },
] as const;

interface EditorStoreState {
  editorState: EditorState | null;
  isEditing: boolean;
  activeTab: 'filters' | 'adjust' | 'crop' | 'tools';
  compareMode: boolean;
  historyIndex: number;

  initializeEditor: (uri: string) => void;
  closeEditor: () => void;
  setActiveTab: (tab: 'filters' | 'adjust' | 'crop' | 'tools') => void;
  setFilter: (filter: string) => void;
  setRotation: (rotation: number) => void;
  toggleFlipHorizontal: () => void;
  toggleFlipVertical: () => void;
  setCropRegion: (region: CropRegion | undefined) => void;
  setActivePreset: (preset: CropPreset | undefined) => void;
  setAdjustment: (key: keyof ImageAdjustments, value: number) => void;
  resetAdjustments: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  resetAll: () => void;
  toggleCompareMode: () => void;
  updateUri: (uri: string) => void;
  pushUndoAction: (action: EditorAction) => void;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  editorState: null,
  isEditing: false,
  activeTab: 'filters',
  compareMode: false,
  historyIndex: -1,

  initializeEditor: (uri: string) => {
    set({
      editorState: {
        uri,
        originalUri: uri,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        filter: 'none',
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        overlays: [],
        undoStack: [],
        redoStack: [],
        isDirty: false,
      },
      isEditing: true,
      activeTab: 'filters',
      compareMode: false,
      historyIndex: -1,
    });
  },

  closeEditor: () => {
    set({
      editorState: null,
      isEditing: false,
    });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setFilter: (filter: string) => {
    const state = get().editorState;
    if (!state) return;

    const action: EditorAction = {
      type: 'filter',
      timestamp: Date.now(),
      previousState: { filter: state.filter },
      description: `Applied ${filter} filter`,
    };

    set({
      editorState: {
        ...state,
        filter,
        isDirty: true,
        undoStack: [...state.undoStack, action],
        redoStack: [],
      },
    });
  },

  setRotation: (rotation: number) => {
    const state = get().editorState;
    if (!state) return;

    const action: EditorAction = {
      type: 'rotate',
      timestamp: Date.now(),
      previousState: { rotation: state.rotation },
      description: `Rotated to ${rotation} degrees`,
    };

    set({
      editorState: {
        ...state,
        rotation,
        isDirty: true,
        undoStack: [...state.undoStack, action],
        redoStack: [],
      },
    });
  },

  toggleFlipHorizontal: () => {
    const state = get().editorState;
    if (!state) return;

    const action: EditorAction = {
      type: 'flip',
      timestamp: Date.now(),
      previousState: { flipHorizontal: state.flipHorizontal },
      description: 'Flipped horizontally',
    };

    set({
      editorState: {
        ...state,
        flipHorizontal: !state.flipHorizontal,
        isDirty: true,
        undoStack: [...state.undoStack, action],
        redoStack: [],
      },
    });
  },

  toggleFlipVertical: () => {
    const state = get().editorState;
    if (!state) return;

    const action: EditorAction = {
      type: 'flip',
      timestamp: Date.now(),
      previousState: { flipVertical: state.flipVertical },
      description: 'Flipped vertically',
    };

    set({
      editorState: {
        ...state,
        flipVertical: !state.flipVertical,
        isDirty: true,
        undoStack: [...state.undoStack, action],
        redoStack: [],
      },
    });
  },

  setCropRegion: (region: CropRegion | undefined) => {
    const state = get().editorState;
    if (!state) return;

    const action: EditorAction = {
      type: 'crop',
      timestamp: Date.now(),
      previousState: { cropRegion: state.cropRegion },
      description: 'Cropped image',
    };

    set({
      editorState: {
        ...state,
        cropRegion: region,
        isDirty: true,
        undoStack: [...state.undoStack, action],
        redoStack: [],
      },
    });
  },

  setActivePreset: (preset: CropPreset | undefined) => {
    const state = get().editorState;
    if (!state) return;

    set({
      editorState: {
        ...state,
        activePreset: preset,
      },
    });
  },

  setAdjustment: (key: keyof ImageAdjustments, value: number) => {
    const state = get().editorState;
    if (!state) return;

    const action: EditorAction = {
      type: 'adjust',
      timestamp: Date.now(),
      previousState: {
        adjustments: { ...state.adjustments },
      },
      description: `Adjusted ${key} to ${value}`,
    };

    set({
      editorState: {
        ...state,
        adjustments: {
          ...state.adjustments,
          [key]: value,
        },
        isDirty: true,
        undoStack: [...state.undoStack, action],
        redoStack: [],
      },
    });
  },

  resetAdjustments: () => {
    const state = get().editorState;
    if (!state) return;

    set({
      editorState: {
        ...state,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        isDirty: state.filter !== 'none' || state.rotation !== 0,
      },
    });
  },

  undo: () => {
    const state = get().editorState;
    if (!state || state.undoStack.length === 0) return;

    const lastAction = state.undoStack[state.undoStack.length - 1];
    const newUndoStack = state.undoStack.slice(0, -1);

    set({
      editorState: {
        ...state,
        ...lastAction.previousState,
        undoStack: newUndoStack,
        redoStack: [
          ...state.redoStack,
          {
            ...lastAction,
            previousState: {
              filter: state.filter,
              rotation: state.rotation,
              flipHorizontal: state.flipHorizontal,
              flipVertical: state.flipVertical,
              cropRegion: state.cropRegion,
              adjustments: { ...state.adjustments },
            },
          },
        ],
        isDirty: newUndoStack.length > 0,
      },
    });
  },

  redo: () => {
    const state = get().editorState;
    if (!state || state.redoStack.length === 0) return;

    const nextAction = state.redoStack[state.redoStack.length - 1];
    const newRedoStack = state.redoStack.slice(0, -1);

    set({
      editorState: {
        ...state,
        ...nextAction.previousState,
        undoStack: [...state.undoStack, nextAction],
        redoStack: newRedoStack,
        isDirty: true,
      },
    });
  },

  canUndo: () => {
    return (get().editorState?.undoStack.length ?? 0) > 0;
  },

  canRedo: () => {
    return (get().editorState?.redoStack.length ?? 0) > 0;
  },

  resetAll: () => {
    const state = get().editorState;
    if (!state) return;

    set({
      editorState: {
        uri: state.originalUri,
        originalUri: state.originalUri,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        filter: 'none',
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        overlays: [],
        undoStack: [],
        redoStack: [],
        isDirty: false,
      },
    });
  },

  toggleCompareMode: () => {
    set((s) => ({ compareMode: !s.compareMode }));
  },

  updateUri: (uri: string) => {
    const state = get().editorState;
    if (!state) return;
    set({ editorState: { ...state, uri } });
  },

  pushUndoAction: (action: EditorAction) => {
    const state = get().editorState;
    if (!state) return;
    set({
      editorState: {
        ...state,
        undoStack: [...state.undoStack, action],
        redoStack: [],
        isDirty: true,
      },
    });
  },
}));
