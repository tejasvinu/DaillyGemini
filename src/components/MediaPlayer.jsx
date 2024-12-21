import React, { useState, useEffect } from 'react';
import { spotifyAuth } from '../services/spotifyAuthService';
import LoginButton from './LoginButton';
import WebPlayback from './WebPlayback';

function MediaPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem('spotify_access_token');

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
      <div className="relative w-full h-full">
        <div className="absolute bottom-1 right-1">
          <LoginButton />
        </div>
      </div>
    );
  }

  // Simply show the WebPlayback component
  return (
    <div className="h-full">
      <WebPlayback token={token} />
    </div>
  );
}

export default MediaPlayer;