import axios from 'axios';

const localApiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  registerUser(userData) {
    return localApiClient.post('/users', userData);
  },
  
  async loginUser(credentials) {
    const response = await localApiClient.get('/users', {
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
  },

  getAllUsers() {
    return localApiClient.get('/users').then(res => res.data);
  },

  getUserById(userId) {
    return localApiClient.get(`/users/${userId}`).then(res => res.data);
  },

  updateUser(userId, userData) {
    return localApiClient.patch(`/users/${userId}`, userData);
  },

  deleteUser(userId) {
    return localApiClient.delete(`/users/${userId}`);
  },

  async isEmailTaken(email, excludeUserId = null) {
    const response = await localApiClient.get('/users', {
      params: { email }
    });
    
    if (excludeUserId) {
      return response.data.some(user => user.id !== excludeUserId);
    }
    
    return response.data.length > 0;
  },

  async isUsernameTaken(username, excludeUserId = null) {
    const response = await localApiClient.get('/users', {
      params: { username }
    });
    
    if (excludeUserId) {
      return response.data.some(user => user.id !== excludeUserId);
    }
    
    return response.data.length > 0;
  }
};