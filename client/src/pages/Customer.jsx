import { useState } from 'react';
import CustomerCard from '../Components/CustomerCard';
import CustomerDetailModal from '../Components/CustomerDetailModal';
import '../styles/Customer.css';

export default function Customer() {
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Updated customer data structure to match backend schema
    const customerData = [
        {
            _id: "1",
            user: "user123",
            name: "Yasir Akhlaque",
            email: "yasir@example.com",
            phoneNumber: "1234567890",
            billingAddress: "A 22/50 jbp lorema, UP",
            shippingAddress: "A 22/50 jbp lorema, UP",
            balanceDue: 0,
            amountPaid: 320,
            transactions: [
                {
                    date: "2024-01-15T10:30:00Z",
                    amount: 120,
                    method: "UPI",
                    notes: "Payment for invoice #INV-001"
                },
                {
                    date: "2023-12-20T14:45:00Z",
                    amount: 200,
                    method: "Cash",
                    notes: "Payment for invoice #INV-002"
                }
            ],
            paymentHistory: [
                {
                    invoiceId: "inv001",
                    amount: 120,
                    date: "2024-01-15T10:30:00Z"
                },
                {
                    invoiceId: "inv002",
                    amount: 200,
                    date: "2023-12-20T14:45:00Z"
                }
            ],
            createdAt: "2023-10-01T08:00:00Z",
            updatedAt: "2024-01-15T10:30:00Z"
        },
        {
            _id: "2",
            user: "user123",
            name: "Rishikesh Samant",
            email: "rishikesh@example.com",
            phoneNumber: "9876543210",
            billingAddress: "B 15/32 abc colony, MP",
            shippingAddress: "B 15/32 abc colony, MP",
            balanceDue: 150,
            amountPaid: 0,
            transactions: [],
            paymentHistory: [],
            createdAt: "2023-11-05T09:15:00Z",
            updatedAt: "2023-11-05T09:15:00Z"
        },
        {
            _id: "3",
            user: "user123",
            name: "Sajal Gangwar",
            email: "sajal@example.com",
            phoneNumber: "5678901234",
            billingAddress: "C 45/10 xyz street, Delhi",
            shippingAddress: "C 45/10 xyz street, Delhi",
            balanceDue: 0,
            amountPaid: 80,
            transactions: [
                {
                    date: "2023-12-10T11:20:00Z",
                    amount: 80,
                    method: "Card",
                    notes: "Payment for invoice #INV-003"
                }
            ],
            paymentHistory: [
                {
                    invoiceId: "inv003",
                    amount: 80,
                    date: "2023-12-10T11:20:00Z"
                }
            ],
            createdAt: "2023-10-20T12:30:00Z",
            updatedAt: "2023-12-10T11:20:00Z"
        },
    ];

    return (
        <div className="customer-page">
            <h1>Customers</h1>
            <div className="customer-grid">
                {customerData.map((customer) => (
                    <CustomerCard 
                        key={customer._id}
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