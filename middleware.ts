import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate-limiting constants
const RATE_LIMIT = 20; // requests
const WINDOW_MS = 60 * 1000; // 1 minute
const ipStore = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  /**
   * ---------------------------
   * 🛡️ Rate Limiting
   * ---------------------------
   */
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip =
      request.ip ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';

    const now = Date.now();
    const record = ipStore.get(ip);

    if (record) {
      const elapsed = now - record.timestamp;

      if (elapsed < WINDOW_MS) {
        if (record.count >= RATE_LIMIT) {
          return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        // Reset window
        record.count = 1;
        record.timestamp = now;
      }
    } else {
      ipStore.set(ip, { count: 1, timestamp: now });
    }
  }

  /**
   * ---------------------------
   * 🛡️ Security Headers
   * ---------------------------
   */
  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME-type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Enable XSS protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://accounts.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
    "connect-src 'self' https://api.chainshield.ai https://subs.tokencheck.ai https://subscriptions.tokencheck.ai https://api.stripe.com https://accounts.google.com https://api.github.com https://api.twitter.com https://api.x.com",
    "frame-src https://js.stripe.com https://checkout.stripe.com https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com https://github.com https://api.twitter.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  response.headers.set('Content-Security-Policy', cspHeader);

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files
     * Apply rate limiting only to API routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

