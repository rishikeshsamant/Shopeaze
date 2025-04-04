import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

export default function CustomerCard({ customer, onClick }) {
    return (
        <div className="modern-card" onClick={onClick}>
            <div className="top-row">
                <div className="avatar">
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div className='customer-det'>
                    <h3>{customer.CustomerName}</h3>
                    <p>
                        <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} /> 
                        {customer.CustomerMobile}
                    </p>
                </div>
            </div>
            <div className="bottom-row">
                <div className={`status ${customer.Status.toLowerCase()}`}>
                    <FontAwesomeIcon icon={customer.Status === 'Paid' ? faCheckCircle : faClock} />
                    {customer.Status}
                </div>
                <div className="items-preview">
                    {customer.invoices.length > 0 ? (
                        <span>{customer.invoices.length} invoice(s)</span>
                    ) : (
                        <span>No invoices</span>
                    )}
                </div>
            </div>
        </div>
    );
}
