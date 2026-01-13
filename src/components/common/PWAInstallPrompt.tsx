import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/components/hooks/usePWA';

interface PWAInstallPromptProps {
  className?: string;
}

/**
 * Composant d'installation PWA
 * Phase 6 - Progressive Web App
 */
const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const {
    canInstall,
    isOffline,
    needsUpdate,
    installApp,
    updateApp,
    clearCache
  } = usePWA();

  const [showPrompt, setShowPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Afficher le prompt d'installation après un délai
  useEffect(() => {
    if (canInstall) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // 3 secondes après le chargement

      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  // Afficher le prompt de mise à jour
  useEffect(() => {
    if (needsUpdate) {
      setShowUpdatePrompt(true);
    }
  }, [needsUpdate]);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();

    if (success) {
      setShowPrompt(false);
    }

    setIsInstalling(false);
  };

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Stocker dans localStorage pour ne plus afficher
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Vérifier si l'utilisateur a déjà refusé
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < oneDay) {
        setShowPrompt(false);
      }
    }
  }, []);

  return (
    <>
      {/* Prompt d'installation */}
      <AnimatePresence>
        {showPrompt && canInstall && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Installer Web Spider
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Accédez à votre plateforme partout, même hors ligne
                  </p>

                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Smartphone className="w-3 h-3" />
                      <span>Mobile</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Monitor className="w-3 h-3" />
                      <span>Desktop</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Installation...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Installer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt de mise à jour */}
      <AnimatePresence>
        {showUpdatePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-green-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mise à jour disponible
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Une nouvelle version de Web Spider est disponible avec des améliorations et corrections.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUpdatePrompt(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Plus tard
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Mettre à jour
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de connexion */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-40"
          >
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2 text-sm font-medium max-w-sm mx-auto">
              <WifiOff className="w-4 h-4" />
              <span>Mode hors ligne - Fonctionnalités limitées</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallPrompt;