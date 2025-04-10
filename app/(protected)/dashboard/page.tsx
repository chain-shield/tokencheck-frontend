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

import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { CreateApiKeyModal } from './components/api-key-modal';

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