import React from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaHistory, FaTrash } from 'react-icons/fa';

const UndoButton = ({ 
  onClick, 
  disabled = false,
  showHistory = false,
  onViewHistory,
  onClearAll,
  hasHistory = false
}) => {
  const [showOptions, setShowOptions] = React.useState(false);

  const handleUndoClick = () => {
    if (showOptions) {
      setShowOptions(false);
    }
    onClick();
  };

  return (
    <div className="relative">
      {/* Main Undo Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUndoClick}
        disabled={disabled}
        className={`
          w-full bg-gradient-to-r from-yellow-500 to-yellow-600 
          hover:from-yellow-600 hover:to-yellow-700 
          text-white py-3 px-4 rounded-xl font-semibold 
          flex items-center justify-center
          transition-all duration-200
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          ${showOptions ? 'rounded-b-none' : ''}
        `}
      >
        <FaUndo className="mr-2" />
        Undo Last Ball
      </motion.button>

      {/* Options Toggle */}
      {hasHistory && (
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
        >
          ▼
        </button>
      )}

      {/* Options Dropdown */}
      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-b-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10"
        >
          <div className="py-2">
            {showHistory && onViewHistory && (
              <button
                onClick={() => {
                  onViewHistory();
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-300"
              >
                <FaHistory className="mr-3 text-blue-500" />
                View Ball History
              </button>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            
            {onClearAll && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all balls? This cannot be undone.')) {
                    onClearAll();
                    setShowOptions(false);
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center text-red-600 dark:text-red-400"
              >
                <FaTrash className="mr-3" />
                Clear All Balls
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Information Tooltip */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {disabled 
            ? 'No balls to undo' 
            : 'Click to remove the last ball scored'}
        </p>
      </div>

      {/* Keyboard Shortcut */}
      <div className="mt-1 text-center">
        <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
          Ctrl+Z
        </kbd>
        <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
          or tap to undo
        </span>
      </div>
    </div>
  );
};


export const UndoButtonWithConfirm = ({ onUndo, disabled, confirmationText }) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleClick = () => {
    if (confirmationText) {
      setShowConfirm(true);
    } else {
      onUndo();
    }
  };

  const handleConfirm = () => {
    onUndo();
    setShowConfirm(false);
  };

  return (
    <>
      <UndoButton 
        onClick={handleClick} 
        disabled={disabled}
      />
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
             <div className="text-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUndo className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Undo Last Ball?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                 {confirmationText || 'Are you sure you want to undo the last ball scored?'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg font-semibold"
              >
                Cancel
               </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
              >
                Yes, Undo
              </button>
            </div>
          </div>
         </div>
      )}
    </>
  );
  };


export const UndoButtonWithHistory = ({ 
  onUndo, 
  disabled, 
  history = [],
  maxHistoryItems = 5 
}) => {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="space-y-4">
      <UndoButton 
        onClick={onUndo} 
        disabled={disabled}
        showHistory={true}
        onViewHistory={() => setShowHistory(!showHistory)}
        hasHistory={history.length > 0}
      />
      
      {showHistory && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <FaHistory className="mr-2 text-blue-500" />
            Recent Balls ({history.length})
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(0, maxHistoryItems).map((ball, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  ball.isWicket
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : ball.runs > 0
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-400 mr-3">
                    {history.length - index}.
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Ball {Math.floor(ball.ballNumber / 6)}.{ball.ballNumber % 6 || 6}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {ball.batsman || 'Batsman'} vs {ball.bowler || 'Bowler'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    ball.isWicket
                      ? 'text-red-600 dark:text-red-400'
                      : ball.runs > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {ball.isWicket ? 'W' : ball.runs}
                    {ball.extras > 0 && `+${ball.extras}`}
                  </p>
                  {ball.isWicket && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {ball.wicketType || 'Wicket'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {history.length > maxHistoryItems && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing last {maxHistoryItems} of {history.length} balls
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UndoButton;