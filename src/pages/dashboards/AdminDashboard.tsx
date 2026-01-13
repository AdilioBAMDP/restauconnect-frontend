
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { Users, DollarSign, Shield, BarChart3, UserCheck, Activity, Server, Lock, FileText } from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import AdminNotifications from '@/components/admin/AdminNotifications';
import AdminExport from '@/components/admin/AdminExport';
import AdminSettings from '@/components/admin/AdminSettings';
import { ApplicationsManagement } from '../admin/ApplicationsManagement';
import { AdminOverview } from '@/components/dashboard/admin/AdminOverview';
import { AdminUsersManagement } from '@/components/dashboard/admin/AdminUsersManagement';
import { AdminRegistrations } from '@/components/dashboard/admin/AdminRegistrations';
import { AdminModeration } from '@/components/dashboard/admin/AdminModeration';
import { AdminTransactions } from '@/components/dashboard/admin/AdminTransactions';
import { AdminAnalytics } from '@/components/dashboard/admin/AdminAnalytics';
import { AdminRevenues } from '@/components/dashboard/admin/AdminRevenues';
import { AdminSystem } from '@/components/dashboard/admin/AdminSystem';
import { AdminSecurity } from '@/components/dashboard/admin/AdminSecurity';
import AdminAuditLog from '@/components/dashboard/admin/AdminAuditLog';

// Types précis pour les données
interface Professional {
  id: string;
  status?: string;
  [key: string]: unknown;
}
interface Offer {
  id: string;
  status?: string;
  [key: string]: unknown;
}
interface Application {
  id: string;
  status?: string;
  [key: string]: unknown;
}
interface Message {
  id: string;
  [key: string]: unknown;
}
interface GlobalStats {
  totalUsers: number;
  usersByRole: Record<string, number>;
  activeUsers?: number;
  pendingRegistrations?: number;
  totalOffers?: number;
  activeOffers?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  [key: string]: unknown;
}
interface PlatformStats {
  totalCommissionsCollected?: number;
  totalFeesCollected?: number;
  monthlyStats?: {
    revenue?: number;
    transactions?: number;
  };
  [key: string]: unknown;
}

