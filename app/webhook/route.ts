import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Log all headers
  console.log('Webhook headers:');
  request.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  // Log the request body
  const body = await request.json();
  console.log('Webhook body:', body);

  // Return 200 OK
  return NextResponse.json({ status: 'ok' });
}

// Also handle GET requests for testing
export async function GET(request: Request) {
  // Log all headers
  console.log('Webhook headers:');
  request.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  console.log('GET request received on webhook endpoint');
  return NextResponse.json({ status: 'ok' });
}
