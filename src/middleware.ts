import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/'];
const PROTECTED_ROUTES = ['/dashboard', '/education', '/progress', '/achievements'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`🔍 Middleware checking: ${pathname}`);
  
  if (PROTECTED_ROUTES.includes(pathname)) {
    const cookieValue = request.cookies.get('wagmi.store')?.value;
    
    console.log('Connection cookie:', cookieValue);
    
    if (!cookieValue || cookieValue === 'undefined') {
      console.log(`🚫 Middleware: Blocking ${pathname} - no wallet connection`);
      return NextResponse.redirect(new URL('/?blocked=wallet', request.url));
    }
    
    try {
      const wagmiState = JSON.parse(cookieValue);
      
      // Check global state thay vì individual connections
      const hasConnections = wagmiState?.state?.connections?.value?.length > 0;
      const currentConnectionId = wagmiState?.state?.current;
      const globalChainId = wagmiState?.state?.chainId; // ← Use global chain
      
      console.log('Has connections:', hasConnections);
      console.log('Current connection ID:', currentConnectionId);
      console.log('Global chain ID:', globalChainId);
      console.log('Expected chain ID (Creditcoin):', 102031);
      
      if (!hasConnections || !currentConnectionId) {
        console.log(`🚫 Middleware: Blocking ${pathname} - no active connections`);
        return NextResponse.redirect(new URL('/?blocked=wallet', request.url));
      }
      
      // Optional: Check if on correct network
      if (globalChainId !== 102031) {
        console.log(`⚠️ Middleware: Wrong network (${globalChainId}), but allowing access`);
        // Không block, để client-side handle network switch
      }
      
      console.log(`✅ Middleware: Connection found, allowing access to ${pathname}`);
      
    } catch (error) {
      console.log(`🚫 Middleware: Blocking ${pathname} - invalid connection state`);
      console.log('Parse error:', error);
      return NextResponse.redirect(new URL('/?blocked=wallet', request.url));
    }
  }
  
  console.log(`✅ Middleware: Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};