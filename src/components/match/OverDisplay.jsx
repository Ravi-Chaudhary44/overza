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

  const balls = currentInning?.balls || 0;
  const totalOvers = match.totalOvers;
  const ballsPerOver = 6;

  
  const completedOvers = Math.floor(balls / ballsPerOver);
  const currentOverBalls = balls % ballsPerOver;

 
  const isLiveInnings = inningToShow === match.currentInnings && match.status === 'live';


  const allBalls = Array.from({ length: totalOvers * ballsPerOver }, (_, i) => {
    const ballNumber = i + 1;
    const ballData = currentInning?.ballsData?.find(
      ball => ball.ballNumber === ballNumber
    );

    return {
      number: ballNumber,
      isBowled: ballNumber <= balls,
      isWicket: ballData?.isWicket || false,
      runs: ballData?.runs || 0,
      isExtras: ballData?.extras && Object.values(ballData.extras).some(val => val > 0),
      extrasData: ballData?.extras || {}
    };
  });

 
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
      const overRuns = overBalls.reduce((sum, ball) => sum + (ball.runs || 0), 0);
      const overExtras = overBalls.reduce((sum, ball) => 
        sum + (ball.extrasData.wides || 0) + (ball.extrasData.noBalls || 0), 0);
      
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
    <div className="space-y-6">
      {/* Innings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            Innings {inningToShow} - {currentInning.team}
          </h4>
          {isLiveInnings && (
            <span className="inline-block mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
              🔴 LIVE
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentInning.runs || 0}/{currentInning.wickets || 0}
          </p>
        </div>
      </div>

      {/* Current Over Progress - Only show if it's the current live innings */}
      {isLiveInnings && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
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
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Over-by-Over Progress
        </h4>
        
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: totalOvers }, (_, overIndex) => {
            const overNumber = overIndex + 1;
            const startBall = (overNumber - 1) * ballsPerOver;
            const overBalls = allBalls.slice(startBall, startBall + ballsPerOver);
            const isCurrentOver = completedOvers === overNumber - 1 && isLiveInnings;
            const isCompleted = overNumber <= completedOvers;

          const overRuns = overBalls.reduce((sum, ball) => {
  let runs = ball.runs || 0;
  if (ball.extrasData) {
    runs += (ball.extrasData.wides || 0) + (ball.extrasData.noBalls || 0);
  
    runs += (ball.extrasData.byes || 0) + (ball.extrasData.legByes || 0);
  }
  return sum + runs;
}, 0);


           
            const wicketsInOver = overBalls.filter(ball => ball.isWicket).length;

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
                <div className="text-center mb-2">
                  <span className={`font-bold ${
                    isCurrentOver
                      ? 'text-cricket-green'
                      : isCompleted
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {overNumber}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  {overBalls.map((ball, ballIndex) => {
                   
                    if (!ball.isBowled) {
                      return (
                        <div
                          key={ballIndex}
                          className="h-6 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs font-medium"
                        >
                          •
                        </div>
                      );
                    }

                    let bgColor = 'bg-gray-700';
                    let displayText = '•';
                    
                    if (ball.isWicket) {
                      bgColor = 'bg-red-500';
                      displayText = 'W';
                      } else if (ball.runs > 0) {
                      if (ball.runs >= 4) {
                        bgColor = 'bg-green-500';
                      } else {
                        bgColor = 'bg-blue-500';
                 }
                      displayText = ball.runs.toString();
                    } else if (ball.isExtras) {
                      bgColor = 'bg-yellow-500';
                      displayText = 'E';
                    }

                    return (
                      <div
                        key={ballIndex}
                        className={`h-6 flex items-center justify-center rounded text-xs font-medium text-white ${bgColor}`}
                        title={
                          ball.isWicket
                            ? 'Wicket'
                            : ball.runs > 0
                            ? `${ball.runs} run${ball.runs > 1 ? 's' : ''}`
                            : ball.isExtras
                            ? 'Extras'
                            : 'Dot ball'
                        }
                      >
                        {displayText}
                      </div>
                    );
                  })}
                </div>
                
                {isCompleted && (
                <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {overRuns}{wicketsInOver > 0 ? `/${wicketsInOver}` : ''}
                    </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Balls Bowled</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{balls}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Overs Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedOvers}.{currentOverBalls}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Overs Remaining</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {oversRemaining}.{remainingBalls}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Balls Remaining</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {ballsRemaining}
          </p>
        </div>
      </div>

      {/* Innings Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Innings Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Runs</p>
            <p className="text-2xl font-bold text-cricket-green">{summary.totalRuns}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Wickets</p>
            <p className="text-2xl font-bold text-red-500">{summary.totalWickets}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Extras</p>
            <p className="text-2xl font-bold text-yellow-500">{summary.totalExtras}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Maiden Overs</p>
            <p className="text-2xl font-bold text-blue-500">{summary.maidenOvers}</p>
          </div>
        </div>
        
        {/* Run Rate */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Run Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {balls > 0 ? ((currentInning.runs || 0) / (balls / 6)).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};