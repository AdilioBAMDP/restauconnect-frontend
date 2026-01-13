import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Package, Truck, Clock, Navigation } from 'lucide-react';
import { apiClient } from '@/services/api';

// ✅ CORRIGÉ: Interface commentée car non utilisée (cohérence avec l'autre fichier)
// interface DeliveryLocation {
//   lat: number;
//   lng: number;
//   label: string;
//   type: 'restaurant' | 'supplier' | 'driver';
// }

interface ActiveDelivery {
  _id: string;
  orderId: string;
  status: 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'cancelled';
  driverName?: string;
  supplierName?: string;
  estimatedTime?: string;
  currentLocation?: {
    coordinates?: [number, number];
  };
  pickupAddress?: {
    street?: string;
    city?: string;
    coordinates?: [number, number];
  };
  deliveryAddress?: {
    street?: string;
    city?: string;
    coordinates?: [number, number];
  };
}

export const RestaurantOrderTrackingMap: React.FC = () => {
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<ActiveDelivery | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveDeliveries = useCallback(async () => {
    try {
      const response = await apiClient.get('/tms/deliveries/my-deliveries');
      
      // 🔧 CORRECTION: Protection pour s'assurer que data est un tableau
      const deliveries = Array.isArray(response.data) ? response.data : (response.data.data && Array.isArray(response.data.data) ? response.data.data : []);
      
      // Filtrer uniquement les livraisons actives (pas encore livrées)
      const active = deliveries.filter((d: ActiveDelivery) => 
        d.status !== 'delivered' && d.status !== 'cancelled'
      );
      setActiveDeliveries(active);
      if (active.length > 0 && !selectedDelivery) {
        setSelectedDelivery(active[0]);
      }
    } catch (error) {
      console.error('Erreur chargement livraisons:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDelivery]);

  useEffect(() => {
    fetchActiveDeliveries();
    // Rafraîchir toutes les 10 secondes pour le tracking en temps réel
    const interval = setInterval(fetchActiveDeliveries, 10000);
    return () => clearInterval(interval);
  }, [fetchActiveDeliveries]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'pickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned':
        return '📋 Assignée';
      case 'pickup':
        return '📦 Récupération en cours';
      case 'in_transit':
        return '🚛 En route vers vous';
      case 'delivered':
        return '✅ Livrée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock className="w-5 h-5" />;
      case 'pickup':
        return <Package className="w-5 h-5" />;
      case 'in_transit':
        return <Truck className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🗺️ Suivi des Livraisons en Temps Réel
        </h3>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-3"></div>
            <p>Chargement des livraisons...</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeDeliveries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🗺️ Suivi des Livraisons en Temps Réel
        </h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">Aucune livraison en cours</p>
            <p className="text-sm mt-2">Vos livraisons actives apparaîtront ici</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Navigation className="text-emerald-600 w-6 h-6" />
        Suivi des Livraisons en Temps Réel
        <span className="ml-auto text-sm font-normal text-gray-500">
          {activeDeliveries.length} livraison{activeDeliveries.length > 1 ? 's' : ''} active{activeDeliveries.length > 1 ? 's' : ''}
        </span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Liste des livraisons actives */}
        <div className="lg:col-span-1 space-y-3 max-h-96 overflow-y-auto">
          {activeDeliveries.map((delivery) => (
            <div
              key={delivery._id}
              onClick={() => setSelectedDelivery(delivery)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDelivery?._id === delivery._id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(delivery.status)}
                  <span className="font-medium text-gray-900">
                    #{delivery.orderId?.slice(-6)}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                  {getStatusLabel(delivery.status)}
                </span>
              </div>

              {delivery.supplierName && (
                <p className="text-sm text-gray-600 mb-1">
                  📍 De: {delivery.supplierName}
                </p>
              )}

              {delivery.driverName && (
                <p className="text-sm text-gray-600 mb-1">
                  🚗 Livreur: {delivery.driverName}
                </p>
              )}

              {delivery.estimatedTime && (
                <p className="text-sm text-emerald-600 font-medium">
                  ⏱️ Arrivée estimée: {delivery.estimatedTime}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Zone de carte et détails */}
        <div className="lg:col-span-2">
          <div className="h-96 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg flex flex-col items-center justify-center border-2 border-gray-200 p-6">
            {selectedDelivery && (
              <div className="text-center w-full">
                {/* En-tête */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-3">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Commande #{selectedDelivery.orderId?.slice(-8).toUpperCase()}
                  </h4>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedDelivery.status)}`}>
                    {getStatusLabel(selectedDelivery.status)}
                  </span>
                </div>

                {/* Informations de livraison */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <div className="space-y-3">
                    {/* Point de départ */}
                    {selectedDelivery.pickupAddress && (
                      <div className="flex items-start gap-3 text-left">
                        <div className="bg-blue-100 p-2 rounded-lg mt-1">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Fournisseur - {selectedDelivery.supplierName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedDelivery.pickupAddress.street}, {selectedDelivery.pickupAddress.city}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Ligne de séparation */}
                    <div className="flex items-center gap-2 pl-5">
                      <div className="border-l-2 border-dashed border-gray-300 h-8"></div>
                    </div>

                    {/* Point d'arrivée */}
                    {selectedDelivery.deliveryAddress && (
                      <div className="flex items-start gap-3 text-left">
                        <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Votre restaurant
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedDelivery.deliveryAddress.street}, {selectedDelivery.deliveryAddress.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const coords = selectedDelivery.deliveryAddress?.coordinates;
                      if (coords && coords.length === 2) {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Ouvrir dans Maps
                  </button>
                  <button
                    onClick={fetchActiveDeliveries}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualiser
                  </button>
                </div>

                {/* Note */}
                <p className="text-xs text-gray-500 mt-4">
                  🔄 Mise à jour automatique toutes les 10 secondes
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  📡 Intégration Google Maps complète à venir
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};