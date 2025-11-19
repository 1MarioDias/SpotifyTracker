import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  registerUser(userData) {
    return apiClient.post('/users', userData);
  },
  
  async loginUser(credentials) {
    const response = await apiClient.get('/users', {
      params: {
        email: credentials.email,
        password: credentials.password
      }
    });
    if (response.data.length === 1) {
      return response.data[0];
    } else {
      throw new Error('Invalid credentials');
    }
  }
};