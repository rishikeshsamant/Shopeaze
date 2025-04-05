import React, { useState, useEffect, useRef } from 'react';
import '../styles/Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faHome,
  faCamera,
  faSpinner,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { theme } = useTheme();
  const { user, token, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !token) {
      // If not loading and no token exists, redirect to login
      // This would be enabled in a real app with login functionality
      // navigate('/login');
    }
  }, [authLoading, token, navigate]);
  
  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
      
      if (user.profilePicture) {
        setPreviewImage(user.profilePicture);
      }
      
      setIsLoading(false);
    }
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      setMessage({ 
        text: 'You must be logged in to update your profile', 
        type: 'error' 
      });
      return;
    }
    
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await updateProfile(
        user._id, 
        formData, 
        selectedFile
      );
      
      if (result.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Clear the selected file after successful update
        setSelectedFile(null);
      } else {
        setMessage({ 
          text: result.error || 'Failed to update profile', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: 'An unexpected error occurred. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="profile-loading">
        <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {message.text && (
        <div className={`profile-message ${message.type}`}>
          <FontAwesomeIcon icon={message.type === 'success' ? faCheck : faExclamationTriangle} />
          <span>{message.text}</span>
        </div>
      )}
      
      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image-container" onClick={handleImageClick}>
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" rx="40" fill="transparent" stroke="var(--primary-lighter, #dfbbda)" strokeWidth="2" />
                </svg>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="image-input"
          />
          <p className="profile-upload-hint">Click to upload photo</p>
        </div>
        
        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <span className="input-prefix">👤</span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <span className="input-prefix">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
              />
            </div>
            
            <div className="form-group">
              <span className="input-prefix">📱</span>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="form-group">
              <span className="input-prefix textarea-prefix">🏠</span>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                rows="4"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="update-profile-btn" 
              disabled={isSaving}
            >
              {isSaving ? "UPDATING..." : "UPDATE PROFILE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}