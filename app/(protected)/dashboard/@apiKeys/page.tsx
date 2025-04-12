'use client'

/**
 * API Keys Page Component
 *
 * This component displays a list of the user's API keys and provides functionality
 * to create new keys and delete existing ones. It includes:
 * - A table of existing API keys with their details
 * - A button to create new API keys
 * - Functionality to copy keys to clipboard
 * - A confirmation dialog for key deletion
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Trash2 } from 'lucide-react';
import { CreateApiKeyModal } from '../components/api-key-modal';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogTitle, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useApiKeys } from '@/hooks/use-api-keys';

export default function ApiKeysPage() {
  // Use the custom hook to manage API keys
  const { apiKeys, makeNewKey, removeKey, keyToDelete, setKeyToDelete, error, isLoading } = useApiKeys();

  /**
   * Copies the API key to the clipboard and shows a toast notification
   *
   * @param text - The API key text to copy
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Key copied to clipboard",
    });
  };

  /**
   * Formats a date string into a more readable format
   *
   * @param dateString - The ISO date string to format
   * @returns Formatted date string (e.g., "Jan 1, 2023")
   */
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Show loading state while fetching API keys
  if (isLoading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // Show error message if API key fetching failed
  if (error) return (
    <div className="p-4 bg-destructive/10 text-destructive rounded-md">
      <p className="font-medium">Error getting API keys</p>
      <p className="text-sm">{error.message || 'An unknown error occurred'}</p>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <CreateApiKeyModal onCreateKey={makeNewKey} />
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
              onClick={() => keyToDelete && removeKey(keyToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
