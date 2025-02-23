import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

// Tool handlers
const handlers = {
  view_file: async (params: any) => {
    const { path, owner, repo, branch } = params;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.text();
  }
};

// Intent patterns and their corresponding tools
const intentPatterns = [
  {
    pattern: /read|view|show|get|fetch.*(?:file|content)/i,
    tool: 'view_file',
    extractParams: (intent: string, context: any) => {
      // For now just pass through any provided params
      // TODO: Use NLP to extract params from intent string
      return {
        path: context.path || context.file || context.filepath,
        owner: context.owner || 'OpenAgentsInc',
        repo: context.repo || context.repository || 'snowball',
        branch: context.branch || 'main'
      };
    }
  }
  // TODO: Add more intent patterns for other tools
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
        { error: 'Intent is required' },
        { status: 400 }
      );
    }

    // Find matching intent handler
    const handler = findIntentHandler(intent);
    if (!handler) {
      return NextResponse.json(
        { error: `I don't know how to '${intent}'. Please try rephrasing or ask for something else.` },
        { status: 400 }
      );
    }

    console.log('\nMatched intent pattern:', handler.pattern);
    console.log('Selected tool:', handler.tool);

    // Extract parameters from intent and context
    const params = handler.extractParams(intent, context);
    console.log('\nExtracted parameters:', params);

    // Validate required parameters are present
    const toolHandler = handlers[handler.tool as keyof typeof handlers];
    if (!toolHandler) {
      return NextResponse.json(
        { error: `Tool '${handler.tool}' not implemented yet` },
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

  } catch (error) {
    // Log the error
    console.error('\n=== ERROR ===');
    console.error('Error processing tool request:', error);
    console.error('=== END ERROR ===\n');

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For testing the endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Tool routing endpoint is running'
  });
}