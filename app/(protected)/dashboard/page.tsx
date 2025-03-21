'use client';

import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { CreateApiKeyModal } from './components/api-key-modal';

export default function DashboardPage() {

  return (
      <div className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">API Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/logout'}>
            Sign Out
          </Button>
        </div>
      </div>
  );
}