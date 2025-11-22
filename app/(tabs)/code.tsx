import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Screen } from '@/components';
import { theme } from '@/constants/theme';
import { codeService } from '@/services/codeService';
import { CodeFile } from '@/types/council';
import { useAlert } from '@/template';

export default function CodeEditorScreen() {
  const { showAlert } = useAlert();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    const { data, error } = await codeService.getCodeFiles();
    if (error) {
      showAlert(error);
    } else if (data) {
      setFiles(data);
    }
    setLoading(false);
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      showAlert('Please enter a filename');
      return;
    }

    const language = getLanguageFromFilename(newFileName);
    const { data, error } = await codeService.saveCodeFile({
      filename: newFileName,
      content: '',
      language,
      isFromGithub: false,
    });

    if (error) {
      showAlert(error);
    } else {
      showAlert('File created successfully!');
      setShowNewFileModal(false);
      setNewFileName('');
      loadFiles();
    }
  };

  const handleSelectFile = (file: CodeFile) => {
    setSelectedFile(file);
    setEditContent(file.content);
    setIsEditing(true);
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;

    const { error } = await codeService.updateCodeFile(selectedFile.id, {
      content: editContent,
    });

    if (error) {
      showAlert(error);
    } else {
      showAlert('File saved successfully!');
      setIsEditing(false);
      loadFiles();
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    Alert.alert('Delete File', 'Are you sure you want to delete this file?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await codeService.deleteCodeFile(fileId);
          if (error) {
            showAlert(error);
          } else {
            showAlert('File deleted');
            if (selectedFile?.id === fileId) {
              setIsEditing(false);
              setSelectedFile(null);
            }
            loadFiles();
          }
        },
      },
    ]);
  };

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/*', 'application/json', 'application/javascript'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const response = await fetch(file.uri);
      const content = await response.text();
      
      const language = getLanguageFromFilename(file.name);
      const { error } = await codeService.saveCodeFile({
        filename: file.name,
        content,
        language,
        isFromGithub: false,
      });

      if (error) {
        showAlert(error);
      } else {
        showAlert('File uploaded successfully!');
        loadFiles();
      }
    } catch (error: any) {
      showAlert(error.message || 'Failed to upload file');
    }
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
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
    };
    return langMap[ext || ''] || 'text';
  };

  const getLanguageIcon = (language: string): string => {
    const iconMap: Record<string, string> = {
      javascript: 'language-javascript',
      typescript: 'language-typescript',
      python: 'language-python',
      java: 'language-java',
      html: 'language-html5',
      css: 'language-css3',
      json: 'code-json',
    };
    return iconMap[language] || 'file-code';
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>👨‍💻 Code Editor</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} onPress={handleUploadFile}>
              <MaterialCommunityIcons name="upload" size={24} color={theme.colors.primary} />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => setShowNewFileModal(true)}
            >
              <MaterialCommunityIcons name="file-plus" size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Files ({files.length})</Text>
            <FlatList
              data={files}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.fileItem,
                    selectedFile?.id === item.id && styles.fileItemActive,
                  ]}
                  onPress={() => handleSelectFile(item)}
                  onLongPress={() => handleDeleteFile(item.id)}
                >
                  <MaterialCommunityIcons
                    name={getLanguageIcon(item.language) as any}
                    size={20}
                    color={
                      selectedFile?.id === item.id
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.fileName,
                      selectedFile?.id === item.id && styles.fileNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.filename}
                  </Text>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.editor}>
            {isEditing && selectedFile ? (
              <>
                <View style={styles.editorHeader}>
                  <Text style={styles.editorTitle}>{selectedFile.filename}</Text>
                  <View style={styles.editorActions}>
                    <Pressable style={styles.saveButton} onPress={handleSaveFile}>
                      <MaterialCommunityIcons
                        name="content-save"
                        size={20}
                        color={theme.colors.background}
                      />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color={theme.colors.text}
                      />
                    </Pressable>
                  </View>
                </View>
                <ScrollView style={styles.codeContainer}>
                  <TextInput
                    style={styles.codeInput}
                    value={editContent}
                    onChangeText={setEditContent}
                    multiline
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </ScrollView>
              </>
            ) : (
              <View style={styles.emptyEditor}>
                <MaterialCommunityIcons
                  name="code-braces"
                  size={64}
                  color={theme.colors.textMuted}
                />
                <Text style={styles.emptyText}>Select or create a file to start coding</Text>
              </View>
            )}
          </View>
        </View>

        <Modal
          visible={showNewFileModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNewFileModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New File</Text>
              <TextInput
                style={styles.modalInput}
                value={newFileName}
                onChangeText={setNewFileName}
                placeholder="filename.js"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />
              <View style={styles.modalActions}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    setShowNewFileModal(false);
                    setNewFileName('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleCreateFile}
                >
                  <Text style={styles.modalButtonTextPrimary}>Create</Text>
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
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: theme.colors.surface,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    padding: theme.spacing.sm,
  },
  sidebarTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  fileItemActive: {
    backgroundColor: theme.colors.background,
  },
  fileName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  fileNameActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  editor: {
    flex: 1,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  editorTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  editorActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  saveButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.background,
    marginLeft: theme.spacing.xs,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  codeContainer: {
    flex: 1,
  },
  codeInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    color: theme.colors.text,
    lineHeight: 20,
  },
  emptyEditor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
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
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
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
