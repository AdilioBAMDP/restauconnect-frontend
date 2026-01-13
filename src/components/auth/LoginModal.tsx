import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';

interface TestAccount {
  role: string;
  label: string;
  email: string;
  password: string;
  description: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Rate limiter pour éviter l'erreur 429
const rateLimiter = {
  lastRequest: 0,
  minDelay: 500, // Délai minimum entre les requêtes (500ms)
  
  async wait() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minDelay) {
      const waitTime = this.minDelay - timeSinceLastRequest;
      console.log(`⏳ Rate limiter: attente de ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequest = Date.now();
  }
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const isRequestInProgress = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Empêcher les requêtes multiples simultanées
    if (isRequestInProgress.current) {
      console.log('⚠️ Une requête est déjà en cours');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    isRequestInProgress.current = true;
    
    try {
      // Attendre le rate limiter
      await rateLimiter.wait();
      
      console.log('🔐 Tentative de connexion:', email);
      await login(email, password);
      console.log('✅ Connexion réussie');
      setEmail('');
      setPassword('');
      // ⏱️ Attendre que React mette à jour isAuthenticated avant de fermer
      setTimeout(() => {
        console.log('🚪 Fermeture du modal de connexion');
        onClose();
      }, 300);
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  };

  const handleQuickLogin = async (testAccount: TestAccount) => {
    // Empêcher les requêtes multiples simultanées
    if (isRequestInProgress.current) {
      console.log('⚠️ Une requête est déjà en cours');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    isRequestInProgress.current = true;
    
    try {
      // Attendre le rate limiter
      await rateLimiter.wait();
      
      console.log('🔐 Connexion rapide:', testAccount.role);
      await login(testAccount.email, testAccount.password);
      console.log('✅ Connexion réussie');
      // ⏱️ Attendre que React mette à jour isAuthenticated avant de fermer
      setTimeout(() => {
        console.log('🚪 Fermeture du modal de connexion');
        onClose();
      }, 300);
    } catch (err) {
      console.error('❌ Erreur de connexion rapide:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  };

  // Comptes de test essentiels uniquement
  const testAccounts = [
    { 
      role: 'restaurant', 
      label: '🍽️ Restaurant', 
      email: 'restaurant1@restauconnect.com', 
      password: 'password123',
      description: 'Tableau de bord restaurant'
    },
    { 
      role: 'driver', 
      label: '🚗 Livreur', 
      email: 'driver1@test.fr', 
      password: 'password123',
      description: 'Application livreur'
    },
    { 
      role: 'artisan', 
      label: '👨‍🍳 Artisan', 
      email: 'artisan@test.fr', 
      password: 'password123',
      description: 'Compte artisan'
    },
    { 
      role: 'supplier', 
      label: '📦 Fournisseur', 
      email: 'fournisseur@test.fr', 
      password: 'password123',
      description: 'Compte fournisseur'
    },
    { 
      role: 'candidat', 
      label: '👤 Candidat', 
      email: 'candidat@test.fr', 
      password: 'password123',
      description: 'Compte candidat'
    },
    { 
      role: 'community_manager', 
      label: '📱 Community Manager', 
      email: 'community_manager@test.fr', 
      password: 'password123',
      description: 'Gestion réseaux sociaux'
    },
    { 
      role: 'banker', 
      label: '🏦 Banquier', 
      email: 'banquier@test.fr', 
      password: 'password123',
      description: 'Services bancaires'
    },
    { 
      role: 'investor', 
      label: '💼 Investisseur', 
      email: 'investisseur@test.fr', 
      password: 'password123',
      description: 'Gestion investissements'
    },
    { 
      role: 'accountant', 
      label: '📊 Comptable', 
      email: 'comptable@test.fr', 
      password: 'password123',
      description: 'Gestion comptabilité'
    },
    { 
      role: 'carrier', 
      label: '🚚 Transporteur', 
      email: 'transporteur@test.fr', 
      password: 'password123',
      description: 'Gestion transport'
    },
    { 
      role: 'super_admin', 
      label: '⚙️ Admin', 
      email: 'super_admin@test.fr', 
      password: 'password123',
      description: 'Administration système'
    },
    { 
      role: 'driver', 
      label: '🏍️ Livreur 2', 
      email: 'livreur@test.fr', 
      password: 'password123',
      description: 'Compte livreur alternatif'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <LogIn className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connexion à RestauConnect</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Formulaire de connexion classique */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connexion manuelle</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="votre@email.fr"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Votre mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      ❌ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? '🔄 Connexion...' : '🚀 Se connecter'}
                  </button>
                </form>
              </div>

              {/* Connexions rapides */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connexion rapide - Comptes de test
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cliquez sur un compte pour vous connecter instantanément
                </p>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testAccounts.map((account) => (
                    <button
                      key={account.role + '-' + account.email}
                      onClick={() => handleQuickLogin(account)}
                      disabled={isLoading}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{account.label.split(' ')[0]}</div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-orange-600">
                              {account.label}
                            </div>
                            <div className="text-sm text-gray-500">
                              {account.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 font-mono">
                            {account.email}
                          </div>
                          <div className="text-xs text-gray-300 font-mono">
                            {account.password}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p className="mb-2">
                  🧪 <strong>Mode Test :</strong> Ces comptes sont disponibles pour tester toutes les fonctionnalités
                </p>
                <p>
                  💡 Chaque rôle a accès à son tableau de bord spécialisé avec des permissions adaptées
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
