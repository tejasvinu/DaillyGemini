import React, { useState, useEffect } from 'react';
import { getCurrentPlayback, controlPlayback } from '../services/spotifyService';
import { spotifyAuth } from '../services/spotifyAuthService';
import LoginButton from './LoginButton';

const defaultTrackImage = '/api/placeholder/400/400';

function MediaPlayer() {
  const [playbackState, setPlaybackState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = spotifyAuth.isAuthenticated();
      setIsAuthenticated(auth);
    };

    checkAuth();
    const authCheck = setInterval(checkAuth, 3000);

    const fetchPlaybackState = async () => {
      if (isAuthenticated) {
        try {
          const state = await getCurrentPlayback();
          setPlaybackState(state);
        } catch (error) {
          console.error('Failed to fetch playback state:', error);
          setPlaybackState(null);
        }
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
    return () => clearInterval(authCheck);
  }, [isAuthenticated]);

  const handlePlayPause = () => {
    if (playbackState?.item) {
      controlPlayback(playbackState?.is_playing ? 'pause' : 'play');
    }
  };

  const handleSkip = (direction) => {
    if (playbackState?.item) {
      controlPlayback(direction === 'next' ? 'next' : 'previous');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-8 right-8">
        <LoginButton />
      </div>
    );
  }

  if (!playbackState) return null;

  return (
    <div className="w-96 bg-gray-100 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Main Content */}
        <div className="flex-1">
          <img
            className="w-24 h-24 aspect-square object-cover rounded-lg shadow-md"
            src={playbackState?.item?.album?.images[0]?.url || defaultTrackImage}
            alt="album cover"
          />
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {playbackState?.item?.name || 'No track playing'}
            </h2>
            <p className="text-gray-600">
              {playbackState?.item?.artists?.map(a => a.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Side Controls */}
        <div className="flex flex-col justify-center items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            aria-label={playbackState?.is_playing ? 'Pause' : 'Play'}
          >
            <div className={`w-8 h-8 rounded-full ${playbackState?.is_playing ? 'bg-red-400' : 'bg-gray-600'} flex items-center justify-center`}>
              {playbackState?.is_playing ? (
                <div className="w-4 h-4 bg-white rounded-sm" />
              ) : (
                <div className="w-0 h-0 border-l-8 border-l-white border-y-4 border-y-transparent ml-1" />
              )}
            </div>
          </button>
          <button
            onClick={() => handleSkip('next')}
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center"
            aria-label="Next"
          >
            <div className="w-0 h-0 border-l-6 border-l-white border-y-3 border-y-transparent ml-1" />
          </button>
          <button
            onClick={() => handleSkip('previous')}
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center"
            aria-label="Previous"
          >
            <div className="w-0 h-0 border-r-6 border-r-white border-y-3 border-y-transparent mr-1" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 relative h-1 bg-gray-300 rounded">
        <div 
          className="absolute h-full bg-gray-600 rounded"
          style={{
            width: `${(playbackState?.progress_ms / playbackState?.item?.duration_ms) * 100 || 0}%`
          }}
        />
      </div>

      {/* Additional Controls */}
      <div className="mt-4 flex justify-between">
        <button
          className="w-10 h-10 flex items-center justify-center"
          aria-label="Share"
        >
          <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" />
          </svg>
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center"
          aria-label="Like"
        >
          <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MediaPlayer;