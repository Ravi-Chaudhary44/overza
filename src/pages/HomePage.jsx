import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaPlay, FaEye, FaHistory, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useMatch } from '../context/MatchContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MatchCard from '../components/match/MatchCard';
import GlassButton from '../components/common/GlassButton';
import GlassWrapper from '../components/layout/GlassWrapper';
import { useTheme } from '../context/ThemeContext';
import { Helmet } from 'react-helmet'; 
const HomePage = () => {
  const { user } = useAuth();
  const { liveMatches, getLiveMatches, isLoading } = useMatch();
  const navigate = useNavigate();
const { isDarkMode } = useTheme();
  useEffect(() => {
    getLiveMatches();
  }, []);

  return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
        <title>OverZa - Live Gully Cricket Scores</title>
        <meta
          name="description"
          content="OverZa provides live gully cricket scores, match history, and player stats for cricket enthusiasts. Real-time updates, zero refresh needed."
        />
        <meta
          name="keywords"
          content="OverZa, gully cricket, live cricket scores, cricket match, cricket stats, real-time scoring"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Social Preview */}
        <meta property="og:title" content="OverZa - Live Gully Cricket Scores" />
        <meta
          property="og:description"
          content="Track live gully cricket matches with OverZa, your cricket companion."
        />
        <meta property="og:image" content="https://overza.vercel.app/assets/images/og-image.png" />
        <meta property="og:url" content="https://overza.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter / X Preview */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OverZa - Live Gully Cricket Scores" />
        <meta
          name="twitter:description"
          content="Follow live gully cricket matches with OverZa. Real-time scoring and match updates."
        />
        <meta name="twitter:image" content="https://overza.vercel.app/assets/images/og-image.png" />
      </Helmet>
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
              <GlassButton
              onClick={() => navigate('/scorer')}
              variant="primary"
              size="lg"
              icon={FaPlay}
              iconPosition="left"
              className="bg-cricket-green hover:bg-cricket-darkGreen border-none"
               glow={true} 
            >
              Start New Match
            </GlassButton>
            ) : (
             <GlassButton
              onClick={() => navigate('/login')}
              variant="primary"
              size="lg"
              icon={FaPlay}
              iconPosition="left"
              className="bg-cricket-green hover:bg-cricket-darkGreen border-none"
               glow
  glowColor="rgba(9, 255, 0, 0.5)" 
            >
              Login to Score
            </GlassButton>
            )}
            
            
          <GlassButton
            to="/live"
            variant="secondary"
            size="lg"
            icon={FaEye}
            iconPosition="left"
            className="bg-cricket-blue hover:bg-cricket-darkBlue border-none text-white"
            glow
  glowColor="rgba(255, 0, 225, 0.5)" 
          >
            Watch Live Match
          </GlassButton>
             <GlassButton
            to="/history"
            variant="dark"
            size="lg"
            icon={FaHistory}
            iconPosition="left"
             glow={true} 
          >
            Match History
          </GlassButton>
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
                  <MatchCard match={match} glow={true} />
                </motion.div>
              ))}
            </div>
          ) : (
           <GlassWrapper
            variant={isDarkMode ? 'card' : 'light'} 
            rounded="2xl"
            padding="py-12"
            className="text-center"
             glow
  glowColor="rgba(179, 0, 255, 0.5)" 
          >
            <FaBaseballBall className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Live Matches
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to start a match!
            </p>
          </GlassWrapper>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div whileHover={{ scale: 1.05 }}>
            <GlassWrapper
            variant={isDarkMode ? 'card' : 'light'}
            rounded="2xl"
            padding="p-6"
            className="text-center"
             glow={true} 
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
          </GlassWrapper>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
          >
            <GlassWrapper
            variant={isDarkMode ? 'card' : 'light'}
            rounded="2xl"
            padding="p-6"
            className="text-center"
             glow={true} 
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
          </GlassWrapper>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}>
            <GlassWrapper
            variant={isDarkMode ? 'card' : 'light'}
            rounded="2xl"
            padding="p-6"
            className="text-center"
             glow={true} 
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
          </GlassWrapper>
          </motion.div>
        </div>
      </div>
  );
};


export default HomePage;


