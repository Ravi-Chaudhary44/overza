import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaHome, FaShare, FaQrcode, FaCopy, FaUser, FaUserShield, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { useMatch } from '../context/MatchContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ScoreCard } from '../components/match/ScoreCard';
import { OverDisplay } from '../components/match/OverDisplay';
import MatchInfo from '../components/viewer/MatchInfo';
import RecentBalls from '../components/viewer/RecentBalls';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';

import GlassButton from '../components/common/GlassButton';
import GlassWrapper from '../components/layout/GlassWrapper';
const InningsScorecard = ({ match, viewingInnings }) => {

  const [activeTab, setActiveTab] = useState('batting');
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  
  if (!match || !match.innings || !match.innings[viewingInnings - 1]) {
    return null;
  }

  const currentInning = match.innings[viewingInnings - 1];
  
 
  const inningsStarted = currentInning.battingLineup && currentInning.battingLineup.length > 0;
  
  if (!inningsStarted) {
    return (
     <GlassWrapper variant="card" rounded="3xl" padding="p-6" className="shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Scorecard - Innings {viewingInnings} ({currentInning.team || 'TBD'})
        </h3>
        <div className="text-center py-8">
          <FaBaseballBall className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Innings not started
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {match.status === 'completed' ? 'Match ended before this innings could be played' : 'Innings will begin soon'}
          </p>
        </div>
     </GlassWrapper>
    );
  }

  const battingLineup = currentInning.battingLineup || [];
  const bowlingLineup = currentInning.bowlingLineup || [];

 
  const battingTeam = match.teamA.name === currentInning.team ? match.teamA : match.teamB;
  const bowlingTeam = battingTeam === match.teamA ? match.teamB : match.teamA;

 
  const battedPlayers = battingLineup.map(player => ({
    ...player,
    hasBatted: true
  }));

  
  const sortedBattedPlayers = [...battedPlayers].sort((a, b) => (b.runs || 0) - (a.runs || 0));

  
  const yetToBatPlayers = [];
  if (battingTeam.players) {
    const battedPlayerNames = new Set(battedPlayers.map(p => p.playerName));
    battingTeam.players.forEach(playerName => {
      if (!battedPlayerNames.has(playerName)) {
        yetToBatPlayers.push({
          playerName,
          status: 'yetToBat'
        });
      }
    });
  }

 
  const bowledPlayers = bowlingLineup
    .filter(player => (player.ballsBowled || 0) > 0)
    .map(player => ({
      ...player,
      hasBowled: true
    }));

 
  const sortedBowledPlayers = [...bowledPlayers].sort((a, b) => {
    if ((b.wickets || 0) !== (a.wickets || 0)) {
      return (b.wickets || 0) - (a.wickets || 0);
    }
    const aEcon = a.ballsBowled > 0 ? (a.runsConceded || 0) / (a.ballsBowled / 6) : 999;
    const bEcon = b.ballsBowled > 0 ? (b.runsConceded || 0) / (b.ballsBowled / 6) : 999;
    return aEcon - bEcon;
  });

  
  const yetToBowlPlayers = [];
  if (bowlingTeam.players) {
    const bowledPlayerNames = new Set(bowledPlayers.map(p => p.playerName));
    
    bowlingTeam.players.forEach(playerName => {
      if (!bowledPlayerNames.has(playerName)) {
        yetToBowlPlayers.push({
          playerName,
          status: 'yetToBowl'
        });
      }
    });
  }

  const togglePlayerExpand = (playerName) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  const calculateStrikeRate = (runs, balls) => {
    if (!balls || balls === 0) return '0.00';
    return ((runs / balls) * 100).toFixed(2);
  };

  const calculateEconomy = (runsConceded, ballsBowled) => {
    if (!ballsBowled || ballsBowled === 0) return '0.00';
    return ((runsConceded || 0) / (ballsBowled / 6)).toFixed(2);
  };

  return (
     <GlassWrapper variant="card" rounded="3xl" padding="p-6" className="shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Scorecard - Innings {viewingInnings} ({currentInning.team})
        </h3>
        <div className="flex space-x-2">
          <GlassButton
  onClick={() => setActiveTab('batting')}
  variant={activeTab === 'batting' ? 'primary' : 'outline'}
  size="sm"
  icon={FaUser}
  iconPosition="left"
  className={activeTab === 'batting' ? 'bg-cricket-green border-none' : ''}
>
  Batting
</GlassButton>
          <GlassButton
  onClick={() => setActiveTab('bowling')}
  variant={activeTab === 'bowling' ? 'primary' : 'outline'}
  size="sm"
  icon={FaUserShield}
  iconPosition="left"
  className={activeTab === 'bowling' ? 'bg-cricket-green border-none' : ''}
>
  Bowling
</GlassButton>
        </div>
      </div>

      {activeTab === 'batting' ? (
  <>
   
    <div className="overflow-x-auto mb-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Batter</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">R</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">B</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">4s</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">6s</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">SR</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedBattedPlayers.map((player, index) => {
            const isExpanded = expandedPlayer === player.playerName;
            const isOut = player.status === 'out';
            const isBatting = player.status === 'batting' || player.isStriker || player.isNonStriker;
            
          
            if (player.ballsFaced > 0 || isBatting || isOut) {
              return (
                <React.Fragment key={index}>
                  <tr 
                    className={`border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                      isExpanded ? 'bg-gray-50 dark:bg-gray-700/30' : ''
                    } ${isOut ? 'cursor-pointer' : ''}`}
                    onClick={() => isOut && togglePlayerExpand(player.playerName)}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <FaUser className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{player.playerName}</p>
                          {player.outDescription && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {player.outDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {player.runs || 0}
                      </span>
                    </td>
                    <td className="text-center py-3 px-2 text-gray-700 dark:text-gray-300">
                      {player.ballsFaced || 0}
                    </td>
                    <td className="text-center py-3 px-2 text-blue-600 dark:text-blue-400">
                      {player.fours || 0}
                    </td>
                    <td className="text-center py-3 px-2 text-green-600 dark:text-green-400">
                      {player.sixes || 0}
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`font-medium ${
                        (player.runs || 0) > 0 ? 'text-cricket-green' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {calculateStrikeRate(player.runs || 0, player.ballsFaced || 0)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <div className="flex flex-col items-center">
                        {isOut ? (
                          <>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                              Out
                            </span>
                            {player.bowler && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                b {player.bowler}
                              </span>
                            )}
                          </>
                        ) : isBatting ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            {player.isStriker ? 'Striker' : player.isNonStriker ? 'Non-Striker' : 'Batting'}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                            Not Out
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && isOut && (
                    <tr className="bg-red-50 dark:bg-red-900/10">
                      <td colSpan="7" className="py-3 px-2">
                        <div className="pl-10">
                          <div className="flex items-center text-sm">
                            <span className="font-semibold mr-2 text-red-600 dark:text-red-400">Dismissal:</span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {player.outDescription || `b ${player.bowler || 'Unknown'}`}
                            </span>
                          </div>
                          {player.wicketType && (
                            <div className="flex items-center text-sm mt-1">
                              <span className="font-semibold mr-2 text-gray-600 dark:text-gray-400">Type:</span>
                              <span className="text-gray-700 dark:text-gray-300">{player.wicketType}</span>
                            </div>
                          )}
                          {player.fielder && (
                            <div className="flex items-center text-sm mt-1">
                              <span className="font-semibold mr-2 text-gray-600 dark:text-gray-400">Fielder:</span>
                              <span className="text-gray-700 dark:text-gray-300">{player.fielder}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </tbody>
      </table>
      
      {sortedBattedPlayers.filter(p => p.ballsFaced > 0 || p.status === 'batting' || p.isStriker || p.isNonStriker || p.status === 'out').length === 0 && (
        <div className="text-center py-8">
          <FaUser className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No batting data available</p>
        </div>
      )}
    </div>

  
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Yet to bat</h4>
      {yetToBatPlayers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {yetToBatPlayers.map((player, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {player.playerName}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">All players have batted</p>
      )}
    </div>

    {/* Statistics Summary for Batters */}
<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
  <div className="grid grid-cols-4 gap-4">
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">Runs from Bat</p>
      <p className="text-2xl font-bold text-cricket-green">
        {sortedBattedPlayers.reduce((sum, player) => sum + (player.runs || 0), 0)}
      </p>
    </div>
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">Extras</p>
      <p className="text-2xl font-bold text-yellow-600">
        {(() => {
          const extras = currentInning.extras || {};
          return (extras.wides || 0) + 
                 (extras.noBalls || 0) + 
                 (extras.byes || 0) + 
                 (extras.legByes || 0);
        })()}
      </p>
    </div>
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">Total Runs</p>
      <p className="text-2xl font-bold text-green-600">
        {currentInning.runs || 0}
      </p>
    </div>
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">Outs</p>
      <p className="text-2xl font-bold text-red-500">
        {sortedBattedPlayers.filter(player => player.status === 'out').length}
      </p>
    </div>
  </div>
</div>
  </>
) : (
        <>
        
          <div className="overflow-x-auto mb-6">
            {sortedBowledPlayers.length === 0 ? (
              <div className="text-center py-8">
                <FaUserShield className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No bowling data yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Bowler</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">O</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">R</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">W</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">ECON</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">M</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">WD</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">NB</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBowledPlayers.map((player, index) => {
                    const overs = player.ballsBowled ? 
                      `${Math.floor(player.ballsBowled / 6)}.${player.ballsBowled % 6}` : 
                      '0.0';
                    
                    return (
                      <tr 
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                              <FaUserShield className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{player.playerName}</p>
                              {player.isCurrentBowler && (
                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                                  BOWLING
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-2 text-gray-900 dark:text-white font-medium">
                          {overs}
                        </td>
                        <td className="text-center py-3 px-2 text-gray-900 dark:text-white">
                          {player.runsConceded || 0}
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className="font-bold text-red-600 dark:text-red-400">
                            {player.wickets || 0}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className={`font-medium ${
                            calculateEconomy(player.runsConceded || 0, player.ballsBowled || 0) < 6 
                              ? 'text-green-600 dark:text-green-400' 
                              : calculateEconomy(player.runsConceded || 0, player.ballsBowled || 0) < 8
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {calculateEconomy(player.runsConceded || 0, player.ballsBowled || 0)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2 text-gray-700 dark:text-gray-300">
                          {player.maidens || 0}
                        </td>
                        <td className="text-center py-3 px-2 text-yellow-600 dark:text-yellow-400">
                          {player.wides || 0}
                        </td>
                        <td className="text-center py-3 px-2 text-orange-600 dark:text-orange-400">
                          {player.noBalls || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

       
          {yetToBowlPlayers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Yet to bowl</h4>
              <div className="flex flex-wrap gap-2">
                {yetToBowlPlayers.map((player, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {player.playerName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Summary for Bowlers */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Wickets</p>
                <p className="text-2xl font-bold text-red-500">
                  {sortedBowledPlayers.reduce((sum, player) => sum + (player.wickets || 0), 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Overs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(sortedBowledPlayers.reduce((sum, player) => sum + (player.ballsBowled || 0), 0) / 6).toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Maidens</p>
                <p className="text-2xl font-bold text-blue-500">
                  {sortedBowledPlayers.reduce((sum, player) => sum + (player.maidens || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </GlassWrapper>
  );
};

const LiveMatchViewer = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { currentMatch, getMatchById, isLoading } = useMatch();
  const [showShare, setShowShare] = useState(false);
  const [matchUrl, setMatchUrl] = useState('');

  const [viewingInnings, setViewingInnings] = useState(1);

  useEffect(() => {
    if (matchId) {
      getMatchById(matchId);
    }
  }, [matchId]);

  useEffect(() => {
    if (currentMatch) {
      const url = `${window.location.origin}/live/${currentMatch.matchId}`;
      setMatchUrl(url);
      
     
      if (currentMatch.status === 'completed') {
        
        if (currentMatch.innings && currentMatch.innings.length > 0) {
         
          const playedInnings = currentMatch.innings.filter(innings => 
            innings.runs !== undefined || 
            innings.wickets !== undefined ||
            (innings.battingLineup && innings.battingLineup.length > 0)
          );
          
          if (playedInnings.length > 0) {
            setViewingInnings(playedInnings.length); 
          } else {
            setViewingInnings(1); 
          }
        }
      } else if (currentMatch.currentInnings) {
    
        setViewingInnings(currentMatch.currentInnings);
      }
    }
  }, [currentMatch]);

  
  const handleInningsChange = (innings) => {
    setViewingInnings(innings);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(matchUrl);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <FaBaseballBall className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Match Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This match doesn't exist or has ended
          </p>
         <div className="flex justify-center">
  <GlassButton
    onClick={() => navigate('/')}
    variant="primary"
    size="lg"
    className="bg-cricket-green hover:bg-cricket-darkGreen border-none"
     glow
  glowColor="rgba(9, 255, 0, 0.5)" 
  >
    Go Home
  </GlassButton>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <GlassButton
  onClick={() => navigate('/')}
  variant="outline"
  size="sm"
  icon={FaHome}
  iconPosition="left"
>
  Home
</GlassButton>
            
            <div className="text-center">
              <div className="flex items-center justify-center">
                <FaBaseballBall className="text-2xl text-cricket-green mr-2" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Over<span className="text-cricket-green">Za</span>
                </h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live Cricket Scoring
              </p>
            </div>
            
            <button
              onClick={() => setShowShare(true)}
              className="bg-cricket-blue hover:bg-cricket-darkBlue text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaShare className="mr-2" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Live Badge and Match Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <span className={`inline-block px-4 py-2 rounded-full font-semibold mb-3 ${
                currentMatch.status === 'live' 
                  ? 'bg-red-500 text-white animate-pulse-slow' 
                  : currentMatch.status === 'completed'
                  ? 'bg-gray-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}>
                {currentMatch.status === 'live' ? '🔴 LIVE' : 
                 currentMatch.status === 'completed' ? '🏁 ENDED' : '⏳ UPCOMING'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {currentMatch.teamA.name} vs {currentMatch.teamB.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {currentMatch.venue} • {currentMatch.matchType}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600 dark:text-gray-400">Match ID</p>
              <p className="font-mono font-bold text-cricket-green">{currentMatch.matchId}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Display */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8"
            >
              <ScoreCard 
                match={currentMatch} 
                viewingInnings={viewingInnings}
                onInningsChange={handleInningsChange}
              />
            </motion.div>

            {/* Over Display - Only show if innings has started */}
            {currentMatch.innings && 
             currentMatch.innings[viewingInnings - 1] && 
             currentMatch.innings[viewingInnings - 1].battingLineup && 
             currentMatch.innings[viewingInnings - 1].battingLineup.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Over Progress - Innings {viewingInnings}
                </h3>
                <OverDisplay match={currentMatch} viewingInnings={viewingInnings} detailed={true} />
              </motion.div>
            )}

            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <InningsScorecard match={currentMatch} viewingInnings={viewingInnings} />
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6"
            >
              <MatchInfo match={currentMatch} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6"
            >
              <RecentBalls match={currentMatch} viewingInnings={viewingInnings} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShare(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Share Live Match
            </h3>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <QRCode value={matchUrl} size={200} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Scan QR code to join this match on your phone
              </p>
              <div className="flex gap-3 w-full">
                <input
                  type="text"
                  value={matchUrl}
                  readOnly
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-6 py-3 rounded-xl flex items-center"
                >
                  <FaCopy className="mr-2" /> Copy
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowShare(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};


export default LiveMatchViewer;
