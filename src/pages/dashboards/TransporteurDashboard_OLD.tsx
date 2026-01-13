import React, { useState, useEffect } from 'react';
import { Truck, Package, Route, Clock, MapPin, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Delivery {
  id: number;
  orderNumber: string;
  pickup: string;
  delivery: string;
  status: string;
  estimatedTime: string;
  distance: string;
  earnings: number;
}

interface Vehicle {
  id: number;
  type: string;
  brand: string;
  plateNumber: string;
  status: string;
  capacity: string;
  mileage: number;
}

interface TransportStats {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  totalDistance: number;
  averageRating: number;
  totalEarnings: number;
}

const TransporteurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<TransportStats>({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    totalDistance: 0,
    averageRating: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    // Simuler des données pour l'instant
    setStats({
      totalDeliveries: 156,
      activeDeliveries: 8,
      completedDeliveries: 148,
      totalDistance: 2340,
      averageRating: 4.7,
      totalEarnings: 5200
    });
    
    setDeliveries([
      {
        id: 1,
        orderNumber: 'TRP-2025-001',
        pickup: 'Restaurant Le Gourmet, Paris 16ème',
        delivery: '45 Rue de la Paix, Paris 1er',
        status: 'in_transit',
        estimatedTime: '15 min',
        distance: '4.2 km',
        earnings: 12.50
      },
      {
        id: 2,
        orderNumber: 'TRP-2025-002',
        pickup: 'Boulangerie Martin, Lyon',
        delivery: '12 Avenue des Champs, Lyon',
        status: 'assigned',
        estimatedTime: '25 min',
        distance: '7.8 km',
        earnings: 18.00
      }
    ]);

    setVehicles([
      {
        id: 1,
        type: 'Camionnette',
        brand: 'Renault Master',
        plateNumber: 'AB-123-CD',
        status: 'active',
        capacity: '1500kg',
        mileage: 45000
      }
    ]);
  }, []);

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in_transit': return 'text-yellow-600 bg-yellow-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeliveryStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assignée';
      case 'in_transit': return 'En cours';
      case 'delivered': return 'Livrée';
      case 'failed': return 'Échec';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Transporteur
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.name}, gérez vos livraisons et votre flotte de véhicules.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Livraisons</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Cours</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Complétées</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Route className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Distance Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalDistance} km</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Note Moyenne</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}/5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Gains</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEarnings}€</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Livraisons actives */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Livraisons Actives</h3>
              </div>
              <div className="p-6">
                {deliveries.length > 0 ? (
                  <div className="space-y-4">
                    {deliveries.map((delivery: Delivery) => (
                      <div key={delivery.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{delivery.orderNumber}</h4>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                                <span className="font-medium">Retrait:</span> {delivery.pickup}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-red-600" />
                                <span className="font-medium">Livraison:</span> {delivery.delivery}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>⏱️ {delivery.estimatedTime}</span>
                              <span>📍 {delivery.distance}</span>
                              <span className="text-green-600 font-medium">💰 {delivery.earnings}€</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(delivery.status)}`}>
                            {getDeliveryStatusLabel(delivery.status)}
                          </span>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          {delivery.status === 'assigned' && (
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                              Commencer
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                              Marquer comme livrée
                            </button>
                          )}
                          <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
                            Détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune livraison active</p>
                  </div>
                )}
              </div>
            </div>

            {/* Véhicules */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ma Flotte</h3>
              </div>
              <div className="p-6">
                {vehicles.length > 0 ? (
                  <div className="space-y-4">
                    {vehicles.map((vehicle: Vehicle) => (
                      <div key={vehicle.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{vehicle.brand}</h4>
                            <p className="text-sm text-gray-600">{vehicle.type} - {vehicle.plateNumber}</p>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>📦 Capacité: {vehicle.capacity}</span>
                              <span>🛣️ {vehicle.mileage.toLocaleString()} km</span>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                            Actif
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun véhicule enregistré</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporteurDashboard;
