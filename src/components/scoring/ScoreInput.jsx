import React, { useState } from 'react';
import { FaTimes, FaUndo } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ScoreInput = ({ onScoreSubmit, onUndo, match, disabled = false }) => {
  const [selectedRuns, setSelectedRuns] = useState(null);
  const [selectedWicket, setSelectedWicket] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [extraRuns, setExtraRuns] = useState(0);
  const [showExtraRunsModal, setShowExtraRunsModal] = useState(false);
  
  const handleRunSelect = (runs) => {
    setSelectedRuns(runs);
    setSelectedWicket(false);
    setSelectedExtra(null);
    setExtraRuns(0);
  };
  
  const handleWicketSelect = () => {
    setSelectedWicket(true);
    setSelectedRuns(null);
    setSelectedExtra(null);
    setExtraRuns(0);
  };
  
  const handleExtraSelect = (extra) => {
    setSelectedExtra(extra);
    setShowExtraRunsModal(true);
    setSelectedRuns(null);
    setSelectedWicket(false);
  };
  
  const handleSubmit = () => {
    if (selectedRuns !== null || selectedWicket || selectedExtra) {
      const scoreData = {
        runs: selectedRuns || 0,
        isWicket: selectedWicket,
        wicketType: selectedWicket ? 'bowled' : null,
        extras: {}
      };
      
    
      if (selectedExtra) {
        switch (selectedExtra) {
          case 'wide':
           
            scoreData.extras.wide = 1 + extraRuns;
            scoreData.runs = 0;
            break;
          case 'noBall':
         
            scoreData.extras.noBall = 1;
            scoreData.runs = extraRuns; 
            break;
          case 'bye':
            
            scoreData.extras.bye = extraRuns;
            scoreData.runs = 0;
            break;
          case 'legBye':
            
            scoreData.extras.legBye = extraRuns;
            scoreData.runs = 0;
            break;
          default:
            scoreData.extras[selectedExtra] = 1;
            break;
        }
      }
      
      console.log('Submitting score:', scoreData);
      onScoreSubmit(scoreData);
      resetSelection();
    }
  };
  
  const resetSelection = () => {
    setSelectedRuns(null);
    setSelectedWicket(false);
    setSelectedExtra(null);
    setExtraRuns(0);
  };
  
  const runButtons = [
    { value: 0, label: '0', color: 'gray', description: 'Dot ball' },
    { value: 1, label: '1', color: 'blue', description: 'Single' },
    { value: 2, label: '2', color: 'blue', description: 'Double' },
    { value: 3, label: '3', color: 'blue', description: 'Triple' },
    { value: 4, label: '4', color: 'green', description: 'Boundary' },
    { value: 6, label: '6', color: 'green', description: 'Six' }
  ];
  
  const extraButtons = [
    { type: 'wide', label: 'WD', color: 'yellow', description: 'Wide' },
    { type: 'noBall', label: 'NB', color: 'yellow', description: 'No Ball' },
    { type: 'bye', label: 'B', color: 'purple', description: 'Bye' },
    { type: 'legBye', label: 'LB', color: 'purple', description: 'Leg Bye' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Extra Runs Modal */}
      {showExtraRunsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Enter Additional Runs for {selectedExtra === 'wide' ? 'Wide' : 
                selectedExtra === 'noBall' ? 'No Ball' : 
                selectedExtra === 'bye' ? 'Bye' : 'Leg Bye'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedExtra === 'wide' ? 
                "Base 1 run + additional runs (0-6)" :
              selectedExtra === 'noBall' ? 
                "Base 1 run + runs scored off bat (0-6)" :
              "Runs taken (0-6)"}
            </p>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
                <button
                  key={runs}
                  onClick={() => {
                    setExtraRuns(runs);
                    setShowExtraRunsModal(false);
                  }}
                  className={`py-3 rounded-lg font-bold ${
                    extraRuns === runs
                      ? 'bg-cricket-green text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {runs}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setShowExtraRunsModal(false);
                setSelectedExtra(null);
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Selected Action Preview */}
      {(selectedRuns !== null || selectedWicket || selectedExtra) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Selected Action</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedWicket ? 'Wicket' : 
                 selectedExtra ? `${selectedExtra.toUpperCase()} (+${extraRuns} run${extraRuns !== 1 ? 's' : ''})` : 
                 `${selectedRuns} run${selectedRuns !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={resetSelection}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Runs Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Runs</h3>
        <div className="grid grid-cols-3 gap-3">
          {runButtons.map((btn) => (
            <motion.button
              key={btn.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRunSelect(btn.value)}
              disabled={disabled}
              className={`
                h-16 rounded-xl font-bold text-xl flex flex-col items-center justify-center
                transition-all duration-200
                ${selectedRuns === btn.value 
                  ? 'ring-2 ring-offset-2 ring-cricket-green scale-105' 
                  : 'hover:scale-105'
                }
                ${btn.color === 'green' 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : btn.color === 'blue'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span>{btn.label}</span>
              <span className="text-xs mt-1 opacity-75">{btn.description}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Wicket & Extras */}
      <div className="grid grid-cols-2 gap-6">
        {/* Wicket Button */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Wicket</h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWicketSelect}
            disabled={disabled}
            className={`
              w-full h-16 rounded-xl font-bold text-xl flex flex-col items-center justify-center
              transition-all duration-200 hover:scale-105
              ${selectedWicket 
                ? 'ring-2 ring-offset-2 ring-red-500 bg-red-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <FaTimes className="text-2xl" />
            <span className="text-sm mt-1">Wicket</span>
          </motion.button>
        </div>
        
        {/* Extras */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Extras</h3>
          <div className="grid grid-cols-2 gap-2">
            {extraButtons.map((btn) => (
              <motion.button
                key={btn.type}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExtraSelect(btn.type)}
                disabled={disabled}
                className={`
                  h-16 rounded-xl font-bold text-lg flex flex-col items-center justify-center
                  transition-all duration-200
                  ${selectedExtra === btn.type 
                    ? 'ring-2 ring-offset-2 ring-yellow-500 scale-105' 
                    : 'hover:scale-105'
                  }
                  ${btn.color === 'yellow' 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span>{btn.label}</span>
                <span className="text-xs mt-1 opacity-75">{btn.description}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onUndo}
          disabled={disabled}
          className={`
            h-12 rounded-xl font-semibold flex items-center justify-center
            bg-yellow-500 hover:bg-yellow-600 text-white
            transition-colors duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <FaUndo className="mr-2" /> Undo
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={disabled || (selectedRuns === null && !selectedWicket && !selectedExtra)}
          className={`
            h-12 rounded-xl font-semibold flex items-center justify-center
            transition-all duration-200
            ${selectedRuns !== null || selectedWicket || selectedExtra
              ? 'bg-cricket-green hover:bg-cricket-darkGreen text-white hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Submit Ball
        </motion.button>
      </div>
      
      {/* Match Info */}
      {match && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Current Over:</span>
              <span className="font-semibold">
                {Math.floor(match.innings?.[match.currentInnings - 1]?.balls / 6)}.
                {match.innings?.[match.currentInnings - 1]?.balls % 6}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Balls in over:</span>
              <span className="font-semibold">
                {(match.innings?.[match.currentInnings - 1]?.balls % 6) + 1}/6
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreInput;