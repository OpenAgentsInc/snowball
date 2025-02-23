import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

// Validate GitHub token is configured
function validateGitHubToken() {
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
function isAllowedPath(owner: string, repo: string, filepath: string, branch: string): boolean {
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

// Extract file path from intent
function extractFilePath(intent: string): string | null {
  // Common file patterns
  const patterns = [
    /(?:read|view|show|get|fetch)\s+(?:the\s+)?([^\s]+(?:\.[\w]+)?)/i,
    /what'?s?\s+in\s+(?:the\s+)?([^\s]+(?:\.[\w]+)?)/i,
    /contents?\s+of\s+(?:the\s+)?([^\s]+(?:\.[\w]+)?)/i
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

// Tool handlers
const handlers = {
  view_file: async (params: any) => {
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
};

// Intent patterns and their corresponding tools
const intentPatterns = [
  {
    pattern: /read|view|show|get|fetch|what'?s?\s+in|contents?\s+of/i,
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
  }
];

// Find matching intent handler
function findIntentHandler(intent: string) {
  return intentPatterns.find(pattern => pattern.pattern.test(intent));
}

export async function POST(request: Request) {
  try {
    // Log all request details
    console.log('\n=== ELEVENLABS TOOL REQUEST ===');
    console.log('Timestamp:', new Date().toISOString());
    
    // Log headers
    console.log('\nHeaders:');
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
      headers[key] = value;
    });

    // Get and log raw body
    const rawBody = await request.text();
    console.log('\nRaw Body:', rawBody);

    // Parse body and log structured version
    const body = JSON.parse(rawBody);
    console.log('\nParsed Body:', JSON.stringify(body, null, 2));

    // Log URL and method
    console.log('\nRequest URL:', request.url);
    console.log('Request Method:', request.method);
    
    console.log('\n=== END REQUEST DETAILS ===\n');

    // Extract intent and context
    const { intent, context = {} } = body;

    if (!intent) {
      return NextResponse.json(
        { error: 'Please tell me what you would like to do.' },
        { status: 400 }
      );
    }

    // Find matching intent handler
    const handler = findIntentHandler(intent);
    if (!handler) {
      return NextResponse.json(
        { error: `I'm not sure how to '${intent}'. Could you rephrase that or try asking for something else?` },
        { status: 400 }
      );
    }

    console.log('\nMatched intent pattern:', handler.pattern);
    console.log('Selected tool:', handler.tool);

    try {
      // Extract parameters from intent and context
      const params = handler.extractParams(intent, context);
      console.log('\nExtracted parameters:', params);

      // Validate required parameters are present
      const toolHandler = handlers[handler.tool as keyof typeof handlers];
      if (!toolHandler) {
        return NextResponse.json(
          { error: `I understand you want to ${handler.tool}, but I haven't learned how to do that yet.` },
          { status: 501 }
        );
      }

      // Execute the tool
      const result = await toolHandler(params);

      // Log the response
      const response = { result };
      console.log('\n=== RESPONSE ===');
      console.log(JSON.stringify(response, null, 2));
      console.log('=== END RESPONSE ===\n');

      // Return the result
      return NextResponse.json(response);
    } catch (error: any) {
      // Handle parameter extraction errors
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

  } catch (error: any) {
    // Log the error
    console.error('\n=== ERROR ===');
    console.error('Error processing tool request:', error);
    console.error('=== END ERROR ===\n');

    // Return user-friendly error messages
    const message = error.message || 'Something went wrong';
    const isAuthError = message.includes('authentication') || message.includes('GITHUB_TOKEN');
    
    return NextResponse.json(
      { 
        error: isAuthError 
          ? "I'm having trouble accessing GitHub right now. Please try again later or contact support."
          : message
      },
      { status: isAuthError ? 503 : 500 }
    );
  }
}

// For testing the endpoint
export async function GET() {
  try {
    // Test GitHub token on startup
    validateGitHubToken();
    return NextResponse.json({
      status: 'ok',
      message: 'Tool routing endpoint is running and GitHub token is configured'
    });
  } catch (error) {
    console.error('Startup check failed:', error);
    return NextResponse.json({
      status: 'warning',
      message: 'Tool routing endpoint is running but GitHub access is not configured'
    });
  }
}