import '../styles/Invoice.css';
import { useState, useEffect } from 'react';
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
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { invoiceService, itemService, customerService } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Invoice = () => {
  const { isAuthenticated } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer: { _id: '', name: '', email: '', phone: '', address: '' },
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: 'draft',
    paymentMethod: 'cash',
    dueDate: '',
    notes: '',
  });

  const fetchData = async () => {
    setError(null);
    try {
      setLoading(true);
      
      // Check if user is authenticated before making API calls
      if (!isAuthenticated) {
        console.log("User not authenticated, using mock data");
        setInvoices(mockInvoices);
        setProducts(mockProducts);
        setCustomers(mockCustomers);
        setLoading(false);
        return;
      }
      
      // Try fetching data from API
      try {
        const [invoicesRes, productsRes, customersRes] = await Promise.all([
          invoiceService.getAllInvoices(),
          itemService.getAllItems(),
          customerService.getAllCustomers()
        ]);
        
        setInvoices(invoicesRes.data);
        setProducts(productsRes.data);
        setCustomers(customersRes.data);
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError('Failed to fetch data from API, using mock data instead');
        toast.error('Failed to fetch data from API, using mock data instead');
        
        // Set mock data if API calls fail
        setInvoices(mockInvoices);
        setProducts(mockProducts);
        setCustomers(mockCustomers);
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      
      // Ensure mock data is set even if there's another error
      setInvoices(mockInvoices);
      setProducts(mockProducts);
      setCustomers(mockCustomers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  // Mock data for fallback
  const mockInvoices = [
    {
      _id: '1',
      invoiceNumber: 'INV-001',
      customer: { name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St' },
      items: [
        { name: 'Product 1', price: 100, quantity: 2, total: 200 }
      ],
      subtotal: 200,
      tax: 20,
      discount: 10,
      total: 210,
      status: 'paid',
      paymentMethod: 'cash',
      createdAt: new Date('2023-10-15'),
      dueDate: '2023-10-30',
      notes: 'Thank you for your business'
    },
    {
      _id: '2',
      invoiceNumber: 'INV-002',
      customer: { name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave' },
      items: [
        { name: 'Product 2', price: 50, quantity: 3, total: 150 }
      ],
      subtotal: 150,
      tax: 15,
      discount: 0,
      total: 165,
      status: 'sent',
      paymentMethod: 'card',
      createdAt: new Date('2023-10-18'),
      dueDate: '2023-11-18',
      notes: ''
    },
    {
      _id: '3',
      invoiceNumber: 'INV-003',
      customer: { name: 'Alex Johnson', email: 'alex@example.com', phone: '555-9012', address: '789 Pine St' },
      items: [
        { name: 'Product 3', price: 200, quantity: 1, total: 200 }
      ],
      subtotal: 200,
      tax: 20,
      discount: 20,
      total: 200,
      status: 'draft',
      paymentMethod: 'bank transfer',
      createdAt: new Date('2023-10-20'),
      dueDate: '2023-11-20',
      notes: 'Please pay by due date'
    },
    {
      _id: '4',
      invoiceNumber: 'INV-004',
      customer: { name: 'Sam Brown', email: 'sam@example.com', phone: '555-3456', address: '321 Cedar Rd' },
      items: [
        { name: 'Product 4', price: 75, quantity: 4, total: 300 }
      ],
      subtotal: 300,
      tax: 30,
      discount: 15,
      total: 315,
      status: 'overdue',
      paymentMethod: 'cash',
      createdAt: new Date('2023-09-15'),
      dueDate: '2023-10-15',
      notes: 'Payment overdue'
    }
  ];

  const mockProducts = [
    { _id: 'p1', name: 'Laptop', price: 1000 },
    { _id: 'p2', name: 'Smartphone', price: 800 },
    { _id: 'p3', name: 'Tablet', price: 500 },
    { _id: 'p4', name: 'Monitor', price: 300 },
    { _id: 'p5', name: 'Keyboard', price: 100 },
    { _id: 'p6', name: 'Mouse', price: 50 }
  ];
  
  const mockCustomers = [
    { _id: 'c1', name: 'John Doe', email: 'john@example.com', phoneNumber: '555-1234', billingAddress: '123 Main St' },
    { _id: 'c2', name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '555-5678', billingAddress: '456 Oak Ave' },
    { _id: 'c3', name: 'Alex Johnson', email: 'alex@example.com', phoneNumber: '555-9012', billingAddress: '789 Pine St' }
  ];

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    }).format(val);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US');
  };

  const openModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    if (invoice) {
      // Map backend invoice format to form data format
      setFormData({
        customer: invoice.customer || { _id: '', name: '', email: '', phone: '', address: '' },
        items: invoice.items.map(item => ({
          itemId: item.itemId?._id || item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total
        })) || [],
        subtotal: calculateSubtotal(invoice.items),
        tax: invoice.tax || 0,
        discount: invoice.discount || 0,
        total: invoice.totalAmount || 0,
        status: invoice.status || 'draft',
        paymentMethod: invoice.paymentInfo?.method || 'cash',
        dueDate: invoice.dueDate || '',
        notes: invoice.paymentInfo?.notes || '',
      });
    } else {
      // Reset form for new invoice
      setFormData({
        customer: { _id: '', name: '', email: '', phone: '', address: '' },
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'draft',
        paymentMethod: 'cash',
        dueDate: '',
        notes: '',
      });
    }
    setShowModal(true);
  };
  
  const calculateSubtotal = (items) => {
    return (items || []).reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    
    if (customerId === "new") {
      // User selected to create a new customer
      setFormData(prev => ({
        ...prev,
        customer: {
          _id: "", // Empty ID indicates new customer
          name: "",
          email: "",
          phone: "",
          address: ""
        },
      }));
      return;
    }
    
    const selectedCustomer = customers.find(c => c._id === customerId) || { _id: '', name: '', email: '', phoneNumber: '', billingAddress: '' };
    
    setFormData(prev => ({
      ...prev,
      customer: {
        _id: selectedCustomer._id,
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phoneNumber,
        address: selectedCustomer.billingAddress
      },
    }));
  };

  const updateCustomerField = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        itemId: '', 
        name: 'Custom Item', // Provide a default name to avoid validation errors
        price: 0,
        quantity: 1,
        total: 0 
      }],
    }));
  };

  const removeItem = (i) => {
    const newItems = formData.items.filter((_, idx) => idx !== i);
    updateTotals(newItems);
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    let item = { ...items[index], [field]: value };

    if (field === 'itemId') {
      const prod = products.find(p => p._id === value);
      if (prod) {
        item.name = prod.name;
        item.price = prod.price;
        item.total = prod.price * (item.quantity || 1);
      } else if (value === '') {
        // If clearing product selection, ensure name is still set to avoid validation errors
        if (!item.name) {
          item.name = 'Custom Item';
        }
      }
    }

    if (field === 'quantity' || field === 'price') {
      // Ensure positive numbers
      const numValue = Math.max(field === 'quantity' ? 1 : 0, parseFloat(value) || 0);
      item[field] = numValue;
      item.total = (item.price || 0) * (item.quantity || 1);
    }

    items[index] = item;
    updateTotals(items);
  };

  const updateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = subtotal + (formData.tax || 0) - (formData.discount || 0);
    setFormData(prev => ({ ...prev, items, subtotal, total }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't require a customer ID - allow manual customer info
    if (!formData.customer.name) {
      toast.error('Please provide customer name');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    
    // Validate each item has required fields
    const invalidItems = formData.items.filter(item => !item.name || item.quantity <= 0);
    if (invalidItems.length > 0) {
      toast.error('All items must have a name and quantity greater than zero');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Check authentication before submitting
    if (!isAuthenticated) {
      toast.warning('You must be logged in to save invoices. Using mock mode.');
      
      // Simulate successful operation in mock mode
      if (selectedInvoice) {
        const updated = invoices.map((inv) => 
          inv._id === selectedInvoice._id ? { 
            ...inv, 
            customer: formData.customer,
            items: formData.items,
            status: formData.status,
            totalAmount: formData.total,
            tax: formData.tax,
            discount: formData.discount,
            dueDate: formData.dueDate,
            paymentInfo: {
              method: formData.paymentMethod,
              notes: formData.notes
            }
          } : inv
        );
        setInvoices(updated);
        toast.success('Invoice updated in mock mode');
      } else {
        const newInvoice = {
          _id: Date.now().toString(),
          customer: formData.customer,
          items: formData.items,
          totalAmount: formData.total,
          status: formData.status,
          tax: formData.tax,
          discount: formData.discount,
          dueDate: formData.dueDate,
          paymentInfo: {
            method: formData.paymentMethod,
            notes: formData.notes
          },
          createdAt: new Date()
        };
        setInvoices([...invoices, newInvoice]);
        toast.success('Invoice created in mock mode');
      }
      setIsSubmitting(false);
      closeModal();
      return;
    }
    
    try {
      // Format items properly - remove empty itemId fields and ensure all required fields exist
      const formattedItems = formData.items.map(item => {
        // Create a safe item object with all required fields
        const formattedItem = {
          name: item.name || 'Custom Item', // Ensure name is never empty
          quantity: Math.max(1, item.quantity || 1), // Ensure quantity is at least 1
          price: Math.max(0, item.price || 0), // Ensure price is at least 0
          total: item.total || (item.price * item.quantity) || 0 // Ensure total is calculated
        };
        
        // Only include itemId if it's a valid value (not empty string)
        if (item.itemId && String(item.itemId).trim() !== '') {
          formattedItem.itemId = item.itemId;
        }
        
        return formattedItem;
      });
      
      // Prepare data for the API in the expected format
      const invoiceData = {
        // If customer has no ID, it's a new customer to be created on the fly
        customer: formData.customer._id || undefined,
        customerInfo: !formData.customer._id ? {
          name: formData.customer.name,
          email: formData.customer.email || '',
          phoneNumber: formData.customer.phone || '',
          billingAddress: formData.customer.address || ''
        } : undefined,
        billingAddress: formData.customer.address || '',
        email: formData.customer.email || '',
        phone: formData.customer.phone || '',
        items: formattedItems,
        totalAmount: formData.total || 0,
        status: formData.status || 'draft',
        paymentInfo: {
          method: formData.paymentMethod || 'cash',
          notes: formData.notes || '',
          date: formData.status === 'paid' ? new Date() : null
        },
        tax: formData.tax || 0,
        discount: formData.discount || 0,
        dueDate: formData.dueDate || null
      };

      console.log('Submitting invoice with data:', JSON.stringify(invoiceData));

      let response;
      if (selectedInvoice) {
        // Update existing invoice
        response = await invoiceService.updateInvoice(selectedInvoice._id, invoiceData);
        toast.success('Invoice updated successfully');
        
        // Update the local state
        setInvoices(invoices.map(inv => 
          inv._id === selectedInvoice._id ? response.data : inv
        ));
      } else {
        // Create new invoice
        response = await invoiceService.createInvoice(invoiceData);
        toast.success('Invoice created successfully');
        
        // Update the local state
        setInvoices([...invoices, response.data]);
        
        // If we added a new customer, refresh the customers list
        if (!formData.customer._id) {
          fetchData();
        }
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving invoice:', error);
      setError(error.response?.data?.message || error.message);
      toast.error('Failed to save invoice: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteInvoice = async (invoice) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    // Check authentication before deleting
    if (!isAuthenticated) {
      toast.warning('You must be logged in to delete invoices. Using mock mode.');
      
      // Update local state for mock deletion
      const updated = invoices.filter((inv) => inv._id !== invoice._id);
      setInvoices(updated);
      
      toast.success('Invoice deleted in mock mode');
      return;
    }
    
    try {
      await invoiceService.deleteInvoice(invoice._id);
      
      // Update local state
      const updated = invoices.filter((inv) => inv._id !== invoice._id);
      setInvoices(updated);
      
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
      <p>Loading invoices...</p>
    </div>
  );

  if (error && invoices.length === 0) return (
    <div className="error-container">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={fetchData}>Try Again</button>
    </div>
  );

  return (
    <div className="invoices-container">
      <div className="header">
        <h2>
          <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: '10px' }} />
          Invoices
        </h2>
        <button onClick={() => openModal()}>
          <FontAwesomeIcon icon={faPlus} /> New Invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="no-invoices">
          <h3>No invoices found</h3>
          <p>Create your first invoice by clicking the "New Invoice" button above.</p>
        </div>
      ) : (
        <div className="invoice-grid">
          {invoices.map((inv) => (
            <div className="invoice-card" key={inv._id}>
              <div className="invoice-card-header">
                <div className="invoice-number">
                  <FontAwesomeIcon icon={faFileInvoice} />
                  <span>INV-{inv._id.substring(0, 6)}</span>
                </div>
                <div className={`invoice-status ${inv.status}`}>
                  {inv.status === 'paid' && <FontAwesomeIcon icon={faCheck} />}
                  {inv.status === 'sent' && <FontAwesomeIcon icon={faArrowRight} />}
                  {inv.status === 'draft' && <FontAwesomeIcon icon={faEdit} />}
                  {inv.status === 'overdue' && <FontAwesomeIcon icon={faClock} />}
                  <span>{inv.status}</span>
                </div>
              </div>
              
              <div className="invoice-card-content">
                <div className="invoice-customer">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{inv.customer?.name || 'Unknown Customer'}</span>
                </div>
                
                <div className="invoice-amount">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  <span>{formatCurrency(inv.totalAmount)}</span>
                </div>
                
                <div className="invoice-dates">
                  <div className="invoice-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Created: {formatDate(inv.createdAt)}</span>
                  </div>
                  
                  <div className="invoice-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Due: {formatDate(inv.dueDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="invoice-card-actions">
                <button 
                  className="btn-icon edit-btn" 
                  onClick={() => openModal(inv)}
                  title="Edit Invoice"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="btn-icon delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteInvoice(inv);
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <h3>
              <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: '10px' }} />
              {selectedInvoice ? 'Edit' : 'New'} Invoice
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-section-header">
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                  Customer Information
                </div>
                
                <div className="form-row">
                  <div>
                    <label>Select Customer</label>
                    <select 
                      value={formData.customer._id || ''} 
                      onChange={handleCustomerChange}
                      className="customer-select"
                    >
                      <option value="">Select a customer</option>
                      <option value="new">+ New Customer</option>
                      {customers.length > 0 && <optgroup label="Existing Customers">
                        {customers.map(customer => (
                          <option key={customer._id} value={customer._id}>
                            {customer.name}
                          </option>
                        ))}
                      </optgroup>}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                      Name
                    </label>
                    <input 
                      name="name" 
                      placeholder="Customer name" 
                      value={formData.customer.name || ''} 
                      onChange={updateCustomerField} 
                      disabled={formData.customer._id && formData.customer._id !== "new"}
                      required
                    />
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                      Email
                    </label>
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="Email address" 
                      value={formData.customer.email || ''} 
                      onChange={updateCustomerField} 
                      disabled={formData.customer._id && formData.customer._id !== "new"}
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
                      name="phone" 
                      placeholder="Phone number" 
                      value={formData.customer.phone || ''} 
                      onChange={updateCustomerField} 
                      disabled={formData.customer._id && formData.customer._id !== "new"}
                    />
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                      Address
                    </label>
                    <textarea 
                      name="address" 
                      placeholder="Customer address" 
                      value={formData.customer.address || ''} 
                      onChange={updateCustomerField} 
                      disabled={formData.customer._id && formData.customer._id !== "new"}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} />
                  Invoice Items
                </div>
                
                <div className="item-controls">
                  <button className="add-item-btn" type="button" onClick={addItem}>
                    <FontAwesomeIcon icon={faPlus} /> Add Item
                  </button>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
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
                            <option value="">Custom Item</option>
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </select>
                          {!item.itemId && (
                            <input
                              type="text"
                              placeholder="Item name (required)"
                              value={item.name || ''}
                              onChange={e => updateItem(i, 'name', e.target.value)}
                              className="custom-item-name"
                              required
                            />
                          )}
                        </td>
                        <td>
                          <input 
                            type="number" 
                            min="0"
                            step="0.01"
                            value={item.price || 0} 
                            onChange={e => updateItem(i, 'price', parseFloat(e.target.value) || 0)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={item.quantity || 1} 
                            onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} 
                            min="1"
                          />
                        </td>
                        <td>{formatCurrency(item.total)}</td>
                        <td>
                          <button 
                            className="remove-item-btn" 
                            type="button" 
                            onClick={() => removeItem(i)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: '8px' }} />
                  Totals
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faPercent} style={{ marginRight: '8px' }} />
                      Tax
                    </label>
                    <input 
                      type="number" 
                      placeholder="Tax amount" 
                      value={formData.tax || 0} 
                      onChange={e => setFormData(p => ({ 
                        ...p, 
                        tax: +e.target.value, 
                        total: p.subtotal + +e.target.value - (p.discount || 0) 
                      }))} 
                    />
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faPercent} style={{ marginRight: '8px' }} />
                      Discount
                    </label>
                    <input 
                      type="number" 
                      placeholder="Discount amount" 
                      value={formData.discount || 0} 
                      onChange={e => setFormData(p => ({ 
                        ...p, 
                        discount: +e.target.value, 
                        total: p.subtotal + (p.tax || 0) - +e.target.value 
                      }))} 
                    />
                  </div>
                </div>
                
                <div className="total-section">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(formData.subtotal)}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>{formatCurrency(formData.tax)}</span>
                  </div>
                  <div className="total-row">
                    <span>Discount:</span>
                    <span>-{formatCurrency(formData.discount)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>{formatCurrency(formData.total)}</span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} />
                  Payment Details
                </div>
                
                <div className="form-row">
                  <div>
                    <label>Status</label>
                    <select 
                      className="status-select"
                      value={formData.status || 'draft'} 
                      onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                    >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="draft">Draft</option>
                </select>
                  </div>
                  
                  <div>
                    <label>Payment Method</label>
                    <select 
                      value={formData.paymentMethod || 'cash'} 
                      onChange={e => setFormData(p => ({ ...p, paymentMethod: e.target.value }))}
                    >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="other">Other</option>
                </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                      Due Date
                    </label>
                    <input 
                      type="date" 
                      value={formData.dueDate || ''} 
                      onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))} 
                    />
                  </div>
                  
                  <div>
                    <label>
                      <FontAwesomeIcon icon={faStickyNote} style={{ marginRight: '8px' }} />
                      Notes
                    </label>
                    <textarea 
                      placeholder="Invoice notes" 
                      value={formData.notes || ''} 
                      onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} 
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary" onClick={closeModal} disabled={isSubmitting}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button type="submit" className="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> 
                      {selectedInvoice ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} /> 
                      {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
