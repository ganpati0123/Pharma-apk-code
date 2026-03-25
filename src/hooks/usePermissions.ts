import { useEffect, useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

interface PermissionState {
  hasPermission: boolean | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
}

export const usePermissions = (): PermissionState => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setHasPermission(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { hasPermission, isLoading, requestPermission, checkPermission };
};
