import React from 'react';
import { spotifyAuth } from '../services/spotifyAuthService';

function LoginButton() {
  return (
    <button
      onClick={() => spotifyAuth.initiateLogin()}
      className="flex items-center gap-2 bg-[#1DB954] text-white px-4 py-2 rounded-full hover:bg-[#1ed760]"
    >
      Login with Spotify
    </button>
  );
}

export default LoginButton;
