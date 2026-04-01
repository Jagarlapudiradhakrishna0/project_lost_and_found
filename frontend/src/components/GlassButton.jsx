import React from 'react';
import { motion } from 'framer-motion';

const GlassButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ...props
}) => {
  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30',
    secondary: 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    ghost: 'text-white hover:bg-slate-700/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`
        ${sizes[size]}
        ${variants[variant]}
        font-semibold rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        backdrop-blur-md
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default GlassButton;
