import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth } from '../services/spotifyAuthService';

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code) {
        try {
          const success = await spotifyAuth.handleCallback(code, state);
          if (success) {
            navigate('/');
            return;
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }
      }
      navigate('/login');
    };

    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default CallbackPage;
