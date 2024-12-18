import axios from 'axios';

class SpotifyAuthManager {
  async initiateLogin() {
    try {
      window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
    } catch (error) {
      console.error('Login initiation error:', error);
      throw error;
    }
  }

  async handleCallback() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/callback`, {
        // Include any necessary parameters
      });
      return response.data;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    // Check authentication status via backend
    return !!localStorage.getItem('session_token');
  }

  logout() {
    // Call backend logout endpoint
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/logout`;
  }
}

export const spotifyAuth = new SpotifyAuthManager();
