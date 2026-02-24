import React, { useState, useEffect } from 'react';
import { Truck, Users, FileText, Package, Wrench, BarChart3, Store, Info, LogOut, Calendar, MapPin, Receipt } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import type { PageName } from '@/services/NavigationManager';

// Import des composants
import FleetOverview from './transporteur/components/FleetManagement/FleetOverview';
import FleetMap from './transporteur/components/FleetManagement/FleetMap';
import MaintenanceSchedule from './transporteur/components/FleetManagement/MaintenanceSchedule';
import UsersList from './transporteur/components/UserManagement/UsersList';
import DriversList from './transporteur/components/DriversManagement/DriversList';
import DocumentsList from './transporteur/components/TransportDocuments/DocumentsList';
import DeliveriesList from './transporteur/components/Deliveries/DeliveriesList';
import AnalyticsDashboard from './transporteur/components/Analytics/AnalyticsDashboard';
import MarketplaceList from './transporteur/components/Marketplace/MarketplaceList';
import NewsSection from './transporteur/components/Information/NewsSection';

// TMS PRO - Nouveaux composants
import PlanningCalendar from './transporteur/components/Planning/PlanningCalendar';
import LiveTrackingMap from './transporteur/components/Tracking/LiveTrackingMap';
import InvoiceList from './transporteur/components/Invoicing/InvoiceList';
import TMSProDashboard from './transporteur/TMSProDashboard';

type TabName = 'dashboard' | 'fleet' | 'users' | 'drivers' | 'documents' | 'deliveries' | 'maintenance' | 'analytics' | 'marketplace' | 'info' | 'planning' | 'tracking' | 'invoicing';

const TransporteurDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { messages, professionals, marketplacePosts, fetchMarketplacePosts } = useBusinessStore();
  const { navigateTo } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    totalDeliveries: 0,
    pendingDeliveries: 0,
    inProgressDeliveries: 0,
    completedDeliveries: 0,
    revenue: 0
  });

  // Rediriger vers /dashboard/transporteur si on est sur /dashboard
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/dashboard' && (user?.role === 'transporteur' || user?.role === 'carrier')) {
      window.history.replaceState(null, '', '/dashboard/transporteur');
    }
    
    // Lire l'onglet depuis l'URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'fleet', 'users', 'drivers', 'documents', 'deliveries', 'maintenance', 'analytics', 'marketplace', 'info', 'planning', 'tracking', 'invoicing'].includes(hash)) {
      setActiveTab(hash as TabName);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
    // Charger les données du marketplace et messages pour afficher dans la sidebar
    fetchMarketplacePosts().catch(err => console.error('Erreur chargement marketplace:', err));
  }, [fetchMarketplacePosts]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Charger les stats TMS
      const statsResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/transporteur-tms/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsResponse.data) {
        setStats({
          totalVehicles: statsResponse.data.fleet?.totalVehicles || 0,
          activeVehicles: statsResponse.data.fleet?.activeVehicles || 0,
          totalDrivers: statsResponse.data.drivers?.total || 0,
          totalDeliveries: statsResponse.data.deliveries?.total || 0,
          pendingDeliveries: statsResponse.data.deliveries?.pending || 0,
          inProgressDeliveries: statsResponse.data.deliveries?.inTransit || 0,
          completedDeliveries: statsResponse.data.deliveries?.completed || 0,
          revenue: statsResponse.data.revenue?.total || 0
        });
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      // Valeurs par défaut en cas d'erreur
      setStats({
        totalVehicles: 0,
        activeVehicles: 0,
        totalDrivers: 0,
        totalDeliveries: 0,
        pendingDeliveries: 0,
        inProgressDeliveries: 0,
        completedDeliveries: 0,
        revenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'planning', label: '📅 Planning TMS', icon: Calendar },
    { id: 'tracking', label: '🗺️ Tracking Live', icon: MapPin },
    { id: 'invoicing', label: '💰 Facturation', icon: Receipt },
    { id: 'fleet', label: 'Flotte', icon: Truck },
    { id: 'drivers', label: 'Chauffeurs', icon: Users },
    { id: 'deliveries', label: 'Livraisons', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'info', label: 'Informations', icon: Info }
  ];

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (tabId: TabName) => {
    setActiveTab(tabId);
    window.location.hash = `#${tabId}`;
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue, {user?.name}</h2>
        <p className="text-gray-600">Vue d'ensemble de votre entreprise de transport</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Véhicules Total</h3>
          <p className="text-xs text-green-600 mt-1">{stats.activeVehicles} actifs</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Livraisons</h3>
          <p className="text-xs text-gray-500 mt-1">Ce mois</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Chauffeurs</h3>
          <p className="text-xs text-gray-500 mt-1">Employés</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.revenue}€</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Chiffre d'affaires</h3>
          <p className="text-xs text-gray-500 mt-1">Ce mois</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">🚀 Fonctionnalités disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-yellow-900 mb-2">✅ Gestion Flotte</h4>
            <p className="text-sm text-yellow-800">Ajoutez et gérez vos véhicules, suivez maintenance et documents</p>
          </div>
          <div>
            <h4 className="font-medium text-yellow-900 mb-2">✅ Gestion Utilisateurs</h4>
            <p className="text-sm text-yellow-800">Créez des comptes dispatcher, comptable, chauffeur avec permissions</p>
          </div>
          <div>
            <h4 className="font-medium text-yellow-900 mb-2">✅ Documents Transport</h4>
            <p className="text-sm text-yellow-800">Générez CMR, lettres de voiture avec QR codes et signatures électroniques</p>
          </div>
          <div>
            <h4 className="font-medium text-yellow-900 mb-2">✅ Analytics Avancées</h4>
            <p className="text-sm text-yellow-800">Suivez CA, coûts, rentabilité par véhicule/chauffeur</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TMSProDashboard />;
      case 'planning':
        return <PlanningCalendar />;
      case 'tracking':
        return <LiveTrackingMap />;
      case 'invoicing':
        return <InvoiceList />;
      case 'fleet':
        return <FleetOverview />;
      case 'users':
        return <UsersList />;
      case 'drivers':
        return <DriversList />;
      case 'documents':
        return <DocumentsList />;
      case 'deliveries':
        return <DeliveriesList />;
      case 'maintenance':
        return <MaintenanceSchedule />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'marketplace':
        return <MarketplaceList />;
      case 'info':
        return <NewsSection />;
      default:
        return <TMSProDashboard />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      {/* Mode TMS Pro - Full Screen */}
      {activeTab === 'dashboard' ? (
        <TMSProDashboard onNavigate={(action) => {
          console.log('🔘 TMS Navigation:', action);
          // Mapper les actions vers les vraies pages ou onglets
          const pageMapping: Record<string, PageName | TabName> = {
            'messages': 'messages',
            'marketplace': 'marketplace',
            'professionals': 'partenaires',
            'deliveries': 'deliveries',
            'drivers': 'drivers',
            'analytics': 'analytics',
            'fleet': 'fleet',
            'info': 'information-globale'
          };
          
          const target = pageMapping[action] || action;
          
          // Si c'est une PageName globale, naviguer avec NavigationManager
          if (['messages', 'marketplace', 'partenaires', 'information-globale'].includes(target as string)) {
            console.log('✅ Navigation globale vers:', target);
            navigateTo(target as PageName);
          } else {
            // Sinon, c'est un onglet local du dashboard transporteur
            console.log('✅ Changement onglet vers:', target);
            handleTabChange(target as TabName);
          }
        }} />
      ) : (
        <>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Truck className="h-6 w-6 text-white" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transport Pro</h1>
                    <p className="text-sm text-gray-600">TMS Professionnel</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            </div>
          </header>

          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar à gauche - 1 colonne */}
              <div className="lg:col-span-1">
                <CompleteSidebar
                  upcomingEvents={[]}
                  messagesCount={messages?.length || 0}
                  professionalsCount={professionals?.length || 0}
                  avgRating={4.5}
                  activeOffers={marketplacePosts?.length || 0}
                  currentUserRole="transporteur"
                  partners={useBusinessStore.getState().partners}
                  onNavigate={(page) => {
                    console.log('🔘 SIDEBAR CLICK:', page);
                    // Naviguer vers la page demandée
                    if (page === 'information-globale' || page === 'marketplace' || page === 'messages') {
                      console.log('✅ Navigation vers:', page);
                      navigateTo(page as PageName);
                    } else {
                      console.warn('⚠️ Page non gérée:', page);
                    }
                  }}
                />
                
                {/* Stats rapides transporteur */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-4">📊 Vue rapide</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">💬 Messages</span>
                      <span className="font-semibold text-blue-600">{messages?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">🏪 Marketplace</span>
                      <span className="font-semibold text-purple-600">{marketplacePosts?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">👥 Pros</span>
                      <span className="font-semibold text-green-600">{professionals?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-gray-600">En cours</span>
                      <span className="font-semibold text-orange-600">{stats.inProgressDeliveries}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-600">En attente</span>
                      <span className="font-semibold text-yellow-600">{stats.pendingDeliveries}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm text-gray-600">Livrées</span>
                      <span className="font-semibold text-emerald-600">{stats.completedDeliveries}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <span className="text-sm text-gray-600">Chauffeurs</span>
                      <span className="font-semibold text-indigo-600">{stats.totalDrivers}/{stats.totalDrivers}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <span className="text-sm text-gray-600">À l'heure</span>
                      <span className="font-semibold text-cyan-600">80%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu principal - 3 colonnes */}
              <div className="lg:col-span-3">
                <div className="space-y-8">
                  {/* Navigation Tabs */}
                  <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
                    <nav className="flex">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as TabName)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                              activeTab === tab.id
                                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Content */}
                  {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4">Chargement...</p>
                    </div>
                  ) : (
                    renderTabContent()
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransporteurDashboard;
