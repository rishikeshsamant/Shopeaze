import axiosClient from './axiosClient';

const itemService = {
  // Get all items
  getAllItems: () => axiosClient.get('/items'),
  
  // Get item by ID
  getItemById: (id) => axiosClient.get(`/items/${id}`),
  
  // Create new item
  createItem: (itemData) => axiosClient.post('/items', itemData),
  
  // Update item
  updateItem: (id, itemData) => axiosClient.put(`/items/${id}`, itemData),
  
  // Delete item
  deleteItem: (id) => axiosClient.delete(`/items/${id}`),
};

export default itemService; 