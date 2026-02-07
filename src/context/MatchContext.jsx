import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSocket } from './SocketContext';
import api from '../utils/api'; 
import toast from 'react-hot-toast';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();

 
  useEffect(() => {
    if (!socket) return;

    socket.on('score_updated', (data) => {
      setCurrentMatch(data.match);
      toast.success('Score updated!', { duration: 1000 });
    });

    socket.on('inning_ended', (data) => {
      setCurrentMatch(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentInnings: data.currentInnings,
          target: data.target,
          status: 'live'
        };
      });
      toast.success(`Inning ended! Target: ${data.target} runs`);
    });

    socket.on('batsman_changed', (data) => {
      
      setCurrentMatch(prev => {
        if (!prev) return prev;
        const newMatch = { ...prev };
        const inning = newMatch.innings[newMatch.currentInnings - 1];
        if (inning) {
          if (data.role === 'striker') {
            inning.striker = data.playerName;
          } else {
            inning.nonStriker = data.playerName;
          }
        }
        return newMatch;
      });
    });

    socket.on('bowler_changed', (data) => {
     
      setCurrentMatch(prev => {
        if (!prev) return prev;
        const newMatch = { ...prev };
        const inning = newMatch.innings[newMatch.currentInnings - 1];
        if (inning) {
          inning.currentBowler = data.playerName;
        }
        return newMatch;
      });
    });

    return () => {
      socket.off('score_updated');
      socket.off('inning_ended');
      socket.off('batsman_changed');
      socket.off('bowler_changed');
    };
  }, [socket]);

  // Join match room
  const joinMatchRoom = (matchId) => {
    if (socket) {
      socket.emit('join_match', matchId);
    }
  };

  // Leave match room
  const leaveMatchRoom = (matchId) => {
    if (socket) {
      socket.emit('leave_match', matchId);
    }
  };

  // Create new match
  const createMatch = async (matchData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/matches/create', matchData);
      
      setCurrentMatch(response.data.match);
      joinMatchRoom(response.data.match.matchId);
      toast.success('Match created successfully!');
      return response.data.match;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create match');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const updateScore = async (scoreData) => {
    try {
      
      if (currentMatch?.status === 'completed') {
        toast.error('Match has ended. No further updates allowed.');
        return;
      }
      
     
      const response = await api.post(`/score/${scoreData.matchId}/update-score`, {
        runs: scoreData.runs || 0,
        isWicket: scoreData.isWicket || false,
        wicketType: scoreData.wicketType || null,
        extras: scoreData.extras || { wide: 0, noBall: 0, bye: 0, legBye: 0 },
        batsman: scoreData.batsman || null,
        bowler: scoreData.bowler || null,
        wicketInfo: scoreData.wicketInfo || {}
      });
      
   
      setCurrentMatch(response.data.match);
      
  
      if (socket) {
        socket.emit('score_update', {
          matchId: scoreData.matchId,
          match: response.data.match
        });
      }
      
      toast.success('Score updated!', { duration: 1000 });
      return response.data.match;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update score');
      throw error;
    }
  };

  // NEW: End inning manually
  const endInning = async (matchId) => {
    try {
      const response = await api.post(`/score/${matchId}/end-inning`);
      
     
      setCurrentMatch(response.data.match);
      
      
      if (socket) {
        socket.emit('end_inning_manual', { matchId });
      }
      
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to end inning');
      throw error;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('match_ended_error', (data) => {
      toast.error(data.message || 'Match has ended. Updates disabled.');
    });

    socket.on('match_ended_notification', (data) => {
      if (currentMatch) {
        setCurrentMatch(prev => ({ ...prev, status: 'completed' }));
      }
      toast.success('Match has ended!');
    });

    return () => {
      socket.off('match_ended_error');
      socket.off('match_ended_notification');
    };
  }, [socket, currentMatch]);

  // Undo last ball
  const undoLastBall = async (matchId) => {
    try {
      const response = await api.post('/matches/undo', { matchId });
      
      if (socket) {
        socket.emit('score_update', {
          matchId,
          match: response.data.match
        });
      }
      
      toast.success('Last ball undone');
      return response.data.match;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to undo');
      throw error;
    }
  };

  // Get match by ID
  const getMatchById = async (matchId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/matches/${matchId}`);
      setCurrentMatch(response.data.match);
      joinMatchRoom(matchId);
      return response.data.match;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load match');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get live matches
  const getLiveMatches = async () => {
    try {
      const response = await api.get('/matches/live');
      setLiveMatches(response.data.matches);
      return response.data.matches;
    } catch (error) {
      console.error('Failed to load live matches:', error);
      return [];
    }
  };

  const endMatch = async (matchData) => {
    try {
      const response = await api.post('/matches/end', matchData);
      
     
      if (currentMatch && currentMatch.matchId === matchData.matchId) {
        setCurrentMatch(null);
      }
      
     
      if (socket) {
        socket.emit('match_ended', {
          matchId: matchData.matchId,
          match: response.data.match
        });
      }
      
      toast.success('Match ended successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to end match');
      throw error;
    }
  };

  const clearCurrentMatch = () => {
    if (currentMatch) {
      leaveMatchRoom(currentMatch.matchId);
    }
    setCurrentMatch(null);
  };

  // Change batsman
  const changeBatsman = async (matchId, playerName, role) => {
    try {
      const response = await api.post(`/score/${matchId}/change-batsman`, {
        playerName,
        role
      });
      
      // Emit socket event
      if (socket) {
        socket.emit('change_batsman', {
          matchId,
          playerName,
          role
        });
      }
      
      setCurrentMatch(response.data.match);
      return response.data.match;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change batsman');
      throw error;
    }
  };

  // Change bowler
  const changeBowler = async (matchId, playerName) => {
    try {
      const response = await api.post(`/score/${matchId}/change-bowler`, {
        playerName
      });
      
      // Emit socket event
      if (socket) {
        socket.emit('change_bowler', {
          matchId,
          playerName
        });
      }
      
      setCurrentMatch(response.data.match);
      return response.data.match;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change bowler');
      throw error;
    }
  };

  const value = {
    currentMatch,
    liveMatches,
    isLoading,
    createMatch,
    updateScore,
    undoLastBall,
    getMatchById,
    getLiveMatches,
    joinMatchRoom,
    endMatch,
    leaveMatchRoom,
    clearCurrentMatch,
    changeBatsman,
    changeBowler,
    endInning  
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};