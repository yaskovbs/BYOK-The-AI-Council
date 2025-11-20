import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components';
import { useCouncil } from '@/hooks/useCouncil';
import { theme } from '@/constants/theme';

export default function SettingsScreen() {
  const { apiKeys, setApiKeys } = useCouncil();
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = () => {
    setApiKeys(localKeys);
    alert('API Keys saved successfully!');
  };

  const updateKey = (key: string, value: string) => {
    setLocalKeys((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Screen edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Settings</Text>
          <Text style={styles.subtitle}>BYOK - Bring Your Own Keys</Text>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={24} color={theme.colors.primary} />
          <Text style={styles.infoText}>
            Your API keys are stored locally and never sent to our servers. They are used only to communicate directly with AI providers.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>API Keys</Text>
            <Pressable onPress={() => setShowKeys(!showKeys)}>
              <MaterialCommunityIcons
                name={showKeys ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🧠 Gemini API Key</Text>
            <TextInput
              style={styles.input}
              value={localKeys.gemini || ''}
              onChangeText={(text) => updateKey('gemini', text)}
              placeholder="Enter Gemini API key"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showKeys}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>👨‍💻 Claude API Key</Text>
            <TextInput
              style={styles.input}
              value={localKeys.claude || ''}
              onChangeText={(text) => updateKey('claude', text)}
              placeholder="Enter Claude API key"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showKeys}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🧮 OpenAI API Key</Text>
            <TextInput
              style={styles.input}
              value={localKeys.openai || ''}
              onChangeText={(text) => updateKey('openai', text)}
              placeholder="Enter OpenAI API key"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showKeys}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📰 Grok API Key</Text>
            <TextInput
              style={styles.input}
              value={localKeys.grok || ''}
              onChangeText={(text) => updateKey('grok', text)}
              placeholder="Enter Grok API key"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showKeys}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔥 Firebase Config</Text>
            <TextInput
              style={styles.input}
              value={localKeys.firebase || ''}
              onChangeText={(text) => updateKey('firebase', text)}
              placeholder="Enter Firebase API key"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showKeys}
            />
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Created by YAKOV LIAV BEN SALOMON{'\n'}
            יעקב ליאב בן סלומון{'\n'}
            @yaskovbs
          </Text>
          <Text style={styles.version}>Version 3.0.0-beta</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    lineHeight: 20,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
  },
  footer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  version: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
});
