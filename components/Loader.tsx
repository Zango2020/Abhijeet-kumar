
import React from 'react';
import { motion } from 'framer-motion';
import { NetworkIcon, SparkleIcon } from './Icons';

export const Loader: React.FC = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-6"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Animated 5G signal rings */}
    <div className="relative w-24 h-24">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Center icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <NetworkIcon className="w-12 h-12 text-cyan-400" />
      </motion.div>
    </div>

    {/* Loading text with typewriter effect */}
    <div className="text-center">
      <motion.div
        className="flex items-center justify-center space-x-2 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <SparkleIcon className="w-5 h-5 text-purple-400" />
        </motion.div>
        <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Generating Content
        </span>
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <SparkleIcon className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </motion.div>

      {/* Animated dots */}
      <div className="flex items-center justify-center space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-cyan-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <motion.p
        className="text-sm text-gray-500 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Powered by Gemini AI
      </motion.p>
    </div>

    {/* Progress bar */}
    <motion.div
      className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full"
        style={{ backgroundSize: '200% 100%' }}
        animate={{
          x: ['-100%', '100%'],
          backgroundPosition: ['0% 0%', '100% 0%'],
        }}
        transition={{
          x: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
        }}
      />
    </motion.div>
  </motion.div>
);
