import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserShield, FaExchangeAlt, FaTrophy, FaTimesCircle } from 'react-icons/fa';

export const ScoreCard = ({ 
  match, 
  onPlayerChange, 
  viewingInnings: propViewingInnings, 
  onInningsChange 
}) => {
 
  const [internalViewingInnings, setInternalViewingInnings] = useState(match?.currentInnings || 1);
  const viewingInnings = propViewingInnings !== undefined ? propViewingInnings : internalViewingInnings;
  
  if (!match) return null;

  const isMatchEnded = match.status === 'completed';
  const viewedInning = match.innings && match.innings[viewingInnings - 1];
  
  
  if (!viewedInning) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {isMatchEnded
          ? 'Innings was not required'
          : 'Innings not started yet'}
      </div>
    );
  }

 
  const inningsHadPlay = viewedInning.balls && viewedInning.balls > 0;
  const isInningsCompleted = viewedInning.isCompleted || (isMatchEnded && inningsHadPlay);
  
 
  const striker = viewedInning.battingLineup?.find(
    player => player.isStriker || player.playerName === viewedInning.striker
  );
  
  const nonStriker = viewedInning.battingLineup?.find(
    player => player.isNonStriker || player.playerName === viewedInning.nonStriker
  );


  const currentBowler = viewedInning.bowlingLineup?.find(
    bowler => bowler.isCurrentBowler || bowler.playerName === viewedInning.currentBowler
  );

  const currentScore = {
    runs: viewedInning.runs || 0,
    wickets: viewedInning.wickets || 0,
    oversFormatted: viewedInning.balls 
      ? `${Math.floor(viewedInning.balls / 6)}.${viewedInning.balls % 6}`
      : '0.0'
  };

  
  const calculateRRR = () => {
    
    if (match.status !== 'live' || viewingInnings !== 2) return null;
    
    const firstInningsScore = match.innings[0]?.runs || 0;
    const secondInningsScore = match.innings[1]?.runs || 0;
    const ballsRemaining = (match.totalOvers * 6) - (match.innings[1]?.balls || 0);
    
    if (ballsRemaining <= 0) return null;
    
    const runsNeeded = firstInningsScore - secondInningsScore + 1;
    const oversRemaining = ballsRemaining / 6;
    
    return {
      runsNeeded: runsNeeded > 0 ? runsNeeded : 0,
      requiredRate: (runsNeeded > 0 ? (runsNeeded / oversRemaining).toFixed(2) : '0.00')
    };
  };

  const rrr = calculateRRR();

 
  const calculateRunRate = () => {
    if (isMatchEnded && !inningsHadPlay) return '--';
    if (!viewedInning.balls || viewedInning.balls === 0) return '0.00';
    const overs = viewedInning.balls / 6;
    return (viewedInning.runs / overs).toFixed(2);
  };

  
  const handleInningsChange = (inningsNum) => {
    if (onInningsChange) {
    
      onInningsChange(inningsNum);
    } else {
     
      setInternalViewingInnings(inningsNum);
    }
  };

  
  const getMatchResult = () => {
    if (!isMatchEnded) return null;
    
    const firstInnings = match.innings[0];
    const secondInnings = match.innings[1];
    
   
    if (!secondInnings || !secondInnings.battingLineup || secondInnings.battingLineup.length === 0) {
      const winner = firstInnings?.team || 'Team';
      return {
        winner,
        by: `Won by ${firstInnings?.runs || 0} runs`,
        method: 'first innings score'
      };
    }
    
 
    const target = (firstInnings?.runs || 0) + 1;
    const secondScore = secondInnings.runs || 0;
    
    if (secondScore >= target) {
      const winner = secondInnings.team;
      const wicketsLeft = 10 - (secondInnings.wickets || 0);
      return {
        winner,
        by: `Won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`,
        method: 'wickets'
      };
    } else {
      const winner = firstInnings.team;
      const runsMargin = target - secondScore - 1;
      return {
        winner,
        by: `Won by ${runsMargin} run${runsMargin !== 1 ? 's' : ''}`,
        method: 'runs'
      };
    }
  };

  const matchResult = getMatchResult();

  return (
    <div className="relative">
      {/* Match Status */}
      <div className="absolute top-4 right-4">
        <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
          match.status === 'live' 
            ? 'bg-red-500 text-white animate-pulse-slow' 
            : match.status === 'completed'
            ? 'bg-gray-500 text-white'
            : 'bg-yellow-500 text-white'
        }`}>
          {match.status === 'live' ? '🔴 LIVE' : match.status === 'completed' ? '🏁 ENDED' : '⏳ UPCOMING'}
        </span>
      </div>

      {/* Match Result Banner for Completed Matches */}
      {isMatchEnded && matchResult && (
        <div className="mb-6 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-center">
            <FaTrophy className="mr-3 text-yellow-300 text-xl" />
            <div className="text-center">
              <h3 className="text-lg font-bold">{matchResult.winner} WON!</h3>
              <p className="text-sm opacity-90">{matchResult.by}</p>
            </div>
          </div>
        </div>
      )}

      {/* Innings Toggle Buttons */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2].map((inningsNum) => {
            const inning = match.innings?.[inningsNum - 1];
            const isCurrentView = viewingInnings === inningsNum;
            const hasInningsStarted = inning && inning.battingLineup && inning.battingLineup.length > 0;
            
            return (
              <button
                key={inningsNum}
                onClick={() => handleInningsChange(inningsNum)}
                className={`flex items-center px-4 py-2 rounded-lg mx-1 transition-all ${
                  isCurrentView
                    ? 'bg-cricket-green text-white shadow-lg'
                    : hasInningsStarted
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                }`}
                disabled={!hasInningsStarted && isMatchEnded}
                title={!hasInningsStarted && isMatchEnded ? "Innings was not required" : ""}
              >
                <span className="font-semibold">Innings {inningsNum}</span>
                <span className="ml-2">
                  ({inning?.team || 'TBD'})
                </span>
                {!hasInningsStarted && isMatchEnded && (
                  <FaTimesCircle className="ml-2 text-sm" />
                )}
              </button>
            );
          })}
        </div>
        
     
        <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          {match.status === 'completed' ? (
            <span className="flex items-center justify-center">
              <FaTrophy className="mr-2" />
              Match completed
            </span>
          ) : viewingInnings === match.currentInnings ? (
            <span className="text-green-600 dark:text-green-400 flex items-center justify-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              Currently live
            </span>
          ) : viewingInnings < match.currentInnings ? (
            <span>Viewing completed innings</span>
          ) : (
            <span>Innings not started yet</span>
          )}
        </div>
      </div>

      {/* Main Score Display */}
      <motion.div 
        key={viewingInnings}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-2">
          {currentScore.runs}
          <span className="text-4xl md:text-6xl text-gray-500 dark:text-gray-400 mx-2">/</span>
          {currentScore.wickets}
        </div>
        {inningsHadPlay ? (
          <div className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400">
            Overs: <span className="font-bold text-cricket-green">{currentScore.oversFormatted}</span>
          </div>
        ) : (
          <div className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 italic">
            {isMatchEnded ? 'Innings not required' : 'No balls bowled yet'}
          </div>
        )}
      </motion.div>

     
      {!isMatchEnded && inningsHadPlay && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Striker */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUser className="mr-2 text-green-600" />
                Striker
              </h4>
              {onPlayerChange && viewingInnings === match.currentInnings && match.status === 'live' && (
                <button
                  onClick={() => onPlayerChange('striker')}
                  className="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded flex items-center"
                >
                  <FaExchangeAlt className="mr-1" /> Change
                </button>
              )}
            </div>
            {striker ? (
              <>
                <p className="font-bold text-lg mb-2">{striker.playerName}</p>
                <div className="flex justify-between mb-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{striker.runs || 0}</p>
                    <p className="text-sm text-gray-500">Runs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{striker.ballsFaced || 0}</p>
                    <p className="text-sm text-gray-500">Balls</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>4s: {striker.fours || 0}</span>
                  <span>6s: {striker.sixes || 0}</span>
                  <span>SR: {striker.ballsFaced > 0 
                    ? ((striker.runs || 0) / striker.ballsFaced * 100).toFixed(0)
                    : 0}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">Not set</p>
            )}
          </div>

          {/* Non-Striker */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Non-Striker
              </h4>
              {onPlayerChange && viewingInnings === match.currentInnings && match.status === 'live' && (
                <button
                  onClick={() => onPlayerChange('nonStriker')}
                  className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded flex items-center"
                >
                  <FaExchangeAlt className="mr-1" /> Change
                </button>
              )}
            </div>
            {nonStriker ? (
              <>
                <p className="font-bold text-lg mb-2">{nonStriker.playerName}</p>
                <div className="flex justify-between mb-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{nonStriker.runs || 0}</p>
                    <p className="text-sm text-gray-500">Runs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{nonStriker.ballsFaced || 0}</p>
                    <p className="text-sm text-gray-500">Balls</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>4s: {nonStriker.fours || 0}</span>
                  <span>6s: {nonStriker.sixes || 0}</span>
                  <span>SR: {nonStriker.ballsFaced > 0 
                    ? ((nonStriker.runs || 0) / nonStriker.ballsFaced * 100).toFixed(0)
                    : 0}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">Not set</p>
            )}
          </div>

          {/* Current Bowler */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUserShield className="mr-2 text-red-600" />
                Bowler
              </h4>
              {onPlayerChange && viewingInnings === match.currentInnings && match.status === 'live' && (
                <button
                  onClick={() => onPlayerChange('bowler')}
                  className="text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-300 px-2 py-1 rounded flex items-center"
                >
                  <FaExchangeAlt className="mr-1" /> Change
                </button>
              )}
            </div>
            {currentBowler ? (
              <>
                <p className="font-bold text-lg mb-2">{currentBowler.playerName}</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div>
                    <p className="text-xl font-bold">
                      {Math.floor(currentBowler.ballsBowled / 6)}.{currentBowler.ballsBowled % 6}
                    </p>
                    <p className="text-sm text-gray-500">Overs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{currentBowler.runsConceded || 0}</p>
                    <p className="text-sm text-gray-500">Runs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{currentBowler.wickets || 0}</p>
                    <p className="text-sm text-gray-500">Wkts</p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>Econ: {currentBowler.ballsBowled > 0 
                    ? ((currentBowler.runsConceded || 0) / (currentBowler.ballsBowled / 6)).toFixed(2)
                    : '0.00'}</p>
                  <p className="text-xs mt-1">
                    Maidens: {currentBowler.maidens || 0} • Wides: {currentBowler.wides || 0}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">Not set</p>
            )}
          </div>
        </div>
      )}

      {/* Team Details */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-2xl ${
          viewedInning?.team === match.teamA.name
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
            : 'bg-gray-50 dark:bg-gray-800/50'
        }`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {match.teamA.name}
            {viewedInning?.team === match.teamA.name && inningsHadPlay && (
              <span className="ml-2 text-sm bg-cricket-green text-white px-2 py-1 rounded">
                {isMatchEnded ? 'Batted' : 'Batting'}
              </span>
            )}
          </h3>
          {match.teamA.players && match.teamA.players.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Players:</p>
              <div className="flex flex-wrap gap-1">
                {match.teamA.players.map((player, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    title={player}
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`p-6 rounded-2xl ${
          viewedInning?.team === match.teamB.name
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
            : 'bg-gray-50 dark:bg-gray-800/50'
        }`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {match.teamB.name}
            {viewedInning?.team === match.teamB.name && inningsHadPlay && (
              <span className="ml-2 text-sm bg-cricket-green text-white px-2 py-1 rounded">
                {isMatchEnded ? 'Batted' : 'Batting'}
              </span>
            )}
          </h3>
          {match.teamB.players && match.teamB.players.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Players:</p>
              <div className="flex flex-wrap gap-1">
                {match.teamB.players.map((player, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    title={player}
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
     
      {/* Run Rate & Required Rate */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-1">Run Rate</p>
          <p className={`text-2xl font-bold ${
            isMatchEnded && !inningsHadPlay ? 'text-gray-500' : 'text-cricket-green'
          }`}>
            {calculateRunRate()}
          </p>
        </div>

      
        {match.status === 'live' && viewingInnings === 2 && rrr && rrr.runsNeeded > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Need {rrr.runsNeeded} runs
            </p>
            <p className="text-2xl font-bold text-red-500">
              RRR: {rrr.requiredRate}
            </p>
          </div>
        )}
      </div>

      
      {inningsHadPlay && viewedInning?.extras && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Extras</h4>
          <div className="flex flex-wrap gap-4">
            {viewedInning.extras.wides > 0 && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                Wides: {viewedInning.extras.wides}
              </span>
            )}
            {viewedInning.extras.noBalls > 0 && (
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                No Balls: {viewedInning.extras.noBalls}
              </span>
            )}
            {viewedInning.extras.byes > 0 && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                Byes: {viewedInning.extras.byes}
              </span>
            )}
            {viewedInning.extras.legByes > 0 && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                Leg Byes: {viewedInning.extras.legByes}
              </span>
            )}
          </div>
        </div>
      )}

     
      {inningsHadPlay && viewedInning?.extras && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Extras: {
              (viewedInning.extras.wides || 0) + 
              (viewedInning.extras.noBalls || 0) + 
              (viewedInning.extras.byes || 0) + 
              (viewedInning.extras.legByes || 0)
            }
          </p>
        </div>
      )}
    </div>
  );
};