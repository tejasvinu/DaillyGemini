import React, { useState, useEffect, useRef } from 'react';
import { getUserPlaylists, getRandomPlaylist, startPlayback, transferPlayback } from '../services/spotifyService';
import { spotifyAuth } from '../services/spotifyAuthService';
import { FaPlay, FaPause, FaShuffle } from 'react-icons/fa6';
import {  FaRedo, FaStepBackward,FaStepForward } from 'react-icons/fa';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { formatTime } from '../utils/timeFormatter';

const initialTrack = {
  name: "Select a track",
  album: { images: [{ url: "/placeholder-album.png" }] },
  artists: [{ name: "No artist playing" }]
};

function MediaPlayer() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem('spotify_access_token');

  // Player state
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [playlists, setPlaylists] = useState([]);
  const [showStart, setShowStart] = useState(true);
  
  // Playback state
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const progressIntervalRef = useRef();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(spotifyAuth.isAuthenticated());
    };
    checkAuth();
    const authCheck = setInterval(checkAuth, 3000);
    return () => clearInterval(authCheck);
  }, []);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
      setPlayer(newPlayer);

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        transferPlayback(device_id, true);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsActive(false);
      });

      newPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setProgressMs(state.position);
        setDurationMs(state.duration);
        setIsShuffled(state.shuffle);
        setRepeatMode(state.repeat_mode);
        
        newPlayer.getCurrentState()
          .then(s => setIsActive(!!s))
          .catch(err => console.error(err));
      });

      newPlayer.connect();
    };

    getUserPlaylists().then(setPlaylists);
  }, [isAuthenticated, token]);

  // Progress bar update
  useEffect(() => {
    if (!isPaused && isActive) {
      progressIntervalRef.current = setInterval(() => {
        setProgressMs(prev => Math.min(prev + 1000, durationMs));
      }, 1000);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPaused, isActive, durationMs]);

  // Player controls
  const handlePlaylistSelect = async (uri) => {
    if (uri && deviceId) {
      await transferPlayback(deviceId, true);
      await startPlayback(uri);
    }
  };

  const handleVolumeChange = async (e) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume * 100);
    if (player) {
      await player.setVolume(newVolume);
    }
  };

  const handleSeek = async (e) => {
    if (player) {
      const seekMs = Number(e.target.value);
      await player.seek(seekMs);
    }
  };

  const handleVolumeClick = () => {
    if (player) {
      if (isMuted) {
        player.setVolume(volume / 100);
      } else {
        player.setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  // New Handler: Transfer Playback
  const handleTransfer = async () => {
    if (player) {
      const state = await player.getCurrentState().catch(() => null);
      if (state?.device?.device_id) {
        await transferPlayback(state.device.device_id, false);
      }
    }
  };

  // New Handler: Feeling Lucky (Random Playlist)
  const handleFeelingLucky = async () => {
    const randomPlaylist = await getRandomPlaylist();
    if (randomPlaylist) {
      await transferPlayback(deviceId, true); // Ensure SDK is the active device
      await startPlayback(randomPlaylist.uri);
    }
  };

  // New Handler: Start Playback
  const handleStartPlayback = async () => {
    if (deviceId) {
      await transferPlayback(deviceId, true);
      setShowStart(false);
      setIsActive(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-purple-900 to-black rounded-xl p-8">
        <button
          onClick={() => spotifyAuth.initiateLogin()}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transform hover:scale-105 transition-all flex items-center space-x-2"
        >
          <span>Connect Spotify</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 flex flex-col space-y-6">
      {!isActive ? (
        <div className="flex-1 flex items-center justify-center flex-col space-y-4">
          <span className="text-white/80">
            Transfer playback using your Spotify app
          </span>
          <button
            onClick={handleStartPlayback}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Start Playback
          </button>
        </div>
      ) : (
        <>
          {/* Album Art and Track Info */}
          <div className="flex items-center space-x-6">
            <img
              src={currentTrack.album.images[0].url}
              className="w-24 h-24 rounded-lg shadow-xl"
              alt={currentTrack.name}
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-xl font-bold truncate">
                {currentTrack.name}
              </h2>
              <p className="text-white/80 truncate">
                {currentTrack.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-sm text-white/60">
              <span>{formatTime(progressMs)}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={durationMs}
                  value={progressMs}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                           [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-green-500
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                           hover:[&::-webkit-slider-thumb]:bg-green-400"
                />
              </div>
              <span>{formatTime(durationMs)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => player?.toggleShuffle(!isShuffled)}
                className={`p-2 rounded-full ${isShuffled ? 'text-green-500' : 'text-white/80'} 
                           hover:text-white hover:bg-white/10 transition-all`}
              >
                <FaShuffle className="w-5 h-5" />
              </button>

              <button
                onClick={() => player?.previousTrack()}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <FaStepBackward className="w-6 h-6" />
              </button>

              <button
                onClick={() => player?.togglePlay()}
                className="p-4 rounded-full bg-white hover:bg-green-500 text-black hover:text-white 
                         transform hover:scale-105 transition-all shadow-lg"
              >
                {isPaused ? (
                  <FaPlay className="w-8 h-8 ml-1" />
                ) : (
                  <FaPause className="w-8 h-8" />
                )}
              </button>

              <button
                onClick={() => player?.nextTrack()}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <FaStepForward className="w-6 h-6" />
              </button>

              <button
                onClick={() => player?.toggleRepeat()}
                className={`p-2 rounded-full ${repeatMode !== 0 ? 'text-green-500' : 'text-white/80'}
                           hover:text-white hover:bg-white/10 transition-all`}
              >
                <FaRedo className="w-5 h-5" />
              </button>
            </div>

            {/* Volume and Playlist Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleVolumeClick}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {isMuted ? (
                    <HiVolumeOff className="w-6 h-6" />
                  ) : (
                    <HiVolumeUp className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                           [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-green-500
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                           hover:[&::-webkit-slider-thumb]:bg-green-400"
                />
              </div>

              <select
                onChange={(e) => handlePlaylistSelect(e.target.value)}
                className="bg-gray-800 text-white/80 rounded-lg px-4 py-2 outline-none
                         hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <option value="">Choose Playlist</option>
                {playlists.map(pl => (
                  <option key={pl.id} value={pl.uri}>{pl.name}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MediaPlayer;