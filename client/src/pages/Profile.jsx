import React, { useState, useEffect, useRef } from 'react';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faHome,
  faCamera,
  faSpinner,
  faCheck,
  faTimes,
  faArrowLeft,
  faKey
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    profilePicture: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  useEffect(() => {
    // Use the currentUser from auth context
    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        profilePicture: currentUser.profilePicture || null
      });
      setPreviewImage(currentUser.profilePicture || null);
      setIsLoading(false);
    }
  }, [currentUser]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // In a real application, you would upload this file to your server
      // and update the user.profilePicture with the URL returned from the server
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Using the updateProfile from auth context
      const formData = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address
      };
      
      // If we have a new image, we would handle file upload here
      // For now, assuming profilePicture is a URL string
      if (previewImage && previewImage !== currentUser.profilePicture) {
        formData.profilePicture = previewImage;
      }
      
      const success = await updateProfile(formData);
      
      if (success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordSection(false);
      } else {
        toast.error(response.data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`profile-loading ${theme}-theme`}>
        <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={`profile-container ${theme}-theme`}>
      <div className="profile-header">
        <div className="profile-header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information</p>
          </div>
        </div>
      </div>
      
      <div className="profile-card">
        <div className="profile-image-section">
          <div className="profile-image-container" onClick={handleImageClick}>
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <div className="profile-image-overlay">
              <FontAwesomeIcon icon={faCamera} />
            </div>
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
        
        <div className="profile-form-section">
          {message.text && (
            <div className={`profile-message ${message.type}`}>
              <FontAwesomeIcon icon={message.type === 'success' ? faCheck : faTimes} />
              <span>{message.text}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
              />
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="form-group">
              <div className="input-icon textarea-icon">
                <FontAwesomeIcon icon={faHome} />
              </div>
              <textarea
                name="address"
                value={user.address}
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
              {isSaving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Updating...</span>
                </>
              ) : 'Update Profile'}
            </button>
          </form>
          
          <div className="profile-section-divider">
            <span>Security</span>
          </div>
          
          <button 
            className="toggle-password-section" 
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            <FontAwesomeIcon icon={faKey} />
            <span>Change Password</span>
          </button>
          
          {showPasswordSection && (
            <form onSubmit={handlePasswordSubmit} className="profile-form password-form">
              <div className="form-group">
                <div className="input-icon">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Current Password"
                  className={passwordErrors.currentPassword ? 'error' : ''}
                />
                {passwordErrors.currentPassword && (
                  <div className="error-message">{passwordErrors.currentPassword}</div>
                )}
              </div>
              
              <div className="form-group">
                <div className="input-icon">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="New Password"
                  className={passwordErrors.newPassword ? 'error' : ''}
                />
                {passwordErrors.newPassword && (
                  <div className="error-message">{passwordErrors.newPassword}</div>
                )}
              </div>
              
              <div className="form-group">
                <div className="input-icon">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm New Password"
                  className={passwordErrors.confirmPassword ? 'error' : ''}
                />
                {passwordErrors.confirmPassword && (
                  <div className="error-message">{passwordErrors.confirmPassword}</div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="update-profile-btn" 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Updating Password...</span>
                  </>
                ) : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}