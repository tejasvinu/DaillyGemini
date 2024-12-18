import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth } from '../services/spotifyAuthService';

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [handled, setHandled] = useState(false); // Add a state to prevent multiple handling

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const data = await spotifyAuth.handleCallback();
        if (data.success) {
          setHandled(true);
          window.history.replaceState(null, null, ' '); // Remove hash from URL
          navigate('/', { replace: true });
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message);
        setHandled(true);
        setTimeout(() => {
          window.history.replaceState(null, null, ' '); // Remove hash from URL
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    if (!handled) {
      handleCallback();
    }
  }, [navigate, handled]);

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
