// Debug script for login issues
import axios from 'axios';

// Configure test client
const testClient = axios.create({
  baseURL: 'https://shopeaze-server.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Test direct API endpoint
async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    // Test with /api/user/login
    const response = await testClient.post('/api/user/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Error details:', error.response?.data || 'No response data');
    return { error: error.message, details: error.response?.data };
  }
}

// Run the test
testLogin().then(result => {
  console.log('Test completed:', result);
});

export { testLogin }; 