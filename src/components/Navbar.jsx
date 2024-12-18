import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, user, clearAuth } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav
      className="navbar p-4 flex justify-between items-center"
      style={{
        background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
        backgroundSize: '600% 600%',
        animation: 'gradientAnimation 16s ease infinite',
      }}
    >
      <div className="logo">
        <Link
          to="/"
          className="text-white text-4xl font-extrabold transform hover:rotate-360 transition duration-1000"
        >
          DailyGemini
        </Link>
      </div>
      <div className="flex items-center">
        {token ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 transform hover:rotate-180 transition duration-500"
              >
                {getInitials(user?.username)}
              </div>
              <span className="mr-4 text-white font-bold animate-pulse">
                {user?.username || user?.email}
              </span>
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 animate-bounce">
                <div className="px-4 py-2 text-sm text-gray-700">
                  {user?.email}
                </div>
                <button
                  onClick={clearAuth}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="mr-4 text-white font-bold transform hover:skew-y-12 transition duration-500"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white font-bold transform hover:-skew-y-12 transition duration-500"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
