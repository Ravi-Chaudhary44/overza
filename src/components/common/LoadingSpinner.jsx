import React from 'react';
import { motion } from 'framer-motion';
import { FaBaseballBall } from 'react-icons/fa';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'cricket-green',
  fullScreen = false,
  text = 'Loading...',
  showText = true,
  className = ''
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const colors = {
    'cricket-green': 'border-cricket-green',
    'cricket-blue': 'border-cricket-blue',
    white: 'border-white',
    gray: 'border-gray-400'
  };
  
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full`}
        />
        {size === 'lg' || size === 'xl' ? (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FaBaseballBall className={`${size === 'lg' ? 'text-lg' : 'text-xl'} text-${color}`} />
          </motion.div>
        ) : null}
      </div>
      {showText && text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 font-medium ${
            color === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};


export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <LoadingSpinner size="xl" text="Loading Overza..." showText={true} />
  </div>
);


export const InlineLoader = ({ text }) => (
  <LoadingSpinner size="sm" text={text} />
);


export const ContentLoader = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
  </div>
);

export default LoadingSpinner;