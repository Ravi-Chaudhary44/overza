import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBaseballBall, FaSun, FaMoon, FaUser, FaSignOutAlt, FaHome, FaEye, FaHistory, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <FaBaseballBall className="text-2xl text-cricket-green" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Over<span className="text-cricket-green">Za</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-cricket-green dark:hover:text-cricket-green font-medium transition-colors"
            >
              <FaHome className="inline mr-2" /> Home
            </Link>
            <Link
              to="/live"
              className="text-gray-700 dark:text-gray-300 hover:text-cricket-green dark:hover:text-cricket-green font-medium transition-colors"
            >
              <FaEye className="inline mr-2" /> Live Matches
            </Link>
            <Link
              to="/history"
              className="text-gray-700 dark:text-gray-300 hover:text-cricket-green dark:hover:text-cricket-green font-medium transition-colors"
            >
              <FaHistory className="inline mr-2" /> History
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 bg-cricket-green rounded-full flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {user.username}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaUser className="mr-3" /> Profile
                    </Link>
                    <Link
                      to="/scorer"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaCog className="mr-3" /> Scorer Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cricket-green font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-cricket-green hover:bg-cricket-darkGreen text-white rounded-lg font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cricket-green py-2"
              >
                <FaHome className="mr-3" /> Home
              </Link>
              <Link
                to="/live"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cricket-green py-2"
              >
                <FaEye className="mr-3" /> Live Matches
              </Link>
              <Link
                to="/history"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cricket-green py-2"
              >
                  <FaHistory className="mr-3" /> History
              </Link>

                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full text-gray-700 dark:text-gray-300 py-2"
                >
                  {isDarkMode ? <FaSun className="mr-3" /> : <FaMoon className="mr-3" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
  
                {user ? (
                  <>
                      <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 dark:text-gray-300 py-2"
                    >
                      <FaUser className="mr-3" /> Profile
                    </Link>
                    <Link
                      to="/scorer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 dark:text-gray-300 py-2"
                    >
                      <FaCog className="mr-3" /> Scorer Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-red-600 py-2"
                    >
                      <FaSignOutAlt className="mr-3" /> Logout
                      </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 dark:text-gray-300 py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-cricket-green py-2"
                    >
                      Register
                    </Link>
                  </>
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