import { getSupabaseClient } from '@/template';
import { GitHubRepo, CodeFile } from '@/types/council';

const supabase = getSupabaseClient();

export const githubService = {
  async listRepos(githubToken: string): Promise<{ data: GitHubRepo[] | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }

      const { data, error } = await supabase.functions.invoke('github-integration', {
        body: { action: 'list-repos', githubToken },
      });

      if (error) throw error;
      return { data: data.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getRepoFiles(
    githubToken: string,
    repoOwner: string,
    repoName: string
  ): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }

      const { data, error } = await supabase.functions.invoke('github-integration', {
        body: { action: 'get-repo-files', githubToken, repoOwner, repoName },
      });

      if (error) throw error;
      return { data: data.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getFileContent(
    githubToken: string,
    repoOwner: string,
    repoName: string,
    filePath: string
  ): Promise<{ data: string | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }

      const { data, error } = await supabase.functions.invoke('github-integration', {
        body: { action: 'get-file-content', githubToken, repoOwner, repoName, filePath },
      });

      if (error) throw error;
      return { data: data.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async saveRepoMetadata(repo: GitHubRepo): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Not authenticated' };
      }

      const { error } = await supabase.from('github_repos').insert({
        user_id: user.id,
        repo_name: repo.name,
        repo_url: repo.url,
        description: repo.description,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getUserRepos(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('github_repos')
        .select('*')
        .order('last_synced_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
