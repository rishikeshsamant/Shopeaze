import axiosClient from './axiosClient';

const settingsService = {
  // Get all settings
  getSettings: () => axiosClient.get('/settings'),
  
  // Update settings
  updateSettings: (settingsData) => axiosClient.put('/settings', settingsData),
  
  // Get company info
  getCompanyInfo: () => axiosClient.get('/settings/company'),
  
  // Update company info
  updateCompanyInfo: (companyData) => axiosClient.put('/settings/company', companyData),
  
  // Get invoice settings
  getInvoiceSettings: () => axiosClient.get('/settings/invoice'),
  
  // Update invoice settings
  updateInvoiceSettings: (invoiceSettings) => axiosClient.put('/settings/invoice', invoiceSettings),
};

export default settingsService; 