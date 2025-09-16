import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const sizes = {
  sm: { wrapper: 'w-12 h-7', icon: 'w-4 h-4', knob: 'h-5 w-5', shift: 20 },
  md: { wrapper: 'w-16 h-9', icon: 'w-5 h-5', knob: 'h-7 w-7', shift: 32 },
  lg: { wrapper: 'w-20 h-11', icon: 'w-6 h-6', knob: 'h-9 w-9', shift: 40 },
};

const ThemeToggle = ({ className = '', ariaLabel = 'Alternar tema claro/escuro', size = 'md', knobStyle = {} }) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={ariaLabel}
      className={`relative ${s.wrapper} rounded-full border backdrop-blur-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
        isDark
          ? 'bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 focus:ring-offset-gray-800'
          : 'bg-white/80 border-gray-200 hover:bg-white/90 focus:ring-offset-gray-100'
      } ${className}`}
    >
      <Sun
        className={`absolute left-1 top-1/2 -translate-y-1/2 ${s.icon} transition-colors ${
          isDark ? 'text-gray-400' : 'text-yellow-500'
        }`}
      />
      <Moon
        className={`absolute right-1 top-1/2 -translate-y-1/2 ${s.icon} transition-colors ${
          isDark ? 'text-gray-200' : 'text-gray-400'
        }`}
      />

      <Motion.div
        initial={false}
        animate={{ x: isDark ? s.shift : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`absolute top-1 left-1 ${s.knob} rounded-full shadow-md transition-colors ${
          isDark ? 'bg-gray-600' : 'bg-gray-100'
        }`}
        style={knobStyle}
      />
    </button>
  );
};

export default ThemeToggle;
