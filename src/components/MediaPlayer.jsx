import React from 'react';
import { FiMusic } from 'react-icons/fi';
import { BsPlayFill, BsPauseFill, BsSkipForward } from 'react-icons/bs';

function MediaPlayer({ isPlaying, setIsPlaying }) {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
        <FiMusic className="mr-2" />
        Now Playing
      </h2>
      <div className="text-center">
        <div className="bg-white/60 w-full h-32 rounded-lg mb-4" />
        <p className="font-medium text-purple-900">Focus Playlist</p>
        <p className="text-purple-700 text-sm mb-4">Deep Work Music</p>
        <div className="flex justify-center items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-white/60 text-purple-700">
            <BsSkipForward className="rotate-180 text-xl" />
          </button>
          <button
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <BsPauseFill className="text-2xl" /> : <BsPlayFill className="text-2xl" />}
          </button>
          <button className="p-2 rounded-full hover:bg-white/60 text-purple-700">
            <BsSkipForward className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaPlayer;
