import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ toasts, removeToast }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };
  
  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex items-center w-full max-w-sm p-4 rounded-xl shadow-lg border ${getBgColor(toast.type)}`}
          >
            <div className="flex-shrink-0 mr-3">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {toast.message}
              </p>
              {toast.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimesCircle />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);
  
  const addToast = (message, type = 'info', duration = 3000, description = '') => {
    const id = Date.now().toString();
    const newToast = { id, message, type, description };
    
    setToasts(prev => [...prev, newToast]);
    
   
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const success = (message, description = '', duration = 3000) => {
    return addToast(message, 'success', duration, description);
  };
  
  const error = (message, description = '', duration = 4000) => {
    return addToast(message, 'error', duration, description);
  };
  
  const warning = (message, description = '', duration = 3000) => {
    return addToast(message, 'warning', duration, description);
  };
  
  const info = (message, description = '', duration = 3000) => {
    return addToast(message, 'info', duration, description);
  };
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

export default Toast;