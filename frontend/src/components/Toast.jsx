import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose }) => {
  const typeClasses = {
    success: 'bg-green-900/20 border-green-700 text-green-400',
    error: 'bg-red-900/20 border-red-700 text-red-400',
    info: 'bg-blue-900/20 border-blue-700 text-blue-400',
    warning: 'bg-yellow-900/20 border-yellow-700 text-yellow-400',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${typeClasses[type]} z-50`}
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
