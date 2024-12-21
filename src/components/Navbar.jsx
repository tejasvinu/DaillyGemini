import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, user, clearAuth } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-light tracking-wider text-white">
              Daily<span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Gemini</span>
            </span>
          </Link>

          {token ? (
            <div className="relative">
              <button
                className="group flex items-center space-x-3 py-2 px-4 rounded-full transition-all duration-300 hover:bg-white/10"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium transition-transform duration-300 group-hover:scale-105">
                    {getInitials(user?.username)}
                  </div>
                  <div className="absolute inset-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span className="text-white/90 font-light hidden md:block">
                  {user?.username}
                </span>
                <MdKeyboardArrowDown 
                  className="w-4 h-4 text-white/70 transition-transform duration-300 group-hover:text-white"
                  style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-300">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 rounded-md text-sm text-white/70">
                      {user?.email}
                    </div>
                    <button
                      onClick={() => {
                        clearAuth();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-md transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="px-4 py-2 text-sm text-white/90 hover:text-white transition-colors duration-200">
                Sign in
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;