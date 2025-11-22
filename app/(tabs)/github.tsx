import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components';
import { theme } from '@/constants/theme';
import { githubService } from '@/services/githubService';
import { codeService } from '@/services/codeService';
import { GitHubRepo } from '@/types/council';
import { useAlert } from '@/template';

export default function GitHubScreen() {
  const { showAlert } = useAlert();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [repoFiles, setRepoFiles] = useState<any[]>([]);

  const handleLoadRepos = async () => {
    if (!githubToken.trim()) {
      setShowTokenModal(true);
      return;
    }

    setLoading(true);
    const { data, error } = await githubService.listRepos(githubToken);
    if (error) {
      showAlert(error);
    } else if (data) {
      setRepos(data);
      showAlert('Repositories loaded successfully!');
    }
    setLoading(false);
  };

  const handleSelectRepo = async (repo: GitHubRepo) => {
    if (!githubToken) return;

    setSelectedRepo(repo);
    setLoading(true);

    const [owner, repoName] = repo.fullName.split('/');
    const { data, error } = await githubService.getRepoFiles(githubToken, owner, repoName);

    if (error) {
      showAlert(error);
    } else if (data) {
      setRepoFiles(data.filter((file: any) => file.type === 'file'));
    }
    setLoading(false);
  };

  const handleImportFile = async (file: any) => {
    if (!githubToken || !selectedRepo) return;

    setLoading(true);
    const [owner, repoName] = selectedRepo.fullName.split('/');
    const { data, error } = await githubService.getFileContent(
      githubToken,
      owner,
      repoName,
      file.path
    );

    if (error) {
      showAlert(error);
    } else if (data) {
      const language = getLanguageFromFilename(file.name);
      const saveResult = await codeService.saveCodeFile({
        filename: file.name,
        content: data,
        language,
        filePath: file.path,
        repoName: selectedRepo.name,
        isFromGithub: true,
      });

      if (saveResult.error) {
        showAlert(saveResult.error);
      } else {
        showAlert('File imported successfully!');
      }
    }
    setLoading(false);
  };

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      json: 'json',
    };
    return langMap[ext || ''] || 'text';
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🐙 GitHub</Text>
          <Pressable
            style={styles.tokenButton}
            onPress={() => setShowTokenModal(true)}
          >
            <MaterialCommunityIcons name="key" size={20} color={theme.colors.primary} />
            <Text style={styles.tokenButtonText}>Token</Text>
          </Pressable>
        </View>

        {!githubToken ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="github" size={80} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Connect to GitHub</Text>
            <Text style={styles.emptyText}>
              Add your GitHub Personal Access Token to import repositories and files
            </Text>
            <Pressable
              style={styles.connectButton}
              onPress={() => setShowTokenModal(true)}
            >
              <Text style={styles.connectButtonText}>Add Token</Text>
            </Pressable>
          </View>
        ) : !selectedRepo ? (
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Repositories</Text>
              <Pressable style={styles.refreshButton} onPress={handleLoadRepos}>
                <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.primary} />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <FlatList
                data={repos}
                keyExtractor={(item) => item.fullName}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.repoCard}
                    onPress={() => handleSelectRepo(item)}
                  >
                    <View style={styles.repoHeader}>
                      <MaterialCommunityIcons
                        name={item.private ? 'lock' : 'book'}
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.repoName}>{item.name}</Text>
                    </View>
                    {item.description && (
                      <Text style={styles.repoDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                    {item.language && (
                      <View style={styles.repoFooter}>
                        <Text style={styles.repoLanguage}>{item.language}</Text>
                      </View>
                    )}
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        ) : (
          <View style={styles.content}>
            <Pressable
              style={styles.backButton}
              onPress={() => {
                setSelectedRepo(null);
                setRepoFiles([]);
              }}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color={theme.colors.text} />
              <Text style={styles.backButtonText}>Back to Repositories</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>{selectedRepo.name} - Files</Text>

            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <FlatList
                data={repoFiles}
                keyExtractor={(item) => item.path}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.fileCard}
                    onPress={() => handleImportFile(item)}
                  >
                    <MaterialCommunityIcons
                      name="file-code"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.fileName}>{item.name}</Text>
                    <MaterialCommunityIcons
                      name="download"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}

        <Modal
          visible={showTokenModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTokenModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>GitHub Personal Access Token</Text>
              <Text style={styles.modalDescription}>
                Create a token at: github.com/settings/tokens with repo scope
              </Text>
              <TextInput
                style={styles.modalInput}
                value={githubToken}
                onChangeText={setGithubToken}
                placeholder="ghp_xxxxxxxxxxxx"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
              />
              <View style={styles.modalActions}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => setShowTokenModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={() => {
                    setShowTokenModal(false);
                    handleLoadRepos();
                  }}
                >
                  <Text style={styles.modalButtonTextPrimary}>Save & Load</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  tokenButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
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
  connectButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  connectButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  refreshButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  repoCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  repoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  repoName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  repoDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  repoFooter: {
    marginTop: theme.spacing.xs,
  },
  repoLanguage: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  fileName: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  modalButtonTextPrimary: {
    fontSize: theme.fontSize.md,
    color: theme.colors.background,
    fontWeight: theme.fontWeight.medium,
  },
});
