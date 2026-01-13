import React, { useState } from 'react';
import { MapPin, Truck, Navigation, ZoomIn, Layers } from 'lucide-react';

interface DeliveryLocation {
  id: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'current';
  status: 'pending' | 'completed';
}

const DeliveryMap: React.FC = () => {
  const [locations] = useState<DeliveryLocation[]>([
    {
      id: '1',
      address: 'Paris 15ème',
      lat: 48.8406,
      lng: 2.2896,
      type: 'pickup',
      status: 'completed'
    },
    {
      id: '2',
      address: 'Véhicule actuel',
      lat: 48.8566,
      lng: 2.3522,
      type: 'current',
      status: 'pending'
    },
    {
      id: '3',
      address: 'Lyon 3ème',
      lat: 45.7640,
      lng: 4.8357,
      type: 'delivery',
      status: 'pending'
    }
  ]);

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Carte des livraisons</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            {mapType === 'roadmap' ? 'Satellite' : 'Plan'}
          </button>
        </div>
      </div>

      {/* Carte (placeholder) */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-300" style={{ height: '500px' }}>
        {/* Simulation de carte */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto text-blue-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">Carte interactive Google Maps</p>
            <p className="text-sm text-gray-500">Intégration Google Maps API ou Leaflet</p>
          </div>
        </div>

        {/* Points sur la carte (simulation) */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
              ✓
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
              Enlèvement ✓
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative animate-pulse">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <Truck className="h-5 w-5" />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap font-medium">
              Position actuelle
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
              📦
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
              Destination
            </div>
          </div>
        </div>

        {/* Contrôles de zoom */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
            <ZoomIn className="h-5 w-5 text-gray-700 rotate-180" />
          </button>
          <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
            <Navigation className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Légende */}
      <div className="grid grid-cols-3 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`p-4 rounded-lg border-2 ${
              location.type === 'current'
                ? 'border-blue-500 bg-blue-50'
                : location.status === 'completed'
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                location.type === 'current'
                  ? 'bg-blue-500 animate-pulse'
                  : location.type === 'pickup'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {location.type === 'current' ? '🚚 ' : location.type === 'pickup' ? '📦 ' : '🏠 '}
                  {location.type === 'current' ? 'Position actuelle' : location.type === 'pickup' ? 'Enlèvement' : 'Livraison'}
                </p>
                <p className="text-xs text-gray-600">{location.address}</p>
              </div>
              {location.status === 'completed' && (
                <span className="text-green-600 text-lg">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Informations de trajet */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Distance parcourue</p>
            <p className="text-lg font-bold text-blue-600">127 km</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Distance restante</p>
            <p className="text-lg font-bold text-purple-600">338 km</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Temps écoulé</p>
            <p className="text-lg font-bold text-green-600">1h42</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">ETA</p>
            <p className="text-lg font-bold text-orange-600">4h18</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
