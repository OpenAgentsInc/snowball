import { NextResponse } from "next/server";
import { view_file } from '../handlers/github/view_file';
import { view_folder } from '../handlers/github/view_folder';
import { githubIntents } from '../intents/github';

// Tool handlers
const handlers = {
  view_file,
  view_folder
};

// Find matching intent handler
function findIntentHandler(intent: string) {
  return githubIntents.find(pattern => pattern.pattern.test(intent));
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