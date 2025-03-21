'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Activity } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContent';
import { useRouter } from 'next/navigation';

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

  // Display loading indicator while authentication state is being determined
  if (loading) return <div>Loading...</div>;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left section: Logo and primary navigation */}
        <div className="flex items-center space-x-6">
          {/* Brand logo and name */}
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-xl">TokenCheck.ai</span>
          </Link>
          {/* Main navigation links */}
          <Link 
            href="/api-plans" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            API Plans
          </Link>
        </div>
        
        {/* Right section: Theme toggle and authentication controls */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <ModeToggle />
          
          {/* Conditional rendering based on authentication state */}
          {isAuthenticated ? (
            <>
              {/* Authenticated user options */}
              <Link href="/dashboard">
                <Button variant="default">Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Settings</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Unauthenticated user options */}
              <Link href="/register">
                <Button variant="default">Sign Up</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}