// Debug script for login issues
import axios from 'axios';

// Configure test client
const testClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shopeaze-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Test direct API endpoint
async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    console.log('API URL:', testClient.defaults.baseURL);
    
    // Test with login endpoint
    const response = await testClient.post('/user/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Error details:', error.response?.data || 'No response data');
    console.error('Full error:', error);
    return { error: error.message, details: error.response?.data };
  }
}

// Run the test
testLogin().then(result => {
  console.log('Test completed:', result);
});

export { testLogin };

// Function to test API connection
const testConnection = async () => {
  try {
    // Get the API URL from environment variables
    const apiUrl = import.meta.env.VITE_API_URL || 'https://shopeaze-backend.onrender.com/api';
    
    console.log('Testing connection to:', apiUrl);
    
    // Make a simple request to check if the API is accessible
    const response = await axios.get(`${apiUrl}/user/test-connection`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    console.log('Connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. CORS issue?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return false;
  }
};

// Function to test CORS configuration
const testCORS = async () => {
  try {
    console.log('Testing CORS configuration...');
    const apiUrl = import.meta.env.VITE_API_URL || 'https://shopeaze-backend.onrender.com/api';
    
    // Make a preflight OPTIONS request
    const response = await fetch(`${apiUrl}/user/login`, {
      method: 'OPTIONS',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      }
    });
    
    console.log('CORS preflight response status:', response.status);
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
    });
    
    return {
      success: response.status === 204 || response.status === 200,
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
      }
    };
  } catch (error) {
    console.error('CORS test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export { testLogin, testCORS, testConnection }; 