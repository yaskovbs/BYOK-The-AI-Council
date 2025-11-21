import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Redirect } from 'expo-router';
import { Screen } from '@/components';
import { MockAuthRouter } from '@/template';
import { theme } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <MockAuthRouter loginRoute="/login">
      <Redirect href="/(tabs)/chat" />
    </MockAuthRouter>
  );
}

function WelcomeContent() {
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>🐝</Text>
          <Text style={styles.title}>The AI Council</Text>
          <Text style={styles.subtitle}>
            Decentralized Intelligence Network
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🧠</Text>
              <Text style={styles.featureText}>4 Expert AI Models</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔑</Text>
              <Text style={styles.featureText}>Bring Your Own Keys</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>Raspberry Pi Control</Text>
            </View>
          </View>

          <Redirect href="/(tabs)/chat" />

          <Text style={styles.credits}>
            Created by YAKOV LIAV BEN SALOMON{'\n'}
            יעקב ליאב בן סלומון
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
  },
  credits: {
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
