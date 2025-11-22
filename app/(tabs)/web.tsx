import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components';
import { theme } from '@/constants/theme';
import { webService } from '@/services/webService';
import { WebPage } from '@/types/council';
import { useAlert } from '@/template';

export default function WebBrowserScreen() {
  const { showAlert } = useAlert();
  const [url, setUrl] = useState('');
  const [currentPage, setCurrentPage] = useState<WebPage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBrowse = async () => {
    if (!url.trim()) {
      showAlert('Please enter a URL');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    setLoading(true);
    const { data, error } = await webService.browseUrl(finalUrl);
    
    if (error) {
      showAlert(error);
    } else if (data) {
      setCurrentPage(data);
    }
    setLoading(false);
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🌐 Web Browser</Text>
        </View>

        <View style={styles.addressBar}>
          <TextInput
            style={styles.urlInput}
            value={url}
            onChangeText={setUrl}
            placeholder="Enter URL (e.g., google.com)"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onSubmitEditing={handleBrowse}
            editable={!loading}
          />
          <Pressable
            style={[styles.goButton, loading && styles.goButtonDisabled]}
            onPress={handleBrowse}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color={theme.colors.background}
              />
            )}
          </Pressable>
        </View>

        {currentPage ? (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>{currentPage.title}</Text>
              <Text style={styles.pageUrl}>{currentPage.url}</Text>
            </View>

            <View style={styles.pageContent}>
              <Text style={styles.contentText}>{currentPage.content}</Text>
            </View>

            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.infoText}>
                This is a text-only preview. Images, videos, and interactive elements are not displayed.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="earth"
              size={80}
              color={theme.colors.textMuted}
            />
            <Text style={styles.emptyTitle}>Browse the Web</Text>
            <Text style={styles.emptyText}>
              Enter any URL to fetch and view web pages{'\n'}
              Powered by The AI Council
            </Text>

            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Quick Examples:</Text>
              {['github.com', 'wikipedia.org', 'news.ycombinator.com'].map((example) => (
                <Pressable
                  key={example}
                  style={styles.exampleButton}
                  onPress={() => {
                    setUrl(example);
                    setTimeout(handleBrowse, 100);
                  }}
                >
                  <Text style={styles.exampleText}>{example}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  addressBar: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  urlInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  goButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goButtonDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  pageHeader: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pageTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pageUrl: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  pageContent: {
    padding: theme.spacing.md,
  },
  contentText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  examplesContainer: {
    marginTop: theme.spacing.xl,
    width: '100%',
  },
  examplesTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  exampleButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  exampleText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
});
