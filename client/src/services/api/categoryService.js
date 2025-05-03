import axiosClient from './axiosClient';

const categoryService = {
  // Get all categories
  getAllCategories: () => axiosClient.get('/categories'),
  
  // Get category by ID
  getCategoryById: (id) => axiosClient.get(`/categories/${id}`),
  
  // Create new category
  createCategory: (categoryData) => axiosClient.post('/categories', categoryData),
  
  // Update category
  updateCategory: (id, categoryData) => axiosClient.put(`/categories/${id}`, categoryData),
  
  // Delete category
  deleteCategory: (id) => axiosClient.delete(`/categories/${id}`),
};

export default categoryService; 