import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { apiClient } from '@/services/api';

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

  // Mode : 'login' | 'forgot' | 'forgotSent'
  const [mode, setMode] = useState<'login' | 'forgot' | 'forgotSent'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);

    try {
      await apiClient.post('/auth/forgot-password', { email: forgotEmail });
      setMode('forgotSent');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error 
        || 'Erreur lors de l\'envoi. Veuillez réessayer.';
      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                {mode === 'login' ? <LogIn className="w-4 h-4 text-white" /> : <KeyRound className="w-4 h-4 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Connexion à RestauConnect' : 'Mot de passe oublié'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* ─── Mode Connexion ─── */}
            {mode === 'login' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connectez-vous</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
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
                    {/* Lien mot de passe oublié */}
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setForgotEmail(email); setForgotError(null); }}
                        className="text-sm text-orange-500 hover:text-orange-600 hover:underline focus:outline-none"
                      >
                        Mot de passe oublié ?
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
            )}

            {/* ─── Mode Mot de passe oublié ─── */}
            {mode === 'forgot' && (
              <div>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour à la connexion
                </button>
                <p className="text-sm text-gray-600 mb-4">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="votre@email.fr"
                        required
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      ❌ {forgotError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {forgotLoading ? '🔄 Envoi en cours...' : '📧 Envoyer le lien de réinitialisation'}
                  </button>
                </form>
              </div>
            )}

            {/* ─── Mode Confirmation envoi ─── */}
            {mode === 'forgotSent' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email envoyé !</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Si un compte existe avec l'adresse <strong>{forgotEmail}</strong>, vous recevrez un email avec un lien de réinitialisation (valable 1 heure).
                </p>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setForgotEmail(''); }}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
