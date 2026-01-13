import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Package, Truck, Clock, Navigation } from 'lucide-react';
import { apiClient } from '@/services/api';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

interface ActiveDelivery {
  _id: string;
  orderId: string;
  status: 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'cancelled';
  driverName?: string;
  restaurantName?: string;
  estimatedTime?: string;
  currentLocation?: {
    coordinates?: [number, number];
    latitude?: number;
    longitude?: number;
  };
  pickupAddress?: {
    street?: string;
    city?: string;
    coordinates?: [number, number];
    latitude?: number;
    longitude?: number;
  };
  deliveryAddress?: {
    street?: string;
    city?: string;
    coordinates?: [number, number];
    latitude?: number;
    longitude?: number;
  };
}

export const SupplierDeliveryTrackingMap: React.FC = () => {
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<ActiveDelivery | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour extraire les coordonnées GPS (supporte 2 formats)
  const getCoordinates = (address: any): [number, number] | null => {
    if (!address) return null;
    
    // Format 1: coordinates array [lng, lat]
    if (address.coordinates && Array.isArray(address.coordinates) && address.coordinates.length === 2) {
      return [address.coordinates[1], address.coordinates[0]]; // [lat, lng]
    }
    
    // Format 2: latitude et longitude séparés
    if (address.latitude && address.longitude) {
      return [address.latitude, address.longitude];
    }
    
    return null;
  };

  // Calculer le centre et le zoom de la carte
  const getMapCenter = (delivery: ActiveDelivery): { center: [number, number]; zoom: number } => {
    const pickup = getCoordinates(delivery.pickupAddress);
    const dest = getCoordinates(delivery.deliveryAddress);
    
    if (!pickup || !dest) {
      return { center: [48.8566, 2.3522], zoom: 13 }; // Paris par défaut
    }

    // Centrer entre pickup et delivery
    const centerLat = (pickup[0] + dest[0]) / 2;
    const centerLng = (pickup[1] + dest[1]) / 2;
    
    // Calculer zoom selon distance
    const latDiff = Math.abs(pickup[0] - dest[0]);
    const lngDiff = Math.abs(pickup[1] - dest[1]);
    const maxDiff = Math.max(latDiff, lngDiff);
    
    let zoom = 14;
    if (maxDiff > 0.1) zoom = 11;
    else if (maxDiff > 0.05) zoom = 12;
    else if (maxDiff > 0.02) zoom = 13;
    
    return { center: [centerLat, centerLng], zoom };
  };

  const fetchActiveDeliveries = useCallback(async () => {
    try {
      // ✅ NOUVEAU: Vérifier si l'utilisateur est connecté avant d'appeler l'API
      const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('token');
      
      if (!token) {
        // Si pas de token, ne pas appeler l'API (évite les 401 en boucle)
        setLoading(false);
        return;
      }

      // ✅ CORRIGÉ: Utilisation de apiClient au lieu de fetch pour gérer automatiquement l'auth
      const response = await apiClient.get('/tms/deliveries/my-deliveries');
      
      if (response.data && response.data.deliveries) {
        // Filtrer uniquement les livraisons actives (pas encore livrées)
        const active = response.data.deliveries.filter((d: ActiveDelivery) => 
          d.status !== 'delivered' && d.status !== 'cancelled'
        );
        setActiveDeliveries(active);
        if (active.length > 0 && !selectedDelivery) {
          setSelectedDelivery(active[0]);
        }
      }
    } catch (error) {
      console.error('Erreur chargement livraisons:', error);
      // ✅ NOUVEAU: Ne plus réessayer si erreur 401
      if (error instanceof Error && error.message.includes('Non authentifi')) {
        setLoading(false);
        return; // Arrêter les tentatives
      }
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
      case 'cancelled':
        return 'bg-red-100 text-red-800'; // ✅ AJOUTÉ: Gestion du statut cancelled
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned':
        return '📋 Livreur assigné';
      case 'pickup':
        return '📦 Récupération chez vous';
      case 'in_transit':
        return '🚛 En route vers client';
      case 'delivered':
        return '✅ Livrée';
      case 'cancelled':
        return '❌ Annulée'; // ✅ AJOUTÉ: Label pour cancelled
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
          🗺️ Suivi des Livraisons Sortantes
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
          🗺️ Suivi des Livraisons Sortantes
        </h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">Aucune livraison en cours</p>
            <p className="text-sm mt-2">Les livraisons actives de vos produits apparaîtront ici</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Navigation className="text-blue-600 w-6 h-6" />
        Suivi des Livraisons Sortantes
        <span className="ml-auto text-sm font-normal text-gray-500">
          {activeDeliveries.length} livraison{activeDeliveries.length > 1 ? 's' : ''} en cours
        </span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Liste des livraisons actives */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {activeDeliveries.map((delivery) => (
            <div
              key={delivery._id}
              onClick={() => setSelectedDelivery(delivery)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDelivery?._id === delivery._id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
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

              {delivery.restaurantName && (
                <p className="text-sm text-gray-600 mb-1">
                  🏪 Vers: {delivery.restaurantName}
                </p>
              )}

              {delivery.driverName && (
                <p className="text-sm text-gray-600 mb-1">
                  🚗 Livreur: {delivery.driverName}
                </p>
              )}

              {delivery.estimatedTime && (
                <p className="text-sm text-blue-600 font-medium">
                  ⏱️ Livraison estimée: {delivery.estimatedTime}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Zone de carte et détails */}
        <div className="lg:col-span-3 space-y-4">
          {selectedDelivery ? (
            <>
              {/* Panneau d'informations détaillées */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 shadow-md">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="text-blue-600 w-6 h-6" />
                  Détails de la livraison #{selectedDelivery.orderId?.slice(-8).toUpperCase()}
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Colonne gauche */}
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Statut</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDelivery.status)}`}>
                        {getStatusLabel(selectedDelivery.status)}
                      </span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">🏪 Client Restaurant</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDelivery.restaurantName || 'Non défini'}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">🚗 Livreur assigné</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDelivery.driverName || 'Non assigné'}
                      </p>
                    </div>
                  </div>

                  {/* Colonne droite */}
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">📍 Adresse de collecte (Votre établissement)</p>
                      <p className="font-medium text-gray-900">
                        {selectedDelivery.pickupAddress?.street || 'Non définie'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedDelivery.pickupAddress?.city || ''}
                      </p>
                      {(() => {
                        const coords = getCoordinates(selectedDelivery.pickupAddress);
                        return coords ? (
                          <p className="text-xs text-blue-600 mt-1">
                            GPS: {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                          </p>
                        ) : null;
                      })()}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">🎯 Adresse de livraison (Restaurant client)</p>
                      <p className="font-medium text-gray-900">
                        {selectedDelivery.deliveryAddress?.street || 'Non définie'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedDelivery.deliveryAddress?.city || ''}
                      </p>
                      {(() => {
                        const coords = getCoordinates(selectedDelivery.deliveryAddress);
                        return coords ? (
                          <p className="text-xs text-green-600 mt-1">
                            GPS: {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                          </p>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte interactive */}
              <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg relative">
                {(() => {
                  const pickup = getCoordinates(selectedDelivery.pickupAddress);
                  const dest = getCoordinates(selectedDelivery.deliveryAddress);
                  
                  if (!pickup || !dest) {
                    return (
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-16 w-16 mx-auto mb-3 text-gray-400" />
                          <p className="text-lg font-medium text-gray-600">Coordonnées GPS non disponibles</p>
                          <p className="text-sm text-gray-500 mt-2">Les adresses doivent contenir des coordonnées GPS valides</p>
                        </div>
                      </div>
                    );
                  }

                  const { center, zoom } = getMapCenter(selectedDelivery);

                  return (
                    <Map
                      height={600}
                      center={center}
                      zoom={zoom}
                      mouseEvents={true}
                      touchEvents={true}
                    >
                      <ZoomControl />
                      
                      {/* Marqueur votre établissement (bleu) */}
                      <Marker 
                        width={40} 
                        anchor={pickup}
                        color="#3b82f6"
                        onClick={() => {
                          console.log('Clic sur marqueur collecte:', selectedDelivery.pickupAddress);
                        }}
                      />
                      
                      {/* Marqueur restaurant client (vert) */}
                      <Marker 
                        width={40} 
                        anchor={dest}
                        color="#10b981"
                        onClick={() => {
                          console.log('Clic sur marqueur livraison:', selectedDelivery.deliveryAddress);
                        }}
                      />

                      {/* Marqueur livreur (orange) si en transit */}
                      {selectedDelivery.status === 'in_transit' && (() => {
                        const driverPos: [number, number] = [
                          (pickup[0] + dest[0]) / 2,
                          (pickup[1] + dest[1]) / 2
                        ];
                        return (
                          <Marker 
                            width={40} 
                            anchor={driverPos}
                            color="#f97316"
                            onClick={() => {
                              console.log('Clic sur marqueur livreur');
                            }}
                          />
                        );
                      })()}
                    </Map>
                  );
                })()}

                {/* Overlay simplifié en bas */}
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 border-t-2 border-gray-300 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-600">Collecte (Vous)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Livraison (Client)</span>
                      </div>
                      {selectedDelivery.status === 'in_transit' && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span className="text-xs text-gray-600">Livreur en route</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={fetchActiveDeliveries}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-xs shadow-md"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualiser
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    🔄 Mise à jour automatique toutes les 10 secondes • 🗺️ OpenStreetMap
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">Sélectionnez une livraison</p>
                <p className="text-sm text-gray-500 mt-2">Cliquez sur une livraison dans la liste pour voir les détails et la carte</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
