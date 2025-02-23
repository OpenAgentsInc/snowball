// Validate GitHub token is configured
export function validateGitHubToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not configured');
  }
  return token;
}

// Check if a path is allowed
export function isAllowedPath(owner: string, repo: string, filepath: string, branch: string): boolean {
  if (!filepath) {
    console.warn('No filepath provided');
    return false;
  }

  // Only allow access to OpenAgentsInc/snowball on main branch
  if (owner !== 'OpenAgentsInc' || repo !== 'snowball' || branch !== 'main') {
    console.warn(`Attempted access to unauthorized repo/branch: ${owner}/${repo}@${branch}`);
    return false;
  }

  return true;
}