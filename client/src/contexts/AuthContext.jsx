import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper function to safely parse jwt expiration
const getTokenExpiration = (token) => {
  try {
    // JWT tokens have three parts separated by dots
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;
    
    // Parse the middle part (payload)
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  return expiration ? expiration < new Date() : true;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token expired, logging out');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
        
        // Token exists and is not expired, fetch user data
        await fetchCurrentUser();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      
      // Only clear auth if it's an authentication error
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthError('Authentication expired. Please login again.');
      } else {
        // For other errors (like network issues), keep the auth state but set an error
        setAuthError('Could not connect to server. Using offline mode.');
      }
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await userService.login(credentials);
      localStorage.setItem('token', response.data.token);
      await fetchCurrentUser();
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.register(userData);
      
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please login.');
        return true;
      } else {
        toast.error(response.data?.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    toast.info('You have been logged out');
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.updateProfile(userData);
      setCurrentUser(response.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Session refresh function that can be called periodically
  const refreshSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // If token is about to expire (within 5 minutes), try to refresh it
    const expiration = getTokenExpiration(token);
    if (expiration && (expiration.getTime() - Date.now() < 5 * 60 * 1000)) {
      try {
        const response = await userService.refreshToken();
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }
  };

  // Refresh auth state if user comes back to the app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        refreshSession();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const value = {
    currentUser,
    loading,
    isAuthenticated,
    authError,
    login,
    register,
    logout,
    updateProfile,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 