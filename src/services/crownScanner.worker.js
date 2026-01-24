import axios from 'axios';

const lastFmApiKey = import.meta.env.VITE_LASTFM_API_KEY;
const lastFmApiUrl = 'https://ws.audioscrobbler.com/2.0/';
const localApiUrl = 'http://localhost:3000';

// cache para artistas já verificados
const artistCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function getArtistInfo(lastfmUsername, artistName) {
  const cacheKey = `${lastfmUsername}:${artistName}`;
  const cached = artistCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await axios.get(lastFmApiUrl, {
    params: {
      method: 'artist.getInfo',
      artist: artistName,
      username: lastfmUsername,
      api_key: lastFmApiKey,
      format: 'json'
    }
  });

  if (response.data.error) {
    throw new Error(response.data.message);
  }

  const data = response.data.artist.stats;
  artistCache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}

async function getTopArtists(lastfmUsername, limit = 50) {
  const response = await axios.get(lastFmApiUrl, {
    params: {
      method: 'user.gettopartists',
      user: lastfmUsername,
      api_key: lastFmApiKey,
      format: 'json',
      period: 'overall',
      limit: limit
    }
  });

  if (response.data.error) {
    throw new Error(response.data.message);
  }

  return response.data.topartists.artist;
}

async function getAllUsers() {
  const response = await axios.get(`${localApiUrl}/users`);
  return response.data;
}

async function updateUserCrowns(userId, crowns) {
  await axios.patch(`${localApiUrl}/users/${userId}`, { crowns });
}

// processa artists em batches para não sobrecarregar a API
async function processBatch(artists, users, startIndex, batchSize) {
  const batch = artists.slice(startIndex, startIndex + batchSize);
  const results = {};

  for (const artist of batch) {
    let maxPlays = 0;
    let crownHolderId = null;

    // processa users em paralelo (max 5 simultâneos para respeitar rate limit)
    const userBatches = [];
    for (let i = 0; i < users.length; i += 5) {
      const userBatch = users.slice(i, i + 5);
      userBatches.push(userBatch);
    }

    for (const userBatch of userBatches) {
      const promises = userBatch.map(async (u) => {
        try {
          const stats = await getArtistInfo(u.lastfm_username, artist.name);
          const playcount = parseInt(stats.userplaycount || 0, 10);
          return { userId: u.id, playcount };
        } catch (err) {
          console.warn(`Failed to fetch stats for ${u.lastfm_username} - ${artist.name}:`, err.message);
          return { userId: u.id, playcount: 0 };
        }
      });

      const batchResults = await Promise.all(promises);
      
      for (const { userId, playcount } of batchResults) {
        if (playcount > maxPlays) {
          maxPlays = playcount;
          crownHolderId = userId;
        }
      }
    }

    if (crownHolderId) {
      results[artist.name] = { userId: crownHolderId, playcount: maxPlays };
    }
  }

  return results;
}

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === 'START_SCAN') {
    try {
      const { currentUserId, lastfmUsername } = payload;

      // 1. Fetch dados iniciais
      self.postMessage({ type: 'PROGRESS', data: { step: 'fetching', percent: 0 } });
      
      const [topArtists, allUsers] = await Promise.all([
        getTopArtists(lastfmUsername, 50),
        getAllUsers()
      ]);

      self.postMessage({ type: 'PROGRESS', data: { step: 'scanning', percent: 10 } });

      // processa artistas em batches de 10
      const BATCH_SIZE = 10;
      const totalBatches = Math.ceil(topArtists.length / BATCH_SIZE);
      const crownHolders = {};

      for (let i = 0; i < topArtists.length; i += BATCH_SIZE) {
        const batchResults = await processBatch(topArtists, allUsers, i, BATCH_SIZE);
        Object.assign(crownHolders, batchResults);

        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
        const percent = 10 + Math.floor((currentBatch / totalBatches) * 80);
        
        self.postMessage({
          type: 'PROGRESS',
          data: {
            step: 'scanning',
            percent,
            artistsProcessed: Math.min(i + BATCH_SIZE, topArtists.length),
            totalArtists: topArtists.length
          }
        });
      }

      self.postMessage({ type: 'PROGRESS', data: { step: 'updating', percent: 90 } });

      // conta crowns antigas do currentUser
      const currentUser = allUsers.find(u => u.id === currentUserId);
      const oldCrownsCount = currentUser.crowns?.length || 0;

      // atualiza crowns de todos os users
      const updatePromises = allUsers.map(async (u) => {
        const newCrowns = Object.keys(crownHolders).filter(
          artistName => crownHolders[artistName].userId === u.id
        );
        await updateUserCrowns(u.id, newCrowns);
        return { userId: u.id, crowns: newCrowns };
      });

      const updatedUsers = await Promise.all(updatePromises);

      // calcula crowns ganhas
      const userUpdate = updatedUsers.find(u => u.userId === currentUserId);
      const newCrownsCount = userUpdate.crowns.length;
      const crownsGained = newCrownsCount - oldCrownsCount;

      self.postMessage({
        type: 'SCAN_COMPLETE',
        data: {
          crowns: userUpdate.crowns,
          crownsGained,
          totalCrowns: newCrownsCount
        }
      });

    } catch (error) {
      self.postMessage({
        type: 'SCAN_ERROR',
        data: { message: error.message }
      });
    }
  }
};