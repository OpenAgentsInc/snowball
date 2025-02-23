import { validateGitHubToken, isAllowedPath } from '../../utils/github';

export async function view_folder(params: any) {
  const token = validateGitHubToken();
  const { path: folderpath, owner, repo, branch } = params;

  if (!folderpath) {
    throw new Error('Please specify which folder you want to view');
  }

  // Check if this is an allowed path
  if (!isAllowedPath(owner, repo, folderpath, branch)) {
    throw new Error('This folder is not publicly accessible');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folderpath}?ref=${branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('GitHub authentication failed. Please check the token configuration.');
    }

    if (response.status === 404) {
      throw new Error(`Folder not found: ${folderpath}`);
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const contents = await response.json();
    
    // Format the response to show files and folders
    const formattedContents = contents.map((item: any) => ({
      name: item.name,
      type: item.type,
      path: item.path,
      size: item.size
    }));

    return formattedContents;
  } catch (error: any) {
    // Add context to the error
    if (error.message.includes('authentication failed')) {
      console.error('GitHub Auth Error:', error);
      throw new Error('Sorry, I cannot access GitHub right now due to an authentication issue. Please try again later or contact support.');
    }
    if (error.message.includes('not found')) {
      throw new Error(`I couldn't find that folder. Are you sure '${folderpath}' exists in ${owner}/${repo} on branch '${branch}'?`);
    }
    throw error;
  }
}