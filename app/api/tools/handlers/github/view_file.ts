import { validateGitHubToken, isAllowedPath } from '../../utils/github';

export async function view_file(params: any) {
  const token = validateGitHubToken();
  const { path: filepath, owner, repo, branch } = params;

  if (!filepath) {
    throw new Error('Please specify which file you want to read');
  }
  
  // Check if this is an allowed path
  if (!isAllowedPath(owner, repo, filepath, branch)) {
    throw new Error('This file is not publicly accessible');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('GitHub authentication failed. Please check the token configuration.');
    }

    if (response.status === 404) {
      throw new Error(`File not found: ${filepath}`);
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error: any) {
    // Add context to the error
    if (error.message.includes('authentication failed')) {
      console.error('GitHub Auth Error:', error);
      throw new Error('Sorry, I cannot access GitHub right now due to an authentication issue. Please try again later or contact support.');
    }
    if (error.message.includes('not found')) {
      throw new Error(`I couldn't find that file. Are you sure '${filepath}' exists in ${owner}/${repo} on branch '${branch}'?`);
    }
    throw error;
  }
}