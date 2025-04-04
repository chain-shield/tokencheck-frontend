
import { apiRequest } from './apiRequest';
import { CreateApiKeyResponse, ApiKey } from '@/lib/models/models';

export async function getAllKeys(): Promise<ApiKey[]> {
  return apiRequest<ApiKey[]>('/secured/key/get-all', 'GET');
}

export async function createKey(name: string): Promise<CreateApiKeyResponse> {
  return apiRequest<CreateApiKeyResponse>('/secured/key/generate', 'POST', { name });
}

export async function deleteKey(id: string): Promise<void> {
  return apiRequest(`/secured/key/delete/${id}`, 'DELETE');
}
