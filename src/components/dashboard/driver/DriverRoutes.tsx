import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Clock, CheckCircle, AlertCircle, Package } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
  deliveries: number;
  distance: number;
  estimatedTime: string;
  stops: {
    address: string;
    time: string;
    status: 'pending' | 'completed' | 'current';
  }[];
}

interface DriverRoutesProps {
  routes: Route[];
}

export function DriverRoutes({ routes }: DriverRoutesProps) {
  const activeRoute = routes.find(r => r.status === 'active');

  const getStatusBadge = (status: string) => {
    const styles = {
      planned: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      planned: 'Planifié',
      active: 'En cours',
      completed: 'Terminé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mes Itinéraires</h2>

      {/* Active Route Highlight */}
      {activeRoute && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Navigation className="w-6 h-6" />
              <h3 className="text-xl font-bold">Itinéraire actif: {activeRoute.name}</h3>
            </div>
            <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
              Ouvrir GPS
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <Package className="w-5 h-5 mx-auto mb-1" />
              <div className="font-bold">{activeRoute.deliveries} livraisons</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <MapPin className="w-5 h-5 mx-auto mb-1" />
              <div className="font-bold">{activeRoute.distance} km</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <Clock className="w-5 h-5 mx-auto mb-1" />
              <div className="font-bold">{activeRoute.estimatedTime}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Routes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
              {getStatusBadge(route.status)}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span>{route.deliveries} arrêts</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{route.distance} km</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{route.estimatedTime}</span>
              </div>
            </div>

            {/* Stops Preview */}
            <div className="space-y-2 mb-4">
              {route.stops.slice(0, 3).map((stop, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm">
                  {stop.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : stop.status === 'current' ? (
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span className="text-gray-700 truncate flex-1">{stop.address}</span>
                  <span className="text-gray-500">{stop.time}</span>
                </div>
              ))}
              {route.stops.length > 3 && (
                <p className="text-sm text-gray-500 ml-7">+{route.stops.length - 3} autres arrêts</p>
              )}
            </div>

            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              {route.status === 'active' ? 'Continuer' : route.status === 'planned' ? 'Démarrer' : 'Voir détails'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
