import React from 'react';
import { spotifyAuth } from '../services/spotifyAuthService';

const LoginButton = () => {
  const handleLogin = () => {
    spotifyAuth.initiateLogin();
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Login with Spotify
    </button>
  );
};

export default LoginButton;
