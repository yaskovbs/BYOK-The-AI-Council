import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodeFile } from '@/types/council';

const CODE_FILES_STORAGE_KEY = 'byok_code_files';

export const codeService = {
  async saveCodeFile(file: Partial<CodeFile>): Promise<{ data: CodeFile | null; error: string | null }> {
    try {
      const fullFile: CodeFile = {
        id: Date.now().toString(),
        filename: file.filename || 'unnamed.js',
        content: file.content || '',
        language: file.language || 'javascript',
        filePath: file.filePath,
        repoName: file.repoName,
        isFromGithub: file.isFromGithub || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to local storage
      const existingFiles = await this.getCodeFiles();
      const updatedFiles = existingFiles.data ? [...existingFiles.data, fullFile] : [fullFile];

      await AsyncStorage.setItem(CODE_FILES_STORAGE_KEY, JSON.stringify(updatedFiles));

      return { data: fullFile, error: null };
    } catch (error: any) {
      console.warn('[CodeService] Error saving code file:', error);
      return { data: null, error: 'Failed to save code file locally' };
    }
  },

  async getCodeFiles(): Promise<{ data: CodeFile[] | null; error: string | null }> {
    try {
      const storedData = await AsyncStorage.getItem(CODE_FILES_STORAGE_KEY);
      if (!storedData) {
        return { data: [], error: null };
      }

      const files = JSON.parse(storedData) as CodeFile[];
      // Sort by updatedAt descending
      files.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      return { data: files, error: null };
    } catch (error: any) {
      console.warn('[CodeService] Error getting code files:', error);
      return { data: null, error: 'Failed to load code files from local storage' };
    }
  },

  async updateCodeFile(id: string, updates: Partial<CodeFile>): Promise<{ error: string | null }> {
    try {
      const existingFilesResult = await this.getCodeFiles();
      if (existingFilesResult.error || !existingFilesResult.data) {
        return { error: 'Failed to load existing files' };
      }

      const files = existingFilesResult.data;
      const fileIndex = files.findIndex(f => f.id === id);

      if (fileIndex === -1) {
        return { error: 'File not found' };
      }

      const updatedFile = {
        ...files[fileIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      files[fileIndex] = updatedFile;

      await AsyncStorage.setItem(CODE_FILES_STORAGE_KEY, JSON.stringify(files));

      return { error: null };
    } catch (error: any) {
      console.warn('[CodeService] Error updating code file:', error);
      return { error: 'Failed to update code file' };
    }
  },

  async deleteCodeFile(id: string): Promise<{ error: string | null }> {
    try {
      const existingFilesResult = await this.getCodeFiles();
      if (existingFilesResult.error || !existingFilesResult.data) {
        return { error: 'Failed to load existing files' };
      }

      const files = existingFilesResult.data.filter(f => f.id !== id);

      await AsyncStorage.setItem(CODE_FILES_STORAGE_KEY, JSON.stringify(files));

      return { error: null };
    } catch (error: any) {
      console.warn('[CodeService] Error deleting code file:', error);
      return { error: 'Failed to delete code file' };
    }
  },

  async uploadFile(file: { uri: string; name: string; type: string }): Promise<{ data: string | null; error: string | null }> {
    try {
      // Convert file to base64 for local storage
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);

      // Create a local file reference
      const fileId = Date.now().toString();
      const localFileUrl = `local://${fileId}_${file.name}`;

      // Save file metadata to code files
      const codeFile: Partial<CodeFile> = {
        filename: file.name,
        content: `// File uploaded locally\n// Original type: ${file.type}\n// Base64: ${base64}`,
        language: this.getLanguageFromFileName(file.name),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saveResult = await this.saveCodeFile({
        ...codeFile,
        content: `// Local file: ${file.name}\n// Generated: ${new Date().toISOString()}\n\n// Original content stored as base64:\n// ${base64}`,
      });

      if (saveResult.error) {
        return { data: null, error: saveResult.error };
      }

      return { data: localFileUrl, error: null };
    } catch (error: any) {
      console.warn('[CodeService] Error uploading file:', error);
      return { data: null, error: 'Failed to upload file locally' };
    }
  },

  getLanguageFromFileName(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'c++',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'html': 'html',
      'css': 'css',
      'md': 'markdown',
      'json': 'json',
      'xml': 'xml',
      'yml': 'yaml',
      'yaml': 'yaml',
    };

    return languageMap[ext || ''] || 'text';
  },
};

// Helper function to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove the data: prefix
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
