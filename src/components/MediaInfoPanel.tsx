import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useMediaInfo } from '../hooks/useMediaInfo';
import type { MediaItem } from '../types';

interface MediaInfoPanelProps {
  item: MediaItem;
  visible: boolean;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; value: string; icon: string; colors: any }> = ({
  label, value, icon, colors,
}) => (
  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon as any} size={16} color={colors.primary} />
      <Text style={[styles.labelText, { color: colors.textSecondary }]}>{label}</Text>
    </View>
    <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
  </View>
);

export const MediaInfoPanel: React.FC<MediaInfoPanelProps> = ({ item, visible, onClose }) => {
  const { colors } = useSettingsStore();
  const info = useMediaInfo(item);

  if (!visible || !info) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Details</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>File Info</Text>
        <InfoRow label="Filename" value={info.filename} icon="document" colors={colors} />
        <InfoRow label="Type" value={info.mediaType.toUpperCase()} icon="image" colors={colors} />
        <InfoRow label="Size" value={info.fileSize} icon="server" colors={colors} />
        <InfoRow label="Dimensions" value={info.dimensions} icon="resize" colors={colors} />
        <InfoRow label="Aspect Ratio" value={info.aspectRatio} icon="crop" colors={colors} />
        <InfoRow label="Resolution" value={info.megapixels} icon="aperture" colors={colors} />

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Date & Time</Text>
        <InfoRow label="Date" value={info.dateCreated} icon="calendar" colors={colors} />
        <InfoRow label="Time" value={info.timeCreated} icon="time" colors={colors} />
        <InfoRow label="Relative" value={info.relativeDate} icon="hourglass" colors={colors} />

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Camera</Text>
        <InfoRow label="Camera" value={info.exifData.camera || 'Unknown'} icon="camera" colors={colors} />
        <InfoRow label="Lens" value={info.exifData.lens || 'Unknown'} icon="eye" colors={colors} />
        <InfoRow label="Focal Length" value={info.exifData.focalLength || 'Unknown'} icon="locate" colors={colors} />
        <InfoRow label="Aperture" value={info.exifData.aperture || 'Unknown'} icon="radio-button-on" colors={colors} />
        <InfoRow label="Shutter" value={info.exifData.shutterSpeed || 'Unknown'} icon="timer" colors={colors} />
        <InfoRow label="ISO" value={info.exifData.iso || 'Unknown'} icon="speedometer" colors={colors} />
        <InfoRow label="Flash" value={info.exifData.flash ? 'On' : 'Off'} icon="flash" colors={colors} />

        {item.aiCategory && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>AI Analysis</Text>
            <InfoRow label="Category" value={item.aiCategory} icon="sparkles" colors={colors} />
            {item.aiTags && item.aiTags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.aiTags.slice(0, 8).map((tag, index) => (
                  <View key={index} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>
                      {tag.label} ({Math.round(tag.confidence * 100)}%)
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    fontSize: 14,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '50%',
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
