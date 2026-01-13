import { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  DollarSign,
  Boxes,
  Megaphone
} from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuth } from '@/hooks/useAuthContext';
import { logger } from '@/utils/logger';
import Header from '@/components/layout/Header';
import BanquesTab from '@/components/features/BanquesTab';
import WmsTab from '@/components/common/WmsTab';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { SupplierOverview, ProductCatalog, OrdersManagement, ClientsManagement } from '@/components/dashboard/supplier';
import { SupplierDeliveryTrackingMap } from '@/components/dashboard/supplier/SupplierDeliveryTrackingMap';
import CreateBoostCampaign from '@/pages/marketing/CreateBoostCampaign';


interface SupplierDashboardProps {
  navigateTo: (page: string) => void;
}

export default function SupplierDashboard({ navigateTo }: SupplierDashboardProps) {
  const { 
    supplierProducts, 
    supplierOrders, 
    supplierClients, 
    supplierStats
  } = useBusinessStore();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'orders' | 'clients' | 'banques' | 'analytics' | 'wms' | 'boost-campaigns'>('overview');

  // Récupérer les informations utilisateur depuis localStorage avec fallback
  const getUserInfo = () => {
    try {
      // Essayer plusieurs clés localStorage
      const auth_user = localStorage.getItem('auth_user');
      const user = localStorage.getItem('user');
      const userProfile = localStorage.getItem('userProfile');
      
      if (auth_user) {
        const parsed = JSON.parse(auth_user);
        return {
          email: parsed.email || '',
          role: parsed.role || 'fournisseur',
          userId: parsed.id || parsed._id || ''
        };
      }
      
      if (user) {
        const parsed = JSON.parse(user);
        return {
          email: parsed.email || '',
          role: parsed.role || 'fournisseur',
          userId: parsed.id || parsed._id || ''
        };
      }
      
      if (userProfile) {
        const parsed = JSON.parse(userProfile);
        return {
          email: parsed.email || '',
          role: parsed.role || 'fournisseur',
          userId: parsed.id || parsed._id || ''
        };
      }
      
      // Fallback vers useAuth
      if (authUser) {
        return {
          email: authUser.email || '',
          role: authUser.role || 'fournisseur',
          userId: ''
        };
      }
      
    } catch (error) {
      logger.error('Erreur lors de la récupération des infos utilisateur', error);
    }
    
    return {
      email: '',
      role: 'fournisseur',
      userId: ''
    };
  };

  const userInfo = getUserInfo();

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'catalog', label: 'Mon Catalogue', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
    { id: 'wms', label: 'WMS Entrepôt', icon: <Boxes className="w-4 h-4" /> },
    { id: 'banques', label: 'Banques', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'boost-campaigns', label: '💰 Mes Campagnes Pub', icon: <Megaphone className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Header currentPage="supplier-dashboard" onNavigate={navigateTo} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={supplierClients.length}
              avgRating={4.5}
              activeOffers={supplierProducts.length}
              currentUserRole="fournisseur"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateTo(path)}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
        {/* Header Fournisseur */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Fournisseur 📦</h1>
              <p className="text-gray-600 mt-2">
                Gérez votre catalogue, vos commandes et vos clients restaurants
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>En ligne</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant - Désactivé */}

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'catalog' | 'orders' | 'clients' | 'banques' | 'analytics' | 'wms' | 'boost-campaigns')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu par onglet */}
        <div>
          {activeTab === 'overview' && (
            <>
              <SupplierOverview 
                supplierStats={supplierStats}
                supplierOrders={supplierOrders}
                supplierClients={supplierClients}
                setActiveTab={setActiveTab}
              />
              
              {/* 🗺️ NOUVEAU : Suivi des Livraisons Sortantes en Temps Réel */}
              <div className="mt-8">
                <SupplierDeliveryTrackingMap />
              </div>
            </>
          )}
          {activeTab === 'catalog' && <ProductCatalog supplierProducts={supplierProducts} navigateTo={navigateTo} />}
          {activeTab === 'orders' && <OrdersManagement supplierOrders={supplierOrders} />}
          {activeTab === 'clients' && <ClientsManagement clients={supplierClients} />}
          {activeTab === 'wms' && (
            <WmsTab 
              token={localStorage.getItem('auth_token') || localStorage.getItem('token') || ''} 
              userRole={userInfo.role}
              userEmail={userInfo.email}
            />
          )}
          {activeTab === 'banques' && (
            <div>
              <BanquesTab />
            </div>
          )}
          {activeTab === 'analytics' && <div className="text-center py-12 text-gray-500">Analytics fournisseur en cours de développement</div>}
          {activeTab === 'boost-campaigns' && <CreateBoostCampaign />}
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
