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
  faClock
} from '@fortawesome/free-solid-svg-icons';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer: { name: '', email: '', phone: '', address: '' },
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

  // Simulate API calls for demonstration
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          setInvoices(mockInvoices);
          setProducts(mockProducts);
          setLoading(false);
        }, 500);
      } catch (err) {
        alert('Failed to fetch data');
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
    return new Date(date).toLocaleDateString('en-US');
  };

  const openModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    setFormData(invoice || {
      customer: { name: '', email: '', phone: '', address: '' },
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
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
      items: [...prev.items, { product: '', name: '', price: 0, quantity: 1, total: 0 }],
    }));
  };

  const removeItem = (i) => {
    const newItems = formData.items.filter((_, idx) => idx !== i);
    updateTotals(newItems);
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    let item = { ...items[index], [field]: value };

    if (field === 'product') {
      const prod = products.find(p => p._id === value);
      if (prod) {
        item.name = prod.name;
        item.price = prod.price;
      }
    }

    if (field === 'quantity' || field === 'price') {
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
    try {
      if (selectedInvoice) {
        // Simulate API call
        const updated = invoices.map((inv) => 
          inv._id === selectedInvoice._id ? { ...formData, _id: inv._id } : inv
        );
        setInvoices(updated);
        alert('Invoice updated successfully');
      } else {
        // Simulate API call
        const newInvoice = {
          ...formData,
          _id: Date.now().toString(),
          invoiceNumber: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          createdAt: new Date()
        };
        setInvoices([...invoices, newInvoice]);
        alert('Invoice created successfully');
      }
      closeModal();
    } catch {
      alert('Failed to save invoice');
    }
  };

  const deleteInvoice = async (invoice) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      // Simulate API call
      const updated = invoices.filter((inv) => inv._id !== invoice._id);
      setInvoices(updated);
      alert('Invoice deleted successfully');
    } catch {
      alert('Failed to delete invoice');
    }
  };

  if (loading) return <div className="loading">Loading invoices...</div>;

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

      <div className="invoice-grid">
        {invoices.map((inv) => (
          <div className="invoice-card" key={inv._id}>
            <div className="invoice-card-header">
              <div className="invoice-number">
                <FontAwesomeIcon icon={faFileInvoice} />
                <span>{inv.invoiceNumber}</span>
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
                <span>{inv.customer.name}</span>
              </div>
              
              <div className="invoice-amount">
                <FontAwesomeIcon icon={faMoneyBillWave} />
                <span>{formatCurrency(inv.total)}</span>
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
                    <label>
                      <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                      Name
                    </label>
                    <input 
                      name="name" 
                      placeholder="Customer name" 
                      value={formData.customer.name || ''} 
                      onChange={updateCustomerField} 
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
                            value={item.product || ''} 
                            onChange={e => updateItem(i, 'product', e.target.value)}
                          >
                            <option value="">Select product</option>
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={item.price || 0} 
                            onChange={e => updateItem(i, 'price', parseFloat(e.target.value))} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={item.quantity || 1} 
                            onChange={e => updateItem(i, 'quantity', parseInt(e.target.value))} 
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
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
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
                  <option value="digital wallet">Digital Wallet</option>
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
                <button type="button" className="secondary" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button type="submit" className="primary">
                  <FontAwesomeIcon icon={faSave} /> {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
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
