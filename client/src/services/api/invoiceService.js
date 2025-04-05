import axiosClient from './axiosClient';

const invoiceService = {
  // Get all invoices
  getAllInvoices: () => axiosClient.get('/invoices'),
  
  // Get invoice by ID
  getInvoiceById: (id) => axiosClient.get(`/invoices/${id}`),
  
  // Create new invoice
  createInvoice: (invoiceData) => axiosClient.post('/invoices', invoiceData),
  
  // Update invoice
  updateInvoice: (id, invoiceData) => axiosClient.put(`/invoices/${id}`, invoiceData),
  
  // Delete invoice
  deleteInvoice: (id) => axiosClient.delete(`/invoices/${id}`),
  
  // Get invoice PDF
  getInvoicePdf: (id) => axiosClient.get(`/invoices/${id}/pdf`, {
    responseType: 'blob',
  }),
  
  // Send invoice by email
  sendInvoiceByEmail: (id, emailData) => axiosClient.post(`/invoices/${id}/send`, emailData),
};

export default invoiceService; 