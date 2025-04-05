import React, { useState, useEffect, useRef } from 'react';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
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
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
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
  
  useEffect(() => {
    // Fetch user data from backend
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - in production, this would be an API call
      // const response = await fetch('/api/user/profile');
      // const data = await response.json();
      
      // Mock response
      const data = {
        name: 'Yasir Akhlaque',
        email: 'yasirakhlaque@gmail.com',
        phoneNumber: '9876543210',
        address: 'New Delhi, India',
        profilePicture: 'https://via.placeholder.com/150'
      };
      
      setUser(data);
      setPreviewImage(data.profilePicture);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ text: 'Failed to load profile data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
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
      // Simulate API call
      // In production:
      // const formData = new FormData();
      // formData.append('name', user.name);
      // formData.append('email', user.email);
      // formData.append('phoneNumber', user.phoneNumber);
      // formData.append('address', user.address);
      // if (fileInputRef.current.files[0]) {
      //   formData.append('profilePicture', fileInputRef.current.files[0]);
      // }
      // 
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   body: formData
      // });
      // const data = await response.json();
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      // Update local state with the "response"
      setUser(prev => ({
        ...prev,
        profilePicture: previewImage
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile', type: 'error' });
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
        </div>
      </div>
    </div>
  );
}