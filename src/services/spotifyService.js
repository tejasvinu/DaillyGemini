import axios from 'axios';

export const getCurrentPlayback = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/spotify/player`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playback:', error);
    return null;
  }
};

export const controlPlayback = async (action) => {
  try {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/spotify/player/${action}`);
  } catch (error) {
    console.error('Error controlling playback:', error);
  }
};
