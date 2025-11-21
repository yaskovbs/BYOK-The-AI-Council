import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    icon: string;
    specialty: string;
    color: string;
  };
  isActive: boolean;
  isThinking: boolean;
}

export function ModelCard({ model, isActive, isThinking }: ModelCardProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isActive && isThinking) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 8 }),
          withSpring(1, { damping: 8 })
        ),
        -1,
        true
      );
      rotation.value = withRepeat(
        withTiming(360, { duration: 3000 }),
        -1,
        false
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(isActive ? 1.05 : 1);
      rotation.value = withTiming(0);
      glowOpacity.value = withSpring(isActive ? 0.6 : 0.3);
    }
  }, [isActive, isThinking]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const getGradientColors = (color: string): [string, string] => {
    const colorMap: Record<string, [string, string]> = {
      '#4285F4': ['#4285F4', '#34A853'],
      '#E06C75': ['#E06C75', '#C678DD'],
      '#10A37F': ['#10A37F', '#00D9FF'],
      '#FFA500': ['#FFA500', '#FF4757'],
    };
    return colorMap[color] || [color, color];
  };

  return (
    <Pressable style={styles.container}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Animated.View style={[styles.glowRing, glowStyle]}>
          <LinearGradient
            colors={getGradientColors(model.color)}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <LinearGradient
          colors={isActive ? ['#1E2340', '#151932'] : ['#151932', '#1E2340']}
          style={styles.cardGradient}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{model.icon}</Text>
          </View>
          
          <Text style={[styles.name, isActive && styles.nameActive]}>
            {model.name}
          </Text>
          
          <View style={[styles.badge, { backgroundColor: `${model.color}20` }]}>
            <Text style={[styles.specialty, { color: model.color }]}>
              {model.specialty}
            </Text>
          </View>

          {isActive && isThinking && (
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: model.color }]} />
              <Text style={[styles.statusText, { color: model.color }]}>
                ACTIVE
              </Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.sm,
  },
  card: {
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 180,
    borderRadius: theme.borderRadius.lg,
    top: -4,
    left: -4,
  },
  cardGradient: {
    width: 132,
    height: 172,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  nameActive: {
    color: theme.colors.primary,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  specialty: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1,
  },
});
