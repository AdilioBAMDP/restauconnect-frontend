import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/utils/logger';
import { UserRole } from '@/types';
import { 
  Warehouse, 
  Package2, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Boxes,
  Thermometer,
  Shield,
  CheckCircle,
  Lock
} from 'lucide-react';
import { roleUtils } from '@/utils/roleUtils';
import { useAuth } from '@/hooks/useAuthContext';

interface WmsStats {
  overview: {
    totalWarehouses: number;
    totalBatches: number;
    activeBatches: number;
    totalStockValue: number;
  };
  alerts: {
    expiringSoon: number;
    lowStock: number;
  };
  activity: {
    activeReservations: number;
    utilizationRate: number;
  };
}

interface Warehouse {
  _id: string;
  name: string;
  code: string;
  type: 'main' | 'cold' | 'frozen' | 'dry' | 'hazardous';
  capacity: {
    totalVolume: number;
    availableVolume: number;
  };
  settings: {
    temperatureMin?: number;
    temperatureMax?: number;
  };
  isActive: boolean;
}

interface Batch {
  _id: string;
  batchNumber: string;
  productId: {
    name: string;
    category: string;
  };
  currentQuantity: number;
  unit: string;
  expirationDate: string;
  status: 'received' | 'available' | 'reserved' | 'consumed' | 'expired';
  storage: {
    locationId: {
      code: string;
      zone: string;
    };
  };
  daysLeft?: number;
  urgency?: 'critical' | 'high' | 'medium';
}

interface WmsTabProps {
  token: string;
  userRole?: string;
  userEmail?: string;
}

type ActiveSection = 'dashboard' | 'warehouses' | 'batches' | 'movements' | 'alerts';

