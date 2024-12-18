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
