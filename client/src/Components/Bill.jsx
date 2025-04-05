import '../styles/Bill.css';

const Bill = () => {
  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div>
          <h2>Invoice</h2>
          <p><strong>Billed To:</strong><br />Client Name<br />Address / Contact Info</p>
        </div>
        <div className="invoice-info">
          <p><strong>Invoice No.</strong><br />#000123</p>
          <p><strong>Issued on</strong><br />December 7, 2022</p>
          <p><strong>Payment Due</strong><br />December 22, 2022</p>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Services</th>
            <th>Qty.</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Invoice Item 1</td>
            <td>1</td>
            <td>4,000.00</td>
            <td>4,000.00</td>
          </tr>
          <tr>
            <td>Invoice Item 2</td>
            <td>1</td>
            <td>4,000.00</td>
            <td>4,000.00</td>
          </tr>
          <tr>
            <td>Invoice Item 3</td>
            <td>1</td>
            <td>4,000.00</td>
            <td>4,000.00</td>
          </tr>
        </tbody>
      </table>

      <div className="invoice-total">
        <span>Total (USD)</span>
        <strong>4,000.00</strong>
      </div>

      <div className="invoice-footer">
        <div>
          <h4>Company Name LLC</h4>
          <p>Address / Contact Info</p>
          <p>email@company.com</p>
          <p>ID#1 Label<br />1234567890-123</p>
          <p>ID#2 Label<br />ABC-0987654321</p>
        </div>
        <div>
          <h4>Payment Instructions</h4>
          <p>Voluptas nis aut. Est vitae dolore molestias porro praesentium. Tempore recusandae voluptatem necessitatibus corporis inventore neque magnam ut.</p>
          <p>ID#1 Label<br />1234567890-123</p>
          <p>ID#2 Label<br />ABC-0987654321</p>
        </div>
        <div>
          <h4>Additional Notes</h4>
          <p>Have a great day</p>
        </div>
      </div>
    </div>
  );
};

export default Bill;
