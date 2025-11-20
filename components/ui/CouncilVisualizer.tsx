import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AIModel } from '@/types/council';
import { AI_MODELS } from '@/constants/config';
import { ModelCard } from './ModelCard';
import { theme } from '@/constants/theme';
import { useCouncil } from '@/hooks/useCouncil';

const { width } = Dimensions.get('window');

export function CouncilVisualizer() {
  const { activeModel, isThinking } = useCouncil();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐝 The AI Council</Text>
        <Text style={styles.subtitle}>Decentralized Intelligence Network</Text>
      </View>

      <View style={styles.councilTable}>
        <View style={styles.centerCircle}>
          <Text style={styles.centerIcon}>🧠</Text>
          <Text style={styles.centerText}>
            {isThinking ? 'Processing...' : 'Ready'}
          </Text>
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
          <Text style={styles.statusText}>
            {AI_MODELS.find(m => m.id === activeModel)?.icon}{' '}
            {AI_MODELS.find(m => m.id === activeModel)?.name} is analyzing...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  councilTable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  centerIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.xs,
  },
  centerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width - 32,
  },
  statusBar: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  statusText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
});
