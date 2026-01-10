'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EmailConfirmationAlertProps {
  email: string;
  onClose: () => void;
}

export default function EmailConfirmationAlert({ email, onClose }: EmailConfirmationAlertProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse-slow" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-[#2A2A2A] rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-300" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="w-16 h-16 mx-auto mb-6 relative"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 30],
                    y: [0, -30]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full"
                />
              ))}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white text-center mb-3"
            >
              Check Your Inbox!
            </motion.h2>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 mb-6"
            >
              <p className="text-gray-400 text-center leading-relaxed">
                We&apos;ve sent a confirmation email to
              </p>
              <div className="px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
                <p className="text-blue-400 text-center font-medium break-all">
                  {email}
                </p>
              </div>
              <p className="text-gray-400 text-center text-sm leading-relaxed">
                Click the link in the email to verify your account and start using TeiqR.
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 mb-6"
            >
              {[
                { text: 'Check your email inbox', delay: 0.6 },
                { text: 'Click the confirmation link', delay: 0.7 },
                { text: 'Start chatting with TeiqR', delay: 0.8 },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{step.text}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-6"
            >
              <div className="h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </motion.div>

            {/* Action button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              Got it!
            </motion.button>

            {/* Help text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center text-xs text-gray-600 mt-4"
            >
              Didn&apos;t receive the email? Check your spam folder or contact support.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
