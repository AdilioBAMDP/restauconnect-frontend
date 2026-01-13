import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Truck } from 'lucide-react';
import axios from 'axios';

interface VehicleLocation {
  _id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  status: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
}

const FleetMap: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);

  useEffect(() => {
    loadVehicleLocations();
    const interval = setInterval(loadVehicleLocations, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const loadVehicleLocations = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Erreur chargement positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const vehiclesWithLocation = vehicles.filter(v => v.currentLocation);
  const activeVehicles = vehiclesWithLocation.filter(v => v.status === 'in_use');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Carte de la Flotte</h2>
        <p className="text-gray-600 mt-1">Suivi en temps réel de vos véhicules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Véhicules géolocalisés</p>
              <p className="text-2xl font-bold text-gray-900">{vehiclesWithLocation.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Navigation className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En déplacement</p>
              <p className="text-2xl font-bold text-gray-900">{activeVehicles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Positions mises à jour</p>
              <p className="text-xs text-gray-500 mt-1">Toutes les 30 secondes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carte placeholder + Liste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte (à implémenter avec Google Maps ou Leaflet) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Carte interactive</p>
              <p className="text-sm text-gray-500 mt-2">
                Intégration Google Maps / Leaflet à venir
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Affichera tous les véhicules en temps réel avec marqueurs interactifs
              </p>
            </div>
          </div>
        </div>

        {/* Liste des véhicules */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Véhicules actifs</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : vehiclesWithLocation.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun véhicule géolocalisé</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto">
              {vehiclesWithLocation.map((vehicle) => (
                <div
                  key={vehicle._id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedVehicle?._id === vehicle._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{vehicle.registrationNumber}</p>
                      <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      vehicle.status === 'in_use' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {vehicle.status === 'in_use' ? 'En service' : 'Stationnaire'}
                    </span>
                  </div>
                  
                  {vehicle.driver && (
                    <div className="text-sm text-gray-600 mb-2">
                      <p>👨‍✈️ {vehicle.driver.name}</p>
                    </div>
                  )}
                  
                  {vehicle.currentLocation && (
                    <div className="text-xs text-gray-500">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{vehicle.currentLocation.address}</span>
                      </div>
                      <p className="mt-1">
                        Mis à jour: {new Date(vehicle.currentLocation.timestamp).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Astuce:</strong> Les positions sont mises à jour automatiquement toutes les 30 secondes. 
          Cliquez sur un véhicule dans la liste pour le centrer sur la carte.
        </p>
      </div>
    </div>
  );
};

export default FleetMap;
