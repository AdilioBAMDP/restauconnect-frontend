import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import Header from '@/components/Header';
import { useAppStore } from '@/stores/appStore';
import { roleUtils } from '@/utils/roleUtils';
import { PageName } from '@/services/NavigationManager';

// Import des composants admin
import AdminUserManagement from './AdminUserManagement';
import AdminAnalytics from './AdminAnalytics';
import AdminSystemConfig from './AdminSystemConfig';
import AdminStats from './AdminStats';

const AdminDashboardComplete: React.FC = () => {
  const { user } = useAuth();
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'analytics' | 'system'>('dashboard');
  
  // Protection : Seuls les super_admin peuvent accéder
  if (!user || !roleUtils.isSuperAdmin(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-4">Cette page est réservée aux super administrateurs.</p>
          <p className="text-sm text-gray-500 mb-4">
            Rôle actuel: {user?.role || 'Non connecté'}
          </p>
          <button 
            onClick={() => navigateTo('home')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { key: 'users', label: 'Utilisateurs', icon: '👥' },
    { key: 'analytics', label: 'Analytics', icon: '📈' },
    { key: 'system', label: 'Système', icon: '⚙️' }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUserManagement />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'system':
        return <AdminSystemConfig />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="admin" onNavigate={navigateToString} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de l'admin */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration RestauConnect</h1>
                <p className="text-gray-600 mt-1">
                  Connecté en tant que {user?.name || 'Super Admin'} • {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Système opérationnel
                </div>
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardComplete;
