import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface SuccessNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  duration?: number;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isOpen,
  onClose,
  message,
  duration = 3000
}) => {
  const [progress, setProgress] = React.useState(100);

  useEffect(() => {
    if (isOpen) {
      setProgress(100);

      // Auto-close timer
      const closeTimer = setTimeout(() => {
        onClose();
      }, duration);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(closeTimer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white rounded-lg shadow-xl border border-green-200 overflow-hidden pointer-events-auto max-w-sm"
          >
            <div className="p-4 flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-green-600"
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessNotification;
