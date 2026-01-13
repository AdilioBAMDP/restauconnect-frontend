import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';
import Header from '@/components/layout/Header';
import { ArrowLeft } from 'lucide-react';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import { logger } from '@/utils/logger';

interface TestAccount {
  email: string;
  password: string;
  role: string;
}

interface ApiConnectionTestProps {
  onNavigate: (page: string) => void;
}

const ApiConnectionTest: React.FC<ApiConnectionTestProps> = ({ onNavigate }) => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [testAccounts, setTestAccounts] = useState<TestAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<TestAccount | null>(null);
  const { navigateToUserDashboard } = useUserDashboardNavigation();
  
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuthStore();

  // Tester la connexion API au chargement
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        // Vérifier la connexion API
        await authService.verifyToken();
        setApiStatus('connected');

        // Définir le compte super_admin de production
        const productionAdminAccount: TestAccount = {
          email: 'admin@restauconnect.production',
          password: 'AdminProd2025!',
          role: 'super_admin'
        };

        setTestAccounts([productionAdminAccount]);
        setSelectedAccount(productionAdminAccount);
      } catch (error) {
        logger.error('Erreur lors de la connexion à l\'API', error);
        setApiStatus('error');
      }
    };

    testApiConnection();
  }, []);

  // Fonction de test de connexion
  const handleTestLogin = async () => {
    if (!selectedAccount) return;
    
    await login({
      email: selectedAccount.email,
      password: selectedAccount.password
    });
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="api-test" onNavigate={onNavigate} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateToUserDashboard(onNavigate)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </button>
        
        <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🔗 Test de Connexion Frontend ↔ Backend
      </h2>

      {/* Status de l'API */}
      <div className="mb-4 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📡 Status de l'API Backend</h3>
        {apiStatus === 'checking' && (
          <div className="text-blue-600">🔄 Vérification de la connexion...</div>
        )}
        {apiStatus === 'connected' && (
          <div className="text-green-600">✅ API Backend connectée (http://localhost:5000)</div>
        )}
        {apiStatus === 'error' && (
          <div className="text-red-600">❌ Impossible de se connecter à l'API Backend</div>
        )}
      </div>

      {/* Test d'authentification */}
      {apiStatus === 'connected' && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🔐 Test d'Authentification</h3>
          
          {!isAuthenticated ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compte de test:
                </label>
                <select
                  value={selectedAccount?.email || ''}
                  onChange={(e) => {
                    const account = testAccounts.find(acc => acc.email === e.target.value);
                    setSelectedAccount(account || null);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {testAccounts.map((account) => (
                    <option key={account.email} value={account.email}>
                      {account.role.toUpperCase()} - {account.email}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedAccount && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <div><strong>Email:</strong> {selectedAccount.email}</div>
                  <div><strong>Mot de passe:</strong> {selectedAccount.password}</div>
                  <div><strong>Rôle:</strong> {selectedAccount.role}</div>
                </div>
              )}
              
              <button
                onClick={handleTestLogin}
                disabled={isLoading || !selectedAccount}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '🔄 Connexion...' : '🚀 Tester la connexion'}
              </button>
              
              {error && (
                <div className="mt-2 text-red-600 text-sm">
                  ❌ {error}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-green-100 rounded-lg">
                <h4 className="text-green-800 font-semibold">✅ Connexion réussie!</h4>
                <div className="mt-2 text-sm text-green-700">
                  <div><strong>Nom:</strong> {(user as { name?: string })?.name || 'N/A'}</div>
                  <div><strong>Email:</strong> {user?.email}</div>
                  <div><strong>Rôle:</strong> {user?.role}</div>
                  <div><strong>ID:</strong> {user?.id}</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                🚪 Se déconnecter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Instructions</h3>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Vérifiez que le backend est démarré sur le port 5000</li>
          <li>Sélectionnez un compte de test</li>
          <li>Cliquez sur "Tester la connexion"</li>
          <li>Vérifiez que les données utilisateur s'affichent</li>
        </ol>
        
        <div className="mt-3 text-xs text-blue-600">
          💡 Pour démarrer le backend: <code>cd backend && node server-api.js</code>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConnectionTest;
