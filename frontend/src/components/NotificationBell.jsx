import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { pulseAnimation } from '../utils/animations';

const NotificationBell = ({ count, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <motion.span
          {...pulseAnimation}
          className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
        />
      )}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </motion.button>
  );
};

export default NotificationBell;
