import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faCheckCircle, 
  faClock,
  faFileInvoice,
  faCalendarAlt,
  faMoneyBillWave,
  faShoppingBag,
  faEnvelope,
  faPlus,
  faTimes,
  faWallet,
  faCreditCard,
  faReceipt,
  faSave,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import customerService from '../services/api/customerService';

// Create a CustomerForm component for reuse
const CustomerForm = ({ customer, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        billingAddress: '',
        shippingAddress: '',
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                email: customer.email || '',
                phoneNumber: customer.phoneNumber || '',
                billingAddress: customer.billingAddress || '',
                shippingAddress: customer.shippingAddress || '',
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-group">
                <label htmlFor="name">
                    <FontAwesomeIcon icon={faUser} /> Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">
                    <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="phoneNumber">
                    <FontAwesomeIcon icon={faPhone} /> Phone Number
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="billingAddress">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Billing Address
                </label>
                <textarea
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="shippingAddress">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Shipping Address
                </label>
                <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onCancel}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button type="submit" className="save-btn">
                    <FontAwesomeIcon icon={faSave} /> Save
                </button>
            </div>
        </form>
    );
};

export default function CustomerDetailModal({ customer, onClose, onUpdate, isNew = false }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [editMode, setEditMode] = useState(isNew);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Determine customer status
    const getStatus = () => {
        if (!customer) return { status: 'new', icon: faUser, label: 'New' };
        
        if (customer.balanceDue > 0) {
            return { status: 'pending', icon: faClock, label: 'Due Balance' };
        } else if (customer.amountPaid > 0) {
            return { status: 'paid', icon: faCheckCircle, label: 'Paid' };
        } else {
            return { status: 'new', icon: faUser, label: 'New' };
        }
    };

    const status = getStatus();

    const handleSaveCustomer = async (formData) => {
        try {
            setLoading(true);
            
            let response;
            if (isNew) {
                response = await customerService.createCustomer(formData);
            } else {
                response = await customerService.updateCustomer(customer._id, formData);
            }
            
            setError(null);
            setEditMode(false);
            
            // Notify parent component of the update
            if (onUpdate) {
                onUpdate(response.data);
            } else {
                // If no update handler is provided, just close the modal
                onClose();
            }
        } catch (err) {
            console.error('Error saving customer:', err);
            setError('Failed to save customer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCustomer = async () => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                setLoading(true);
                await customerService.deleteCustomer(customer._id);
                setError(null);
                onClose();
                
                // Notify parent component of the deletion
                if (onUpdate) {
                    onUpdate(null, true);
                }
            } catch (err) {
                console.error('Error deleting customer:', err);
                setError('Failed to delete customer. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    // If in edit mode, show the form
    if (editMode) {
        return (
            <div className="modal-overlay full-screen">
                <div className="modal-content glass">
                    <button className="close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    
                    <div className="modal-header">
                        <h2>{isNew ? 'Add New Customer' : 'Edit Customer'}</h2>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <CustomerForm 
                        customer={customer} 
                        onSubmit={handleSaveCustomer} 
                        onCancel={() => isNew ? onClose() : setEditMode(false)}
                    />
                </div>
            </div>
        );
    }

    // For new customers, we should always start in edit mode
    if (isNew) {
        return null;
    }

    // Display view for existing customer
    return (
        <div className="modal-overlay full-screen">
            <div className="modal-content glass">
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading-message">Processing...</div>}

                <div className="modal-header">
                    <div className="modal-avatar">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="modal-header-info">
                        <h2>{customer.name}</h2>
                        <p>
                            <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                            {customer.phoneNumber}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                            {customer.email}
                        </p>
                        <div className={`status-badge ${status.status}`}>
                            <FontAwesomeIcon icon={status.icon} />
                            {status.label}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="edit-btn" onClick={() => setEditMode(true)}>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                        <button className="delete-btn" onClick={handleDeleteCustomer}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="info-section">
                        <h3>Customer Information</h3>
                        <p>
                            <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Billing Address</span>
                            <span>{customer.billingAddress || 'Not provided'}</span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Shipping Address</span>
                            <span>{customer.shippingAddress || 'Not provided'}</span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faWallet} /> Balance Due</span>
                            <span className={customer.balanceDue > 0 ? 'due-amount' : ''}>
                                {formatCurrency(customer.balanceDue)}
                            </span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faMoneyBillWave} /> Amount Paid</span>
                            <span>{formatCurrency(customer.amountPaid)}</span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faCalendarAlt} /> Customer Since</span>
                            <span>{formatDate(customer.createdAt)}</span>
                        </p>
                    </div>

                    <div className="purchase-section">
                        <h3>Transaction History</h3>
                        {customer.transactions && customer.transactions.length > 0 ? (
                            <div className="transaction-grid">
                                {customer.transactions.map((transaction, index) => (
                                    <div 
                                        key={index} 
                                        className={`transaction-card ${selectedTransaction === transaction ? 'selected' : ''}`}
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                        <div className="transaction-header">
                                            <div className="transaction-icon">
                                                <FontAwesomeIcon icon={faReceipt} />
                                            </div>
                                            <div className="transaction-amount">
                                                {formatCurrency(transaction.amount)}
                                            </div>
                                        </div>
                                        <div className="transaction-details">
                                            <div className="transaction-date">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                <span>{formatDate(transaction.date)}</span>
                                            </div>
                                            <div className="transaction-method">
                                                <FontAwesomeIcon icon={faCreditCard} />
                                                <span>{transaction.method}</span>
                                            </div>
                                            {transaction.notes && (
                                                <div className="transaction-notes">
                                                    {transaction.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-transactions">No transactions found for this customer.</p>
                        )}

                        {selectedTransaction && (
                            <div className="transaction-detail-card">
                                <h3>
                                    <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: '8px' }} />
                                    Transaction Details
                                </h3>
                                <div className="transaction-detail-content">
                                    <div className="detail-row">
                                        <div className="detail-label">
                                            <FontAwesomeIcon icon={faCalendarAlt} /> Date
                                        </div>
                                        <div className="detail-value">
                                            {formatDate(selectedTransaction.date)}
                                        </div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-label">
                                            <FontAwesomeIcon icon={faMoneyBillWave} /> Amount
                                        </div>
                                        <div className="detail-value highlight">
                                            {formatCurrency(selectedTransaction.amount)}
                                        </div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-label">
                                            <FontAwesomeIcon icon={faCreditCard} /> Payment Method
                                        </div>
                                        <div className="detail-value">
                                            {selectedTransaction.method}
                                        </div>
                                    </div>
                                    {selectedTransaction.notes && (
                                        <div className="detail-row notes">
                                            <div className="detail-label">Notes</div>
                                            <div className="detail-value">
                                                {selectedTransaction.notes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button className="add-invoice-btn">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                            Create New Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
