'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Activity } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-xl">TokenCheck.ai</span>
          </Link>
          <Link 
            href="/api-plans" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            API Plans
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Link href="/register">
            <Button variant="default">Sign Up</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}