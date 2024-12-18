import { spotifyAuth } from './spotifyAuthService';

export const getCurrentPlayback = async () => {
  try {
    const token = await spotifyAuth.getAccessToken();
    console.log(token);
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching playback:', error);
    return null;
  }
};

export const controlPlayback = async (action) => {
  try {
    const token = await spotifyAuth.getAccessToken();
    await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error controlling playback:', error);
  }
};
