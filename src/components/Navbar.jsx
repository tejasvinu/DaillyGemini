import { useState } from 'react';
// import Link from 'next/link'; // Changed from 'next/link' to 'react-router-dom'
import { Link } from 'react-router-dom'; // New import
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowDown, MdDashboard, MdSettings, MdHelp, MdLogout, MdBook } from 'react-icons/md';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, user, clearAuth } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  const menuItems = [
    { icon: MdDashboard, label: 'Dashboard', desc: 'View your activity' },
    { icon: MdSettings, label: 'Settings', desc: 'Manage your account' },
    { icon: MdHelp, label: 'Help', desc: 'Get support' },
    { icon: MdBook, label: 'Learning', desc: 'Access learning resources' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2"> {/* Changed from href to to */}
              <motion.span 
                className="text-2xl font-light tracking-wider text-white"
                whileHover={{ scale: 1.02 }}
              >
                Dailyy
                <span className="font-bold bg-gradient-to-r from-violet-200 to-blue-400 bg-clip-text text-transparent">
                  Gemini
                </span>
              </motion.span>
            </Link>
            
            {/* Add Learning link */}
            <Link to="/learning" className="hidden md:block text-slate-300 hover:text-white transition-colors duration-200">
              Learning
            </Link>
          </div>

          {token ? (
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
              </motion.button>

              <div className="relative">
                <motion.button
                  className="group flex items-center space-x-3 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-400 to-indigo-400 flex items-center justify-center text-white font-medium shadow-lg">
                      {getInitials(user?.username)}
                    </div>
                    <div className="absolute inset-0 w-10 h-10 rounded-lg bg-gradient-to-r from-violet-400 to-indigo-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-200">
                      {user?.username}
                    </p>
                    <p className="text-xs text-slate-400">
                      {user?.role}
                    </p>
                  </div>
                  <MdKeyboardArrowDown 
                    className="w-5 h-5 text-slate-400 transition-transform duration-300"
                    style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-xl"
                    >
                      <div className="p-3">
                        <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg mb-2">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-violet-400 to-indigo-400 flex items-center justify-center text-white text-lg font-medium">
                            {getInitials(user?.username)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-slate-400">{user?.email}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {menuItems.map((item, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ x: 4 }}
                              className="w-full flex items-center space-x-3 p-2 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                            >
                              <item.icon className="w-5 h-5" />
                              <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                              </div>
                            </motion.button>
                          ))}
                          
                          <motion.button
                            whileHover={{ x: 4 }}
                            onClick={() => {
                              clearAuth();
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 p-2 text-left text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                          >
                            <MdLogout className="w-5 h-5" />
                            <div>
                              <p className="text-sm font-medium">Sign out</p>
                              <p className="text-xs opacity-70">End your session</p>
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200"> {/* Changed from href to to */}
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign in
                </motion.span>
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm text-white bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors duration-200"> {/* Changed from href to to */}
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign up
                </motion.span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;