interface AdminDashboardProps {
  navigateTo: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigateTo }) => {
  // Lire l'onglet depuis l'URL (stocké par NavigationManager)
  const initialTab = (sessionStorage.getItem('adminActiveTab') as 'overview' | 'users' | 'registrations' | 'applications' | 'transactions' | 'moderation' | 'analytics' | 'revenues' | 'system' | 'security' | 'auditlog') || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'registrations' | 'applications' | 'transactions' | 'moderation' | 'analytics' | 'revenues' | 'system' | 'security' | 'auditlog'>(initialTab);
  
  // Nettoyer sessionStorage APRÈS le premier rendu complet
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('adminActiveTab')) {
        sessionStorage.removeItem('adminActiveTab');
      }
    }, 500); // Attendre 500ms pour s'assurer que le composant est bien monté
    
    return () => clearTimeout(timer);
  }, []);
  const [professionals] = useState<Professional[]>([]);
  const [offers] = useState<Offer[]>([]);
  const [applications] = useState<Application[]>([]);
  const [messages] = useState<Message[]>([]);
  const [globalStats] = useState<GlobalStats>({
    totalUsers: 0,
    usersByRole: {},
    activeUsers: 0,
    pendingRegistrations: 0,
    totalOffers: 0,
    activeOffers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [loadingStats] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [moderationFilter] = useState('');

  // Fonctions fictives minimales pour props nécessaires
  const handleToggleVerification = () => {};
  const handleDeleteUser = () => {};
  const handleViewDetails = () => {};
  const executeTransfer = () => {};
  const getUserTypeIcon = () => '';

  // Charger dynamiquement les paramètres plateforme
  // Fonction de chargement dynamique des stats plateforme
  const fetchPlatformStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setPlatformStats(data);
      }
    } catch {
      // Optionnel: afficher une notification d'erreur
    }
  };
  useEffect(() => {
    fetchPlatformStats();
  }, []);

  function renderActiveTab() {
    switch (activeTab) {
      case 'users':
        return (
          <AdminUsersManagement
            professionals={professionals}
            offers={offers}
            applications={applications}
            messages={messages}
            globalStats={globalStats}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleVerification={handleToggleVerification}
            onDeleteUser={handleDeleteUser}
            onViewDetails={handleViewDetails}
            onCreateUser={() => navigateTo('admin-create-user')}
          />
        );
      case 'registrations':
        return <AdminRegistrations token={localStorage.getItem('auth_token') || localStorage.getItem('token') || ''} />;
      case 'moderation':
        return (
          <AdminModeration
            professionals={professionals}
            globalStats={globalStats}
            onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
            messages={messages}
            offers={offers}
            applications={applications}
            moderationFilter={moderationFilter}
          />
        );
      case 'analytics':
        return <AdminAnalytics />;
      case 'applications':
        return <ApplicationsManagement />;
      case 'transactions':
        return <AdminTransactions globalStats={globalStats} />;
      case 'revenues':
        return (
          <AdminRevenues
            platformStats={platformStats}
            loadingStats={loadingStats}
            transferAmount={transferAmount}
            showTransferModal={showTransferModal}
            newCommissionRate={newCommissionRate}
            onSetTransferAmount={setTransferAmount}
            onSetShowTransferModal={setShowTransferModal}
            onSetNewCommissionRate={setNewCommissionRate}
            onTransferFunds={executeTransfer}
            getUserTypeIcon={getUserTypeIcon}
          />
        );
      case 'system':
        return <AdminSystem globalStats={globalStats} />;
      case 'security':
        return <AdminSecurity globalStats={globalStats} onTabChange={(tab) => setActiveTab(tab as typeof activeTab)} />;
      case 'auditlog':
        return <AdminAuditLog />;
      default:
        return (
          <AdminOverview
            globalStats={globalStats}
            professionals={professionals}
            offers={offers}
            applications={applications}
            onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="admin-dashboard" onNavigate={navigateTo} />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour global */}
        <div className="mb-4">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            ← Retour à l'accueil
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={messages.length}
              professionalsCount={professionals.length}
              avgRating={4.5}
              activeOffers={offers.length}
              currentUserRole="admin"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateTo(path)}
            />
          </div>
          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Header Admin */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Administration Web Spider</h1>
                  <p className="text-gray-600 mt-2">Supervision complète de la plateforme</p>
                  <button
                    onClick={() => navigateTo('admin-platform-settings')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow text-sm font-semibold"
                  >
                    Accéder au paramétrage plateforme avancé
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <AdminNotifications />
                  <AdminSettings />
                  <AdminExport />
                </div>
              </div>
              {/* Paramétrage plateforme avancé */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Paramétrage plateforme avancé</h2>
                  <button
                    onClick={fetchPlatformStats}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Rafraîchir
                  </button>
                </div>
                {platformStats ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clé</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dernière maj</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(platformStats).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="px-4 py-2 font-mono text-sm text-gray-700">{key}</td>
                          <td className="px-4 py-2 text-gray-900">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                          <td className="px-4 py-2 text-gray-500">-</td>
                          <td className="px-4 py-2 text-gray-400">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500">Chargement des paramètres plateforme...</div>
                )}
              </div>
              {/* Navigation par onglets */}
              <div className="mb-8">
                <nav className="flex space-x-6 border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity, description: 'Dashboard principal' },
                    { id: 'users', label: 'Utilisateurs', icon: Users, description: 'Gestion des comptes' },
                    { id: 'registrations', label: 'Inscriptions', icon: UserCheck, description: 'Validation des inscriptions' },
                    { id: 'applications', label: 'Candidatures', icon: FileText, description: 'Demandes d\'adhésion', badge: 0 },
                    { id: 'transactions', label: 'Transactions', icon: DollarSign, description: 'Finances & revenus' },
                    { id: 'revenues', label: 'Revenus Platform', icon: BarChart3, description: 'Commissions & virements' },
                    { id: 'moderation', label: 'Modération', icon: Shield, description: 'Contrôle contenu' },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Statistiques avancées' },
                    { id: 'system', label: 'Système', icon: Server, description: 'Administration serveur' },
                    { id: 'security', label: 'Sécurité', icon: Lock, description: 'Contrôle sécurité' },
                    { id: 'auditlog', label: 'Audit Log', icon: FileText, description: 'Journal des actions admin' }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`group flex flex-col items-center py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        title={tab.description}
                      >
                        <Icon className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                          activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                        <span className="whitespace-nowrap">{tab.label}</span>
                        {activeTab === tab.id && (
                          <span className="text-xs text-indigo-500 mt-1">{tab.description}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              {/* Contenu de l'onglet actif */}
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;