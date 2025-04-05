import axiosClient from './axiosClient';

const customerService = {
  // Get all customers
  getAllCustomers: () => axiosClient.get('/customers'),
  
  // Get customer by ID
  getCustomerById: (id) => axiosClient.get(`/customers/${id}`),
  
  // Create new customer
  createCustomer: (customerData) => axiosClient.post('/customers', customerData),
  
  // Update customer
  updateCustomer: (id, customerData) => axiosClient.put(`/customers/${id}`, customerData),
  
  // Delete customer
  deleteCustomer: (id) => axiosClient.delete(`/customers/${id}`),
};

export default customerService; 