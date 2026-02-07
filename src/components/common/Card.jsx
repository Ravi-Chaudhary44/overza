import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  headerAction,
  className = '',
  hoverable = false,
  padding = 'p-6',
  border = true,
  shadow = 'lg',
  ...props
}) => {
  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  const shadowClass = `shadow-${shadow}`;
  const hoverClass = hoverable ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl ${borderClass} ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="flex items-center">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={padding}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;