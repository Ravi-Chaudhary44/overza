import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserShield, FaExchangeAlt, FaTrophy, FaTimesCircle } from 'react-icons/fa';
import GlassWrapper from '../layout/GlassWrapper';
import GlassButton from '../common/GlassButton';

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
   <GlassWrapper
    variant="card"
    rounded="2xl"
    padding="p-8"
    glow
    className="relative"
  >
      {/* Match Status */}
      <div className="absolute top-4 right-4">
        <span className={`
  px-4 py-2 rounded-full font-semibold text-sm border backdrop-blur-md
  ${match.status === 'live'
    ? 'bg-red-500/20 text-red-400 border-red-400/40 animate-pulse'
    : match.status === 'completed'
    ? 'bg-gray-500/20 text-gray-300 border-gray-400/40'
    : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40'
  }
`}>

          {match.status === 'live' ? '🔴 LIVE' : match.status === 'completed' ? '🏁 ENDED' : '⏳ UPCOMING'}
        </span>
      </div>

      {/* Match Result Banner for Completed Matches */}
      {isMatchEnded && matchResult && (
        <div className="mb-6 glass-card border border-emerald-400/40 text-emerald-300 p-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)]
">
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
              <GlassButton
  key={inningsNum}
  onClick={() => handleInningsChange(inningsNum)}
  size="sm"
  variant={isCurrentView ? 'primary' : 'secondary'}
  glow={isCurrentView}
  className={`mx-1 ${!hasInningsStarted && isMatchEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={!hasInningsStarted && isMatchEnded}
>
  Innings {inningsNum} ({inning?.team || 'TBD'})
  {!hasInningsStarted && isMatchEnded && (
    <FaTimesCircle className="ml-2 text-sm" />
  )}
</GlassButton>

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
          <div className="glass-card p-4 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUser className="mr-2 text-green-600" />
                Striker
              </h4>
              {onPlayerChange && viewingInnings === match.currentInnings && match.status === 'live' && (
               <GlassButton
  size="sm"
  variant="secondary"
  glow
  onClick={() => onPlayerChange('striker')}
  className="!text-xs"
>
  <FaExchangeAlt className="mr-1" /> Change
</GlassButton>

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
          <div className="glass-card p-4 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Non-Striker
              </h4>
              {onPlayerChange && viewingInnings === match.currentInnings && match.status === 'live' && (
               <GlassButton
  size="sm"
  variant="secondary"
  glow
  onClick={() => onPlayerChange('nonstriker')}
  className="!text-xs"
>
  <FaExchangeAlt className="mr-1" /> Change
</GlassButton>

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
          <div className="glass-card p-4 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUserShield className="mr-2 text-red-600" />
                Bowler
              </h4>
              {onPlayerChange && viewingInnings === match.currentInnings && match.status === 'live' && (
               <GlassButton
  size="sm"
  variant="secondary"
  glow
  onClick={() => onPlayerChange('bowler')}
  className="!text-xs"
>
  <FaExchangeAlt className="mr-1" /> Change
</GlassButton>

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
        <div className={`
  p-6 rounded-2xl glass-card border
  ${viewedInning?.team === match.teamA.name
    ? 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
    : 'border-white/10'
  }
`}
>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {match.teamA.name}
            {viewedInning?.team === match.teamA.name && inningsHadPlay && (
              <span className="ml-2 text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
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
                  className="text-xs glass-card border border-white/10 px-2 py-1 rounded-full"

                    title={player}
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`
  p-6 rounded-2xl glass-card border
  ${viewedInning?.team === match.teamB.name
    ? 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
    : 'border-white/10'
  }
`}
>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {match.teamB.name}
            {viewedInning?.team === match.teamB.name && inningsHadPlay && (
              <span className="ml-2 text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
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
                    className="text-xs glass-card border border-white/10 px-2 py-1 rounded-full"

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
        <div className="glass-card p-4 rounded-2xl text-center border border-white/10">
          <p className="text-gray-600 dark:text-gray-400 mb-1">Run Rate</p>
          <p className={`text-2xl font-bold ${
            isMatchEnded && !inningsHadPlay ? 'text-gray-500' : 'text-cricket-green'
          }`}>
            {calculateRunRate()}
          </p>
        </div>

      
        {match.status === 'live' && viewingInnings === 2 && rrr && rrr.runsNeeded > 0 && (
          <div className="glass-card p-4 rounded-2xl text-center border border-white/10">
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
        <div className="mt-6 p-4 glass-card rounded-2xl border border-white/10">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Extras</h4>
          <div className="flex flex-wrap gap-4">
            {viewedInning.extras.wides > 0 && (
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">
                Wides: {viewedInning.extras.wides}
              </span>
            )}
            {viewedInning.extras.noBalls > 0 && (
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-400/30"
>
                No Balls: {viewedInning.extras.noBalls}
              </span>
            )}
            {viewedInning.extras.byes > 0 && (
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30"
>
                Byes: {viewedInning.extras.byes}
              </span>
            )}
            {viewedInning.extras.legByes > 0 && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-400/30"
>
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
   </GlassWrapper>

  );

};
