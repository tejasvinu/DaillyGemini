import React, { useEffect, useState } from 'react';
import { FiHeart, FiVolume2 } from 'react-icons/fi';
import { BsPlayFill, BsPauseFill, BsSkipForward, BsSkipBackward, BsShuffle, BsRepeat } from 'react-icons/bs';
import { getCurrentPlayback, controlPlayback } from '../services/spotifyService';
import { spotifyAuth } from '../services/spotifyAuthService';
import LoginButton from './LoginButton';

function MediaPlayer() {
  const [playbackState, setPlaybackState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setIsAuthenticated(spotifyAuth.isAuthenticated());
    };

    checkAuth();
    // Recheck auth status every few seconds in case of changes
    const authCheck = setInterval(checkAuth, 3000);
    const fetchPlaybackState = async () => {
      if (isAuthenticated) {
        const state = await getCurrentPlayback();
        setPlaybackState(state);
      }
    };

    if (isAuthenticated) {
      fetchPlaybackState();
      const playbackCheck = setInterval(fetchPlaybackState, 1000);
      return () => {
        clearInterval(authCheck);
        clearInterval(playbackCheck);
      };
    }
    console.log(isAuthenticated);
    return () => clearInterval(authCheck);
  }, [isAuthenticated]);

  const handlePlayPause = () => {
    controlPlayback(playbackState?.is_playing ? 'pause' : 'play');
  };

  const handleSkip = (direction) => {
    controlPlayback(direction === 'next' ? 'next' : 'previous');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#282828] p-4 flex justify-center">
        <LoginButton />
      </div>
    );
  }

  if (!playbackState) return null;

  return (
    <div className="bg-[#282828] text-white p-4 fixed bottom-0 left-0 right-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center w-1/4">
          <img 
            src={playbackState?.item?.album?.images[0]?.url} 
            alt="Album Cover" 
            className="w-14 h-14 rounded"
          />
          <div className="ml-3">
            <p className="text-sm font-medium">{playbackState?.item?.name}</p>
            <p className="text-xs text-gray-400">
              {playbackState?.item?.artists?.map(a => a.name).join(', ')}
            </p>
          </div>
          <button className="ml-4 text-gray-400 hover:text-white">
            <FiHeart />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-4 mb-2">
            <button className={`text-gray-400 hover:text-white ${playbackState?.shuffle_state ? 'text-green-500' : ''}`}>
              <BsShuffle className="text-sm" />
            </button>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => handleSkip('previous')}
            >
              <BsSkipBackward className="text-lg" />
            </button>
            <button
              className="p-2 bg-white text-black rounded-full hover:scale-105"
              onClick={handlePlayPause}
            >
              {playbackState?.is_playing ? 
                <BsPauseFill className="text-xl" /> : 
                <BsPlayFill className="text-xl ml-0.5" />
              }
            </button>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => handleSkip('next')}
            >
              <BsSkipForward className="text-lg" />
            </button>
            <button className={`text-gray-400 hover:text-white ${playbackState?.repeat_state !== 'off' ? 'text-green-500' : ''}`}>
              <BsRepeat className="text-sm" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 text-xs">
            <span className="text-gray-400">
              {Math.floor(playbackState?.progress_ms / 1000 / 60)}:
              {String(Math.floor((playbackState?.progress_ms / 1000) % 60)).padStart(2, '0')}
            </span>
            <div className="h-1 flex-grow rounded-full bg-gray-600">
              <div 
                className="h-1 rounded-full bg-gray-200 hover:bg-green-500"
                style={{ width: `${(playbackState?.progress_ms / playbackState?.item?.duration_ms) * 100}%` }}
              />
            </div>
            <span className="text-gray-400">
              {Math.floor(playbackState?.item?.duration_ms / 1000 / 60)}:
              {String(Math.floor((playbackState?.item?.duration_ms / 1000) % 60)).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end w-1/4">
          <FiVolume2 className="text-gray-400" />
          <div className="w-24 h-1 ml-2 rounded-full bg-gray-600">
            <div 
              className="h-1 rounded-full bg-gray-200 hover:bg-green-500"
              style={{ width: `${playbackState?.device?.volume_percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaPlayer;