const WmsTab: React.FC<WmsTabProps> = ({ token, userRole, userEmail }) => {
  const { user } = useAuth();
  
  // États React (doivent être déclarés avant toute logique conditionnelle)
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [wmsStats, setWmsStats] = useState<WmsStats | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [expiringBatches, setExpiringBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Déterminer les permissions WMS
  const currentUserRole = (userRole || user?.role || '') as UserRole;
  const currentUserEmail = userEmail || user?.email || '';
  const wmsAccessLevel = roleUtils.getWMSAccessLevel(currentUserRole, currentUserEmail);
  const canAccessWMS = roleUtils.canAccessWMS(currentUserRole, currentUserEmail);

  // Fonction pour récupérer les statistiques WMS
  const fetchWmsStats = useCallback(async () => {
    try {
      const response = await fetch('/api/wms/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWmsStats(data.data);
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques WMS', error);
    }
  }, [token]);

  // Fonction pour récupérer les entrepôts
  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await fetch('/api/wms/warehouses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.data);
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération des entrepôts', error);
    }
  }, [token]);

  // Fonction pour récupérer les lots expirant
  const fetchExpiringBatches = useCallback(async () => {
    try {
      const response = await fetch('/api/wms/batches/alerts/expiring?days=7', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      if (response.ok) {
        const data = await response.json();
        setExpiringBatches(data.data);
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération des alertes d\'expiration', error);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchWmsStats(),
        fetchWarehouses(),
        fetchExpiringBatches()
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchWmsStats, fetchWarehouses, fetchExpiringBatches]);



  const getWarehouseTypeIcon = (type: string) => {
    switch (type) {
      case 'cold': return <Thermometer className="w-5 h-5 text-blue-600" />;
      case 'frozen': return <Thermometer className="w-5 h-5 text-cyan-600" />;
      case 'hazardous': return <Shield className="w-5 h-5 text-red-600" />;
      default: return <Warehouse className="w-5 h-5 text-gray-600" />;
    }
  };



  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Chargement WMS...</span>
      </div>
    );
  }

  // Si aucun accès WMS, afficher un message d'erreur
  if (!canAccessWMS) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès WMS restreint</h3>
          <p className="text-gray-500 max-w-md">
            Le système de gestion d'entrepôt est réservé aux fournisseurs et administrateurs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête WMS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Boxes className="w-8 h-8 text-blue-600 mr-3" />
            {roleUtils.getWMSTitle(wmsAccessLevel)}
            {roleUtils.isTestAccount(currentUserEmail) && (
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                COMPTE TEST - Accès complet démo
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">{roleUtils.getWMSDescription(wmsAccessLevel)}</p>
          {wmsAccessLevel === 'personal' && (
            <p className="text-sm text-blue-600 mt-1">
              📝 Vous voyez uniquement vos entrepôts et stocks personnels
            </p>
          )}
          
          {/* Debug Info pour TEST */}
          {roleUtils.isTestAccount(currentUserEmail) && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700">
                🧪 <strong>Mode TEST:</strong> Email: {currentUserEmail} | Rôle: {currentUserRole} | Accès: {wmsAccessLevel}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            fetchWmsStats();
            fetchWarehouses();
            fetchExpiringBatches();
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </button>
      </div>

      {/* Navigation WMS */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart3 className="w-4 h-4" />, access: ['full', 'personal'] },
            { id: 'warehouses', label: wmsAccessLevel === 'personal' ? 'Mes Entrepôts' : 'Entrepôts', icon: <Warehouse className="w-4 h-4" />, access: ['full', 'personal'] },
            { id: 'batches', label: wmsAccessLevel === 'personal' ? 'Mes Lots & Stock' : 'Lots & Stock', icon: <Package2 className="w-4 h-4" />, access: ['full', 'personal'] },
            { id: 'alerts', label: 'Alertes', icon: <AlertTriangle className="w-4 h-4" />, access: ['full', 'personal'] },
          ].filter(tab => tab.access.includes(wmsAccessLevel)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as ActiveSection)}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
                activeSection === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu dynamique selon la section */}
      {activeSection === 'dashboard' && wmsStats && (
        <div className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md border"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Warehouse className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entrepôts</p>
                  <p className="text-2xl font-bold text-gray-900">{wmsStats.overview.totalWarehouses}</p>
                  <p className="text-xs text-blue-600">Actifs</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md border"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Lots en stock</p>
                  <p className="text-2xl font-bold text-gray-900">{wmsStats.overview.activeBatches}</p>
                  <p className="text-xs text-green-600">Disponibles</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md border"
            >
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alertes</p>
                  <p className="text-2xl font-bold text-gray-900">{wmsStats.alerts.expiringSoon}</p>
                  <p className="text-xs text-yellow-600">Lots expirant</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md border"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taux d'utilisation</p>
                  <p className="text-2xl font-bold text-gray-900">{wmsStats.activity.utilizationRate}%</p>
                  <p className="text-xs text-purple-600">Entrepôts</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alertes prioritaires */}
          {expiringBatches.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Alertes Prioritaires - Lots Expirant
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expiringBatches.slice(0, 6).map((batch) => (
                    <div
                      key={batch._id}
                      className={`p-4 border rounded-lg ${getUrgencyColor(batch.urgency)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{batch.productId.name}</h4>
                          <p className="text-sm text-gray-600">Lot: {batch.batchNumber}</p>
                          <p className="text-sm text-gray-600">Stock: {batch.currentQuantity} {batch.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {batch.daysLeft} jour{batch.daysLeft !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(batch.expirationDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section Entrepôts */}
      {activeSection === 'warehouses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Gestion des Entrepôts</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Entrepôt
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <motion.div
                key={warehouse._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getWarehouseTypeIcon(warehouse.type)}
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{warehouse.name}</h4>
                      <p className="text-sm text-gray-600">Code: {warehouse.code}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {warehouse.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                {warehouse.settings.temperatureMin !== undefined && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Température: {warehouse.settings.temperatureMin}°C à {warehouse.settings.temperatureMax}°C
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacité utilisée:</span>
                    <span className="font-medium">
                      {warehouse.capacity.totalVolume ? 
                        `${Math.round(((warehouse.capacity.totalVolume - warehouse.capacity.availableVolume) / warehouse.capacity.totalVolume) * 100)}%`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  {warehouse.capacity.totalVolume && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.round(((warehouse.capacity.totalVolume - warehouse.capacity.availableVolume) / warehouse.capacity.totalVolume) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                    Gérer
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors">
                    Détails
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Section Alertes */}
      {activeSection === 'alerts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Alertes et Notifications</h3>
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>

          {expiringBatches.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">Lots arrivant à expiration (7 jours)</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emplacement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expiringBatches.map((batch) => (
                      <tr key={batch._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {batch.productId.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {batch.productId.category}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {batch.batchNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {batch.currentQuantity} {batch.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {batch.storage?.locationId?.code || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(batch.expirationDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {batch.daysLeft} jour{batch.daysLeft !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(batch.urgency)}`}>
                            {batch.urgency === 'critical' ? 'Critique' :
                             batch.urgency === 'high' ? 'Élevée' : 'Moyenne'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Voir
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-800">
                            Planifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune alerte critique</h3>
              <p className="text-gray-600">Tous vos stocks sont dans les délais normaux.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WmsTab;
