import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Package, Truck, Clock, Navigation } from 'lucide-react';
import { apiClient } from '@/services/api';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

interface ActiveDelivery {
  _id: string;
  orderId: string;
  status: 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'cancelled';
  driverName?: string;
  supplierName?: string;
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

export const RestaurantOrderTrackingMap: React.FC = () => {
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

  // ✅ CORRIGÉ: Utilisation de apiClient au lieu de fetch pour gérer automatiquement l'auth
  const fetchActiveDeliveries = useCallback(async () => {
    try {
      // ✅ NOUVEAU: Vérifier si l'utilisateur est connecté avant d'appeler l'API
      const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('token');
      
      console.log('🗺️ [TRACKING] Fetching deliveries...', { hasToken: !!token });
      
      if (!token) {
        console.warn('🗺️ [TRACKING] Pas de token - skip API call');
        setLoading(false);
        return;
      }

      const response = await apiClient.get('/tms/deliveries/my-deliveries');
      
      console.log('🗺️ [TRACKING] API Response:', { 
        success: response.data?.success,
        count: response.data?.deliveries?.length,
        deliveries: response.data?.deliveries 
      });
      
      if (response.data && response.data.deliveries) {
        // Filtrer uniquement les livraisons actives (pas encore livrées)
        const active = response.data.deliveries.filter((d: ActiveDelivery) => 
          d.status !== 'delivered' && d.status !== 'cancelled'
        );
        console.log('🗺️ [TRACKING] Active deliveries:', active.length, active);
        setActiveDeliveries(active);
        if (active.length > 0 && !selectedDelivery) {
          setSelectedDelivery(active[0]);
        }
      }
    } catch (error) {
      console.error('🗺️ [TRACKING] Erreur chargement livraisons:', error);
      // ✅ NOUVEAU: Ne plus réessayer si erreur 401
      if (error instanceof Error && error.message.includes('Non authentifi')) {
        setLoading(false);
        return; // Arrêter les tentatives
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDelivery]); // ✅ CORRIGÉ: Ajout de selectedDelivery comme dépendance

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
        return '📋 Assignée';
      case 'pickup':
        return '📦 Récupération en cours';
      case 'in_transit':
        return '🚛 En route vers vous';
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Liste des livraisons actives */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {activeDeliveries.map((delivery) => (
            <div
              key={delivery._id || delivery.orderId}
              onClick={() => {
                console.log('🎯 Livraison sélectionnée:', delivery);
                setSelectedDelivery(delivery);
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDelivery?._id === delivery._id
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 hover:border-emerald-300 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(delivery.status)}
                  <span className="font-medium text-gray-900">
                    #{(delivery.orderId as any)?.slice?.(-6) || 'N/A'}
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
              
              {!delivery.driverName && !delivery.supplierName && (
                <p className="text-xs text-gray-400 italic mt-2">
                  Cliquez pour voir les détails sur la carte
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Zone de carte interactive */}
        <div className="lg:col-span-3 space-y-3">
          {/* Panneau d'informations détaillées */}
          {selectedDelivery && (
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border-2 border-emerald-200 shadow-md">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Commande</p>
                  <p className="font-bold text-gray-900">
                    #{(selectedDelivery.orderId as any)?.slice?.(-8)?.toUpperCase() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Statut</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedDelivery.status)}`}>
                    {getStatusLabel(selectedDelivery.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Fournisseur</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDelivery.supplierName || 'Non défini'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Livreur</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDelivery.driverName || 'Non assigné'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">📍 Adresse départ</p>
                  <p className="text-sm text-gray-700">
                    {selectedDelivery.pickupAddress?.street || 'N/A'}, {selectedDelivery.pickupAddress?.city || 'N/A'}
                  </p>
                  {selectedDelivery.pickupAddress?.latitude && (
                    <p className="text-xs text-gray-500">
                      GPS: [{selectedDelivery.pickupAddress.latitude}, {selectedDelivery.pickupAddress.longitude}]
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">🎯 Adresse livraison</p>
                  <p className="text-sm text-gray-700">
                    {selectedDelivery.deliveryAddress?.street || 'N/A'}, {selectedDelivery.deliveryAddress?.city || 'N/A'}
                  </p>
                  {selectedDelivery.deliveryAddress?.latitude && (
                    <p className="text-xs text-gray-500">
                      GPS: [{selectedDelivery.deliveryAddress.latitude}, {selectedDelivery.deliveryAddress.longitude}]
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200 relative shadow-lg">
            {selectedDelivery ? (
              <>
                {/* Carte OpenStreetMap interactive (Pigeon Maps) */}
                {(() => {
                  const pickup = getCoordinates(selectedDelivery.pickupAddress);
                  const dest = getCoordinates(selectedDelivery.deliveryAddress);
                  
                  console.log('🗺️ [MAP] Coordonnées:', { pickup, dest });
                  
                  if (!pickup || !dest) {
                    return (
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Coordonnées GPS non disponibles</p>
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
                      
                      {/* Marqueur point de départ (bleu) */}
                      <Marker 
                        width={40} 
                        anchor={pickup}
                        color="#3b82f6"
                        onClick={() => {
                          alert(`📦 Point de départ\n${selectedDelivery.supplierName}\n${selectedDelivery.pickupAddress?.street}, ${selectedDelivery.pickupAddress?.city}`);
                        }}
                      />
                      
                      {/* Marqueur destination (vert) */}
                      <Marker 
                        width={40} 
                        anchor={dest}
                        color="#10b981"
                        onClick={() => {
                          alert(`🏪 Votre restaurant\n${selectedDelivery.deliveryAddress?.street}, ${selectedDelivery.deliveryAddress?.city}`);
                        }}
                      />

                      {/* Marqueur livreur (orange) si en transit */}
                      {selectedDelivery.status === 'in_transit' && (() => {
                        // Position simulée à mi-chemin
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
                              alert(`🚗 ${selectedDelivery.driverName || 'Livreur'}\n${selectedDelivery.estimatedTime || 'En cours de livraison'}`);
                            }}
                          />
                        );
                      })()}
                    </Map>
                  );
                })()}

                {/* Info overlay compact en bas */}
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 border-t-2 border-emerald-200 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedDelivery.status)}`}>
                        {getStatusLabel(selectedDelivery.status)}
                      </span>
                      {selectedDelivery.estimatedTime && (
                        <span className="text-sm text-emerald-700 font-medium">
                          ⏱️ {selectedDelivery.estimatedTime}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={fetchActiveDeliveries}
                      className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm shadow-md"
                    >
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualiser
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">Sélectionnez une livraison pour voir la carte</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
