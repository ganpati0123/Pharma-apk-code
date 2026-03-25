import { create } from 'zustand';
import type { ToastMessage, ViewMode, BatchOperation } from '../types';

interface UIState {
  viewMode: ViewMode;
  toasts: ToastMessage[];
  isOnboardingComplete: boolean;
  showOnboarding: boolean;
  activeBatchOperation: BatchOperation | null;
  isFullscreenViewerOpen: boolean;
  isEditorOpen: boolean;
  isSortSheetOpen: boolean;
  isInfoPanelOpen: boolean;
  headerVisible: boolean;
  scrollPosition: number;
  lastInteractionTime: number;
  gesturesEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  animationsEnabled: boolean;
  showAIBadges: boolean;
  showVideoThumbnails: boolean;
  autoPlayVideos: boolean;
  compactMode: boolean;
  showDateHeaders: boolean;
  confirmBeforeDelete: boolean;
  showStorageWarning: boolean;

  setViewMode: (mode: ViewMode) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  completeOnboarding: () => void;
  setShowOnboarding: (show: boolean) => void;
  setBatchOperation: (op: BatchOperation | null) => void;
  updateBatchProgress: (progress: number) => void;
  setFullscreenViewerOpen: (open: boolean) => void;
  setEditorOpen: (open: boolean) => void;
  setSortSheetOpen: (open: boolean) => void;
  setInfoPanelOpen: (open: boolean) => void;
  setHeaderVisible: (visible: boolean) => void;
  setScrollPosition: (position: number) => void;
  updateLastInteraction: () => void;
  toggleGestures: () => void;
  toggleHapticFeedback: () => void;
  toggleAnimations: () => void;
  toggleAIBadges: () => void;
  toggleVideoThumbnails: () => void;
  toggleAutoPlayVideos: () => void;
  toggleCompactMode: () => void;
  toggleDateHeaders: () => void;
  toggleConfirmBeforeDelete: () => void;
  setShowStorageWarning: (show: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>((set, get) => ({
  viewMode: 'grid',
  toasts: [],
  isOnboardingComplete: false,
  showOnboarding: false,
  activeBatchOperation: null,
  isFullscreenViewerOpen: false,
  isEditorOpen: false,
  isSortSheetOpen: false,
  isInfoPanelOpen: false,
  headerVisible: true,
  scrollPosition: 0,
  lastInteractionTime: Date.now(),
  gesturesEnabled: true,
  hapticFeedbackEnabled: true,
  animationsEnabled: true,
  showAIBadges: true,
  showVideoThumbnails: true,
  autoPlayVideos: false,
  compactMode: false,
  showDateHeaders: true,
  confirmBeforeDelete: true,
  showStorageWarning: true,

  setViewMode: (mode) => set({ viewMode: mode }),

  addToast: (toast) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: ToastMessage = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),

  completeOnboarding: () => {
    set({ isOnboardingComplete: true, showOnboarding: false });
  },

  setShowOnboarding: (show) => set({ showOnboarding: show }),

  setBatchOperation: (op) => set({ activeBatchOperation: op }),

  updateBatchProgress: (progress) => {
    const current = get().activeBatchOperation;
    if (current) {
      set({
        activeBatchOperation: {
          ...current,
          progress,
          status: progress >= current.itemCount ? 'completed' : 'running',
        },
      });
    }
  },

  setFullscreenViewerOpen: (open) => set({ isFullscreenViewerOpen: open }),
  setEditorOpen: (open) => set({ isEditorOpen: open }),
  setSortSheetOpen: (open) => set({ isSortSheetOpen: open }),
  setInfoPanelOpen: (open) => set({ isInfoPanelOpen: open }),
  setHeaderVisible: (visible) => set({ headerVisible: visible }),
  setScrollPosition: (position) => set({ scrollPosition: position }),
  updateLastInteraction: () => set({ lastInteractionTime: Date.now() }),
  toggleGestures: () => set((s) => ({ gesturesEnabled: !s.gesturesEnabled })),
  toggleHapticFeedback: () => set((s) => ({ hapticFeedbackEnabled: !s.hapticFeedbackEnabled })),
  toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
  toggleAIBadges: () => set((s) => ({ showAIBadges: !s.showAIBadges })),
  toggleVideoThumbnails: () => set((s) => ({ showVideoThumbnails: !s.showVideoThumbnails })),
  toggleAutoPlayVideos: () => set((s) => ({ autoPlayVideos: !s.autoPlayVideos })),
  toggleCompactMode: () => set((s) => ({ compactMode: !s.compactMode })),
  toggleDateHeaders: () => set((s) => ({ showDateHeaders: !s.showDateHeaders })),
  toggleConfirmBeforeDelete: () => set((s) => ({ confirmBeforeDelete: !s.confirmBeforeDelete })),
  setShowStorageWarning: (show) => set({ showStorageWarning: show }),
}));
