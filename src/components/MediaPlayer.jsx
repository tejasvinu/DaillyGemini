import React, { useState, useEffect, useRef } from 'react';
import { getCurrentPlayback, controlPlayback, setVolume } from '../services/spotifyService';
import { spotifyAuth } from '../services/spotifyAuthService';
import LoginButton from './LoginButton';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2, FiHeart } from 'react-icons/fi';

const defaultTrackImage = 'https://via.placeholder.com/88';

function MediaPlayer() {
  const [playbackState, setPlaybackState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState('0:00');
  const timelineRef = useRef(null);
  const playheadRef = useRef(null);
  const hoverPlayheadRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds % 60);
    seconds = seconds >= 10 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
  };

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
          const newCurrentTime = formatTime(state?.progress_ms / 1000);
          setCurrentTime(newCurrentTime);
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

  useEffect(() => {
    if (playbackState) {
      const progressPercent = (playbackState.progress_ms / playbackState.item.duration_ms) * 100;
      if (playheadRef.current) {
        playheadRef.current.style.width = `${progressPercent}%`;
      }
      setCurrentTime(formatTime(playbackState.progress_ms / 1000));
    }
  }, [playbackState]);

  const handleTimeLineClick = (e) => {
    if (playbackState && timelineRef.current) {
      const duration = playbackState.item.duration_ms / 1000;
      const timelineWidth = timelineRef.current.offsetWidth;
      const offsetWidth = timelineRef.current.getBoundingClientRect().left;
      const clickWidth = e.clientX - offsetWidth;
      const clickPercentage = (clickWidth / timelineWidth) * 100;

      const seekPosition = (duration * clickPercentage) / 100;
      controlPlayback('seek', seekPosition * 1000);
    }
  };

  const handleHoverTimeLine = (e) => {
    if (playbackState && timelineRef.current) {
      const duration = playbackState.item.duration_ms / 1000;
      const timelineWidth = timelineRef.current.offsetWidth;
      const offsetWidth = timelineRef.current.getBoundingClientRect().left;
      const hoverWidth = e.clientX - offsetWidth;
      const hoverPercentage = (hoverWidth / timelineWidth) * 100;

      if (hoverPercentage <= 100) {
        hoverPlayheadRef.current.style.width = `${hoverPercentage}%`;
      }

      const time = (duration * hoverPercentage) / 100;

      if (time >= 0 && time <= duration) {
        setHoverTime(formatTime(time));
      }
    }
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    if (hoverPlayheadRef.current) {
      hoverPlayheadRef.current.style.width = '0';
    }
    setIsHovering(false);
  };

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

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    if (playbackState?.device) {
      setVolume(newVolume);
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
    <div className="bg-white rounded-lg drop-shadow p-4 dark:bg-black dark:shadow-white">
      <div className="flex flex-col justify-center items-center">
        <img
          className="rounded-lg aspect-square w-64"
          src={playbackState?.item?.album?.images[0]?.url || defaultTrackImage}
          alt="album cover"
        />
        <p className="mt-2 font-semibold text-md text-gray-600 dark:text-gray-300">
          {playbackState?.item?.name}
        </p>
        <p className="font-semibold text-xs text-gray-600 dark:text-gray-300">
          {playbackState?.item?.artists?.map(a => a.name).join(', ')}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center my-4">
        <input
          type="range"
          value={playbackState?.progress_ms / playbackState?.item?.duration_ms * 100 || 0}
          onChange={(e) => {
            const seekPosition = parseInt(e.target.value, 10);
            controlPlayback('seek', (seekPosition / 100) * playbackState.item.duration_ms);
          }}
          className="rounded-lg overflow-hidden appearance-none bg-gray-200 h-1 w-full dark:bg-gray-700"
        />
        <div className="flex justify-between w-3/5 items-center my-2">
          <button
            onClick={() => handleSkip('previous')}
            className="aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg dark:bg-gray-800"
            aria-label="Previous"
          >
            <FiSkipBack size={20} color="#816cfa" />
          </button>
          <button
            onClick={handlePlayPause}
            className="aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg dark:bg-gray-800"
            aria-label={playbackState?.is_playing ? 'Pause' : 'Play'}
          >
            {playbackState?.is_playing ? (
              <FiPause size={20} color="#816cfa" />
            ) : (
              <FiPlay size={20} color="#816cfa" />
            )}
          </button>
          <button
            onClick={() => handleSkip('next')}
            className="aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg dark:bg-gray-800"
            aria-label="Next"
          >
            <FiSkipForward size={20} color="#816cfa" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaPlayer;