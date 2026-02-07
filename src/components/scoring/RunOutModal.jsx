import React, { useState, useEffect } from 'react';
import { FaTimes, FaRunning, FaUser, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RunOutModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentStriker, 
  currentNonStriker,
  disabled = false 
}) => {
  const [playerOut, setPlayerOut] = useState('striker');
  const [runsCompleted, setRunsCompleted] = useState(0);
  const [fielder, setFielder] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setPlayerOut('striker');
      setRunsCompleted(0);
      setFielder('');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    onSubmit({
      playerOut,
      runsCompleted: parseInt(runsCompleted) || 0,
      fielder: fielder.trim() || null
    });
  };
  
  const handleRunsChange = (value) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 3) {
      setRunsCompleted(num);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaRunning className="text-2xl text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Run Out Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={disabled}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Batsman Out Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Which batsman was run out?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlayerOut('striker')}
                disabled={disabled}
                className={`
                  p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
                  ${playerOut === 'striker' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <FaUser className={`text-2xl mb-2 ${
                  playerOut === 'striker' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span className="font-semibold text-gray-900 dark:text-white">Striker</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate w-full text-center">
                  {currentStriker || 'Not set'}
                </span>
              </button>
              
              <button
                onClick={() => setPlayerOut('nonStriker')}
                disabled={disabled}
                className={`
                  p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
                  ${playerOut === 'nonStriker' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <FaUserFriends className={`text-2xl mb-2 ${
                  playerOut === 'nonStriker' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span className="font-semibold text-gray-900 dark:text-white">Non-Striker</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate w-full text-center">
                  {currentNonStriker || 'Not set'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Runs Completed */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Runs completed before run-out?
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((runs) => (
                <button
                  key={runs}
                  onClick={() => handleRunsChange(runs)}
                  disabled={disabled}
                  className={`
                    h-12 rounded-lg font-bold text-lg flex items-center justify-center
                    transition-all duration-200
                    ${runsCompleted === runs 
                      ? 'ring-2 ring-red-500 ring-offset-2 bg-red-100 dark:bg-red-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {runs}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Number of runs completed before the wicket
            </p>
          </div>
          
          {/* Fielder Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Fielder involved (optional)
            </label>
            <input
              type="text"
              value={fielder}
              onChange={(e) => setFielder(e.target.value)}
              disabled={disabled}
              placeholder="e.g., Deep Point, Wicket Keeper"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          {/* Cricket Rules Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
              Cricket Run-out Rules:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• If striker is out, new batsman faces next ball</li>
              <li>• If non-striker is out, striker remains the same</li>
              <li>• Completed runs count towards team total</li>
              <li>• Completed runs may be credited to batsmen</li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={disabled}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="px-5 py-2.5 rounded-lg font-medium text-white 
              bg-red-500 hover:bg-red-600 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Run Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RunOutModal;