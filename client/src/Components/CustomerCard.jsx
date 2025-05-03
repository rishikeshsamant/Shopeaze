import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faCheckCircle, faClock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function CustomerCard({ customer, onClick }) {
    // Determine status based on balanceDue and amountPaid
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
    const transactionCount = customer.transactions.length;

    return (
        <div className="modern-card" onClick={onClick}>
            <div className="top-row">
                <div className="avatar">
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div className='customer-det'>
                    <h3>{customer.name}</h3>
                    <p>
                        <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} /> 
                        {customer.phoneNumber}
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} /> 
                        {customer.email}
                    </p>
                </div>
            </div>
            <div className="bottom-row">
                <div className={`status ${status.status}`}>
                    <FontAwesomeIcon icon={status.icon} />
                    {status.label}
                </div>
                <div className="items-preview">
                    {transactionCount > 0 ? (
                        <span>{transactionCount} transaction(s)</span>
                    ) : (
                        <span>No transactions</span>
                    )}
                </div>
            </div>
        </div>
    );
}
