/**
 * API Keys Hook
 * 
 * Custom hook for managing API keys using SWR for data fetching
 * with standardized error handling, loading states, and caching.
 */

import { useState } from 'react';
import { ApiKey, CreateApiKeyResponse } from '@/lib/models/models';
import { createKey, deleteKey, getAllKeys } from '@/utils/keyService';
import { useSWRFetch } from '@/hooks/use-swr-fetch';
import { toast } from '@/hooks/use-toast';

// Cache key for API keys
const API_KEYS_CACHE_KEY = 'api-keys';

/**
 * Hook for managing API keys in the dashboard
 *
 * @returns Object containing API keys state and functions to manage them
 */
export function useApiKeys() {
  // Fetch API keys using SWR for data fetching with caching and revalidation
  const { 
    data: apiKeys, 
    error, 
    isLoading,
    mutate 
  } = useSWRFetch<ApiKey[]>(
    API_KEYS_CACHE_KEY, 
    () => getAllKeys()
  );

  // Local state for tracking key deletion
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Creates a new API key
   * 
   * @param name - Name for the new API key
   * @returns Promise resolving to the newly created API key
   */
  const makeNewKey = async (name: string): Promise<CreateApiKeyResponse> => {
    setIsCreating(true);
    
    try {
      const newKey = await createKey(name);
      
      // Show success toast
      toast({
        title: "API Key Created",
        description: "Your new API key has been created successfully",
      });
      
      // Update the cache with the new key
      await mutate();
      
      return newKey;
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to create API key",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Deletes an API key
   * 
   * @param id - ID of the API key to delete
   */
  const removeKey = async (id: string): Promise<void> => {
    setIsDeleting(true);
    
    try {
      await deleteKey(id);
      
      // Show success toast
      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully",
      });
      
      // Update the cache by removing the deleted key
      await mutate(
        apiKeys?.filter(key => key.id !== id),
        { revalidate: true }
      );
      
      // Clear the key marked for deletion
      setKeyToDelete(null);
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to delete API key",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // Return all the state and functions needed by components
  return {
    apiKeys: apiKeys || [],  // List of API keys (empty array if undefined)
    makeNewKey,              // Function to create a new key
    removeKey,               // Function to delete a key
    keyToDelete,             // ID of key marked for deletion (for confirmation dialog)
    setKeyToDelete,          // Function to mark a key for deletion
    error,                   // Error from SWR if key fetching failed
    isLoading,               // Loading state from SWR
    isCreating,              // Loading state for key creation
    isDeleting,              // Loading state for key deletion
    refresh: mutate          // Function to manually refresh the data
  };
}
