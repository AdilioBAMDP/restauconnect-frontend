import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Map,
  Navigation,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  Route as RouteIcon
} from 'lucide-react';

interface DeliveryPoint {
  id: string;
  address: string;
  customerName: string;
  orderNumber: string;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'delivered';
  packages: number;
}

interface RouteData {
  id: string;
  name: string;
  date: string;
  totalStops: number;
  completedStops: number;
  totalDistance: number;
  estimatedDuration: string;
  status: 'planned' | 'in-progress' | 'completed';
  deliveryPoints: DeliveryPoint[];
}

const DriverRoutesPage: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const [routes] = useState<RouteData[]>([
    {
      id: 'R001',
      name: 'Tournée Matinale Paris Centre',
      date: '2024-10-08',
      totalStops: 8,
      completedStops: 3,
      totalDistance: 42.5,
      estimatedDuration: '3h 30min',
      status: 'in-progress',
      deliveryPoints: [
        {
          id: 'D001',
          address: '15 Rue de Rivoli, 75001 Paris',
          customerName: 'Restaurant Le Gourmet',
          orderNumber: 'CMD-2024-001',
          estimatedTime: '09:30',
          status: 'delivered',
          packages: 3
        },
        {
          id: 'D002',
          address: '28 Avenue des Champs-Élysées, 75008 Paris',
          customerName: 'Bistrot Moderne',
          orderNumber: 'CMD-2024-002',
          estimatedTime: '10:15',
          status: 'delivered',
          packages: 2
        },
        {
          id: 'D003',
          address: '45 Rue du Faubourg Saint-Honoré, 75008 Paris',
          customerName: 'Café Parisien',
          orderNumber: 'CMD-2024-003',
          estimatedTime: '10:45',
          status: 'delivered',
          packages: 1
        },
        {
          id: 'D004',
          address: '12 Boulevard Saint-Germain, 75005 Paris',
          customerName: 'Brasserie du Quartier',
          orderNumber: 'CMD-2024-004',
          estimatedTime: '11:20',
          status: 'in-progress',
          packages: 4
        },
        {
          id: 'D005',
          address: '67 Rue de la Roquette, 75011 Paris',
          customerName: 'Pizzeria Napoli',
          orderNumber: 'CMD-2024-005',
          estimatedTime: '12:00',
          status: 'pending',
          packages: 2
        },
        {
          id: 'D006',
          address: '89 Avenue Parmentier, 75011 Paris',
          customerName: 'Boulangerie Bio',
          orderNumber: 'CMD-2024-006',
          estimatedTime: '12:30',
          status: 'pending',
          packages: 3
        },
        {
          id: 'D007',
          address: '34 Rue Oberkampf, 75011 Paris',
          customerName: 'Restaurant Fusion',
          orderNumber: 'CMD-2024-007',
          estimatedTime: '13:00',
          status: 'pending',
          packages: 2
        },
        {
          id: 'D008',
          address: '56 Boulevard Voltaire, 75011 Paris',
          customerName: 'Café du Commerce',
          orderNumber: 'CMD-2024-008',
          estimatedTime: '13:30',
          status: 'pending',
          packages: 1
        }
      ]
    },
    {
      id: 'R002',
      name: 'Tournée Après-midi Banlieue Nord',
      date: '2024-10-08',
      totalStops: 6,
      completedStops: 0,
      totalDistance: 38.2,
      estimatedDuration: '2h 45min',
      status: 'planned',
      deliveryPoints: [
        {
          id: 'D101',
          address: '23 Avenue Jean Jaurès, 93400 Saint-Ouen',
          customerName: 'Restaurant Familial',
          orderNumber: 'CMD-2024-101',
          estimatedTime: '15:00',
          status: 'pending',
          packages: 3
        },
        {
          id: 'D102',
          address: '15 Rue de la République, 93200 Saint-Denis',
          customerName: 'Brasserie Saint-Denis',
          orderNumber: 'CMD-2024-102',
          estimatedTime: '15:40',
          status: 'pending',
          packages: 2
        },
        {
          id: 'D103',
          address: '78 Boulevard Ornano, 93200 Saint-Denis',
          customerName: 'Pizzeria Italia',
          orderNumber: 'CMD-2024-103',
          estimatedTime: '16:15',
          status: 'pending',
          packages: 4
        },
        {
          id: 'D104',
          address: '45 Avenue du Président Wilson, 93210 Saint-Denis',
          customerName: 'Café Moderne',
          orderNumber: 'CMD-2024-104',
          estimatedTime: '16:50',
          status: 'pending',
          packages: 1
        },
        {
          id: 'D105',
          address: '12 Rue Gabriel Péri, 93400 Saint-Ouen',
          customerName: 'Boulangerie Artisanale',
          orderNumber: 'CMD-2024-105',
          estimatedTime: '17:20',
          status: 'pending',
          packages: 3
        },
        {
          id: 'D106',
          address: '89 Avenue de la Liberté, 93270 Sevran',
          customerName: 'Restaurant du Parc',
          orderNumber: 'CMD-2024-106',
          estimatedTime: '17:45',
          status: 'pending',
          packages: 2
        }
      ]
    },
    {
      id: 'R003',
      name: 'Express Paris Sud',
      date: '2024-10-07',
      totalStops: 5,
      completedStops: 5,
      totalDistance: 28.7,
      estimatedDuration: '2h 15min',
      status: 'completed',
      deliveryPoints: [
        {
          id: 'D201',
          address: '34 Avenue d\'Italie, 75013 Paris',
          customerName: 'Bistrot d\'Italie',
          orderNumber: 'CMD-2024-201',
          estimatedTime: '09:00',
          status: 'delivered',
          packages: 2
        },
        {
          id: 'D202',
          address: '67 Rue de Tolbiac, 75013 Paris',
          customerName: 'Café Tolbiac',
          orderNumber: 'CMD-2024-202',
          estimatedTime: '09:30',
          status: 'delivered',
          packages: 3
        },
        {
          id: 'D203',
          address: '12 Boulevard Auguste Blanqui, 75013 Paris',
          customerName: 'Restaurant Asiatique',
          orderNumber: 'CMD-2024-203',
          estimatedTime: '10:00',
          status: 'delivered',
          packages: 4
        },
        {
          id: 'D204',
          address: '45 Avenue de Choisy, 75013 Paris',
          customerName: 'Brasserie Choisy',
          orderNumber: 'CMD-2024-204',
          estimatedTime: '10:30',
          status: 'delivered',
          packages: 1
        },
        {
          id: 'D205',
          address: '78 Rue de la Butte aux Cailles, 75013 Paris',
          customerName: 'Café de la Butte',
          orderNumber: 'CMD-2024-205',
          estimatedTime: '11:00',
          status: 'delivered',
          packages: 2
        }
      ]
    }
  ]);

  const activeRoute = routes.find(r => r.status === 'in-progress');
  const todayRoutes = routes.filter(r => r.date === '2024-10-08');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Navigation className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'in-progress': return 'En cours';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'planned': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Map className="w-8 h-8 text-blue-600" />
                Mes Itinéraires
              </h1>
              <p className="text-gray-600 mt-2">
                Gestion et optimisation de vos tournées de livraison
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques du jour */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tournées Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{todayRoutes.length}</p>
              </div>
              <RouteIcon className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Arrêts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {todayRoutes.reduce((sum, r) => sum + r.totalStops, 0)}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Distance Totale</p>
                <p className="text-2xl font-bold text-purple-600">
                  {todayRoutes.reduce((sum, r) => sum + r.totalDistance, 0).toFixed(1)} km
                </p>
              </div>
              <Navigation className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Colis à Livrer</p>
                <p className="text-2xl font-bold text-green-600">
                  {todayRoutes.reduce((sum, r) => 
                    sum + r.deliveryPoints.reduce((s, p) => s + p.packages, 0), 0
                  )}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Tournée en cours */}
        {activeRoute && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">🚚 Tournée en cours</h2>
                <p className="text-blue-100 mt-1">{activeRoute.name}</p>
              </div>
              <span className="bg-white/20 px-4 py-2 rounded-lg text-sm">
                {activeRoute.completedStops}/{activeRoute.totalStops} arrêts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Progression</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${(activeRoute.completedStops / activeRoute.totalStops) * 100}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold">
                    {Math.round((activeRoute.completedStops / activeRoute.totalStops) * 100)}%
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Distance</p>
                <p className="text-xl font-bold mt-2">{activeRoute.totalDistance} km</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Temps Estimé</p>
                <p className="text-xl font-bold mt-2">{activeRoute.estimatedDuration}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRoute(activeRoute.id)}
              className="mt-4 w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Voir les détails de la tournée
            </button>
          </motion.div>
        )}

        {/* Liste des tournées */}
        <div className="grid grid-cols-1 gap-6">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{route.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRouteStatusColor(route.status)}`}>
                        {route.status === 'completed' ? 'Terminée' :
                         route.status === 'in-progress' ? 'En cours' :
                         'Planifiée'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {route.date} • {route.totalStops} arrêts • {route.totalDistance} km • {route.estimatedDuration}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {selectedRoute === route.id ? 'Masquer' : 'Détails'}
                  </button>
                </div>

                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progression: {route.completedStops}/{route.totalStops} arrêts</span>
                    <span>{Math.round((route.completedStops / route.totalStops) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(route.completedStops / route.totalStops) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Points de livraison (détails) */}
                {selectedRoute === route.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 pt-4 mt-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Points de livraison
                    </h4>

                    <div className="space-y-3">
                      {route.deliveryPoints.map((point, idx) => (
                        <div
                          key={point.id}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex-shrink-0">
                            {idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">{point.customerName}</h5>
                                <p className="text-sm text-gray-600">{point.address}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(point.status)}`}>
                                {getStatusIcon(point.status)}
                                <span className="ml-1">{getStatusLabel(point.status)}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {point.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {point.packages} colis
                              </span>
                              <span className="text-gray-400">•</span>
                              <span>{point.orderNumber}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverRoutesPage;
