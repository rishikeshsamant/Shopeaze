import '../styles/Invoice.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faTag,
  faFileInvoice,
  faCalendarAlt,
  faMoneyBillWave,
  faCreditCard,
  faPercent,
  faRupeeSign,
  faStickyNote,
  faShoppingCart,
  faCheck,
  faSave,
  faArrowRight,
  faClock,
  faPrint,
  faEye,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import invoiceService from '../services/api/invoiceService';
import customerService from '../services/api/customerService';
import itemService from '../services/api/itemService';
import { useReactToPrint } from 'react-to-print';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyInfo, setCompanyInfo] = useState({
    name: 'ShopeEaze Store',
    address: '123 Commerce Street, Retail District',
    city: 'Mumbai, MH 400001',
    phone: '+91 9876543210',
    email: 'contact@shopeaze.com',
    website: 'www.shopeaze.com',
    gstin: 'GSTIN: 27AADCS0472N1Z1'
  });
  const [formData, setFormData] = useState({
    customer: '',
    billingAddress: '',
    shippingAddress: '',
    email: '',
    phone: '',
    status: 'unpaid',
    items: [],
    totalAmount: 0,
    amountPaid: 0,
    paymentInfo: {
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const billRef = useRef();

  // Setup print handler using useCallback to stabilize function
  const handlePrint = useCallback(() => {
    const printContent = async () => {
      if (!billRef.current) {
        toast.error('Could not find bill content to print');
        return;
      }

      try {
        // Add print class
        document.body.classList.add('printing-invoice');
        
        // Use browser print
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast.error('Print window blocked. Please allow popups for this site.');
          document.body.classList.remove('printing-invoice');
          return;
        }
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice-${selectedBill?._id?.substring(0, 8) || 'Preview'}</title>
              <style>
                body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 1cm; }
                h1, h2, h3 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background-color: #f8f8f8; text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                .bill-header { display: flex; justify-content: space-between; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
                .bill-status { display: inline-block; padding: 3px 8px; border-radius: 4px; border: 1px solid; }
                .bill-footer { border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; }
              </style>
            </head>
            <body>
              ${billRef.current.innerHTML}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
          document.body.classList.remove('printing-invoice');
          toast.success('Invoice printed successfully!');
        };
      } catch (error) {
        console.error('Printing failed:', error);
        document.body.classList.remove('printing-invoice');
        toast.error('Failed to print invoice');
      }
    };
    
    printContent();
  }, [selectedBill, toast]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [invoicesRes, customersRes, itemsRes] = await Promise.all([
          invoiceService.getAllInvoices(),
          customerService.getAllCustomers(),
          itemService.getAllItems()
        ]);
        
        setInvoices(invoicesRes.data);
        setCustomers(customersRes.data);
        setItems(itemsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  };

  const openModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    
    if (invoice) {
      // Pre-fill form with invoice data for editing
      setFormData({
        customer: invoice.customer._id || invoice.customer,
        billingAddress: invoice.billingAddress || '',
        shippingAddress: invoice.shippingAddress || '',
        email: invoice.email || '',
        phone: invoice.phone || '',
        status: invoice.status || 'unpaid',
        items: invoice.items || [],
        totalAmount: invoice.totalAmount || 0,
        amountPaid: invoice.amountPaid || 0,
        paymentInfo: invoice.paymentInfo || {
          method: 'cash',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        }
      });
    } else {
      // Reset form for new invoice
      setFormData({
        customer: '',
        billingAddress: '',
        shippingAddress: '',
        email: '',
        phone: '',
        status: 'unpaid',
        items: [],
        totalAmount: 0,
        amountPaid: 0,
        paymentInfo: {
          method: 'cash',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        }
      });
    }
    
    setShowModal(true);
  };

  const openBillPreview = (invoice) => {
    setSelectedBill(invoice);
    setShowBillPreview(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  const closeBillPreview = () => {
    setShowBillPreview(false);
    setSelectedBill(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'customer' && value) {
      // When customer is selected, auto-populate customer details
      const selectedCustomer = customers.find(c => c._id === value);
      
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          customer: value,
          email: selectedCustomer.email || prev.email,
          phone: selectedCustomer.phoneNumber || prev.phone,
          billingAddress: selectedCustomer.billingAddress || prev.billingAddress,
          shippingAddress: selectedCustomer.shippingAddress || prev.shippingAddress
        }));
        return;
      }
    }
    
    if (name.includes('.')) {
      // Handle nested properties (e.g. paymentInfo.method)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', name: '', quantity: 1, price: 0, total: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    updateTotals(newItems);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    let item = { ...updatedItems[index], [field]: value };

    if (field === 'itemId') {
      const selectedItem = items.find(p => p._id === value);
      if (selectedItem) {
        item.name = selectedItem.name;
        item.price = selectedItem.price;
        item.total = selectedItem.price * (item.quantity || 1);
      }
    }

    if (field === 'quantity' || field === 'price') {
      item.total = (item.price || 0) * (item.quantity || 1);
    }

    updatedItems[index] = item;
    updateTotals(updatedItems);
  };

  const updateTotals = (updatedItems) => {
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    
    setFormData(prev => ({ 
      ...prev, 
      items: updatedItems, 
      totalAmount 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (selectedInvoice) {
        // Update existing invoice
        const response = await invoiceService.updateInvoice(selectedInvoice._id, formData);
        
        // Update invoices list
        setInvoices(prev => 
          prev.map(inv => inv._id === selectedInvoice._id ? response.data : inv)
        );
        
        toast.success('Invoice updated successfully');
      } else {
        // Create new invoice
        const response = await invoiceService.createInvoice(formData);
        
        // Add new invoice to the list
        setInvoices(prev => [...prev, response.data]);
        
        toast.success('Invoice created successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }
    
    try {
      setLoading(true);
      await invoiceService.deleteInvoice(invoiceId);
      
      // Remove deleted invoice from list
      setInvoices(prev => prev.filter(inv => inv._id !== invoiceId));
      
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  const sendInvoiceByEmail = async (invoiceId) => {
    try {
      await invoiceService.sendInvoiceByEmail(invoiceId, {});
      toast.success('Invoice sent successfully');
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    }
  };

  const getInvoicePdf = async (invoiceId) => {
    try {
      const response = await invoiceService.getInvoicePdf(invoiceId);
      
      // Create blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting invoice PDF:', error);
      toast.error('Failed to generate invoice PDF');
    }
  };

  // Get customer details from customer ID
  const getCustomerDetails = (customerId) => {
    return customers.find(c => c._id === customerId) || {};
  };

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => {
    // Check if invoice matches search term
    const customerName = invoice.customer && typeof invoice.customer === 'object' 
      ? invoice.customer.name.toLowerCase() 
      : customers.find(c => c._id === invoice.customer)?.name?.toLowerCase() || '';
    
    const invoiceId = invoice._id.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      customerName.includes(searchTerm.toLowerCase()) || 
      invoiceId.includes(searchTerm.toLowerCase());
    
    // Check if invoice matches status filter
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && !invoices.length) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="invoices-container">
      <div className="page-header">
        <h1>
          <FontAwesomeIcon icon={faFileInvoice} className="header-icon" />
          Invoices
        </h1>
        <button className="add-button" onClick={() => openModal()}>
          <FontAwesomeIcon icon={faPlus} /> New Invoice
        </button>
      </div>

      <div className="filters-container">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filters">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('paid')}
          >
            Paid
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'unpaid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('unpaid')}
          >
            Unpaid
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'partial' ? 'active' : ''}`}
            onClick={() => setStatusFilter('partial')}
          >
            Partial
          </button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state">
          <h2>No Invoices Found</h2>
          <p>Create your first invoice to get started</p>
          <button className="add-button" onClick={() => openModal()}>
            <FontAwesomeIcon icon={faPlus} /> Create Invoice
          </button>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="empty-search-result">
          <h3>No matching invoices found</h3>
          <p>Try changing your search criteria</p>
          <button className="filter-reset-btn" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="invoice-grid">
          {filteredInvoices.map((inv) => (
            <div key={inv._id} className="invoice-card" onClick={() => openModal(inv)}>
              <div className="invoice-card-header">
                <div className="invoice-number">
                  <h3>#{inv._id.substring(0, 8).toUpperCase()}</h3>
                  <span className={`status-badge ${inv.status}`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </div>
                <div className="invoice-date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
                  {formatDate(inv.createdAt)}
                </div>
              </div>
              
              <div className="invoice-card-body">
                <div className="invoice-customer">
                  <FontAwesomeIcon icon={faUser} className="card-icon" />
                  <span>
                    {inv.customer && typeof inv.customer === 'object' 
                      ? inv.customer.name 
                      : customers.find(c => c._id === inv.customer)?.name || 'Unknown Customer'}
                  </span>
                </div>
                
                <div className="invoice-amount">
                  <FontAwesomeIcon icon={faRupeeSign} className="card-icon" />
                  <span>{formatCurrency(inv.totalAmount)}</span>
                </div>
              </div>
              
              <div className="invoice-card-footer">
                <button
                  className="card-action-btn edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(inv);
                  }}
                  title="Edit Invoice"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="card-action-btn view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openBillPreview(inv);
                  }}
                  title="View Bill"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="card-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteInvoice(inv._id);
                  }}
                  title="Delete Invoice"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="invoice-modal">
            <div className="modal-header">
              <h2>{selectedInvoice ? 'Edit Invoice' : 'New Invoice'}</h2>
              <button className="close-btn" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="invoice-form">
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faUser} />
                  Customer Information
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                      Customer
                    </label>
                    <select 
                      name="customer" 
                      value={formData.customer || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a customer</option>
                      {customers.map(customer => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email address" 
                      value={formData.email || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Phone number" 
                      value={formData.phone || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                      Billing Address
                    </label>
                    <textarea 
                      name="billingAddress" 
                      placeholder="Billing address" 
                      value={formData.billingAddress || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                      Shipping Address
                    </label>
                    <textarea 
                      name="shippingAddress" 
                      placeholder="Shipping address (if different)" 
                      value={formData.shippingAddress || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Items
                </div>
                
                <div className="items-container">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <select 
                              value={item.itemId || ''} 
                              onChange={e => updateItem(i, 'itemId', e.target.value)}
                            >
                              <option value="">Select item</option>
                              {items.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity || 1} 
                              onChange={e => updateItem(i, 'quantity', parseInt(e.target.value))}
                            />
                          </td>
                          <td>
                            <input 
                              type="number" 
                              min="0"
                              step="0.01"
                              value={item.price || 0} 
                              onChange={e => updateItem(i, 'price', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>{formatCurrency(item.total || 0)}</td>
                          <td>
                            <button 
                              type="button" 
                              className="remove-item-btn"
                              onClick={() => removeItem(i)}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <button 
                    type="button" 
                    className="add-item-btn"
                    onClick={addItem}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Item
                  </button>
                </div>
              </div>
              
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  Payment Details
                </div>
                
                <div className="total-section">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(formData.totalAmount)}</span>
                  </div>
                  <div className="total-row">
                    <span>Amount Paid:</span>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.amountPaid || 0} 
                      onChange={e => setFormData(p => ({ 
                        ...p, 
                        amountPaid: parseFloat(e.target.value),
                        status: parseFloat(e.target.value) >= p.totalAmount ? 'paid' : 
                               parseFloat(e.target.value) > 0 ? 'partial' : 'unpaid'
                      }))}
                    />
                  </div>
                  <div className="total-row">
                    <span>Balance Due:</span>
                    <span>{formatCurrency((formData.totalAmount || 0) - (formData.amountPaid || 0))}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>{formatCurrency(formData.totalAmount)}</span>
                  </div>
                </div>
                
                <div className="form-row">
                  <div>
                    <label>Invoice Status</label>
                    <select 
                      name="status"
                      className="status-select"
                      value={formData.status || 'unpaid'} 
                      onChange={handleInputChange}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label>Payment Method</label>
                    <select 
                      name="paymentInfo.method"
                      value={formData.paymentInfo.method || 'cash'} 
                      onChange={handleInputChange}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                      Payment Date
                    </label>
                    <input 
                      type="date" 
                      name="paymentInfo.date"
                      value={formData.paymentInfo.date || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faStickyNote} style={{ marginRight: '8px' }} />
                      Notes
                    </label>
                    <textarea 
                      name="paymentInfo.notes"
                      placeholder="Payment notes" 
                      value={formData.paymentInfo.notes || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} />
                  {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {showBillPreview && selectedBill && (
        <div className="modal-overlay">
          <div className="bill-preview-modal">
            <div className="modal-header">
              <h2>Bill Preview</h2>
              <div className="bill-actions">
                <button 
                  className="print-button" 
                  onClick={handlePrint}
                  title="Print Invoice"
                >
                  <FontAwesomeIcon icon={faPrint} /> Print
                </button>
                <button 
                  className="new-invoice-button" 
                  onClick={() => {
                    closeBillPreview();
                    openModal();
                  }}
                  title="Create New Invoice"
                >
                  <FontAwesomeIcon icon={faPlus} /> New Invoice
                </button>
                <button 
                  className="close-btn" 
                  onClick={closeBillPreview} 
                  title="Close"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            
            <div className="bill-content">
              <div className="bill-container" ref={billRef}>
                <div className="bill-header">
                  <div className="company-details">
                    <h1>{companyInfo.name}</h1>
                    <p>{companyInfo.address}</p>
                    <p>{companyInfo.city}</p>
                    <p>Phone: {companyInfo.phone}</p>
                    <p>{companyInfo.email}</p>
                    <p>{companyInfo.gstin}</p>
                  </div>
                  <div className="bill-info">
                    <h2>INVOICE</h2>
                    <table>
                      <tbody>
                        <tr>
                          <td><strong>Invoice No:</strong></td>
                          <td>{selectedBill._id.substring(0, 8).toUpperCase()}</td>
                        </tr>
                        <tr>
                          <td><strong>Date:</strong></td>
                          <td>{formatDate(selectedBill.createdAt)}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <span className={`bill-status ${selectedBill.status}`}>
                              {selectedBill.status.charAt(0).toUpperCase() + selectedBill.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bill-customer-details">
                  <div className="bill-to">
                    <h3>Bill To:</h3>
                    <p><strong>{
                      selectedBill.customer && typeof selectedBill.customer === 'object' 
                        ? selectedBill.customer.name 
                        : getCustomerDetails(selectedBill.customer).name || 'Unknown Customer'
                    }</strong></p>
                    <p>{selectedBill.billingAddress}</p>
                    <p>Phone: {selectedBill.phone}</p>
                    <p>Email: {selectedBill.email}</p>
                  </div>
                  {selectedBill.shippingAddress && (
                    <div className="ship-to">
                      <h3>Ship To:</h3>
                      <p>{selectedBill.shippingAddress}</p>
                    </div>
                  )}
                </div>

                <div className="bill-items">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>Total:</strong></td>
                        <td><strong>{formatCurrency(selectedBill.totalAmount)}</strong></td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-right">Amount Paid:</td>
                        <td>{formatCurrency(selectedBill.amountPaid)}</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-right">Balance Due:</td>
                        <td>{formatCurrency((selectedBill.totalAmount || 0) - (selectedBill.amountPaid || 0))}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="bill-footer">
                  <div className="payment-info">
                    <h3>Payment Information</h3>
                    <p><strong>Method:</strong> {selectedBill.paymentInfo?.method || 'N/A'}</p>
                    <p><strong>Date:</strong> {formatDate(selectedBill.paymentInfo?.date)}</p>
                    {selectedBill.paymentInfo?.notes && (
                      <p><strong>Notes:</strong> {selectedBill.paymentInfo.notes}</p>
                    )}
                  </div>
                  <div className="bill-notes">
                    <h3>Thank You For Your Business</h3>
                    <p>If you have any questions about this invoice, please contact us.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
