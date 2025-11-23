import axios from 'axios';

const localApiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

const lastFmApiKey = import.meta.env.VITE_LASTFM_API_KEY;
const lastFmApiUrl = 'https://ws.audioscrobbler.com/2.0/';

const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
let spotifyAccessToken = null;
let tokenExpirationTime = null;

// setup das credenciais
async function getSpotifyAccessToken() {
  if (spotifyAccessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return spotifyAccessToken;
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${spotifyClientId}:${spotifyClientSecret}`)
      }
    }
  );

  spotifyAccessToken = response.data.access_token;
  tokenExpirationTime = Date.now() + (response.data.expires_in * 1000);
  return spotifyAccessToken;
}

async function getSpotifyArtistImage(artistName) {
  try {
    const token = await getSpotifyAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: artistName,
        type: 'artist',
        limit: 1
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.artists.items.length > 0) {
      const artist = response.data.artists.items[0];
      if (artist.images && artist.images.length > 0) {
        return artist.images[0].url;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching Spotify artist image:', error);
    return null;
  }
}

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
        limit: 35 // ULTIMAS 35 TRACKS
      }
    });
    if (response.data.error) {
      throw new Error(response.data.message);
    }
    return response.data.recenttracks.track;
  },
  
  async getTopArtists(lastfmUsername, period = '7day', limit = 6) {
    const response = await axios.get(lastFmApiUrl, {
      params: {
        method: 'user.gettopartists',
        user: lastfmUsername,
        api_key: lastFmApiKey,
        format: 'json',
        period: period,
        limit: limit
      }
    });
    if (response.data.error) {
      throw new Error(response.data.message);
    }
    
    // dá fetch da imagem PELO spotify visto que o LASTFM não permite faze-lo
    const artists = response.data.topartists.artist;
    const enhancedArtists = await Promise.all(
      artists.map(async (artist) => {
        const spotifyImage = await getSpotifyArtistImage(artist.name);
        return {
          ...artist,
          spotifyImage: spotifyImage
        };
      })
    );
    
    return enhancedArtists;
  },

  getSpotifyArtistImage
};