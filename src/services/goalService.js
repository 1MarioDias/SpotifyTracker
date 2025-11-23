import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getGoals(userId) {
    return apiClient.get(`/goals?userId=${userId}`).then(res => res.data);
  },
  getGoal(id) {
    return apiClient.get(`/goals/${id}`).then(res => res.data);
  },
  createGoal(goalData) {
    return apiClient.post('/goals', goalData).then(res => res.data);
  },
  updateGoal(id, goalData) {
    return apiClient.patch(`/goals/${id}`, goalData).then(res => res.data);
  },
  deleteGoal(id) {
    return apiClient.delete(`/goals/${id}`);
  }
};