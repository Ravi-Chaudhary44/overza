
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RunOutModal from './RunOutModal';
import { useAuth } from '../../context/AuthContext';
import { FaFlagCheckered } from 'react-icons/fa';

const ScoringButtons = ({ onScoreUpdate, matchStatus = 'live', currentMatch, onEndInning }) => {
  const { user } = useAuth();
  const [isMatchEnded, setIsMatchEnded] = useState(false);
  const [showRunOutModal, setShowRunOutModal] = useState(false);
  const [showExtraRunsModal, setShowExtraRunsModal] = useState(false);
  const [selectedExtraType, setSelectedExtraType] = useState(null);
  const [extraRunsInput, setExtraRunsInput] = useState(0);
  
 
  useEffect(() => {
    setIsMatchEnded(matchStatus === 'completed');
  }, [matchStatus]);
  

  const isDisabled = isMatchEnded || (user && !user.isAdmin);
  
  const scoreButtons = [
    { value: 0, label: 'Dot Ball', color: 'bg-gray-600 hover:bg-gray-700' },
    { value: 1, label: '1 Run', color: 'bg-blue-600 hover:bg-blue-700' },
    { value: 2, label: '2 Runs', color: 'bg-green-600 hover:bg-green-700' },
    { value: 3, label: '3 Runs', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { value: 4, label: 'FOUR', color: 'bg-purple-600 hover:bg-purple-700' },
    { value: 6, label: 'SIX', color: 'bg-orange-600 hover:bg-orange-700' },
  ];

  const wicketButtons = [
    { type: 'bowled', label: 'Bowled', color: 'bg-red-600 hover:bg-red-700' },
    { type: 'caught', label: 'Caught', color: 'bg-red-600 hover:bg-red-700' },
    { type: 'lbw', label: 'LBW', color: 'bg-red-600 hover:bg-red-700' },
    { type: 'runout', label: 'Run Out', color: 'bg-red-600 hover:bg-red-700' },
    { type: 'stumped', label: 'Stumped', color: 'bg-red-600 hover:bg-red-700' },
  ];

  const extraButtons = [
    { type: 'wide', label: 'Wide', color: 'bg-pink-600 hover:bg-pink-700' },
    { type: 'noBall', label: 'No Ball', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { type: 'bye', label: 'Bye', color: 'bg-teal-600 hover:bg-teal-700' },
    { type: 'legBye', label: 'Leg Bye', color: 'bg-cyan-600 hover:bg-cyan-700' },
  ];

  const handleWicket = (type) => {
    if (isDisabled) {
      console.log('Match ended or not admin - Wicket button disabled');
      return;
    }
    
    console.log('========== WICKET BUTTON CLICKED ==========');
    console.log('Wicket Type:', type);
    console.log('Match Status:', matchStatus);
    
  
    if (type === 'runout') {
      setShowRunOutModal(true);
      return;
    }
    

    console.log('Normal wicket - calling onScoreUpdate with:', {
      runs: 0,
      isWicket: true,
      wicketType: type,
      extras: {}
    });
    onScoreUpdate(0, true, type, {});
    console.log('==========================================');
  };

  const handleExtra = (type) => {
    if (isDisabled) {
      console.log('Match ended or not admin - Extra button disabled');
      return;
    }
    
    
    setSelectedExtraType(type);
    setExtraRunsInput(0);
    setShowExtraRunsModal(true);
  };

  const handleExtraWithRuns = (type, additionalRuns) => {
    if (isDisabled) {
      console.log('Match ended or not admin - Extra button disabled');
      setShowExtraRunsModal(false);
      return;
    }
    
    const extras = {};
    let totalRuns = 0;
    
    console.log('========== EXTRA WITH RUNS ==========');
    console.log('Extra Type:', type);
    console.log('Additional Runs:', additionalRuns);
    
    switch (type) {
      case 'wide':
       
        extras.wide = 1 + additionalRuns;
        totalRuns = 0; 
        console.log('Wide: Total extra runs =', extras.wide);
        break;
        
      case 'noBall':
        
        extras.noBall = 1;
        totalRuns = additionalRuns; 
        console.log('No Ball: Extra 1 run +', totalRuns, 'runs off bat');
        break;
        
      case 'bye':
        
        extras.bye = additionalRuns;
        totalRuns = 0;
        console.log('Bye:', additionalRuns, 'runs');
        break;
        
      case 'legBye':
       
        extras.legBye = additionalRuns;
        totalRuns = 0;
        console.log('Leg Bye:', additionalRuns, 'runs');
        break;
        
      default:
        console.warn(`Unknown extra type: ${type}`);
        break;
    }
    
    console.log('Calling onScoreUpdate with:', {
      runs: totalRuns,
      isWicket: false,
      wicketType: null,
      extras: extras
    });
    
    onScoreUpdate(totalRuns, false, null, extras);
    
    
    setShowExtraRunsModal(false);
    setSelectedExtraType(null);
    setExtraRunsInput(0);
    console.log('==========================================');
  };

  const handleRunOutSubmit = (runOutDetails) => {
    if (isDisabled) {
      console.log('Match ended or not admin - Run Out submission disabled');
      setShowRunOutModal(false);
      return;
    }
    
    console.log('========== RUN OUT MODAL SUBMITTED ==========');
    console.log('Run Out Details:', runOutDetails);
    
   
    const wicketInfo = {
      playerOut: runOutDetails.playerOut,
      runsCompleted: runOutDetails.runsCompleted,
      fielders: runOutDetails.fielder ? [runOutDetails.fielder] : []
    };
    
    console.log('Calling onScoreUpdate with:', {
      runs: 0,
      isWicket: true,
      wicketType: 'runout',
      extras: {},
      wicketInfo: wicketInfo
    });
    
    onScoreUpdate(
      0,
      true,
      'runout',
      {},
      wicketInfo
    );
    
    setShowRunOutModal(false);
    console.log('==========================================');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Match Ended or Non-Admin Warning */}
        {(isMatchEnded || (user && !user.isAdmin)) && (
          <div className={`border-l-4 p-4 mb-4 rounded ${
            isMatchEnded 
              ? 'bg-red-100 border-red-500 text-red-700' 
              : 'bg-yellow-100 border-yellow-500 text-yellow-700'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">
                  {isMatchEnded 
                    ? 'Match Ended - Scoring Disabled' 
                    : 'Admin Access Required - Scoring Disabled'}
                </p>
                <p className="text-sm mt-1">
                  {isMatchEnded 
                    ? 'This match has been completed. No further scoring is allowed.'
                    : 'Only administrators can update the score. Please contact an admin if you need to make changes.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inning Info Display */}
        {currentMatch?.currentInnings === 2 && currentMatch?.target && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
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

        {/* Runs Scoring */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Runs</h4>
          <div className="grid grid-cols-3 gap-3">
            {scoreButtons.map((button) => (
              <motion.button
                key={button.value}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => !isDisabled && onScoreUpdate(button.value)}
                disabled={isDisabled}
                className={`${button.color} text-white font-bold py-4 px-2 rounded-lg text-lg transition-colors duration-200 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {button.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Wickets */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Wickets</h4>
          <div className="grid grid-cols-2 gap-3">
            {wicketButtons.map((button) => (
              <motion.button
                key={button.type}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => !isDisabled && handleWicket(button.type)}
                disabled={isDisabled}
                className={`${button.color} text-white font-bold py-3 px-2 rounded-lg transition-colors duration-200 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {button.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Extras</h4>
          <div className="grid grid-cols-2 gap-3">
            {extraButtons.map((button) => (
              <motion.button
                key={button.type}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => !isDisabled && handleExtra(button.type)}
                disabled={isDisabled}
                className={`${button.color} text-white font-bold py-3 px-2 rounded-lg transition-colors duration-200 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {button.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Extra Runs Modal */}
      {showExtraRunsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Enter Additional Runs for {selectedExtraType === 'wide' ? 'Wide' : 
                selectedExtraType === 'noBall' ? 'No Ball' : 
                selectedExtraType === 'bye' ? 'Bye' : 'Leg Bye'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedExtraType === 'wide' ? 
                "Base 1 run + additional runs (0-6)" :
              selectedExtraType === 'noBall' ? 
                "Base 1 run + runs scored off bat (0-6)" :
              "Runs taken (0-6)"}
            </p>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
                <button
                  key={runs}
                  onClick={() => setExtraRunsInput(runs)}
                  className={`py-3 rounded-lg font-bold ${
                    extraRunsInput === runs
                      ? 'bg-cricket-green text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {runs}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExtraRunsModal(false);
                  setSelectedExtraType(null);
                  setExtraRunsInput(0);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExtraWithRuns(selectedExtraType, extraRunsInput)}
                className="flex-1 bg-cricket-green hover:bg-cricket-darkGreen text-white py-3 rounded-lg font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Out Modal */}
      <RunOutModal
        isOpen={showRunOutModal}
        onClose={() => setShowRunOutModal(false)}
        onSubmit={handleRunOutSubmit}
        currentStriker={currentMatch?.innings?.[currentMatch.currentInnings - 1]?.striker}
        currentNonStriker={currentMatch?.innings?.[currentMatch.currentInnings - 1]?.nonStriker}
        disabled={isDisabled}
      />
    </>
  );
};

export default ScoringButtons;