import { useState } from 'react';
import CustomerCard from '../Components/CustomerCard';
import CustomerDetailModal from '../Components/CustomerDetailModal';
import '../styles/Customer.css';

export default function Customer() {
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const CustomerData = [
        {
            CustomerName: "Yasir Akhlaque",
            CustomerAdd: "A 22/50 jbp lorema, UP",
            CustomerMobile: "1234567890",
            Status: "Paid",
            invoices: [
                { id: 1, date: "2024-12-01", amount: "₹120", details: ['Burger', 'Soda'] },
                { id: 2, date: "2024-11-20", amount: "₹200", details: ['Pizza'] }
            ]
        },
        {
            CustomerName: "Rishikesh Samant",
            CustomerAdd: "A 22/50 jbp lorema, UP",
            CustomerMobile: "1234567890",
            Status: "Pending",
            invoices: []
        },
        {
            CustomerName: "Sajal Gangwar",
            CustomerAdd: "A 22/50 jbp lorema, UP",
            CustomerMobile: "1234567890",
            Status: "Paid",
            invoices: [
                { id: 3, date: "2024-10-15", amount: "₹80", details: ['Chowmin'] }
            ]
        },
    ];

    return (
        <div className="customer-page">
            <h1>Customers</h1>
            <div className="customer-grid">
                {CustomerData.map((customer, index) => (
                    <CustomerCard 
                        key={index}
                        customer={customer}
                        onClick={() => setSelectedCustomer(customer)}
                    />
                ))}
            </div>

            {selectedCustomer && (
                <CustomerDetailModal 
                    customer={selectedCustomer} 
                    onClose={() => setSelectedCustomer(null)} 
                />
            )}
        </div>
    );
}