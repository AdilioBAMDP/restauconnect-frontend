import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  TrendingUp,
  Map,
  DollarSign,
  User,
  Bell,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';
import { DriverOverview, DriverJobs, DriverMap, DriverEarnings, DriverProfile } from '@/components/dashboard/driver';
import { livreurService, DriverStats, TMSDelivery } from '@/services/livreurService';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';

// Les interfaces sont maintenant importées depuis livreurService

const DriverDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'jobs' | 'map' | 'earnings' | 'profile'>('overview');
  const [driverStats, setDriverStats] = useState<DriverStats | null>(null);
  const [availableDeliveries, setAvailableDeliveries] = useState<TMSDelivery[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<TMSDelivery[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  // Fonction pour récupérer les livraisons disponibles
  const fetchAvailableDeliveries = async () => {
    try {
      const deliveries = await livreurService.getAvailableDeliveries();
      setAvailableDeliveries(deliveries);
    } catch (error) {
      toast.error('Erreur lors de la récupération des livraisons');
      logger.error('Erreur lors de la récupération des livraisons disponibles:', error);
    }
  };

  // Fonction pour récupérer mes livraisons assignées
  const fetchMyDeliveries = async () => {
    try {
      const deliveries = await livreurService.getMyDeliveries();
      setMyDeliveries(deliveries);
    } catch (error) {
      toast.error('Erreur lors de la récupération de vos livraisons');
      logger.error('Erreur lors de la récupération de mes livraisons:', error);
    }
  };

  // Fonction pour prendre en charge une livraison
  const assignDelivery = async (deliveryId: string) => {
    try {
      const result = await livreurService.assignDelivery(deliveryId);
      
      if (result.success) {
        toast.success(result.message);
        // Rafraîchir les listes
        fetchAvailableDeliveries();
        fetchMyDeliveries();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      toast.error('Erreur de connexion');
    }
  };

  // Fonction pour mettre à jour le statut d'une livraison
  const updateDeliveryStatus = async (deliveryId: string, status: string, notes?: string) => {
    try {
      const result = await livreurService.updateDeliveryStatus(deliveryId, status, notes);
      
      if (result.success) {
        toast.success(result.message);
        fetchMyDeliveries();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur de connexion');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Charger les données réelles
      await Promise.all([
        fetchAvailableDeliveries(),
        fetchMyDeliveries()
      ]);
      
      // Charger les statistiques depuis l'API
      try {
        const stats = await livreurService.getDriverStats();
        setDriverStats(stats);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        // Pas de statistiques disponibles - afficher un état vide
        setDriverStats(null);
      }
    };

    loadData();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      if (isOnline) {
        fetchAvailableDeliveries();
        fetchMyDeliveries();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={0}
              avgRating={4.5}
              activeOffers={myDeliveries.length}
              currentUserRole="livreur"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => {}}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
      {/* Header avec statut en ligne */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🚚 Dashboard Livreur TMS</h1>
                <p className="text-sm text-gray-600">Commandes restaurants intégrées • Livraisons automatiques</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  const newStatus = !isOnline;
                  try {
                    const result = await livreurService.updateOnlineStatus(newStatus);
                    if (result.success) {
                      setIsOnline(newStatus);
                      toast.success(result.message);
                    } else {
                      toast.error(result.message);
                    }
                  } catch (error) {
                    console.error('Erreur lors de la mise à jour du statut:', error);
                    toast.error('Erreur de connexion');
                  }
                }}
                className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors ${
                  isOnline 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </button>
              
              <button 
                onClick={() => { fetchAvailableDeliveries(); fetchMyDeliveries(); }}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Actualiser"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'jobs', label: 'Livraisons TMS', icon: <Package className="w-4 h-4" /> },
              { id: 'map', label: 'Carte', icon: <Map className="w-4 h-4" /> },
              { id: 'earnings', label: 'Gains', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as 'overview' | 'jobs' | 'map' | 'earnings' | 'profile')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-6">
        {activeSection === 'overview' && driverStats && (
          <DriverOverview 
            stats={{
              totalDeliveries: driverStats.month.deliveries,
              completedToday: driverStats.today.deliveries,
              totalEarnings: driverStats.month.earnings,
              monthlyEarnings: driverStats.month.earnings,
              rating: driverStats.week.avgRating,
              onTimeRate: 95,
              activeRoute: myDeliveries.some(d => d.status === 'in_transit')
            }}
            onNavigate={(section) => {
              const validSections = ['overview', 'jobs', 'map', 'earnings', 'profile'];
              if (validSections.includes(section)) {
                setActiveSection(section as 'overview' | 'jobs' | 'map' | 'earnings' | 'profile');
              }
            }}
          />
        )}

        {activeSection === 'jobs' && (
          <DriverJobs 
            availableDeliveries={availableDeliveries}
            myDeliveries={myDeliveries}
            onAssignDelivery={assignDelivery}
            onUpdateStatus={updateDeliveryStatus}
          />
        )}

        {activeSection === 'map' && <DriverMap />}

        {activeSection === 'earnings' && driverStats && (
          <DriverEarnings earnings={{
            daily: [],
            weekly: driverStats.week.earnings,
            monthly: driverStats.month.earnings,
            total: driverStats.month.earnings,
            pending: 0
          }} />
        )}

        {activeSection === 'profile' && <DriverProfile driverStats={driverStats} />}
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
