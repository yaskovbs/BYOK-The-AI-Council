import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components';
import { theme } from '@/constants/theme';

export default function RobotScreen() {
  const handleCommand = (command: string) => {
    console.log('Robot Command:', command);
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 Robot Control</Text>
          <Text style={styles.subtitle}>Raspberry Pi 5</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Ready to connect</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Movement Controls</Text>
          
          <View style={styles.dpadContainer}>
            <Pressable
              style={styles.controlButton}
              onPress={() => handleCommand('forward')}
            >
              <MaterialCommunityIcons name="chevron-up" size={32} color={theme.colors.text} />
            </Pressable>
            
            <View style={styles.dpadMiddle}>
              <Pressable
                style={styles.controlButton}
                onPress={() => handleCommand('left')}
              >
                <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.text} />
              </Pressable>
              
              <Pressable
                style={[styles.controlButton, styles.stopButton]}
                onPress={() => handleCommand('stop')}
              >
                <MaterialCommunityIcons name="stop" size={32} color={theme.colors.text} />
              </Pressable>
              
              <Pressable
                style={styles.controlButton}
                onPress={() => handleCommand('right')}
              >
                <MaterialCommunityIcons name="chevron-right" size={32} color={theme.colors.text} />
              </Pressable>
            </View>
            
            <Pressable
              style={styles.controlButton}
              onPress={() => handleCommand('backward')}
            >
              <MaterialCommunityIcons name="chevron-down" size={32} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <View style={styles.actionsGrid}>
            <Pressable
              style={styles.actionButton}
              onPress={() => handleCommand('camera')}
            >
              <MaterialCommunityIcons name="camera" size={24} color={theme.colors.primary} />
              <Text style={styles.actionText}>Camera</Text>
            </Pressable>
            
            <Pressable
              style={styles.actionButton}
              onPress={() => handleCommand('microphone')}
            >
              <MaterialCommunityIcons name="microphone" size={24} color={theme.colors.primary} />
              <Text style={styles.actionText}>Mic</Text>
            </Pressable>
            
            <Pressable
              style={styles.actionButton}
              onPress={() => handleCommand('speaker')}
            >
              <MaterialCommunityIcons name="volume-high" size={24} color={theme.colors.primary} />
              <Text style={styles.actionText}>Speaker</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.warning}>
          ⚠️ Safety Mode: Robot control requires Firebase connection
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  statusLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.warning,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  controlsContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dpadContainer: {
    alignItems: 'center',
  },
  dpadMiddle: {
    flexDirection: 'row',
    marginVertical: theme.spacing.sm,
  },
  controlButton: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.xs,
    ...theme.shadows.md,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
  },
  actionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minWidth: 80,
    ...theme.shadows.sm,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  warning: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.warning,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
