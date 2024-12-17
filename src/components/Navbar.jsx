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
    <nav className="navbar bg-white shadow p-4 flex justify-between items-center">
      <div className="logo">
        <Link to="/">DailyGemini</Link>
      </div>
      <div className="flex items-center">
        {token ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                {getInitials(user?.username)}
              </div>
              <span className="mr-4">{user?.username || user?.email}</span>
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
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
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
