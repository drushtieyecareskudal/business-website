/* import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JWT_SECRET } from '@/utils/auth';
import { verify } from 'jsonwebtoken';

// Helper function to get token from request
function getTokenFromRequest(request: NextRequest): string | null {
  try {
    // First try the Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    
    // Then try the cookie
    const token = request.cookies.get('admin_token');
    if (token) {
      return token.value;
    }
  } catch (error) {
    console.error('Error getting token from request:', error);
  }
  
  return null;
}

export function middleware(request: NextRequest) {
  console.log('Middleware checking path:', request.nextUrl.pathname);
  
  // Check if the path is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isApiRoute = request.nextUrl.pathname.startsWith('/admin/api');
  
  // Routes that should be excluded from authentication
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isLoginApi = request.nextUrl.pathname === '/admin/api/auth/login';
  
  // Skip middleware for non-admin routes
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Skip auth check for excluded routes
  if (isLoginPage || isLoginApi) {
    console.log('Skipping auth check for login page/API');
    return NextResponse.next();
  }
  
  // Get token from request (either from Authorization header or cookie)
  const token = getTokenFromRequest(request);
  console.log('Token found:', !!token);
  
  // If no token found, redirect to login
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  try {
    // Verify JWT token
    const payload = verify(token, JWT_SECRET);
    console.log('Token verified successfully');
    
    // For API routes, handle authentication differently
    if (isApiRoute) {
      return NextResponse.next();
    }
    
    // For regular admin pages, continue to the page
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    
    // For API routes, return unauthorized response
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // For regular admin pages, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

// Apply middleware to all admin routes and API routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin/api/:path*',
  ],
};
*/