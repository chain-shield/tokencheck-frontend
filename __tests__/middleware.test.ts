/**
 * Security middleware tests
 * Tests that security headers are properly set by the middleware
 *
 * Note: Next.js middleware types rely on Web Fetch globals (Request/Response/Headers).
 * In CI (Node 20) these exist, but locally this repo may run tests on older Node.
 * We polyfill *before* importing `next/server` to avoid import-time failures.
 */

// Ensure TextEncoder/TextDecoder exist before requiring undici (Node < 18 / Jest env).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamWeb = require('stream/web');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buffer = require('buffer');

const defineGlobal = (key: string, value: unknown) => {
  if (typeof (globalThis as any)[key] === 'undefined' && typeof value !== 'undefined') {
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
  }
};

defineGlobal('TextEncoder', util.TextEncoder);
defineGlobal('TextDecoder', util.TextDecoder);
defineGlobal('ReadableStream', streamWeb.ReadableStream);
defineGlobal('WritableStream', streamWeb.WritableStream);
defineGlobal('TransformStream', streamWeb.TransformStream);
defineGlobal('Blob', buffer.Blob);
defineGlobal('File', buffer.File);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const undici = require('undici');

defineGlobal('fetch', undici.fetch);
defineGlobal('Headers', undici.Headers);
defineGlobal('Request', undici.Request);
defineGlobal('Response', undici.Response);

// Import after globals are defined
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NextRequest } = require('next/server') as typeof import('next/server');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { middleware } = require('../middleware') as typeof import('../middleware');

// Mock NextRequest
function createMockRequest(url: string): import('next/server').NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

describe('Security Middleware', () => {
  beforeEach(() => {
    // Reset environment
    delete process.env.NODE_ENV;
  });

  it('should set basic security headers', () => {
    const request = createMockRequest('/');
    const response = middleware(request);

    // Check that security headers are set
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });

  it('should set Content Security Policy', () => {
    const request = createMockRequest('/');
    const response = middleware(request);

    const csp = response.headers.get('Content-Security-Policy');
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('https://js.stripe.com');
    expect(csp).toContain('https://accounts.google.com');
  });

  it('should set Permissions Policy', () => {
    const request = createMockRequest('/');
    const response = middleware(request);

    const permissionsPolicy = response.headers.get('Permissions-Policy');
    expect(permissionsPolicy).toBe('camera=(), microphone=(), geolocation=(), payment=(self)');
  });

  it('should set HSTS header in production', () => {
    process.env.NODE_ENV = 'production';

    const request = createMockRequest('/');
    const response = middleware(request);

    const hsts = response.headers.get('Strict-Transport-Security');
    expect(hsts).toBe('max-age=31536000; includeSubDomains; preload');
  });

  it('should not set HSTS header in development', () => {
    process.env.NODE_ENV = 'development';

    const request = createMockRequest('/');
    const response = middleware(request);

    const hsts = response.headers.get('Strict-Transport-Security');
    expect(hsts).toBeNull();
  });

  it('should allow OAuth provider domains in CSP', () => {
    const request = createMockRequest('/');
    const response = middleware(request);

    const csp = response.headers.get('Content-Security-Policy');

    // Check OAuth provider domains are allowed
    expect(csp).toContain('https://accounts.google.com');
    expect(csp).toContain('https://api.github.com');
    expect(csp).toContain('https://avatars.githubusercontent.com');
    expect(csp).toContain('https://lh3.googleusercontent.com');
  });

  it('should allow ChainShield API domains', () => {
    const request = createMockRequest('/');
    const response = middleware(request);

    const csp = response.headers.get('Content-Security-Policy');

    // Check ChainShield API domains are allowed
    expect(csp).toContain('https://api.chainshield.ai');
    expect(csp).toContain('https://subs.tokencheck.ai');
    expect(csp).toContain('https://subscriptions.tokencheck.ai');
  });

  it('should allow Stripe domains for payments', () => {
    const request = createMockRequest('/');
    const response = middleware(request);

    const csp = response.headers.get('Content-Security-Policy');

    // Check Stripe domains are allowed
    expect(csp).toContain('https://js.stripe.com');
    expect(csp).toContain('https://checkout.stripe.com');
    expect(csp).toContain('https://api.stripe.com');
  });
});
