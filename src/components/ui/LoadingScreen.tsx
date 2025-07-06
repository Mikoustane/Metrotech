import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
  variant?: 'splash' | 'component' | 'minimal';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Chargement...", 
  showLogo = true,
  variant = 'splash'
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-blue-500" size={20} />
          <span className="text-white text-sm">{message}</span>
        </div>
      </div>
    );
  }

  if (variant === 'component') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="text-gray-400 text-sm">{message}</span>
        </div>
      </div>
    );
  }

  // Splash screen complet
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showLogo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img 
              src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
              alt="METROTECH Logo" 
              className="h-16 w-auto"
            />
          </motion.div>
        )}
        
        <div className="relative mb-6">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-secondary-500/30 border-b-secondary-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-white text-lg font-semibold mb-2">METROTECH</h2>
          <p className="text-gray-400 text-sm">{message}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;