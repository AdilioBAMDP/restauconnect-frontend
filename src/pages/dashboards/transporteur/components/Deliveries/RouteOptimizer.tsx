import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Zap, Plus, Save, X } from 'lucide-react';

interface RouteStop {
  id: string;
  address: string;
  type: 'pickup' | 'delivery';
  priority: number;
  estimatedTime?: number;
}

interface OptimizedRoute {
  stops: RouteStop[];
  totalDistance: number;
  totalDuration: number;
  fuelEstimate: number;
}

const RouteOptimizer: React.FC = () => {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [newStop, setNewStop] = useState({ address: '', type: 'delivery' as 'pickup' | 'delivery' });
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleAddStop = () => {
    if (!newStop.address) return;
    
    const stop: RouteStop = {
      id: Date.now().toString(),
      address: newStop.address,
      type: newStop.type,
      priority: stops.length + 1
    };
    
    setStops([...stops, stop]);
    setNewStop({ address: '', type: 'delivery' });
  };

  const handleRemoveStop = (id: string) => {
    setStops(stops.filter(s => s.id !== id));
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulation d'optimisation
    setTimeout(() => {
      const optimized: OptimizedRoute = {
        stops: [...stops].sort((a, b) => {
          // Priorité: pickups d'abord, puis deliveries
          if (a.type === 'pickup' && b.type === 'delivery') return -1;
          if (a.type === 'delivery' && b.type === 'pickup') return 1;
          return 0;
        }),
        totalDistance: stops.length * 35 + Math.random() * 50,
        totalDuration: stops.length * 25 + Math.random() * 30,
        fuelEstimate: stops.length * 4.5 + Math.random() * 10
      };
      
      setOptimizedRoute(optimized);
      setIsOptimizing(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Optimisation d'itinéraire</h3>
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Ajouter une étape</h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={newStop.address}
            onChange={(e) => setNewStop({ ...newStop, address: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Adresse de l'étape"
            onKeyPress={(e) => e.key === 'Enter' && handleAddStop()}
          />
          <select
            value={newStop.type}
            onChange={(e) => setNewStop({ ...newStop, type: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="pickup">Enlèvement</option>
            <option value="delivery">Livraison</option>
          </select>
          <button
            onClick={handleAddStop}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des étapes */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">
            Étapes ({stops.length})
          </h4>
          {stops.length >= 2 && (
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isOptimizing ? 'Optimisation...' : 'Optimiser l\'itinéraire'}
            </button>
          )}
        </div>

        {stops.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Aucune étape ajoutée</p>
            <p className="text-sm">Ajoutez au moins 2 étapes pour optimiser l'itinéraire</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {stops.map((stop, index) => (
              <div key={stop.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stop.address}</p>
                    <p className="text-sm text-gray-500">
                      {stop.type === 'pickup' ? '📦 Enlèvement' : '🚚 Livraison'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStop(stop.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Résultats de l'optimisation */}
      {optimizedRoute && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-purple-600" />
            <h4 className="font-bold text-gray-900">Itinéraire optimisé</h4>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Distance totale</p>
              <p className="text-2xl font-bold text-purple-600">
                {optimizedRoute.totalDistance.toFixed(1)} km
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Durée estimée</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.floor(optimizedRoute.totalDuration / 60)}h{(optimizedRoute.totalDuration % 60).toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Carburant estimé</p>
              <p className="text-2xl font-bold text-green-600">
                {optimizedRoute.fuelEstimate.toFixed(1)} L
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">Ordre des étapes optimisé</h5>
            <div className="space-y-2">
              {optimizedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-xs">
                    {index + 1}
                  </div>
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="flex-1 text-sm text-gray-900">{stop.address}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    stop.type === 'pickup' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {stop.type === 'pickup' ? 'Enlèvement' : 'Livraison'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
              <Save className="h-5 w-5" />
              Enregistrer l'itinéraire
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Voir sur la carte
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;
