import React, { useState } from 'react';
import '../styles/Setting.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faGlobe, faMapMarkerAlt, faBuilding, faHome, faImage } from '@fortawesome/free-solid-svg-icons';

const Setting = () => {
  // Initial state that matches the backend schema
  const [settings, setSettings] = useState({
    user: "user123", // This would come from auth context in production
    businessName: "Shopeaze Inc.",
    logo: "https://via.placeholder.com/150",
    language: "English",
    country: "India",
    address: "123 Business Street, Suite 100, Mumbai, India",
    home: "/dashboard" // Default home page path
  });

  // Form state to track changes
  const [formData, setFormData] = useState({...settings});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would make an API call to update settings
    setSettings(formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="settings-card">
          <h2 className="card-title">
            <FontAwesomeIcon icon={faBuilding} /> Company Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="businessName">Company Name</label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="logo">Logo URL</label>
              <input
                type="text"
                id="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">
                <FontAwesomeIcon icon={faGlobe} /> Language
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Telugu">Telugu</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="country">
                <FontAwesomeIcon icon={faGlobe} /> Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Business Address
              </label>
              <textarea
                id="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <h2 className="card-title">
            <FontAwesomeIcon icon={faHome} /> Application Settings
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="home">Default Home Page</label>
              <select
                id="home"
                value={formData.home}
                onChange={handleChange}
              >
                <option value="/dashboard">Dashboard</option>
                <option value="/invoices">Invoices</option>
                <option value="/customers">Customers</option>
                <option value="/items">Items</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <button type="submit" className="btn primary">
                <FontAwesomeIcon icon={faSave} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preview section */}
      <div className="settings-card">
        <h2 className="card-title">Preview</h2>
        <div className="preview-section">
          <div className="preview-logo">
            {formData.logo ? (
              <img src={formData.logo} alt="Company Logo" />
            ) : (
              <div className="preview-logo-placeholder">
                <FontAwesomeIcon icon={faImage} />
                <span>No Logo</span>
              </div>
            )}
          </div>
          <div className="preview-info">
            <h3>{formData.businessName}</h3>
            <p>{formData.address}</p>
            <p>
              <small>
                Language: {formData.language} | Country: {formData.country}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;