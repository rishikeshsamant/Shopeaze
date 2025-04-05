import React, { useState, useEffect } from 'react';
import '../styles/Setting.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faGlobe, faMapMarkerAlt, faBuilding, faHome, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { settingsService } from '../services/api';
import { toast } from 'react-toastify';

const Setting = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingApp, setSavingApp] = useState(false);
  
  // Initial state that matches the backend schema
  const [settings, setSettings] = useState({
    businessName: "",
    logo: "",
    language: "English",
    country: "India",
    address: "",
    home: "/dashboard" // Default home page path
  });

  // Form state to track changes
  const [formData, setFormData] = useState({...settings});

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getSettings();
        if (response.data) {
          setSettings(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSettings();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSavingCompany(true);
      
      const companyData = {
        businessName: formData.businessName,
        logo: formData.logo,
        language: formData.language,
        country: formData.country,
        address: formData.address
      };
      
      const response = await settingsService.updateCompanyInfo(companyData);
      if (response.data) {
        setSettings(prev => ({
          ...prev,
          ...response.data
        }));
        toast.success('Company settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to update company settings:', error);
      toast.error('Failed to save company settings');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleAppSettingsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSavingApp(true);
      
      const appSettings = {
        home: formData.home
      };
      
      const response = await settingsService.updateInvoiceSettings(appSettings);
      if (response.data) {
        setSettings(prev => ({
          ...prev,
          ...response.data
        }));
        toast.success('Application settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to update application settings:', error);
      toast.error('Failed to save application settings');
    } finally {
      setSavingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      
      <form onSubmit={handleCompanySubmit}>
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
            
            <div className="form-group full-width">
              <button type="submit" className="btn primary" disabled={savingCompany}>
                {savingCompany ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} /> Save Company Info
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      <form onSubmit={handleAppSettingsSubmit}>
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
              <button type="submit" className="btn primary" disabled={savingApp}>
                {savingApp ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} /> Save App Settings
                  </>
                )}
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