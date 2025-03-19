'use client';

import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function DashboardPage() {
  const [apiKeys] = useState([
    {
      appName: 'Default App',
      key: 'tk_live_12345_SAMPLE_KEY',
      created: '2025-01-09',
      stats: {
        used: 0,
        remaining: 100000,
      }
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-4 py-8">
        {/* User Info Card */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Current API Plan</h2>
              <p className="text-muted-foreground">user@example.com</p>
            </div>
            <Button>Upgrade Plan</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>API Calls Used Today</span>
                  <span>0 / 100,000</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Free API Plan - Up to 100,000 calls per day
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rate Limit:</span>
                <span className="text-sm">5 calls/second</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Daily Limit:</span>
                <span className="text-sm">100,000 calls</span>
              </div>
            </div>
          </div>
        </Card>

        {/* API Keys Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <Button>
              Create New Key
            </Button>
          </div>

          <Card>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-4">App Name</th>
                      <th className="pb-4">API Key</th>
                      <th className="pb-4">Created</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4">{key.appName}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <code className="bg-secondary px-2 py-1 rounded text-sm">
                              {key.key}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(key.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-4">{key.created}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              View Stats
                            </Button>
                            <Button variant="outline" size="sm">
                              View Logs
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Documentation Notice */}
        <Card className="p-6 bg-secondary/50">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="font-semibold mb-2">API Documentation</h3>
              <p className="text-muted-foreground mb-4">
                For developers interested in building applications using our API Service, please refer to our comprehensive documentation.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                View Documentation
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}