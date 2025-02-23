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

// Find a tool definition file recursively
async function findToolDefinition(toolsDir: string, toolName: string): Promise<string | null> {
  try {
    const entries = await fs.readdir(toolsDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(toolsDir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const found = await findToolDefinition(fullPath, toolName);
        if (found) return found;
      } else if (entry.isFile() && entry.name === `${toolName}.json`) {
        // Found the tool definition
        return fullPath;
      }
    }
  } catch (error) {
    console.error('Error searching for tool:', error);
  }
  
  return null;
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

    // Extract tool and parameters
    const { tool, parameters } = body;

    // Find tool definition recursively
    const toolsDir = path.join(process.cwd(), 'tools');
    const toolPath = await findToolDefinition(toolsDir, tool);
    
    if (!toolPath) {
      console.error('Tool definition not found:', tool);
      return NextResponse.json(
        { error: `Tool '${tool}' not found` },
        { status: 404 }
      );
    }

    // Load tool definition
    let toolDef;
    try {
      const toolContent = await fs.readFile(toolPath, 'utf8');
      toolDef = JSON.parse(toolContent);
      console.log('\nTool definition loaded:', toolDef);
    } catch (error) {
      console.error('Error loading tool definition:', error);
      return NextResponse.json(
        { error: `Error loading tool '${tool}'` },
        { status: 500 }
      );
    }

    // Validate parameters against schema
    const missingParams = toolDef.schema.parameters
      .filter(p => p.required && !parameters[p.name])
      .map(p => p.name);

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the handler for this tool
    const handler = handlers[tool as keyof typeof handlers];
    if (!handler) {
      return NextResponse.json(
        { error: `No handler implemented for tool '${tool}'` },
        { status: 501 }
      );
    }

    // Execute the tool
    const result = await handler(parameters);

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