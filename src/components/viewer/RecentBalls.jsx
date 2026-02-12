import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBaseballBall, FaHistory } from 'react-icons/fa';
import GlassWrapper from '../layout/GlassWrapper';
import GlassButton from '../common/GlassButton';

const RecentBalls = ({ match, viewingInnings }) => {
  const [recentBalls, setRecentBalls] = useState([]);
  const [showAll, setShowAll] = useState(false);
  
 
  const currentViewingInnings = viewingInnings || (match?.currentInnings || 1);
  
  useEffect(() => {
    if (match && match.innings) {
      const currentInning = match.innings[currentViewingInnings - 1];
      if (currentInning && currentInning.ballsData) {
        const balls = [...currentInning.ballsData].reverse();
        setRecentBalls(balls);
      } else {
        setRecentBalls([]);
      }
    }
  }, [match, currentViewingInnings]); 
  
 const getBallColor = (ball) => {
  if (ball.isWicket) return 'text-red-500';
  if (ball.runs >= 4) return 'text-emerald-400';
  if (ball.runs > 0) return 'text-cyan-400';
  if (ball.extras && Object.values(ball.extras).some(v => v > 0)) {
    return 'text-yellow-400';
  }
  return 'text-gray-400';
};

  
  const getBallDisplay = (ball) => {
    if (ball.isWicket) return 'W';
    if (ball.extras?.wide) return 'WD';
    if (ball.extras?.noBall) return 'NB';
    if (ball.extras?.bye) return 'B';
    if (ball.extras?.legBye) return 'LB';
    return ball.runs;
  };
  
  const getOverBall = (ballNumber) => {
  const completedOvers = Math.floor((ballNumber - 1) / 6);
  const ballsInCurrentOver = (ballNumber - 1) % 6;
  return `${completedOvers}.${ballsInCurrentOver + 1}`;
};

  
  const displayedBalls = showAll ? recentBalls : recentBalls.slice(0, 6);
  
  
  const getInningTeam = () => {
    if (!match || !match.innings || match.innings.length === 0) return '';
    const inning = match.innings[currentViewingInnings - 1];
    return inning?.team || '';
  };
  
  return (
    <GlassWrapper
    variant="card"
    rounded="2xl"
    padding="p-6"
    glow
  >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaHistory className="mr-2" /> Recent Balls
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Innings {currentViewingInnings} ({getInningTeam()})
            {currentViewingInnings === match?.currentInnings && match?.status === 'live' && (
              <span className="ml-2 text-red-500 dark:text-red-400">● Live</span>
            )}
          </p>
        </div>
        {recentBalls.length > 6 && (
          <GlassButton
  onClick={() => setShowAll(!showAll)}
  size="sm"
  variant="secondary"
  glow
  className="px-3 py-1"
>
  {showAll ? 'Show Less' : 'Show All'}
</GlassButton>

        )}
      </div>
      
      {recentBalls.length === 0 ? (
        <div className="text-center py-8">
          <FaBaseballBall className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No balls bowled in this innings yet</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-2">
            {displayedBalls.map((ball, index) => (
              <motion.div
                key={`${currentViewingInnings}-${ball.ballNumber}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`   flex items-center justify-between   p-3 rounded-xl   glass-card   border border-white/10   ${getBallColor(ball)} `}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full mr-3">
                    <span className="text-xs font-semibold">
                      {getOverBall(ball.ballNumber).split('.')[1]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {getOverBall(ball.ballNumber)}
                      {ball.over && <span className="text-xs ml-2 opacity-75">(Over {ball.over})</span>}
                    </p>
                    <p className="text-xs opacity-75">
                      {ball.batsman || 'Batsman'} vs {ball.bowler || 'Bowler'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center">
                    <span className={`text-xl font-bold mr-2 ${
                      ball.isWicket ? 'text-red-600 dark:text-red-400' :
                      ball.runs >= 4 ? 'text-green-600 dark:text-green-400' :
                      ball.runs > 0 ? 'text-blue-600 dark:text-blue-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {getBallDisplay(ball)}
                    </span>
                    {ball.isWicket && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        Wicket
                      </span>
                    )}
                  </div>
                  {ball.extras && Object.values(ball.extras).some(v => v > 0) && (
                    <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-400">
                      +{Object.values(ball.extras).reduce((sum, v) => sum + (v || 0), 0)} extra(s)
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
      
      {/* Summary */}
      {recentBalls.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Runs</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {recentBalls.reduce((sum, b) => sum + (b.runs || 0), 0)} runs
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Wickets</p>
              <p className="font-bold text-red-600 dark:text-red-400">
                {recentBalls.filter(b => b.isWicket).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Extras</p>
              <p className="font-bold text-yellow-600 dark:text-yellow-400">
                {recentBalls.filter(b => b.extras && Object.values(b.extras).some(v => v > 0)).length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {displayedBalls.length} of {recentBalls.length} balls
          </div>
        </div>
      )}
  </GlassWrapper>

  );
};


export default RecentBalls;
