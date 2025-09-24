import React from 'react';
import { TrendingUp, TrendingDown, Minus, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue', 
  format = 'number',
  loading = false,
  exporting = false,
  onClick,
  clickable = false
}) => {
  const formatValue = (val) => {
    if (loading) return '...';
    if (!val && val !== 0) return '---';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(Math.round(val));
      case 'percent':
        return `${val.toFixed(1)}%`;
      case 'kwh':
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M kWh`;
        }
        return `${new Intl.NumberFormat('pt-BR').format(Math.round(val))} kWh`;
      default:
        return val;
    }
  };

  const getTrendIcon = () => {
    if (!change || change === 0) return <Minus className="w-4 h-4" />;
    return change > 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const getTrendColor = () => {
    if (!change || change === 0) return 'text-gray-500';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600',
    pink: 'from-pink-400 to-pink-600',
    teal: 'from-teal-400 to-teal-600',
  };

  const handleClick = () => {
    if (clickable && onClick && !loading && !exporting) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-200 relative overflow-visible
        ${clickable ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : 'hover:shadow-xl'}
        ${loading && !exporting ? 'animate-pulse' : ''}
        ${exporting ? 'ring-2 ring-green-500/40 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''}`}
      onClick={handleClick}
    >
      {/* pulsing export indicator (animated) */}
      <AnimatePresence>
        {exporting && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.22 }}
            className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-ping-slow opacity-90 dark:opacity-100"
          />
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} relative`}>
          {loading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Icon className="w-6 h-6 text-white" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {change !== undefined && !exporting && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {formatValue(value)}
      </p>
      
      {/* indicador de exportação posicionado sem afetar layout */}
      <AnimatePresence>
        {exporting && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="absolute top-2 right-3 text-xs text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-md pointer-events-none shadow-sm"
          >
            Gerando Excel...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MetricCard;