import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaEye, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import GlassButton from '../common/GlassButton';

const MatchCard = ({ match,glow = false  }) => {
  if (!match) return null;
  
  const currentScore = match.currentScore || { runs: 0, wickets: 0, oversFormatted: '0.0' };
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const glowColor = 'rgba(255,111,97,0.5)';
  const glowClasses = glow
    ? 'hover:shadow-[0_0_15px_${glowColor}] hover:border-coral-bright/50'
    : '';
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`
  glass-card rounded-2xl overflow-hidden
  border border-white/10
  backdrop-blur-xl
  hover:border-emerald-400/40
  hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]
  transition-all duration-300
  ${glow ? 'shadow-[0_0_20px_rgba(255,111,97,0.25)] border-coral-bright/40' : ''}
`}

    >
      {/* Match Status Badge */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-start">
          <div>
            {isLive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-400/40 backdrop-blur-md">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                LIVE
              </span>
            ) : isCompleted ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-400/30 backdrop-blur-md">
                COMPLETED
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-400/40 backdrop-blur-md">
                UPCOMING
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      {/* Teams */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <h3 className="font-bold text-lg text-white
 truncate">
              {match.teamA.name}
            </h3>
            {match.teamA.players && match.teamA.players.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {match.teamA.players.length} players
              </p>
            )}
          </div>
          
          <div className="mx-4 text-gray-400">vs</div>
          
          <div className="text-center flex-1">
            <h3 className="font-bold text-lg text-white
 truncate">
              {match.teamB.name}
            </h3>
            {match.teamB.players && match.teamB.players.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {match.teamB.players.length} players
              </p>
            )}
          </div>
        </div>
        
        {/* Score Display */}
        {isLive && (
          <div className="glass-card rounded-2xl p-4 mb-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {currentScore.runs}/{currentScore.wickets}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overs: {currentScore.oversFormatted}
            </div>
            <div className="mt-2 text-xs text-gray-400">
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
                <div className="text-lg font-bold text-white
">
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
        <div className="space-y-2 text-sm text-gray-400">
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
      <div className="border-t border-white/10 p-4">
       <GlassButton
  to={`/live/${match.matchId}`}
  variant="primary"
  glow={isLive}
  className="w-full justify-center"
>
  <FaEye className="mr-2" />
  {isLive ? 'Watch Live' : 'View Details'}
</GlassButton>

      </div>
    </motion.div>
  );
};


export default MatchCard;

