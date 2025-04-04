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
  faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function CustomerDetailModal({ customer, onClose }) {
    const [selectedInvoice, setSelectedInvoice] = useState(null);

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
                        <h2>{customer.CustomerName}</h2>
                        <p>
                            <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                            {customer.CustomerMobile}
                        </p>
                        <div className={`status-badge ${customer.Status.toLowerCase()}`}>
                            <FontAwesomeIcon icon={customer.Status === 'Paid' ? faCheckCircle : faClock} />
                            {customer.Status}
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="info-section">
                        <h3>Customer Information</h3>
                        <p>
                            <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Address</span>
                            <span>{customer.CustomerAdd}</span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faPhone} /> Phone</span>
                            <span>{customer.CustomerMobile}</span>
                        </p>
                        <p>
                            <span><FontAwesomeIcon icon={faEnvelope} /> Email</span>
                            <span>customer@example.com</span>
                        </p>
                    </div>

                    <div className="purchase-section">
                        <h3>Purchase History</h3>
                        {customer.invoices.length > 0 ? (
                            <div className="invoice-list">
                                {customer.invoices.map((invoice) => (
                                    <div key={invoice.id} 
                                        className="invoice-item" 
                                        onClick={() => setSelectedInvoice(invoice)}
                                    >
                                        <div className="invoice-date">
                                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                                            {invoice.date}
                                        </div>
                                        <div className="invoice-amount">
                                            <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: '8px' }} />
                                            {invoice.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No invoices found for this customer.</p>
                        )}

                        {selectedInvoice && (
                            <div className="invoice-details">
                                <h3>
                                    <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: '8px' }} />
                                    Invoice Details
                                </h3>
                                <div className="invoice-info">
                                    <p>
                                        <span><FontAwesomeIcon icon={faCalendarAlt} /> Date</span>
                                        <span>{selectedInvoice.date}</span>
                                    </p>
                                    <p>
                                        <span><FontAwesomeIcon icon={faMoneyBillWave} /> Amount</span>
                                        <span>{selectedInvoice.amount}</span>
                                    </p>
                                </div>
                                <h4>Purchased Items:</h4>
                                <ul>
                                    {selectedInvoice.details.map((item, index) => (
                                        <li key={index}>
                                            <FontAwesomeIcon icon={faShoppingBag} style={{ marginRight: '8px' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
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
