import { getSupabaseClient } from '@/template';
import { WebPage } from '@/types/council';

const supabase = getSupabaseClient();

export const webService = {
  async browseUrl(url: string, saveHistory = true): Promise<{ data: WebPage | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }

      const { data, error } = await supabase.functions.invoke('web-browse', {
        body: { url, saveHistory },
      });

      if (error) throw error;
      return { data: data.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getHistory(): Promise<{ data: WebPage[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('web_history')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { data: data as WebPage[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async clearHistory(): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('web_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
