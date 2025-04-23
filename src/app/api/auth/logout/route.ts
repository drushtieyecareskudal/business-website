import { NextResponse } from 'next/server';

export async function GET() {
  // Create a response
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
  
  // Clear the token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    expires: new Date(0), // Set expiration to the past to delete the cookie
    path: '/'
  });
  
  return response;
}