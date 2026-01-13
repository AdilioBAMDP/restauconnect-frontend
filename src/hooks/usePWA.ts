import { useState, useEffect } from 'react';

/**
 * Hook pour gérer la Progressive Web App
 * Phase 6 - PWA Implementation
 */

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    updateAvailable: false,
    registration: null
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Vérifier si l'app est déjà installée
  useEffect(() => {
    const checkInstalled = () => {
      // Vérifier si on est en mode standalone (installé)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Ou si on est dans une PWA installée
      const isInWebAppiOS = (window.navigator as any).standalone === true;

      setPwaState(prev => ({
        ...prev,
        isInstalled: isStandalone || isInWebAppiOS
      }));
    };

    checkInstalled();
    window.addEventListener('resize', checkInstalled);

    return () => window.removeEventListener('resize', checkInstalled);
  }, []);

  // Gérer l'événement beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPwaState(prev => ({
        ...prev,
        isInstallable: true
      }));
    };

    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false
      }));
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Gérer l'état de connexion
  useEffect(() => {
    const handleOnline = () => {
      setPwaState(prev => ({
        ...prev,
        isOffline: false
      }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({
        ...prev,
        isOffline: true
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enregistrer le service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré:', registration);

          setPwaState(prev => ({
            ...prev,
            registration
          }));

          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({
                    ...prev,
                    updateAvailable: true
                  }));
                }
              });
            }
          });

          // Écouter les messages du service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, payload } = event.data;

            switch (type) {
              case 'UPDATE_AVAILABLE':
                setPwaState(prev => ({
                  ...prev,
                  updateAvailable: true
                }));
                break;
              default:
                console.log('📨 Message SW:', type, payload);
            }
          });
        })
        .catch((error) => {
          console.error('❌ Erreur Service Worker:', error);
        });
    }
  }, []);

  // Fonction pour installer l'app
  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setPwaState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false
        }));
      }

      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('❌ Erreur installation:', error);
      return false;
    }
  };

  // Fonction pour mettre à jour l'app
  const updateApp = () => {
    if (pwaState.registration?.waiting) {
      pwaState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Fonction pour effacer le cache
  const clearCache = async () => {
    try {
      if (pwaState.registration) {
        pwaState.registration.active?.postMessage({ type: 'CLEAR_CACHE' });
      }

      // Effacer aussi les caches via Cache API
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      console.log('🧹 Cache effacé');
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement cache:', error);
      return false;
    }
  };

  // Fonction pour vérifier la version
  const getVersion = async () => {
    return new Promise((resolve) => {
      if (pwaState.registration?.active) {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };

        pwaState.registration.active.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );
      } else {
        resolve({ version: 'unknown', timestamp: Date.now() });
      }
    });
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
    clearCache,
    getVersion,
    canInstall: pwaState.isInstallable && !pwaState.isInstalled,
    needsUpdate: pwaState.updateAvailable
  };
};

export default usePWA;