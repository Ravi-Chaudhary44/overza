import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBaseballBall, FaSync } from 'react-icons/fa';

const LiveScore = ({ match, onRefresh }) => {
  const [score, setScore] = useState({ runs: 0, wickets: 0, overs: '0.0' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  useEffect(() => {
    if (match) {
      const currentInning = match.innings?.[match.currentInnings - 1];
      if (currentInning) {
        const overs = Math.floor(currentInning.balls / 6);
        const balls = currentInning.balls % 6;
        
        setScore({
          runs: currentInning.runs,
          wickets: currentInning.wickets,
          overs: `${overs}.${balls}`,
          oversDecimal: overs + (balls / 10)
        });
        setLastUpdate(new Date());
      }
    }
  }, [match]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  const getRunRate = () => {
    if (!match || !match.innings?.[match.currentInnings - 1]) return '0.00';
    
    const inning = match.innings[match.currentInnings - 1];
    if (inning.balls === 0) return '0.00';
    
    return ((inning.runs / inning.balls) * 6).toFixed(2);
  };
  
  const getRequiredRunRate = () => {
    if (match?.currentInnings !== 2 || !match.innings?.[0]) return null;
    
    const target = match.innings[0].runs + 1;
    const currentRuns = match.innings[1]?.runs || 0;
    const ballsRemaining = (match.totalOvers * 6) - (match.innings[1]?.balls || 0);
    
    if (ballsRemaining <= 0) return null;
    
    const runsNeeded = target - currentRuns;
    const oversRemaining = ballsRemaining / 6;
    
    return {
      runsNeeded,
      requiredRate: (runsNeeded / oversRemaining).toFixed(2)
    };
  };
  
  const rrr = getRequiredRunRate();
  
  return (
    <div className="relative">
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        aria-label="Refresh"
      >
        <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
      
      {/* Main Score Display */}
      <div className="text-center mb-8">
        <motion.div
          key={`${score.runs}-${score.wickets}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4"
        >
          <div className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-2">
            {score.runs}
            <span className="text-4xl md:text-6xl text-gray-500 dark:text-gray-400 mx-2">/</span>
            {score.wickets}
          </div>
          <div className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400">
            Overs: <span className="font-bold text-cricket-green">{score.overs}</span>
          </div>
        </motion.div>
        
        {/* Run Rate */}
        <div className="inline-block bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
          <span className="text-gray-600 dark:text-gray-400 mr-2">Run Rate:</span>
          <span className="font-semibold text-cricket-green">{getRunRate()}</span>
        </div>
        
        {/* Required Run Rate */}
        {rrr && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 inline-block bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-full"
          >
            <span className="text-red-700 dark:text-red-300 mr-2">
              Need {rrr.runsNeeded} runs in {((match.totalOvers * 6) - (match.innings[1]?.balls || 0))} balls
            </span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              RRR: {rrr.requiredRate}
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Team Status */}
      {match && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className={`p-4 rounded-xl ${
            match.innings?.[match.currentInnings - 1]?.team === match.teamA.name
              ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
              : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {match.teamA.name}
                </h3>
                {match.innings?.[match.currentInnings - 1]?.team === match.teamA.name && (
                  <span className="inline-block mt-1 px-2 py-1 bg-cricket-green text-white text-xs rounded-full">
                    Batting
                  </span>
                )}
              </div>
              <FaBaseballBall className="text-gray-400" />
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${
            match.innings?.[match.currentInnings - 1]?.team === match.teamB.name
              ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
              : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {match.teamB.name}
                </h3>
                {match.innings?.[match.currentInnings - 1]?.team === match.teamB.name && (
                  <span className="inline-block mt-1 px-2 py-1 bg-cricket-green text-white text-xs rounded-full">
                    Batting
                  </span>
                )}
              </div>
              <FaBaseballBall className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
      
      {/* Last Update */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
};

export default LiveScore;