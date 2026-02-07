import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  preventScroll = true,
  className = ''
}) => {
  
  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);
  
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : null}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full ${sizes[size]} ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                {title && (
                  <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                      </h3>
                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Close"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Body */}
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  {children}
                </div>
                
                {/* Footer */}
                {footer && (
                  <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};


export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  const types = {
    warning: {
      icon: '⚠️',
      confirmColor: 'bg-yellow-500 hover:bg-yellow-600',
    },
    danger: {
      icon: '🗑️',
      confirmColor: 'bg-red-500 hover:bg-red-600',
    },
    success: {
      icon: '✅',
      confirmColor: 'bg-green-500 hover:bg-green-600',
    },
    info: {
      icon: 'ℹ️',
      confirmColor: 'bg-blue-500 hover:bg-blue-600',
    }
  };
  
  const { icon, confirmColor } = types[type];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg font-medium ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <p className="text-gray-700 dark:text-gray-300">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default Modal;