import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AI_MODELS } from '@/constants/config';
import { ModelCard } from './ModelCard';
import { theme } from '@/constants/theme';
import { useCouncil } from '@/hooks/useCouncil';

const { width } = Dimensions.get('window');

export function CouncilVisualizer() {
  const { activeModel, isThinking } = useCouncil();
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (isThinking) {
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
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
      glowScale.value = withSpring(1);
      glowOpacity.value = withSpring(0.5);
    }
  }, [isThinking]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E27', '#151932', '#1E2340']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Text style={styles.headerLogoEmoji}>🐝</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>THE AI COUNCIL</Text>
          <Text style={styles.subtitle}>Decentralized Intelligence Network</Text>
        </View>
      </View>

      <View style={styles.councilTable}>
        <View style={styles.centerContainer}>
          <Animated.View style={[styles.glowRing, glowStyle]}>
            <LinearGradient
              colors={['#00D9FF', '#8B5CF6']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          <View style={styles.centerCircle}>
            <LinearGradient
              colors={['#151932', '#1E2340']}
              style={styles.centerGradient}
            >
              <Text style={styles.centerIcon}>🧠</Text>
              <Text style={styles.centerText}>
                {isThinking ? 'PROCESSING' : 'READY'}
              </Text>
              {isThinking && (
                <View style={styles.statusDots}>
                  {[0, 1, 2].map((i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.statusDot,
                        {
                          opacity: 0.5 + (i * 0.2),
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </LinearGradient>
          </View>
        </View>

        <View style={styles.modelsGrid}>
          {AI_MODELS.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isActive={activeModel === model.id}
              isThinking={isThinking}
            />
          ))}
        </View>
      </View>

      {activeModel && (
        <View style={styles.statusBar}>
          <LinearGradient
            colors={['#151932', '#1E2340']}
            style={styles.statusBarGradient}
          >
            <View style={styles.statusContent}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusText}>
                {AI_MODELS.find(m => m.id === activeModel)?.icon}{' '}
                {AI_MODELS.find(m => m.id === activeModel)?.name} is analyzing your request...
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLogo: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  headerLogoEmoji: {
    fontSize: 32,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    letterSpacing: 1,
  },
  councilTable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  centerContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xxl,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: theme.borderRadius.full,
    top: -20,
    left: -20,
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.colors.primary,
    ...theme.shadows.lg,
  },
  centerGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.xs,
  },
  centerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 2,
  },
  statusDots: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 2,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width - 32,
  },
  statusBar: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    overflow: 'hidden',
  },
  statusBarGradient: {
    padding: theme.spacing.md,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
});
