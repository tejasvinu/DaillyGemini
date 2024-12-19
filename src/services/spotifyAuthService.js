import axios from 'axios';

const CLIENT_ID = '2715c4e17c53497d855d34db2122c513';
const REDIRECT_URI = 'https://dailly-gemini.vercel.app/callback';
//const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPES = 
    'user-top-read',
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',        // Added scope
    'user-modify-playback-state'       // Added scope
];

class SpotifyAuthManager {
  async initiateLogin() {
    try {
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Login initiation error:', error);
      throw error;
    }
  }

  async handleCallback() {
    try {
      const params = getHashParams();
      if (params.access_token) {
        setTokens(params.access_token, params.expires_in);
        return { success: true };
      } else {
        throw new Error('No access token found');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('token_expiry');
    return token && expiry && Date.now() < parseInt(expiry, 10);
  }

  logout() {
    // Call backend logout endpoint
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/logout`;
  }
}

export const spotifyAuth = new SpotifyAuthManager();

let accessToken = localStorage.getItem('spotify_access_token');
let tokenExpiry = localStorage.getItem('token_expiry');

export async function fetchWebApi(endpoint, method, body) {
  accessToken = localStorage.getItem('spotify_access_token');
  tokenExpiry = localStorage.getItem('token_expiry');

  if (!accessToken || Date.now() > tokenExpiry) {
    return { success: false };
  }

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
    
    if (!res.ok) {
      throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export async function getTopTracks() {
  try {
    const tracks = await fetchWebApi(
      'me/top/tracks?time_range=long_term&limit=50', 
      'GET'
    );
    
    return tracks?.items || [];
  } catch (error) {
    console.error('Error in getTopTracks:', error);
    return [];
  }
}

export const loginUrl = (() => {
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'token',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: SCOPES.join(' '),
        show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
})();

export function getHashParams() {
    const hashParams = {};
    const hash = window.location.hash.substring(1);
    hash.split('&').forEach(hk => {
        const temp = hk.split('=');
        hashParams[temp[0]] = decodeURIComponent(temp[1]);
    });
    return hashParams;
}

export function setTokens(accessToken, expiresIn) {
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('token_expiry', Date.now() + (expiresIn * 1000));
}

export function clearTokens() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('token_expiry');
}

function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
