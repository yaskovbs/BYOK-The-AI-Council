import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export function AdBanner() {
  const handleAdClick = () => {
    Linking.openURL('https://github.com/yaskovbs/The-AI-Council');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.adContent} onPress={handleAdClick}>
        <MaterialCommunityIcons name="github" size={20} color={theme.colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.adTitle}>Support Open Source</Text>
          <Text style={styles.adSubtitle}>Star us on GitHub ⭐</Text>
        </View>
      </Pressable>
      <Text style={styles.adLabel}>Ad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: theme.spacing.sm,
  },
  adTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  adSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  adLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
});
