/**
 * Security middleware tests
 * Tests that security headers are properly set by the middleware
 */

import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

// Mock NextRequest
function createMockRequest(url: string): NextRequest {
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
