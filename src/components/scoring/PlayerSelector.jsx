import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaUserCheck, FaBaseballBall } from 'react-icons/fa';

const PlayerSelector = ({ 
  match, 
  onSelect, 
  onClose, 
  type = 'batsman',
  role = 'striker' 
}) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (!match) return;
    
    const inning = match.innings[match.currentInnings - 1];
    if (!inning) return;
    
    if (type === 'batsman') {
      const availablePlayers = inning.battingLineup
        .filter(player => 
          player.status === 'yet_to_bat' || 
          player.status === 'batting'
        )
        .map(player => ({
          name: player.playerName,
          runs: player.runs,
          balls: player.ballsFaced,
          status: player.status,
          isCurrent: role === 'striker' 
            ? player.playerName === inning.striker
            : player.playerName === inning.nonStriker
        }));
      
      setPlayers(availablePlayers);
      setSelectedPlayer(
        role === 'striker' ? inning.striker : inning.nonStriker
      );
    } else {
      const availablePlayers = inning.bowlingLineup.map(player => ({
        name: player.playerName,
        wickets: player.wickets,
        runsConceded: player.runsConceded,
        overs: Math.floor(player.ballsBowled / 6) + '.' + (player.ballsBowled % 6),
        isCurrent: player.playerName === inning.currentBowler
      }));
      
      setPlayers(availablePlayers);
      setSelectedPlayer(inning.currentBowler);
    }
  }, [match, type, role]);

  const handleSelect = (playerName) => {
    if (onSelect) {
      onSelect(playerName, type, role);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {type === 'batsman' ? (
                <FaUser className="text-2xl text-cricket-green mr-3" />
              ) : (
                <FaBaseballBall className="text-2xl text-cricket-blue mr-3" />
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {type === 'batsman' 
                  ? `Select ${role === 'striker' ? 'Striker' : 'Non-Striker'}`
                  : 'Select Bowler'
                }
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            {players.map((player) => (
              <motion.div
                key={player.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(player.name)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlayer === player.name
                    ? 'border-cricket-green bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-cricket-green'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      player.isCurrent 
                        ? 'bg-cricket-green text-white' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {player.isCurrent ? (
                        <FaUserCheck />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {player.name}
                        {player.isCurrent && (
                          <span className="ml-2 text-xs bg-cricket-green text-white px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </h4>
                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {type === 'batsman' ? (
                          <>
                            <span>{player.runs} runs</span>
                            <span>{player.balls} balls</span>
                            <span>SR: {player.runs > 0 ? ((player.runs / player.balls) * 100).toFixed(0) : 0}</span>
                          </>
                        ) : (
                          <>
                            <span>{player.wickets} wkts</span>
                            <span>{player.runsConceded} runs</span>
                            <span>{player.overs} ov</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {players.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No players available
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:border-gray-400 dark:hover:border-gray-500"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PlayerSelector;