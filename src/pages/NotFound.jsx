import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cricket-green to-cricket-blue p-8 text-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.5, repeat: Infinity }
              }}
              className="inline-block mb-4"
            >
              <FaExclamationTriangle className="text-6xl text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">404</h1>
            <p className="text-xl text-white/90">Page Not Found</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <FaBaseballBall className="text-3xl text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Oops! Wrong Pitch
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Looks like you've wandered off the cricket field. The page you're looking for doesn't exist or has been moved.
              </p>
              
              <div className="inline-block bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <FaSearch className="inline mr-2" />
                  Check the URL or try searching for what you need
                </p>
              </div>
            </div>

            {/* Possible Reasons */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Possible reasons:
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-cricket-green mr-2">•</span>
                  The match might have ended or been deleted
                </li>
                <li className="flex items-start">
                  <span className="text-cricket-green mr-2">•</span>
                  You might have typed the wrong URL
                </li>
                <li className="flex items-start">
                  <span className="text-cricket-green mr-2">•</span>
                  The page might have been moved to a different location
                </li>
                <li className="flex items-start">
                  <span className="text-cricket-green mr-2">•</span>
                  You might need to log in to access this page
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/"
                className="bg-cricket-green hover:bg-cricket-darkGreen text-white py-3 rounded-xl font-semibold flex items-center justify-center transition-colors"
              >
                <FaHome className="mr-2" /> Go Home
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 py-3 rounded-xl font-semibold transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Quick links that might help:
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/live"
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  Live Matches
                </Link>
                <Link
                  to="/scorer"
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50"
                >
                  Scorer Panel
                </Link>
                <Link
                  to="/history"
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50"
                >
                  Match History
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default NotFound;
