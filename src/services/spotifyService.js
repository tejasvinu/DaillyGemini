import { fetchWebApi } from './spotifyAuthService';

export const getCurrentPlayback = async () => {
  try {
    const response = await fetchWebApi('me/player', 'GET');
    return response || null;
  } catch (error) {
    console.error('Error fetching playback:', error);
    return null;
  }
};

export const controlPlayback = async (action) => {
  try {
    await fetchWebApi(`me/player/${action}`, 'PUT');
  } catch (error) {
    console.error('Error controlling playback:', error);
  }
};

// Add the setVolume function
export const setVolume = async (volumePercent) => {
  try {
    await fetchWebApi(`me/player/volume?volume_percent=${volumePercent}`, 'PUT');
  } catch (error) {
    console.error('Error setting volume:', error);
  }
};

export const transferPlayback = async (deviceId, shouldPlay) => {
  try {
    await fetchWebApi('me/player', 'PUT', {
      device_ids: [deviceId],
      play: shouldPlay // Ensure this is true to start playback
    });
  } catch (error) {
    console.error('Error transferring playback:', error);
  }
};

export const getUserPlaylists = async () => {
  try {
    const response = await fetchWebApi('me/playlists?limit=10', 'GET');
    return response?.items || [];
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return [];
  }
};

export const startPlayback = async (contextUri) => {
  try {
    console.log('Attempting startPlayback with contextUri:', contextUri);
    await fetchWebApi('me/player/play', 'PUT', {
      context_uri: contextUri,
      offset: { position: 0 },
      position_ms: 0
    });
  } catch (error) {
    console.error('Error starting playback:', error);
    throw error;
  }
};

export const getRandomPlaylist = async () => {
  try {
    const playlists = await getUserPlaylists();
    if (playlists.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * playlists.length);
    return playlists[randomIndex];
  } catch (error) {
    console.error('Error fetching random playlist:', error);
    return null;
  }
};

export async function fetchWebApi(endpoint, method, body) {
  try {
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (res.status === 401) {
      clearTokens();
      return { success: false };
    }
    
    if (res.status === 204) {
      return {};
    }
    
    if (!res.ok) {
      if (res.status === 0) {
        throw new Error('Request was blocked by the client.');
      }
      throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    if (error.message === 'Request was blocked by the client.') {
      console.error('API call was blocked by the client:', error);
      throw error;
    }
    console.error('API call error:', error);
    throw error;
  }
}
