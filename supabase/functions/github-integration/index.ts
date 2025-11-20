// GitHub API Integration Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  action: 'list-repos' | 'get-repo-files' | 'get-file-content';
  githubToken?: string;
  repoOwner?: string;
  repoName?: string;
  filePath?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { action, githubToken, repoOwner, repoName, filePath } = body;

    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: 'GitHub token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`GitHub API: ${action} for user ${user.id}`);

    // Handle different actions
    let result;
    switch (action) {
      case 'list-repos':
        result = await listUserRepos(githubToken);
        break;
      
      case 'get-repo-files':
        if (!repoOwner || !repoName) {
          throw new Error('repoOwner and repoName are required');
        }
        result = await getRepoFiles(githubToken, repoOwner, repoName);
        break;
      
      case 'get-file-content':
        if (!repoOwner || !repoName || !filePath) {
          throw new Error('repoOwner, repoName, and filePath are required');
        }
        result = await getFileContent(githubToken, repoOwner, repoName, filePath);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('GitHub Integration Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function listUserRepos(token: string) {
  const response = await fetch('https://api.github.com/user/repos?per_page=100', {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AI-Council-App'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API: ${response.statusText}`);
  }

  const repos = await response.json();
  return repos.map((repo: any) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    private: repo.private,
    language: repo.language,
    updatedAt: repo.updated_at
  }));
}

async function getRepoFiles(token: string, owner: string, repo: string, path = '') {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AI-Council-App'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API: ${response.statusText}`);
  }

  const files = await response.json();
  return Array.isArray(files) ? files.map((file: any) => ({
    name: file.name,
    path: file.path,
    type: file.type,
    size: file.size,
    downloadUrl: file.download_url
  })) : [];
}

async function getFileContent(token: string, owner: string, repo: string, path: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'AI-Council-App'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API: ${response.statusText}`);
  }

  return await response.text();
}
