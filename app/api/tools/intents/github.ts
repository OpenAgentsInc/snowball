// Extract file path from intent
function extractFilePath(intent: string): string | null {
  // Common file patterns
  const patterns = [
    /(?:read|view|show|get|fetch)\\s+(?:the\\s+)?([^\\s]+(?:\\.[\\w]+)?)/i,
    /what'?s?\\s+in\\s+(?:the\\s+)?([^\\s]+(?:\\.[\\w]+)?)/i,
    /contents?\\s+of\\s+(?:the\\s+)?([^\\s]+(?:\\.[\\w]+)?)/i
  ];

  // Special cases
  if (intent.toLowerCase().includes('readme')) return 'README.md';
  if (intent.toLowerCase().includes('package.json')) return 'package.json';

  // Try each pattern
  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Extract folder path from intent
function extractFolderPath(intent: string): string | null {
  // Common folder patterns
  const patterns = [
    /(?:list|show|view|get)\\s+(?:the\\s+)?(?:contents?\\s+of\\s+)?(?:folder|directory|dir)?\\s*([^\\s]+)/i,
    /what'?s?\\s+in\\s+(?:the\\s+)?(?:folder|directory|dir)?\\s*([^\\s]+)/i
  ];

  // Try each pattern
  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Intent patterns and their corresponding tools
export const githubIntents = [
  {
    pattern: /read|view|show|get|fetch|what'?s?\\s+in|contents?\\s+of/i,
    tool: 'view_file',
    extractParams: (intent: string, context: any) => {
      // Try to get path from context first
      let filepath = context.path || context.file || context.filepath;
      
      // If no path in context, try to extract from intent
      if (!filepath) {
        filepath = extractFilePath(intent);
      }

      const params = {
        path: filepath,
        owner: context.owner || 'OpenAgentsInc',
        repo: context.repo || context.repository || 'snowball',
        branch: context.branch || 'main'
      };

      // Validate required params
      if (!params.path) {
        throw new Error('Please specify which file you want to read');
      }

      return params;
    }
  },
  {
    pattern: /(?:list|show|view|get)\\s+(?:folder|directory|dir)|what'?s?\\s+in\\s+(?:folder|directory|dir)/i,
    tool: 'view_folder',
    extractParams: (intent: string, context: any) => {
      // Try to get path from context first
      let folderpath = context.path || context.folder || context.directory;
      
      // If no path in context, try to extract from intent
      if (!folderpath) {
        folderpath = extractFolderPath(intent);
      }

      const params = {
        path: folderpath,
        owner: context.owner || 'OpenAgentsInc',
        repo: context.repo || context.repository || 'snowball',
        branch: context.branch || 'main'
      };

      // Validate required params
      if (!params.path) {
        throw new Error('Please specify which folder you want to view');
      }

      return params;
    }
  }
];