/**
 * Mock implementation of the itemService for testing
 */

import { Item } from '@/lib/models/models';
import { v4 as uuidv4 } from 'uuid';

// Mock items data store
export const mockItems: Item[] = [
  {
    id: 'mock-item-id-1',
    name: 'Test Item 1',
    description: 'This is a test item 1',
    price: 1999, // $19.99
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'mock-item-id-2',
    name: 'Test Item 2',
    description: 'This is a test item 2',
    price: 2999, // $29.99
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  }
];

// Store for tracking function calls
export const itemServiceCalls = {
  getAllItems: [] as any[],
  getItemById: [] as Array<{ id: string }>,
  createItem: [] as Array<{ item: Partial<Item> }>,
  updateItem: [] as Array<{ id: string; item: Partial<Item> }>,
  deleteItem: [] as Array<{ id: string }>
};

/**
 * Mock implementation of getAllItems
 * 
 * @returns Promise resolving to mock items
 */
export async function getAllItems(): Promise<Item[]> {
  itemServiceCalls.getAllItems.push({});
  return [...mockItems]; // Return a copy to prevent mutation
}

/**
 * Mock implementation of getItemById
 * 
 * @param id - ID of the item to retrieve
 * @returns Promise resolving to mock item or null
 */
export async function getItemById(id: string): Promise<Item | null> {
  itemServiceCalls.getItemById.push({ id });
  
  const item = mockItems.find(item => item.id === id);
  
  if (!item) {
    return null;
  }
  
  return { ...item }; // Return a copy to prevent mutation
}

/**
 * Mock implementation of createItem
 * 
 * @param item - Partial item data to create
 * @returns Promise resolving to created mock item
 */
export async function createItem(item: Partial<Item>): Promise<Item> {
  itemServiceCalls.createItem.push({ item });
  
  // Create a new mock item
  const newItem: Item = {
    id: `mock-item-id-${mockItems.length + 1}`,
    name: item.name || 'Unnamed Item',
    description: item.description || '',
    price: item.price || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to mock data store
  mockItems.push(newItem);
  
  return { ...newItem }; // Return a copy to prevent mutation
}

/**
 * Mock implementation of updateItem
 * 
 * @param id - ID of the item to update
 * @param item - Partial item data to update
 * @returns Promise resolving to updated mock item or null
 */
export async function updateItem(id: string, item: Partial<Item>): Promise<Item | null> {
  itemServiceCalls.updateItem.push({ id, item });
  
  // Find the index of the item to update
  const itemIndex = mockItems.findIndex(i => i.id === id);
  
  // If item doesn't exist, return null
  if (itemIndex === -1) {
    return null;
  }
  
  // Update the item
  const updatedItem: Item = {
    ...mockItems[itemIndex],
    ...item,
    updated_at: new Date().toISOString()
  };
  
  // Update in mock data store
  mockItems[itemIndex] = updatedItem;
  
  return { ...updatedItem }; // Return a copy to prevent mutation
}

/**
 * Mock implementation of deleteItem
 * 
 * @param id - ID of the item to delete
 * @returns Promise resolving to boolean indicating success
 */
export async function deleteItem(id: string): Promise<boolean> {
  itemServiceCalls.deleteItem.push({ id });
  
  // Find the index of the item to delete
  const itemIndex = mockItems.findIndex(item => item.id === id);
  
  // If item doesn't exist, return false
  if (itemIndex === -1) {
    return false;
  }
  
  // Remove from mock data store
  mockItems.splice(itemIndex, 1);
  
  return true;
}

/**
 * Reset all mock data and call history
 */
export function resetMocks(): void {
  // Reset mock items to initial state
  mockItems.length = 0;
  mockItems.push(
    {
      id: 'mock-item-id-1',
      name: 'Test Item 1',
      description: 'This is a test item 1',
      price: 1999,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 'mock-item-id-2',
      name: 'Test Item 2',
      description: 'This is a test item 2',
      price: 2999,
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    }
  );
  
  // Reset call history
  itemServiceCalls.getAllItems.length = 0;
  itemServiceCalls.getItemById.length = 0;
  itemServiceCalls.createItem.length = 0;
  itemServiceCalls.updateItem.length = 0;
  itemServiceCalls.deleteItem.length = 0;
}
