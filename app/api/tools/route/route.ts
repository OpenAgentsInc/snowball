import { NextResponse } from "next/server";
import { view_file } from '../handlers/github/view_file';
import { view_folder } from '../handlers/github/view_folder';
import { selectTool, validateToolSelection } from '../llm/groq';
import { availableTools } from '../types';

// Tool handlers
const handlers = {
  view_file,
  view_folder
};

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

    // Use LLM to select tool and extract parameters
    const { tool, parameters, confidence, reasoning } = await selectTool(intent, availableTools);
    
    console.log('\n=== TOOL SELECTION ===');
    console.log('Selected tool:', tool);
    console.log('Confidence:', confidence);
    console.log('Reasoning:', reasoning);
    console.log('Parameters:', parameters);
    console.log('=== END TOOL SELECTION ===\n');

    // Validate selection if confidence is borderline
    if (confidence >= 0.5 && confidence < 0.7) {
      const validation = await validateToolSelection(intent, tool, parameters, availableTools);
      
      console.log('\n=== VALIDATION ===');
      console.log('Validation result:', validation);
      console.log('=== END VALIDATION ===\n');

      if (!validation.isValid) {
        return NextResponse.json({
          error: `I'm not sure I understood correctly. ${validation.reasoning}${validation.suggestedPrompt ? `\n\nTry rephrasing like this: "${validation.suggestedPrompt}"` : ''}`,
          missingParameters: validation.missingParameters
        }, { status: 400 });
      }
    }
    // Reject if confidence is too low
    else if (confidence < 0.5) {
      return NextResponse.json({
        error: `I'm not confident I understand what you want to do. Could you rephrase that?\n\nMy understanding: ${reasoning}`,
      }, { status: 400 });
    }

    // Get the tool handler
    const toolHandler = handlers[tool as keyof typeof handlers];
    if (!toolHandler) {
      return NextResponse.json(
        { error: `I understand you want to ${tool}, but I haven't learned how to do that yet.` },
        { status: 501 }
      );
    }

    try {
      // Execute the tool
      const result = await toolHandler(parameters);

      // Log the response
      const response = { result };
      console.log('\n=== RESPONSE ===');
      console.log(JSON.stringify(response, null, 2));
      console.log('=== END RESPONSE ===\n');

      // Return the result
      return NextResponse.json(response);
    } catch (error: any) {
      // Handle tool execution errors
      console.error('\n=== TOOL ERROR ===');
      console.error('Error executing tool:', error);
      console.error('=== END TOOL ERROR ===\n');

      const message = error.message || 'Error executing tool';
      
      // Handle specific error cases
      if (message.includes('not publicly accessible')) {
        return NextResponse.json({
          error: `I can't access that ${tool === 'view_file' ? 'file' : 'folder'}. Please check the path and try again.`,
          parameters
        }, { status: 403 });
      }
      if (message.includes('not found')) {
        return NextResponse.json({
          error: `I couldn't find that ${tool === 'view_file' ? 'file' : 'folder'}. Please check the path and try again.`,
          parameters
        }, { status: 404 });
      }

      // Generic error
      return NextResponse.json({
        error: message,
        parameters
      }, { status: 500 });
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
    const { validateGitHubToken } = require('../utils/github');
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