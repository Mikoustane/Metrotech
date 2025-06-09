import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">404</h1>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/">
            <Button 
              variant="primary" 
              size="lg"
              icon={<Home size={18} />}
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;