import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { AIModelConfig } from '@/types/council';
import { theme } from '@/constants/theme';
import { useEffect } from 'react';

interface ModelCardProps {
  model: AIModelConfig;
  isActive: boolean;
  isThinking: boolean;
}

export function ModelCard({ model, isActive, isThinking }: ModelCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = isActive ? withSpring(1.1) : withSpring(1);
    const opacity = isActive ? withTiming(1) : withTiming(0.7);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    if (!isActive || !isThinking) {
      return { opacity: 0 };
    }
    
    return {
      opacity: withSequence(
        withTiming(0.8, { duration: 500 }),
        withTiming(0.3, { duration: 500 })
      ),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.card, { borderColor: model.color }]}>
        {isActive && isThinking && (
          <Animated.View
            style={[
              styles.glow,
              { backgroundColor: model.color },
              glowStyle,
            ]}
          />
        )}
        
        <Text style={styles.icon}>{model.icon}</Text>
        <Text style={styles.name}>{model.name}</Text>
        <Text style={styles.role}>{model.role}</Text>
        
        {isActive && (
          <View style={[styles.activeDot, { backgroundColor: model.color }]} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    margin: theme.spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: theme.borderRadius.lg,
    zIndex: -1,
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  role: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
  },
});
