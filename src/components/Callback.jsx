import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth } from '../services/spotifyAuthService';

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const spotifyError = urlParams.get('error');

        if (spotifyError) {
          throw new Error(`Spotify auth error: ${spotifyError}`);
        }

        if (!code || !state) {
          throw new Error('Missing required auth parameters');
        }

        if (!sessionStorage.getItem('spotify_auth_state')) {
          throw new Error('No stored auth state found');
        }

        const success = await spotifyAuth.handleCallback(code, state);
        if (success) {
          navigate('/', { replace: true });
          return;
        }
        throw new Error('Authentication failed');
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message);
        setTimeout(() => navigate('/', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error ? (
        <div className="text-red-500 text-xl">Authentication Error: {error}</div>
      ) : (
        <div className="text-xl">Authenticating with Spotify...</div>
      )}
    </div>
  );
}

export default Callback;
