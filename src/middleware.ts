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
      
      // ✅ Đúng structure: connections là Map với __type và value
      const connections = wagmiState?.state?.connections;
      
      if (!connections || connections.__type !== 'Map' || !connections.value || connections.value.length === 0) {
        console.log(`🚫 Middleware: Blocking ${pathname} - no active connections`);
        console.log('Connections data:', connections);
        return NextResponse.redirect(new URL('/?blocked=wallet', request.url));
      }
      
      // Check if có connection active
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activeConnections: [string, any][] = connections.value;
      const currentConnectionId = wagmiState?.state?.current;
      
      console.log('Active connections:', activeConnections);
      console.log('Current connection ID:', currentConnectionId);
      
      // Kiểm tra connection hiện tại có accounts không
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentConnection = activeConnections.find(([id, _]: [string, any]) => id === currentConnectionId);
      
      if (!currentConnection) {
        console.log(`🚫 Middleware: Blocking ${pathname} - no current connection`);
        return NextResponse.redirect(new URL('/?blocked=wallet', request.url));
      }
      
      const [_, connectionData] = currentConnection;
      
      if (!connectionData.accounts || connectionData.accounts.length === 0) {
        console.log(`🚫 Middleware: Blocking ${pathname} - no accounts in connection`);
        return NextResponse.redirect(new URL('/?blocked=wallet', request.url));
      }
      
      console.log(`✅ Middleware: Valid connection found for ${connectionData.connector.name}`);
      console.log(`✅ Connected account: ${connectionData.accounts[0]}`);
      
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