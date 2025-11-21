import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components';
import { useCouncil } from '@/hooks/useCouncil';
import { useAuth, useAlert } from '@/template';
import { theme } from '@/constants/theme';
import { PERSONALITIES } from '@/constants/personalities';
import { PersonalityMode } from '@/types/council';

export default function SettingsScreen() {
  const { apiKeys, setApiKeys, personality, setPersonality, theme: appTheme, setTheme, clearMessages } = useCouncil();
  const { logout, user } = useAuth();
  const { showAlert } = useAlert();
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = () => {
    setApiKeys(localKeys);
    showAlert('API Keys saved successfully!');
  };

  const updateKey = (key: string, value: string) => {
    setLocalKeys((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      showAlert(error);
    }
  };

  const handleClearHistory = () => {
    showAlert('Clear Chat History?', 'This action cannot be undone', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearMessages },
    ]);
  };

  return (
    <Screen edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>⚙️ Settings</Text>
          <Text style={styles.subtitle}>BYOK - Bring Your Own Keys</Text>
        </View>

        {user && (
          <View style={styles.userCard}>
            <MaterialCommunityIcons name="account-circle" size={48} color={theme.colors.primary} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.username || 'User'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Personality Mode</Text>
          <Text style={styles.sectionSubtitle}>Choose how the AI Council interacts with you</Text>
          
          {PERSONALITIES.map((p) => (
            <Pressable
              key={p.id}
              style={[
                styles.personalityCard,
                personality === p.id && { borderColor: p.color, borderWidth: 2 },
              ]}
              onPress={() => setPersonality(p.id)}
            >
              <Text style={styles.personalityIcon}>{p.icon}</Text>
              <View style={styles.personalityInfo}>
                <Text style={styles.personalityName}>{p.name}</Text>
                <Text style={styles.personalityDescription}>{p.description}</Text>
              </View>
              {personality === p.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color={p.color} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌓 Appearance</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Toggle between light and dark theme</Text>
            </View>
            <Switch
              value={appTheme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗑️ Data Management</Text>
          <Pressable style={styles.dangerButton} onPress={handleClearHistory}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={theme.colors.danger} />
            <Text style={styles.dangerButtonText}>Clear Chat History</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={theme.colors.background} />
          <Text style={styles.logoutButtonText}>Logout</Text>
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
  logo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.sm,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  userName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
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
  sectionSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  personalityIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  personalityInfo: {
    flex: 1,
  },
  personalityName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  personalityDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  dangerButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.danger,
    marginLeft: theme.spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.danger,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  logoutButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
    marginLeft: theme.spacing.sm,
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
