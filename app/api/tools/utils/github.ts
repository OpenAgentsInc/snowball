// Validate GitHub token is configured
export function validateGitHubToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not configured');
  }
  return token;
}

// Allowed repositories and paths
const ALLOWED_REPOS = {
  'OpenAgentsInc/snowball': {
    allowedPaths: [
      'README.md',
      'package.json',
      'docs/',
      'components/',
      'app/',
      'tools/'
    ],
    publicBranches: ['main']
  }
};

// Check if a path is allowed
export function isAllowedPath(owner: string, repo: string, filepath: string, branch: string): boolean {
  if (!filepath) {
    console.warn('No filepath provided');
    return false;
  }

  const repoKey = `${owner}/${repo}`;
  const repoConfig = ALLOWED_REPOS[repoKey as keyof typeof ALLOWED_REPOS];
  
  if (!repoConfig) {
    console.warn(`Attempted access to unauthorized repo: ${repoKey}`);
    return false;
  }

  if (!repoConfig.publicBranches.includes(branch)) {
    console.warn(`Attempted access to unauthorized branch: ${branch} in ${repoKey}`);
    return false;
  }

  return repoConfig.allowedPaths.some(allowedPath => {
    if (allowedPath.endsWith('/')) {
      return filepath.startsWith(allowedPath);
    }
    return filepath === allowedPath;
  });
}