import { getSupabaseClient } from '@/template';
import { CodeFile } from '@/types/council';

const supabase = getSupabaseClient();

export const codeService = {
  async saveCodeFile(file: Partial<CodeFile>): Promise<{ data: CodeFile | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('code_files')
        .insert({
          user_id: user.id,
          filename: file.filename,
          content: file.content,
          language: file.language || 'javascript',
          file_path: file.filePath,
          repo_name: file.repoName,
          is_from_github: file.isFromGithub || false,
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as CodeFile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getCodeFiles(): Promise<{ data: CodeFile[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { data: data as CodeFile[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateCodeFile(id: string, updates: Partial<CodeFile>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('code_files')
        .update({
          content: updates.content,
          filename: updates.filename,
          language: updates.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async deleteCodeFile(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('code_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async uploadFile(file: { uri: string; name: string; type: string }): Promise<{ data: string | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Not authenticated' };
      }

      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('uploaded-files')
        .upload(filePath, blob, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('uploaded-files')
        .getPublicUrl(filePath);

      return { data: urlData.publicUrl, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
