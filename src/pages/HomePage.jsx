import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaPlay, FaEye, FaHistory, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useMatch } from '../context/MatchContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MatchCard from '../components/match/MatchCard';

const HomePage = () => {
  const { user } = useAuth();
  const { liveMatches, getLiveMatches, isLoading } = useMatch();
  const navigate = useNavigate();

  useEffect(() => {
    getLiveMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <FaBaseballBall className="text-6xl text-cricket-green mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Over<span className="text-cricket-green">Za</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Overza — real-time cricket scoring with instant updates and zero refresh.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {user ? (
              <button
                onClick={() => navigate('/scorer')}
                className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center transition-all duration-300 transform hover:scale-105"
              >
                <FaPlay className="mr-2" /> Start New Match
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center transition-all duration-300 transform hover:scale-105"
              >
                <FaPlay className="mr-2" /> Login to Score
              </button>
            )}
            
            <Link
              to="/live"
              className="bg-cricket-blue hover:bg-cricket-darkBlue text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center transition-all duration-300 transform hover:scale-105"
            >
              <FaEye className="mr-2" /> Watch Live Match
            </Link>
            
            <Link
              to="/history"
              className="bg-gray-800 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center transition-all duration-300 transform hover:scale-105"
            >
              <FaHistory className="mr-2" /> Match History
            </Link>
          </div>
        </motion.div>

        {/* Live Matches Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🔴 Live Matches
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match, index) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MatchCard match={match} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <FaBaseballBall className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Live Matches
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to start a match!
              </p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
          >
            <div className="bg-cricket-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBaseballBall className="text-3xl text-cricket-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Real-time Scoring
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Scores update instantly for all viewers without page refresh
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
          >
            <div className="bg-cricket-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaQrcode className="text-3xl text-cricket-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Easy Sharing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share match via link or QR code. Anyone can join instantly
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
          >
            <div className="bg-cricket-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="text-3xl text-cricket-red" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Live Viewer
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Watch matches live with detailed ball-by-ball commentary
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;