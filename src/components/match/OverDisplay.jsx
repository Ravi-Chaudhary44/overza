import React from 'react';
import { FaBaseballBall } from 'react-icons/fa';

export const OverDisplay = ({ match, viewingInnings = null, detailed = false }) => {
  if (!match) return null;

  const inningToShow = viewingInnings || match.currentInnings;
  const currentInning = match.innings[inningToShow - 1];
  
  if (!currentInning) {
    return (
      <div className="text-center py-8">
        <FaBaseballBall className="text-4xl text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          Innings {inningToShow} data not available
        </p>
      </div>
    );
  }

  const ballsData = currentInning?.ballsData || [];
  const totalOvers = match.totalOvers;
  const ballsPerOver = 6;

 
  const maxBallNumber = ballsData.reduce((max, ball) => Math.max(max, ball.ballNumber || 0), 0);
  const balls = maxBallNumber; 

  const completedOvers = Math.floor(balls / ballsPerOver);
  const currentOverBalls = balls % ballsPerOver;
  const isLiveInnings = inningToShow === match.currentInnings && match.status === 'live';

 
  const groupedBalls = {};
  ballsData.forEach(ball => {
    const key = `${ball.overNumber}-${ball.ballNumber}`;
    if (!groupedBalls[key]) {
      groupedBalls[key] = {
        overNumber: ball.overNumber,
        ballNumber: ball.ballNumber,
        runs: 0,
        isWicket: false,
        wicketType: null,
        wicketInfo: null,
        extras: { wide:0, noBall:0, bye:0, legBye:0, penalty:0 },
        batsman: ball.batsman,
        bowler: ball.bowler,
      };
    }
    
    groupedBalls[key].runs += ball.runs || 0;
  
    if (ball.extras) {
      groupedBalls[key].extras.wide += ball.extras.wide || 0;
      groupedBalls[key].extras.noBall += ball.extras.noBall || 0;
      groupedBalls[key].extras.bye += ball.extras.bye || 0;
      groupedBalls[key].extras.legBye += ball.extras.legBye || 0;
      groupedBalls[key].extras.penalty += ball.extras.penalty || 0;
    }
  
    if (ball.isWicket) {
      groupedBalls[key].isWicket = true;
      groupedBalls[key].wicketType = ball.wicketType;
      groupedBalls[key].wicketInfo = ball.wicketInfo;
    }
  });


  const groupedArray = Object.values(groupedBalls).sort((a, b) => {
    if (a.overNumber !== b.overNumber) return a.overNumber - b.overNumber;
    return a.ballNumber - b.ballNumber;
  });

  
  const allBalls = Array.from({ length: totalOvers * ballsPerOver }, (_, i) => {
    const ballNumber = i + 1;
    const ballGroup = groupedArray.find(g => g.ballNumber === ballNumber);
    return {
      number: ballNumber,
      isBowled: ballGroup !== undefined,
      ballGroup: ballGroup || null,
    };
  });

 
  const overs = [];
  for (let i = 0; i < totalOvers; i++) {
    const startIndex = i * ballsPerOver;
    const endIndex = startIndex + ballsPerOver;
    overs.push(allBalls.slice(startIndex, endIndex));
  }

 
  const getBallDisplay = (ball) => {
    if (!ball) return { text: '•', bgColor: 'bg-gray-700', title: 'Dot ball' };

    const extras = ball.extras;
    const hasWide = extras.wide > 0;
    const hasNoBall = extras.noBall > 0;
    const hasBye = extras.bye > 0;
    const hasLegBye = extras.legBye > 0;
    const totalExtrasRuns = extras.wide + extras.noBall + extras.bye + extras.legBye + extras.penalty;
    const totalRuns = ball.runs + totalExtrasRuns;

    let bgColor = 'bg-gray-700';
    let displayText = '•';
    let title = '';

    if (ball.isWicket) {
      bgColor = 'bg-red-500';
      displayText = 'W';
      title = `Wicket (${ball.wicketType || 'bowled'})`;
    } else if (hasWide) {
      bgColor = 'bg-yellow-500';
      displayText = `Wd${totalRuns > 1 ? '+' + totalRuns : ''}`;
      title = `Wide +${totalRuns}`;
    } else if (hasNoBall) {
      bgColor = 'bg-orange-500';
      displayText = `Nb${totalRuns > 1 ? '+' + totalRuns : ''}`;
      title = `No ball +${totalRuns}`;
    } else if (hasBye) {
      bgColor = 'bg-blue-400';
      displayText = `B${totalRuns}`;
      title = `Bye ${totalRuns}`;
    } else if (hasLegBye) {
      bgColor = 'bg-purple-500';
      displayText = `Lb${totalRuns}`;
      title = `Leg bye ${totalRuns}`;
    } else if (totalRuns > 0) {
      if (totalRuns >= 4) {
        bgColor = 'bg-green-500';
      } else {
        bgColor = 'bg-blue-500';
      }
      displayText = totalRuns.toString();
      title = `${totalRuns} run${totalRuns > 1 ? 's' : ''}`;
    } else {
      title = 'Dot ball';
    }

    return { text: displayText, bgColor, title };
  };

 
  const getOverStats = (overBalls) => {
    let runs = 0;
    let wickets = 0;
    overBalls.forEach(slot => {
      if (slot.isBowled && slot.ballGroup) {
        const bg = slot.ballGroup;
        const extrasRuns = (bg.extras.wide||0)+(bg.extras.noBall||0)+(bg.extras.bye||0)+(bg.extras.legBye||0)+(bg.extras.penalty||0);
        runs += (bg.runs || 0) + extrasRuns;
        if (bg.isWicket) wickets++;
      }
    });
    return { runs, wickets };
  };

  const calculateInningsSummary = () => {
    const totalRuns = currentInning.runs || 0;
    const totalWickets = currentInning.wickets || 0;
    const totalExtras = currentInning.extras ? 
      (currentInning.extras.wides || 0) + 
      (currentInning.extras.noBalls || 0) + 
      (currentInning.extras.byes || 0) + 
      (currentInning.extras.legByes || 0) : 0;
    
    let maidenOvers = 0;
    for (let over = 1; over <= completedOvers; over++) {
      const startBall = (over - 1) * ballsPerOver;
      const overBalls = allBalls.slice(startBall, startBall + ballsPerOver);
      const { runs: overRuns } = getOverStats(overBalls);
      if (overRuns === 0) maidenOvers++;
    }

    return { totalRuns, totalWickets, totalExtras, maidenOvers };
  };

  const summary = calculateInningsSummary();
  const totalBallsAllowed = totalOvers * ballsPerOver;
  const ballsRemaining = totalBallsAllowed - balls;
  const oversRemaining = Math.floor(ballsRemaining / 6);
  const remainingBalls = ballsRemaining % 6;

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Innings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Innings {inningToShow} - {currentInning.team}
          </h4>
          {isLiveInnings && (
            <span className="inline-block mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
              🔴 LIVE
            </span>
          )}
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentInning.runs || 0}/{currentInning.wickets || 0}
          </p>
        </div>
      </div>

      
      {isLiveInnings && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Current Over: {completedOvers}.{currentOverBalls}
          </h4>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5, 6].map((ball) => (
              <div
                key={ball}
                className={`flex-1 h-3 rounded-full ${
                  ball <= currentOverBalls
                    ? 'bg-cricket-green'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detailed Over View */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Over-by-Over Progress
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completedOvers}.{currentOverBalls} / {totalOvers}
          </span>
        </div>
        
      
        <div className="block sm:hidden">
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-3" style={{ minWidth: 'min-content' }}>
              {overs.map((overBalls, overIndex) => {
                const overNumber = overIndex + 1;
                const isCurrentOver = completedOvers === overNumber - 1 && isLiveInnings;
                const isCompleted = overNumber <= completedOvers;
                const { runs: overRuns, wickets: wicketsInOver } = getOverStats(overBalls);

                return (
                  <div
                    key={overNumber}
                    className={`min-w-[120px] p-3 rounded-xl border-2 flex-shrink-0 ${
                      isCurrentOver
                        ? 'border-cricket-green bg-green-50 dark:bg-green-900/20'
                        : isCompleted
                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-bold ${
                        isCurrentOver
                          ? 'text-cricket-green'
                          : isCompleted
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {overNumber}
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {overRuns}{wicketsInOver > 0 ? `/${wicketsInOver}` : ''}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1">
                      {overBalls.map((slot, ballIndex) => {
                        if (!slot.isBowled) {
                          return (
                            <div
                              key={ballIndex}
                              className="h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium"
                            >
                              •
                            </div>
                          );
                        }

                        const display = getBallDisplay(slot.ballGroup);
                        return (
                          <div
                            key={ballIndex}
                            className={`h-8 flex items-center justify-center rounded text-xs sm:text-sm font-medium text-white ${display.bgColor}`}
                            title={display.title}
                          >
                            {display.text}
                          </div>
                        );
                      })}
                    </div>
                    
                    {isCompleted && (
                      <div className="mt-2 text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {overRuns === 0 ? 'Maiden' : 'runs'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            ← Scroll horizontally to view all overs →
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {overs.map((overBalls, overIndex) => {
            const overNumber = overIndex + 1;
            const isCurrentOver = completedOvers === overNumber - 1 && isLiveInnings;
            const isCompleted = overNumber <= completedOvers;
            const { runs: overRuns, wickets: wicketsInOver } = getOverStats(overBalls);

            return (
              <div
                key={overNumber}
                className={`p-3 rounded-xl border-2 ${
                  isCurrentOver
                    ? 'border-cricket-green bg-green-50 dark:bg-green-900/20'
                    : isCompleted
                    ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-bold ${
                    isCurrentOver
                      ? 'text-cricket-green'
                      : isCompleted
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {overNumber}
                  </span>
                  {isCompleted && (
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {overRuns}{wicketsInOver > 0 ? `/${wicketsInOver}` : ''}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  {overBalls.map((slot, ballIndex) => {
                    if (!slot.isBowled) {
                      return (
                        <div
                          key={ballIndex}
                          className="h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium"
                        >
                          •
                        </div>
                      );
                    }

                    const display = getBallDisplay(slot.ballGroup);
                    return (
                      <div
                        key={ballIndex}
                        className={`h-8 flex items-center justify-center rounded text-xs sm:text-sm font-medium text-white ${display.bgColor}`}
                        title={display.title}
                      >
                        {display.text}
                      </div>
                    );
                  })}
                </div>
                
                {isCompleted && (
                  <div className="mt-2 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {overRuns === 0 ? 'Maiden' : 'runs'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Over Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Deliveries Bowled</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{balls}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Overs Completed</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {completedOvers}.{currentOverBalls}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Overs Remaining</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {oversRemaining}.{remainingBalls}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Deliveries Remaining</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {ballsRemaining}
          </p>
        </div>
      </div>

      {/* Innings Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Innings Summary
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Total Runs</p>
            <p className="text-xl sm:text-2xl font-bold text-cricket-green">{summary.totalRuns}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Wickets</p>
            <p className="text-xl sm:text-2xl font-bold text-red-500">{summary.totalWickets}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Extras</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-500">{summary.totalExtras}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Maiden Overs</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-500">{summary.maidenOvers}</p>
          </div>
        </div>
        
        {/* Run Rate */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Run Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {balls > 0 ? ((currentInning.runs || 0) / (balls / 6)).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Projected Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {balls > 0 
                  ? Math.round((currentInning.runs || 0) / balls * totalOvers * 6)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
