import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calendarService } from '../services/CalendarService';

function Googlecallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('googleAuthToken');
        
        if (token) {
          // Store the token directly since it's already in JWT format
          localStorage.setItem('googleAuthToken', token);
          navigate('/');
        }
      } catch (err) {
        setError(`Failed to complete authentication: ${err.message}`);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="text-center mt-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-4">Completing authentication...</p>
    </div>
  );
}

export default Googlecallback;
