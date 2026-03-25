import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import { useUIStore } from '../store/uiStore';

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to AI Gallery',
    description: 'Your photos, intelligently organized with AI-powered features.',
    icon: 'sparkles',
    color: '#6C63FF',
  },
  {
    title: 'Smart Classification',
    description: 'AI automatically categorizes your photos into People, Nature, Food, and more.',
    icon: 'brain',
    color: '#FF6B9D',
  },
  {
    title: 'Face Detection',
    description: 'Detect faces and emotions in your photos automatically.',
    icon: 'happy',
    color: '#4CAF50',
  },
  {
    title: 'Duplicate Finder',
    description: 'Find and remove duplicate photos to save storage space.',
    icon: 'copy',
    color: '#FF9800',
  },
  {
    title: 'Photo Memories',
    description: 'Rediscover your memories with On This Day and monthly highlights.',
    icon: 'heart',
    color: '#E91E63',
  },
];

export const OnboardingOverlay: React.FC = () => {
  const { colors } = useSettingsStore();
  const { showOnboarding, completeOnboarding } = useUIStore();
  const [currentStep, setCurrentStep] = useState(0);
  const { width } = Dimensions.get('window');

  if (!showOnboarding) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>

        <View style={[styles.iconCircle, { backgroundColor: step.color + '20' }]}>
          <Ionicons name={step.icon as any} size={48} color={step.color} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{step.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{step.description}</Text>

        <View style={styles.dots}>
          {ONBOARDING_STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentStep ? colors.primary : colors.border,
                  width: i === currentStep ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: step.color }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>{isLast ? 'Get Started' : 'Next'}</Text>
          <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
  },
  nextText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
