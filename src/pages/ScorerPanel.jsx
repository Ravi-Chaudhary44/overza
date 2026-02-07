import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaUndo, FaStop, FaCopy, FaShare, FaPlus, FaExchangeAlt, FaUserShield, FaUser, FaFlagCheckered } from 'react-icons/fa';
import { useMatch } from '../context/MatchContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { MatchSetup } from '../components/scoring/MatchSetup';
import ScoringButtons from '../components/scoring/ScoringButtons';
import { ScoreCard } from '../components/match/ScoreCard';
import { OverDisplay } from '../components/match/OverDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';
import PlayerSelector from '../components/scoring/PlayerSelector';
import api from '../utils/api';

const ScorerPanel = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const hasShownError = useRef(false);
  const { 
    currentMatch, 
    createMatch, 
    updateScore, 
    undoLastBall, 
    endMatch, 
    isLoading,
    leaveMatchRoom,
    clearCurrentMatch,
    changeBatsman,
    changeBowler
  } = useMatch();
  const navigate = useNavigate();
  const [showShare, setShowShare] = useState(false);
  const [matchUrl, setMatchUrl] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [selectorType, setSelectorType] = useState('batsman');
  const [selectorRole, setSelectorRole] = useState('striker');
  const [isEndingInning, setIsEndingInning] = useState(false);
  
  
  const [viewingInnings, setViewingInnings] = useState(1);

  useEffect(() => {
    if (!user && !hasShownError.current) {
      hasShownError.current = true;
      toast.error('Please login to access scorer panel');
      navigate('/login');
      return;
    }

    if (user && !user.isAdmin && !hasShownError.current) {
      hasShownError.current = true;
      toast.error('Only admin users can access scorer panel');
      navigate('/');
    }
  }, [user, navigate]);


  useEffect(() => {
    if (currentMatch?.status === 'completed') {
      clearCurrentMatch();
    }
  }, []);

  useEffect(() => {
    if (currentMatch) {
      const url = `${window.location.origin}/live/${currentMatch.matchId}`;
      setMatchUrl(url);
      
      if (currentMatch.currentInnings) {
        setViewingInnings(currentMatch.currentInnings);
      }
      
      if (currentMatch.status === 'completed') {
        toast('Viewing ended match', { icon: '🏁' });
      }
    }
  }, [currentMatch]);

  
  useEffect(() => {
    if (!socket) return;

    socket.on('inning_ended', (data) => {
      toast.success(`Inning ${data.inning} ended. Target: ${data.target} runs`);
      
      if (currentMatch) {
       
        setCurrentMatch(prev => ({
          ...prev,
          currentInnings: data.currentInnings,
          target: data.target
        }));
        setViewingInnings(data.currentInnings);
      }
    });

    return () => {
      socket.off('inning_ended');
    };
  }, [socket, currentMatch]);


  const handleInningsChange = (innings) => {
    if (innings === currentMatch?.currentInnings) {
      setViewingInnings(innings);
    } else {
      toast.error('As a scorer, you can only view the current innings');
    }
  };

  const handleCreateMatch = async (matchData) => {
    try {
      await createMatch(matchData);
      toast.success('Match started successfully!');
    } catch (error) {
      console.error('Failed to create match:', error);
    }
  };

  const handleScoreUpdate = async (runs, isWicket = false, wicketType = null, extras = {}, wicketInfo = {}) => {
    if (!currentMatch) {
      console.log('No current match found');
      return;
    }
    
    if (currentMatch.status === 'completed') {
      console.log('Match has ended - cannot update score');
      toast.error('Match has ended. Cannot update score.');
      return;
    }
    
    console.log('========== SCORE UPDATE CALLED ==========');
    console.log('Received data:', {
      runs: runs,
      isWicket: isWicket,
      wicketType: wicketType,
      extras: extras,
      wicketInfo: wicketInfo
    });
    console.log('Current match ID:', currentMatch.matchId);
    
    const currentInning = currentMatch.innings?.[currentMatch.currentInnings - 1];
    const batsman = currentInning?.striker || currentMatch.currentBatsmen?.[0];
    const bowler = currentInning?.currentBowler || currentMatch.currentBowler;
    
    console.log('Current inning:', currentInning);
    console.log('Selected batsman:', batsman);
    console.log('Selected bowler:', bowler);
    
    try {
      console.log('Calling updateScore with data:', {
        matchId: currentMatch.matchId,
        runs,
        isWicket,
        wicketType,
        batsman,
        bowler,
        extras,
        wicketInfo
      });
      
      await updateScore({
        matchId: currentMatch.matchId,
        runs,
        isWicket,
        wicketType,
        batsman,
        bowler,
        extras,
        wicketInfo
      });
      
      console.log('Score update successful');
    } catch (error) {
      console.error('Failed to update score:', error);
      console.error('Error details:', error.response?.data);
    }
    console.log('========================================');
  };

  const handleUndo = async () => {
    if (!currentMatch) return;
    
    if (currentMatch.status === 'completed') {
      toast.error('Match has ended. Cannot undo.');
      return;
    }
    
    try {
      await undoLastBall(currentMatch.matchId);
    } catch (error) {
      console.error('Failed to undo:', error);
    }
  };

  const handleEndMatch = async () => {
    if (!currentMatch) return;
    
    if (currentMatch.status === 'completed') {
      toast.error('Match has already ended!');
      return;
    }
    
    if (window.confirm('Are you sure you want to end this match? This action cannot be undone.')) {
      try {
        await endMatch({ matchId: currentMatch.matchId });
        toast.success('Match ended successfully!');
        clearCurrentMatch();
      } catch (error) {
        console.error('Failed to end match:', error);
      }
    }
  };


  const handleEndInning = async () => {
    if (!currentMatch) {
      toast.error('No active match found');
      return;
    }
    
    if (currentMatch.currentInnings !== 1) {
      toast.error('Cannot end inning. Already in second inning.');
      return;
    }
    
    if (currentMatch.status !== 'live') {
      toast.error('Match is not live');
      return;
    }
    
    const firstInning = currentMatch.innings?.[0];
    if (!firstInning || firstInning.balls === 0) {
      toast.error('First inning has not started yet');
      return;
    }
    
    if (window.confirm(`Are you sure you want to end the first inning and start the second inning?\n\nCurrent Score: ${firstInning.runs}/${firstInning.wickets} (${Math.floor(firstInning.balls / 6)}.${firstInning.balls % 6})`)) {
      setIsEndingInning(true);
      try {
        const response = await api.post(`/score/${currentMatch.matchId}/end-inning`);
        
       
        setCurrentMatch(response.data.match);
        
       
        toast.success(`First inning ended! Target: ${response.data.target} runs`);
        
       
        setViewingInnings(2);
        
        
        if (socket) {
          socket.emit('end_inning_manual', { matchId: currentMatch.matchId });
        }
        
      } catch (error) {
        console.error('Failed to end inning:', error);
        toast.error(error.response?.data?.message || 'Failed to end inning');
      } finally {
        setIsEndingInning(false);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(matchUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = async () => {
    if (!currentMatch) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Live Cricket Match',
          text: `Watch ${currentMatch.teamA.name} vs ${currentMatch.teamB.name} live!`,
          url: matchUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        setShowShare(true);
      }
    } else {
      setShowShare(true);
    }
  };

  const handleStartNewMatch = () => {
    if (currentMatch) {
      leaveMatchRoom(currentMatch.matchId);
      clearCurrentMatch();
    }
    toast.success('Ready to start a new match!');
  };

  const handleChangeBatsman = (role) => {
    setSelectorType('batsman');
    setSelectorRole(role);
    setShowPlayerSelector(true);
  };

  const handleChangeBowler = () => {
    setSelectorType('bowler');
    setShowPlayerSelector(true);
  };

  const handlePlayerSelect = async (playerName, type, role) => {
    if (!currentMatch) return;
    
    try {
      if (type === 'batsman') {
        await changeBatsman(currentMatch.matchId, playerName, role);
        toast.success(`${role === 'striker' ? 'Striker' : 'Non-striker'} changed to ${playerName}`);
      } else {
        await changeBowler(currentMatch.matchId, playerName);
        toast.success(`Bowler changed to ${playerName}`);
      }
    } catch (error) {
      console.error('Failed to change player:', error);
      toast.error(error.response?.data?.message || 'Failed to change player');
    }
  };

  const setCurrentMatch = (matchData) => {
    
    if (typeof updateMatch === 'function') {
      updateMatch(matchData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const showMatchSetup = !currentMatch || currentMatch?.status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FaBaseballBall className="text-4xl text-cricket-green mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Scorer Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome, {user?.username}
              </p>
            </div>
          </div>
          
          {currentMatch && currentMatch.status === 'live' && (
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="bg-cricket-blue hover:bg-cricket-darkBlue text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaShare className="mr-2" /> Share Match
              </button>
              
              {/* Manual Inning End Button - Only show in inning 1 */}
              {currentMatch.currentInnings === 1 && (
                <button
                  onClick={handleEndInning}
                  disabled={isEndingInning}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  <FaFlagCheckered className="mr-2" />
                  {isEndingInning ? 'Ending Inning...' : 'End Inning 1'}
                </button>
              )}
              
              <button
                onClick={handleUndo}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaUndo className="mr-2" /> Undo
              </button>
              
              <button
                onClick={handleEndMatch}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaStop className="mr-2" /> End Match
              </button>
            </div>
          )}
          
          {currentMatch?.status === 'completed' && (
            <button
              onClick={handleStartNewMatch}
              className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-6 py-3 rounded-lg flex items-center text-lg font-semibold"
            >
              <FaPlus className="mr-2" /> Start New Match
            </button>
          )}
        </div>

        {/* Share Modal */}
        {showShare && currentMatch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShare(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share Live Match
              </h3>
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode value={matchUrl} size={200} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  Scan QR code or copy link to share
                </p>
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={matchUrl}
                    readOnly
                    className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaCopy className="mr-2" /> Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Player Selector Modal */}
        {showPlayerSelector && currentMatch && (
          <PlayerSelector
            match={currentMatch}
            type={selectorType}
            role={selectorRole}
            onSelect={handlePlayerSelect}
            onClose={() => setShowPlayerSelector(false)}
          />
        )}

        {showMatchSetup ? (
          <MatchSetup onCreateMatch={handleCreateMatch} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Score Display */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      currentMatch.status === 'live' 
                        ? 'bg-red-500 text-white animate-pulse-slow' 
                        : currentMatch.status === 'completed'
                        ? 'bg-gray-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {currentMatch.status === 'live' ? '🔴 LIVE' : 
                       currentMatch.status === 'completed' ? '🏁 ENDED' : '⏳ UPCOMING'}
                    </span>
                    
                    {/* Target Display for Second Inning */}
                    {currentMatch.target && currentMatch.currentInnings === 2 && (
                      <div className="mt-2 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded-r">
                        <div className="flex items-center">
                          <FaFlagCheckered className="text-yellow-600 dark:text-yellow-400 mr-2" />
                          <div>
                            <p className="font-bold text-yellow-800 dark:text-yellow-300">
                              Target: {currentMatch.target} runs
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                              {currentMatch.innings[1]?.team || 'Batting team'} needs {currentMatch.target - (currentMatch.innings[1]?.runs || 0)} runs to win
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {currentMatch.teamA.name} vs {currentMatch.teamB.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentMatch.venue} • {currentMatch.matchType}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Viewing Innings {viewingInnings} of {currentMatch.currentInnings}
                      {viewingInnings === currentMatch.currentInnings && currentMatch.status === 'live' && (
                        <span className="ml-2 text-red-500 dark:text-red-400">● Live</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400">Match ID</p>
                    <p className="font-mono font-bold text-cricket-green">{currentMatch.matchId}</p>
                  </div>
                </div>

                {/* Score Card */}
                <ScoreCard 
                  match={currentMatch} 
                  viewingInnings={viewingInnings}
                  onInningsChange={handleInningsChange}
                  onPlayerChange={(type) => {
                    if (type === 'striker') {
                      handleChangeBatsman('striker');
                    } else if (type === 'nonStriker') {
                      handleChangeBatsman('nonStriker');
                    } else if (type === 'bowler') {
                      handleChangeBowler();
                    }
                  }}
                />

                {/* Over Display */}
                <div className="mt-8">
                  <OverDisplay match={currentMatch} viewingInnings={viewingInnings} />
                </div>
              </div>
            </div>

            {/* Right Column - Scoring Controls */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {/* Player Selection Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Player Selection
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleChangeBatsman('striker')}
                      disabled={currentMatch?.status !== 'live'}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                        currentMatch?.status === 'live'
                          ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <FaUser className="text-2xl text-green-600 dark:text-green-400 mb-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">Change Striker</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate w-full text-center">
                        {currentMatch?.innings?.[currentMatch.currentInnings - 1]?.striker || 'Not set'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => handleChangeBatsman('nonStriker')}
                      disabled={currentMatch?.status !== 'live'}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                        currentMatch?.status === 'live'
                          ? 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                          : 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <FaUser className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">Change Non-Striker</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate w-full text-center">
                        {currentMatch?.innings?.[currentMatch.currentInnings - 1]?.nonStriker || 'Not set'}
                      </span>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleChangeBowler}
                    disabled={currentMatch?.status !== 'live'}
                    className={`w-full p-3 rounded-lg flex flex-col items-center justify-center ${
                      currentMatch?.status === 'live'
                        ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <FaUserShield className="text-2xl text-red-600 dark:text-red-400 mb-2" />
                    <span className="font-semibold text-gray-900 dark:text-white">Change Bowler</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate w-full text-center">
                      {currentMatch?.innings?.[currentMatch.currentInnings - 1]?.currentBowler || 'Not set'}
                    </span>
                  </button>
                </div>

                {/* Scoring Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Scoring Controls {!user?.isAdmin && "(Admin Only)"}
                  </h3>
                  {user?.isAdmin ? (
                    <ScoringButtons 
                      onScoreUpdate={handleScoreUpdate} 
                      matchStatus={currentMatch?.status || 'upcoming'}
                      currentMatch={currentMatch}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-red-500 text-lg font-semibold mb-2">
                        ⚠️ Admin Access Required
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Only admin users can perform scoring actions.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Contact system administrator for admin privileges.
                      </p>
                    </div>
                  )}
                </div>

                {/* Recent Balls */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Balls - Innings {viewingInnings}
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {currentMatch.innings?.[viewingInnings - 1]?.ballsData
                      ?.slice()
                      .reverse()
                      .slice(0, 6) // Show only 6 most recent balls
                      .map((ball, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            ball.isWicket
                              ? 'bg-red-50 dark:bg-red-900/20'
                              : ball.runs > 0
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
                              <FaBaseballBall className="text-sm" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {ball.overNumber}.{ball.ballNumber % 6 || 6}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {ball.batsman || 'Batsman'} vs {ball.bowler || 'Bowler'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              ball.isWicket
                                ? 'text-red-600 dark:text-red-400'
                                : ball.runs > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {ball.isWicket ? 'W' : ball.runs}
                              {ball.extras && (ball.extras.wide > 0 || ball.extras.noBall > 0 || ball.extras.bye > 0 || ball.extras.legBye > 0) && 
                                `+${(ball.extras.wide || 0) + (ball.extras.noBall || 0) + (ball.extras.bye || 0) + (ball.extras.legBye || 0)}`
                              }
                            </p>
                            {ball.isWicket && (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {ball.wicketType || 'Wicket'}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    {(!currentMatch.innings?.[viewingInnings - 1]?.ballsData?.length || 
                     currentMatch.innings[viewingInnings - 1].ballsData.length === 0) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No balls bowled in this innings yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScorerPanel;