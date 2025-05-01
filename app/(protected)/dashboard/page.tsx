'use client';

/**
 * Dashboard Page Component
 *
 * This is the main dashboard page for authenticated users.
 * It provides access to API keys, usage statistics, and account management.
 *
 * The dashboard uses parallel routes (@apiKeys, @apiPlans, @docs) to organize content
 * into different sections that are loaded and displayed simultaneously.
 */

import { Button } from '@/components/ui/button';

/**
 * Main dashboard page component
 *
 * @returns The dashboard header with title and sign out button
 */
export default function DashboardPage() {
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">API Dashboard</h1>
        </div>
        {/* Sign out button - redirects to logout endpoint */}
        <Button variant="outline" onClick={() => window.location.href = '/logout'}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
