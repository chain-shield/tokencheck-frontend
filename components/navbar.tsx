'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

/**
 * Navbar Component
 *
 * Provides the main navigation interface for the application with:
 * - Brand logo and name
 * - Navigation links
 * - Authentication controls (login/logout/register)
 * - Theme toggle
 *
 * The component adapts its UI based on the user's authentication state.
 */
export function Navbar() {
  // Get authentication context values
  const { user, loading, logout } = useContext(AuthContext);
  // Track authentication state locally
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isBlogActive = pathname?.startsWith('/blog');

  // Update local authentication state whenever the user object changes
  useEffect(() => {
    // Convert user object to boolean (true if exists, false if null/undefined)
    setIsAuthenticated(!!user);
  }, [user]);

  /**
   * Handles user logout process:
   * 1. Calls the logout function from AuthContext
   * 2. Updates local authentication state
   * 3. Redirects user to login page
   */
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Only show loading indicator briefly during initial load
  // Don't show loading when we know the user is not authenticated
  if (loading && !isAuthenticated && user === undefined) {
    return (
      <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1" />
            <div className="flex items-center justify-center py-2">
              <Spinner size="md" />
            </div>
            <div className="flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/chainshield-logo.png"
                alt="ChainShield Logo"
                width={240}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#services"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#process"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Process
            </Link>
            <Link
              href="/#pricing"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className={
                isBlogActive
                  ? 'text-blue-600 font-medium'
                  : 'text-slate-600 hover:text-blue-600 transition-colors'
              }
            >
              Blog
            </Link>

            <Link href="/audit-request">
              <Button className="bg-blue-600 hover:bg-blue-700">Start Audit</Button>
            </Link>
          </div>

          {/* Optional authenticated controls (kept separate from marketing links) */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant={pathname === '/dashboard' ? 'default' : 'outline'}
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  size="sm"
                  variant={pathname === '/profile' ? 'default' : 'outline'}
                >
                  Settings
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
