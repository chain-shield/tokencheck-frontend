
import { apiRequest } from './apiRequest';

export async function getAllItems() {
  return apiRequest('/secured/items', 'GET');
}

export async function getItem(id: string) {
  return apiRequest(`/secured/item/${id}`, 'GET');
}

export async function createItem(name: string) {
  return apiRequest('/secured/item', 'POST', { name });
}

export async function updateItem(id: string, name: string) {
  return apiRequest(`/secured/item/${id}`, 'PUT', { name });
}

export async function deleteItem(id: string) {
  return apiRequest(`/secured/item/${id}`, 'DELETE');
}
