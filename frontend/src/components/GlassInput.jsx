import React from 'react';
import { motion } from 'framer-motion';

const GlassInput = ({ label, error, icon: Icon, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
        )}
        <input
          {...props}
          className={`
            w-full
            ${Icon ? 'pl-10' : 'px-4'}
            py-2.5
            bg-slate-800/50
            backdrop-blur-xl
            border ${error ? 'border-red-500' : 'border-slate-700/50'}
            rounded-lg
            text-white
            placeholder-slate-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/50
            focus:border-transparent
            transition-all duration-200
            hover:border-slate-600/50
          `}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </motion.div>
  );
};

export default GlassInput;
