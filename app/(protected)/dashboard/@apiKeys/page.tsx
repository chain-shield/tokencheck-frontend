'use client'
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Trash2 } from 'lucide-react';
import { CreateApiKeyModal } from '../components/api-key-modal';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogTitle, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { createKey, deleteKey, getAllKeys } from '@/utils/keyService';
import { ApiKey } from '@/lib/models/models';
import { toast } from '@/hooks/use-toast';

export default function ApiKeysPage() {
  const { data: keys, error, isLoading } = useSWR<ApiKey[]>(
    "api-keys", getAllKeys
  )
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  useEffect(() => {
    console.log(keys)
    if (keys) setApiKeys(keys);
  }, [keys])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Key copied to clipboard",
    });
    // You could add a toast notification here
  };

  const handleCreateKey = async (appName: string) => {
    try {
      const { id, key, name, created_at, status } = await createKey(appName);
      const newApiKey: ApiKey = { id, key, name, created_at, status };

      if (status == 'active') {
        setApiKeys([...apiKeys, newApiKey]);
      }
    } catch (error) {
      toast({
        title: "Failed to Create Key",
        description: error instanceof Error && error.message,
        variant: "destructive",
      });

    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await deleteKey(id);
      console.log(response);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      setKeyToDelete(null);
    } catch (error) {
      toast({
        title: "Failed to Delete Key",
        description: error instanceof Error && error.message,
        variant: "destructive",
      });

    }

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
                    <td className="py-4">{key.name}</td>
                    <td className="py-4">
                      <code className="bg-secondary px-2 py-1 rounded text-sm">
                        {key.key}
                      </code>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {formatDate(key.created_at)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-500 hover:text-blue-600 p-0 h-auto font-normal"
                        >
                          Stats
                        </Button>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(key.key)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setKeyToDelete(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone,
              and any applications using this key will immediately lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => keyToDelete && handleDeleteKey(keyToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
