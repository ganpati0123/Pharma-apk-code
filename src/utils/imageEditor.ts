import * as ImageManipulator from 'expo-image-manipulator';
import type { EditorState } from '../types';

export type FilterType = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'cool' | 'warm';

export interface FilterOption {
  id: FilterType;
  label: string;
}

export const FILTERS: FilterOption[] = [
  { id: 'none', label: 'Original' },
  { id: 'grayscale', label: 'B&W' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'cool', label: 'Cool' },
  { id: 'warm', label: 'Warm' },
];

export const rotateImage = async (
  uri: string,
  degrees: number
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ rotate: degrees }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const cropImage = async (
  uri: string,
  cropRegion: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  }
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ crop: cropRegion }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const resizeImage = async (
  uri: string,
  width: number,
  height?: number
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const flipImage = async (
  uri: string,
  direction: 'horizontal' | 'vertical'
): Promise<string> => {
  const flipAction =
    direction === 'horizontal'
      ? ImageManipulator.FlipType.Horizontal
      : ImageManipulator.FlipType.Vertical;

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ flip: flipAction }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const applyEdits = async (editorState: EditorState): Promise<string> => {
  const actions: ImageManipulator.Action[] = [];

  if (editorState.rotation !== 0) {
    actions.push({ rotate: editorState.rotation });
  }

  if (editorState.cropRegion) {
    actions.push({ crop: editorState.cropRegion });
  }

  if (actions.length === 0) {
    return editorState.uri;
  }

  const result = await ImageManipulator.manipulateAsync(
    editorState.uri,
    actions,
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};
