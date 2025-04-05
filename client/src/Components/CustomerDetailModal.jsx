import { useState } from 'react';
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
  faReceipt
} from '@fortawesome/free-solid-svg-icons';

export default function CustomerDetailModal({ customer, onClose }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Format date for display
    const formatDate = (dateString) => {
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
        }).format(amount);
    };

    // Determine customer status
    const getStatus = () => {
        if (customer.balanceDue > 0) {
            return { status: 'pending', icon: faClock, label: 'Due Balance' };
        } else if (customer.amountPaid > 0) {
            return { status: 'paid', icon: faCheckCircle, label: 'Paid' };
        } else {
            return { status: 'new', icon: faUser, label: 'New' };
        }
    };

    const status = getStatus();

    return (
        <div className="modal-overlay full-screen">
            <div className="modal-content glass">
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

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
                </div>

                <div className="modal-body">
                    <div className="info-section">
                        <h3>Customer Information</h3>
                        <p>
                            <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Billing Address</span>
                            <span>{customer.billingAddress}</span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Shipping Address</span>
                            <span>{customer.shippingAddress}</span>
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
                        {customer.transactions.length > 0 ? (
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
