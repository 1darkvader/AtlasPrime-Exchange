'use client';

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebSocketStatusProps {
  connected: boolean;
  reconnecting?: boolean;
  error?: string | null;
  className?: string;
}

export default function WebSocketStatus({
  connected,
  reconnecting = false,
  error = null,
  className = '',
}: WebSocketStatusProps) {
  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (reconnecting) return 'text-yellow-500';
    if (connected) return 'text-green-500';
    return 'text-gray-500';
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (reconnecting) return 'Reconnecting...';
    if (connected) return 'Live';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (reconnecting) {
      return <RefreshCw size={14} className="animate-spin" />;
    }
    if (connected) {
      return <Wifi size={14} />;
    }
    return <WifiOff size={14} />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={connected ? 'connected' : 'disconnected'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            connected
              ? 'bg-green-500/10 border-green-500/30'
              : reconnecting
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className={getStatusColor()}>{getStatusIcon()}</div>

          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>

            {connected && (
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{
                  opacity: [1, 0.4, 1],
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-red-400 max-w-xs truncate"
          title={error}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
