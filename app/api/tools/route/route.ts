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

export async function POST(request: Request) {
  try {
    // Parse the incoming request
    const body = await request.json();
    const { tool, parameters } = body;

    console.log('Tool request received:', { tool, parameters });

    // Load tool definition
    const toolsDir = path.join(process.cwd(), 'tools');
    const toolPath = path.join(toolsDir, `${tool}.json`);
    let toolDef;
    
    try {
      const toolContent = await fs.readFile(toolPath, 'utf8');
      toolDef = JSON.parse(toolContent);
    } catch (error) {
      console.error('Error loading tool definition:', error);
      return NextResponse.json(
        { error: `Tool '${tool}' not found` },
        { status: 404 }
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

    // Return the result
    return NextResponse.json({ result });

  } catch (error) {
    console.error('Error processing tool request:', error);
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