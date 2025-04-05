import { useState, useEffect } from 'react';
import CustomerCard from '../Components/CustomerCard';
import CustomerDetailModal from '../Components/CustomerDetailModal';
import customerService from '../services/api/customerService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/Customer.css';

export default function Customer() {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerService.getAllCustomers();
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCustomerUpdate = (updatedCustomer, isDeleted = false) => {
        if (isDeleted) {
            // Refresh the customer list after deletion
            fetchCustomers();
        } else if (updatedCustomer) {
            // Update the customer in the list if it exists, otherwise add it
            setCustomers(prev => {
                const exists = prev.some(c => c._id === updatedCustomer._id);
                if (exists) {
                    return prev.map(c => c._id === updatedCustomer._id ? updatedCustomer : c);
                } else {
                    return [...prev, updatedCustomer];
                }
            });
        }
        setSelectedCustomer(null);
        setShowNewCustomerModal(false);
    };

    return (
        <div className="customer-page">
            <div className="page-header">
                <h1>Customers</h1>
                <button className="add-customer-btn" onClick={() => setShowNewCustomerModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Customer
                </button>
            </div>
            
            {loading && !customers.length ? (
                <div className="loading-message">Loading customers...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : customers.length === 0 ? (
                <div className="empty-state">
                    <p>No customers found. Add your first customer to get started.</p>
                    <button className="add-customer-btn" onClick={() => setShowNewCustomerModal(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Add Customer
                    </button>
                </div>
            ) : (
                <div className="customer-grid">
                    {customers.map((customer) => (
                        <CustomerCard 
                            key={customer._id}
                            customer={customer}
                            onClick={() => setSelectedCustomer(customer)}
                        />
                    ))}
                </div>
            )}

            {selectedCustomer && (
                <CustomerDetailModal 
                    customer={selectedCustomer} 
                    onClose={() => setSelectedCustomer(null)}
                    onUpdate={handleCustomerUpdate}
                />
            )}

            {showNewCustomerModal && (
                <CustomerDetailModal 
                    isNew={true}
                    onClose={() => setShowNewCustomerModal(false)}
                    onUpdate={handleCustomerUpdate}
                />
            )}
        </div>
    );
}