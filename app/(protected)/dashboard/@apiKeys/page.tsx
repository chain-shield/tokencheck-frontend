'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { CreateApiKeyModal } from '../components/api-key-modal';

export default function ApiKeysPage() {

  const [apiKeys, setApiKeys] = useState([
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

  const handleCreateKey = (appName: string) => {
    const newKey = {
      appName,
      key: `tk_live_${Math.random().toString(36).substring(2)}`,
      created: new Date().toISOString().split('T')[0],
      stats: {
        used: 0,
        remaining: 100000,
      }
    };
    setApiKeys([...apiKeys, newKey]);
  };

    return (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <CreateApiKeyModal onCreateKey={handleCreateKey} />
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
        </>
    )
}