import React from 'react';
import '../styles/Setting.css';

const Setting = () => {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      
      <div className="settings-card">
        <h2 className="card-title">Company Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              defaultValue="Shopeaze Inc."
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              defaultValue="contact@shopeaze.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              defaultValue="+1 (555) 123-4567"
            />
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              defaultValue="www.shopeaze.com"
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              rows="2"
              defaultValue="123 Business Street, Suite 100, San Francisco, CA 94107"
            ></textarea>
          </div>
          <div className="form-group full-width">
            <button className="btn primary">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <h2 className="card-title">Invoice Settings</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="taxRate">Default Tax Rate (%)</label>
            <input
              type="number"
              id="taxRate"
              defaultValue={10}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentTerms">Default Payment Terms (days)</label>
            <input
              type="number"
              id="paymentTerms"
              defaultValue={30}
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="invoiceNotes">Invoice Notes Template</label>
            <textarea
              id="invoiceNotes"
              rows="4"
              defaultValue="Thank you for your business! Payment is due within the specified terms."
            ></textarea>
          </div>
          <div className="form-group full-width">
            <button className="btn primary">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;