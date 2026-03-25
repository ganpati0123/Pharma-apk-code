import { Platform } from 'react-native';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

let hapticEnabled = true;

export const setHapticEnabled = (enabled: boolean): void => {
  hapticEnabled = enabled;
};

export const isHapticAvailable = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

export const triggerHaptic = (type: HapticType = 'light'): void => {
  if (!hapticEnabled || !isHapticAvailable()) return;

  try {
    // In production, would use expo-haptics or react-native-haptic-feedback
    // For now, this is a stub that can be replaced with real haptic feedback
    switch (type) {
      case 'light':
      case 'selection':
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        break;
      case 'medium':
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        break;
      case 'heavy':
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        break;
      case 'success':
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        break;
      case 'warning':
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        break;
      case 'error':
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        break;
    }
  } catch {
    // Silently fail if haptics not available
  }
};

export const hapticOnPress = (): void => triggerHaptic('light');
export const hapticOnLongPress = (): void => triggerHaptic('medium');
export const hapticOnSelect = (): void => triggerHaptic('selection');
export const hapticOnSuccess = (): void => triggerHaptic('success');
export const hapticOnError = (): void => triggerHaptic('error');
export const hapticOnDelete = (): void => triggerHaptic('warning');

export const createHapticHandler = (type: HapticType) => {
  return () => triggerHaptic(type);
};

export const hapticSequence = async (types: HapticType[], delayMs = 100): Promise<void> => {
  for (const type of types) {
    triggerHaptic(type);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
};
