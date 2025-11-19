import axios from 'axios';

const localApiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

const lastFmApiKey = import.meta.env.VITE_LASTFM_API_KEY;
const lastFmApiUrl = 'https://ws.audioscrobbler.com/2.0/';

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

  async getRecentTracks(lastfmUsername) {
    const response = await axios.get(lastFmApiUrl, {
      params: {
        method: 'user.getrecenttracks',
        user: lastfmUsername,
        api_key: lastFmApiKey,
        format: 'json',
        limit: 20 // ULTIMAS 20 TRACKS
      }
    });
    if (response.data.error) {
      throw new Error(response.data.message);
    }
    return response.data.recenttracks.track;
  }
};