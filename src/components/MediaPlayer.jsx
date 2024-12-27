import React, { useState, useEffect } from 'react';
import { spotifyAuth } from '../services/spotifyAuthService';
import LoginButton from './LoginButton';
import WebPlayback from './WebPlayback';

function MediaPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem('spotify_access_token');
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(spotifyAuth.isAuthenticated());
    };
    checkAuth();
    const authCheck = setInterval(checkAuth, 3000);
    return () => clearInterval(authCheck);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute bottom-4 right-4">
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <WebPlayback token={token} darkMode={darkMode} />
    </div>
  );
}

export default MediaPlayer;