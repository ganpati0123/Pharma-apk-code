import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';

interface PermissionRequestProps {
  onRequest: () => void;
  isDenied?: boolean;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({
  onRequest,
  isDenied = false,
}) => {
  const colors = useSettingsStore((s) => s.colors);

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <Ionicons name="images" size={64} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {isDenied ? 'Permission Required' : 'Access Your Gallery'}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {isDenied
            ? 'AI Gallery needs access to your photos and videos to display them. Please enable this permission in your device settings.'
            : 'AI Gallery needs permission to access your photos and videos to display, organize, and enhance them with AI.'}
        </Text>

        <View style={styles.features}>
          {[
            { icon: 'grid', text: 'Browse all your photos & videos' },
            { icon: 'sparkles', text: 'AI-powered organization' },
            { icon: 'search', text: 'Smart search by content' },
            { icon: 'shield-checkmark', text: 'Your photos stay private' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons
                name={feature.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={colors.primary}
              />
              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {isDenied ? (
          <Pressable
            onPress={handleOpenSettings}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>Open Settings</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onRequest}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>Allow Access</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
  },
  button: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default memo(PermissionRequest);
