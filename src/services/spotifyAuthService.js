class SpotifyAuthManager {
  constructor() {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
    this.expiresAt = localStorage.getItem('spotify_token_expires_at');
    this.scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
    this.client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    this.redirect_uri = import.meta.env.VITE_REDIRECT_URI;
  }

  async getAccessToken() {
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }
    
    return this.refreshAccessToken();
  }

  async refreshAccessToken() {
    try {
      const credentials = btoa(`${this.client_id}:${this.client_secret}`);
      
      if (this.refreshToken) {
        // Use refresh token if available
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken
          }),
        });
        
        const data = await response.json();
        if (data.access_token) {
          this.accessToken = data.access_token;
          this.expiresAt = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('spotify_access_token', this.accessToken);
          localStorage.setItem('spotify_token_expires_at', this.expiresAt);
          return this.accessToken;
        }
      }
      
      // Fall back to client credentials if no refresh token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials'
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.expiresAt = Date.now() + (data.expires_in * 1000);
        return this.accessToken;
      }
      
      throw new Error('Failed to get access token');
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout(); // Clear invalid tokens
      throw error;
    }
  }

  generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => possible[x % possible.length]).join('');
  }

  async generateCodeChallenge(codeVerifier) {
    const digest = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(codeVerifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  async initiateLogin() {
    this.logout();
    
    // Generate state and verifier
    const state = this.generateRandomString(16);
    const codeVerifier = this.generateRandomString(64);
    
    // Save to sessionStorage instead of localStorage for better security
    sessionStorage.setItem('spotify_auth_state', state);
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    
    try {
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      
      const params = new URLSearchParams({
        client_id: this.client_id,
        response_type: 'code',
        redirect_uri: this.redirect_uri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        scope: this.scope,
        state: state,
      });

      // Verify storage before redirect
      if (sessionStorage.getItem('spotify_auth_state') !== state) {
        throw new Error('Failed to store auth state');
      }

      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    } catch (error) {
      console.error('Login initiation error:', error);
      sessionStorage.removeItem('spotify_auth_state');
      sessionStorage.removeItem('spotify_code_verifier');
      throw error;
    }
  }

  async handleCallback(code, state) {
    try {
      // Get from sessionStorage instead of localStorage
      const storedState = sessionStorage.getItem('spotify_auth_state');
      const codeVerifier = sessionStorage.getItem('spotify_code_verifier');

      console.log('Auth states:', { received: state, stored: storedState });

      if (!state || !storedState || state !== storedState) {
        throw new Error('State mismatch or missing state parameter');
      }

      if (!codeVerifier) {
        throw new Error('No code verifier found');
      }

      // Only clear auth state after verification
      sessionStorage.removeItem('spotify_auth_state');
      sessionStorage.removeItem('spotify_code_verifier');

      // Use URLSearchParams for the token request
      const tokenBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirect_uri,
        client_id: this.client_id,
        code_verifier: codeVerifier,
      });

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token request failed: ${errorData.error}`);
      }

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.expiresAt = Date.now() + (data.expires_in * 1000);
        
        localStorage.setItem('spotify_access_token', this.accessToken);
        localStorage.setItem('spotify_refresh_token', this.refreshToken);
        localStorage.setItem('spotify_token_expires_at', this.expiresAt);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth error:', error);
      this.logout();
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires_at');
  }
}

export const spotifyAuth = new SpotifyAuthManager();
