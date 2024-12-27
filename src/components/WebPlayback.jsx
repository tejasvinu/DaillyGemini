import { useState, useEffect, useRef } from 'react';
import { getUserPlaylists, getRandomPlaylist, startPlayback, transferPlayback } from '../services/spotifyService';
import { FaPlay, FaPause, FaShuffle } from 'react-icons/fa6';
import {  FaRedo, FaStepBackward,FaStepForward } from 'react-icons/fa';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { formatTime } from '../utils/timeFormatter';

const initialTrack = {
  name: "Select a track",
  album: { images: [{ url: "/placeholder-album.png" }] },
  artists: [{ name: "No artist playing" }]
};

function WebPlayback({ token }) {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(initialTrack);
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const progressIntervalRef = useRef();
  const progressBarRef = useRef();
  const [deviceId, setDeviceId] = useState(null);
  const [showStart, setShowStart] = useState(true);

  useEffect(() => {
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

      newPlayer.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setActive(false); // Set is_active to false when device is not ready
      });

      newPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setProgressMs(state.position);
        setDurationMs(state.duration);
        if (newPlayer) {
          newPlayer.getCurrentState()
            .then(s => setActive(!!s))
            .catch(err => console.error(err));
        }
      });

      newPlayer.connect();
    };

    getUserPlaylists().then(setPlaylists);
  }, [token]);

  useEffect(() => {
    if (!is_paused && is_active) {
      progressIntervalRef.current = setInterval(() => {
        setProgressMs(prev => Math.min(prev + 1000, durationMs));
      }, 1000);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [is_paused, is_active, durationMs]);

  const handleTransfer = async () => {
    if (player) {
      const state = await player.getCurrentState().catch(() => null);
      if (state?.device?.device_id) {
        await transferPlayback(state.device.device_id, false);
      }
    }
  };

  const handleShuffle = async () => {
    if (player) {
      const state = await player.getCurrentState().catch(() => null);
      await player.setShuffle(!state?.shuffle);
    }
  };

  const handleRepeat = async () => {
    if (player) {
      const state = await player.getCurrentState().catch(() => null);
      let nextMode = 'context';
      if (state?.repeat_mode === 0) nextMode = 'track';
      if (state?.repeat_mode === 1) nextMode = 'context';
      if (state?.repeat_mode === 2) nextMode = 'off';
      await player.setRepeat(nextMode);
    }
  };

  const handleVolumeChange = async (e) => {
    const volume = Number(e.target.value) / 100;
    setVolume(volume * 100);
    if (player) {
      await player.setVolume(volume).catch(err => console.error(err));
    }
  };

  const handleSeek = async (e) => {
    if (player) {
      const seekMs = Number(e.target.value);
      await player.seek(seekMs).catch(err => console.error(err));
    }
  };

  const handlePlaylistSelect = async (uri) => {
    if (uri) {
      await transferPlayback(player._options.id, true); // Ensure SDK is the active device
      await startPlayback(uri);
    }
  };

  const handleFeelingLucky = async () => {
    const randomPlaylist = await getRandomPlaylist();
    if (randomPlaylist) {
      await transferPlayback(player._options.id, true); // Ensure SDK is the active device
      await startPlayback(randomPlaylist.uri);
    }
  };

  const handleVolumeClick = () => {
    if (player) {
      if (isMuted) {
        player.setVolume(volume / 100);
        setIsMuted(false);
      } else {
        player.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handleStartPlayback = async () => {
    if (deviceId) {
      await transferPlayback(deviceId, true);
      setShowStart(false);
      setActive(true);
    }
  };

  if (!is_active) {
    return (
      <div className="container">
        <div className="main-wrapper">
          {showStart && deviceId ? (
            <button
              onClick={handleStartPlayback}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Start Playback
            </button>
          ) : (
            <b>Instance not active. Transfer your playback using your Spotify app</b>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-gradient-to-bl from-gray-900 to-blue-800 rounded-xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Album Art and Track Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={current_track.album.images[0].url}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-md"
              alt={current_track.name}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm sm:text-base font-medium truncate">{current_track.name}</h3>
              <p className="text-gray-300 text-xs sm:text-sm truncate">
                {current_track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span className="hidden sm:inline">{formatTime(progressMs)}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={durationMs}
                  value={progressMs}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2
                           [&::-webkit-slider-thumb]:h-2 sm:[&::-webkit-slider-thumb]:w-3
                           sm:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <span className="hidden sm:inline">{formatTime(durationMs)}</span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <button
                onClick={() => player?.toggleShuffle(!isShuffled)}
                className={`p-1 sm:p-2 rounded-full ${isShuffled ? 'text-green-500' : 'text-white'} hover:bg-white/10`}
              >
                <FaShuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => player?.previousTrack()}
                className="p-1 sm:p-2 rounded-full text-white hover:bg-white/10"
              >
                <FaStepBackward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => player?.togglePlay()}
                className="p-2 sm:p-3 rounded-full bg-white text-black hover:scale-105 transition-transform shadow-lg"
              >
                {is_paused ? <FaPlay className="w-5 h-5 sm:w-6 sm:h-6" /> : <FaPause className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              <button
                onClick={() => player?.nextTrack()}
                className="p-1 sm:p-2 rounded-full text-white hover:bg-white/10"
              >
                <FaStepForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => player?.toggleRepeat()}
                className={`p-1 sm:p-2 rounded-full ${repeatMode !== 0 ? 'text-green-500' : 'text-white'} hover:bg-white/10`}
              >
                <FaRedo className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={handleVolumeClick} className="text-white hover:text-green-500">
                  {isMuted ? <HiVolumeOff className="w-5 h-5" /> : <HiVolumeUp className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 sm:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2
                         [&::-webkit-slider-thumb]:h-2 sm:[&::-webkit-slider-thumb]:w-3
                         sm:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Playlist Selection */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              onChange={(e) => handlePlaylistSelect(e.target.value)}
              className="flex-1 bg-white text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose Playlist</option>
              {playlists.map(pl => (
                <option key={pl.id} value={pl.uri}>{pl.name}</option>
              ))}
            </select>
            <button
              onClick={handleFeelingLucky}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              Feeling Lucky
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default WebPlayback;