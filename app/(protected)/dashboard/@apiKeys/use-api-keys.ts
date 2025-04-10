/**
 * Custom hook for managing API keys
 *
 * This hook provides functionality to fetch, create, and delete API keys,
 * as well as manage the state related to API keys.
 */

import { ApiKey } from "@/lib/models/models";
import { createKey, deleteKey, getAllKeys } from "@/utils/keyService";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing API keys in the dashboard
 *
 * @returns Object containing API keys state and functions to manage them
 */
export function useApiKeys() {
  // Fetch API keys using SWR for data fetching with caching and revalidation
  const { data: keys, error, isLoading } = useSWR<ApiKey[]>(
    "api-keys", getAllKeys
  )

  // Local state for API keys and deletion tracking
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  // Update local state when keys are fetched
  useEffect(() => {
    if (keys) setApiKeys(keys);
  }, [keys])

  /**
   * Creates a new API key with the given app name
   *
   * @param appName - The name to associate with the new API key
   */
  const makeNewKey = async (appName: string) => {
    try {
      // Call the API to create a new key
      const { id, key, name, created_at, status } = await createKey(appName);
      const newApiKey: ApiKey = { id, key, name, created_at, status };

      // Only add the key to the state if it was successfully created
      if (status === 'active') {
        setApiKeys([...apiKeys, newApiKey]);
      }
    } catch (error) {
      // Show error toast if key creation fails
      toast({
        title: "Failed to Create Key",
        description: error instanceof Error && error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Deletes an API key with the given ID
   *
   * @param id - The ID of the API key to delete
   */
  const removeKey = async (id: string) => {
    try {
      // Call the API to delete the key
      await deleteKey(id);

      // Update local state by filtering out the deleted key
      setApiKeys(apiKeys.filter(key => key.id !== id));
      setKeyToDelete(null); // Reset the key marked for deletion
    } catch (error) {
      // Show error toast if key deletion fails
      toast({
        title: "Failed to Delete Key",
        description: error instanceof Error && error.message,
        variant: "destructive",
      });
    }
  };

  // Return all the state and functions needed by components
  return {
    apiKeys,           // List of API keys
    makeNewKey,        // Function to create a new key
    removeKey,         // Function to delete a key
    keyToDelete,       // ID of key marked for deletion (for confirmation dialog)
    setKeyToDelete,    // Function to mark a key for deletion
    error,             // Error from SWR if key fetching failed
    isLoading          // Loading state from SWR
  }
}
