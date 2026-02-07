import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaEye, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

const MatchCard = ({ match }) => {
  if (!match) return null;
  
  const currentScore = match.currentScore || { runs: 0, wickets: 0, oversFormatted: '0.0' };
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      {/* Match Status Badge */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-start">
          <div>
            {isLive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                LIVE
              </span>
            ) : isCompleted ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                COMPLETED
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                UPCOMING
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      {/* Teams */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
              {match.teamA.name}
            </h3>
            {match.teamA.players && match.teamA.players.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {match.teamA.players.length} players
              </p>
            )}
          </div>
          
          <div className="mx-4 text-gray-400">vs</div>
          
          <div className="text-center flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
              {match.teamB.name}
            </h3>
            {match.teamB.players && match.teamB.players.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {match.teamB.players.length} players
              </p>
            )}
          </div>
        </div>
        
        {/* Score Display */}
        {isLive && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {currentScore.runs}/{currentScore.wickets}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overs: {currentScore.oversFormatted}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {match.innings?.[match.currentInnings - 1]?.team} batting
            </div>
          </div>
        )}
        
        {isCompleted && match.innings?.length >= 2 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {match.innings[0]?.runs}/{match.innings[0]?.wickets}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {match.teamA.name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {match.innings[1]?.runs}/{match.innings[1]?.wickets}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {match.teamB.name}
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-semibold text-cricket-green">
                {match.innings[0]?.runs > match.innings[1]?.runs ? match.teamA.name : match.teamB.name} won
              </span>
            </div>
          </div>
        )}
        
        {/* Match Details */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {match.venue && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span className="truncate">{match.venue}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <FaBaseballBall className="mr-2" />
            <span>Match ID: {match.matchId}</span>
          </div>
          
          {match.matchType && (
            <div className="flex items-center">
              <FaUsers className="mr-2" />
              <span>{match.matchType === 'limited' ? 'Limited Overs' : match.matchType}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Link
          to={`/live/${match.matchId}`}
          className="flex items-center justify-center w-full bg-cricket-green hover:bg-cricket-darkGreen text-white py-2 rounded-lg font-semibold transition-colors"
        >
          <FaEye className="mr-2" />
          {isLive ? 'Watch Live' : 'View Details'}
        </Link>
      </div>
    </motion.div>
  );
};

export default MatchCard;