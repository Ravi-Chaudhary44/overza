import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaUser, FaSignOutAlt, FaHome, FaEye, FaHistory, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AnimatedCircleImage from '../common/AnimatedCircleImage'; 
import logo from '../../assets/images/og-image.png';
import { motion } from 'framer-motion';//abhi()

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };
const RunningNavMessage = () => {
  return (
    <div className="relative w-full overflow-hidden bg-yellow-400 dark:bg-yellow-600">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 10, 
          ease: "linear",
        }}
        className="
          whitespace-nowrap
          py-2
          px-4
          text-xs sm:text-sm
          font-semibold
          text-black
        "
      >
        🚧 Overza is under active development — some features may not work properly.
      </motion.div>
    </div>
  );
};
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
      <RunningNavMessage />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
         
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <AnimatedCircleImage
                src={logo}
                alt="OverZa Logo"
                size={60}
                borderWidth={2}
                colors={["#22c55e", "#b806d4"]}
                rotationDuration={4}
                showGlow={false}
                intensity={0.4}
                className="transition-transform duration-300 group-hover:scale-105"
                imageClassName="object-contain p-1.5"
              />
             
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border border-white dark:border-gray-800"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Over<span className="text-cricket-green">Za</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                CRICKET SCORER
              </span>
            </div>
          </Link>

        
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-cricket-green dark:hover:text-cricket-green font-medium transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <FaHome className="text-lg" />
              <span>Home</span>
            </Link>
            <Link
              to="/live"
              className="text-gray-700 dark:text-gray-300 hover:text-cricket-green dark:hover:text-cricket-green font-medium transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <FaEye className="text-lg" />
              <span>Live Matches</span>
            </Link>
            <Link
              to="/history"
              className="text-gray-700 dark:text-gray-300 hover:text-cricket-green dark:hover:text-cricket-green font-medium transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <FaHistory className="text-lg" />
              <span>History</span>
            </Link>

            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-cricket-green to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 hidden lg:inline">
                    {user.username}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaUser className="mr-3" /> Profile
                    </Link>
                    <Link
                      to="/scorer"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaCog className="mr-3" /> Scorer Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                    >
                      <FaSignOutAlt className="mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cricket-green font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-cricket-green to-purple-600 hover:from-cricket-darkGreen hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cricket-green py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaHome className="mr-3" /> Home
              </Link>
              <Link
                to="/live"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cricket-green py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaEye className="mr-3" /> Live Matches
              </Link>
              <Link
                to="/history"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cricket-green py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaHistory className="mr-3" /> History
              </Link>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? <FaSun className="mr-3" /> : <FaMoon className="mr-3" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                {user ? (
                  <>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaUser className="mr-3" /> Profile
                    </Link>
                    <Link
                      to="/scorer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaCog className="mr-3" /> Scorer Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FaSignOutAlt className="mr-3" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center bg-gradient-to-r from-cricket-green to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium shadow-md"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


