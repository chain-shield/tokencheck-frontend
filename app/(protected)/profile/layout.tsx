'use client';

import { ReactNode } from 'react';
import { TabProvider } from '@/context/TabContext';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <TabProvider defaultTab="profile">
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <h1 className="text-2xl font-bold">Account Settings</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </TabProvider>
  );
}
