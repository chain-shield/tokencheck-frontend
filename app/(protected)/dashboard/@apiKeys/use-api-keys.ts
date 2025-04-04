import { ApiKey } from "@/lib/models/models";
import { createKey, deleteKey, getAllKeys } from "@/utils/keyService";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from '@/hooks/use-toast';

export function useApiKeys() {
  const { data: keys, error, isLoading } = useSWR<ApiKey[]>(
    "api-keys", getAllKeys
  )
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  useEffect(() => {
    console.log(keys)
    if (keys) setApiKeys(keys);
  }, [keys])

  const makeNewKey = async (appName: string) => {
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

  const removeKey = async (id: string) => {
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

  return { apiKeys, makeNewKey, removeKey, keyToDelete, setKeyToDelete, error, isLoading }
}
