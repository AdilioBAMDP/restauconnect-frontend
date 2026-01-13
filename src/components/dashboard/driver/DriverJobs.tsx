import React from 'react';
import { Package, Truck } from 'lucide-react';
import { getUrgencyColor, getUrgencyLabel, getStatusColor } from '@/utils/dashboard/driverHelpers';

interface TMSDelivery {
  _id: string;
  trackingId: string;
  orderId: {
    _id: string;
    totalAmount: number;
    products: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  restaurantId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  supplierId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  driverId?: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  urgency: 'normal' | 'urgent' | 'express';
  status: 'pending' | 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  specialInstructions?: string;
  deliveryFee: number;
  priority: number;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes: string;
  }>;
  createdAt: string;
  pickupLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  deliveryLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
}

interface DriverJobsProps {
  availableDeliveries: TMSDelivery[];
  myDeliveries: TMSDelivery[];
  onAssignDelivery: (deliveryId: string) => Promise<void>;
  onUpdateStatus: (deliveryId: string, status: string, notes?: string) => Promise<void>;
}

export const DriverJobs: React.FC<DriverJobsProps> = ({
  availableDeliveries,
  myDeliveries,
  onAssignDelivery,
  onUpdateStatus
}) => {
  return (
    <div className="space-y-6">
      {/* Livraisons disponibles */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔍 Livraisons Disponibles (Commandes Restaurants)</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {availableDeliveries.length} disponible(s)
          </span>
        </div>
        
        {availableDeliveries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune livraison disponible pour le moment</p>
            <p className="text-sm">Les nouvelles commandes restaurants apparaîtront ici automatiquement</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableDeliveries.map((delivery) => (
              <div key={delivery._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🍽️</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Restaurant: {delivery.restaurantId.firstName} {delivery.restaurantId.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ID: {delivery.trackingId} • Commande: {delivery.orderId.totalAmount.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(delivery.urgency)}`}>
                      {getUrgencyLabel(delivery.urgency)}
                    </span>
                    <span className="text-lg font-bold text-green-600">{delivery.deliveryFee}€</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">📍 Livraison:</p>
                    <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">⏰ Heure souhaitée:</p>
                    <p className="text-sm text-gray-600">
                      {new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')} à {delivery.deliveryTime}
                    </p>
                  </div>
                </div>
                
                {delivery.specialInstructions && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">💬 Instructions spéciales:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {delivery.specialInstructions}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Fournisseur: {delivery.supplierId.firstName} {delivery.supplierId.lastName}
                  </div>
                  <button
                    onClick={() => onAssignDelivery(delivery._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    🚚 Prendre en charge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mes livraisons en cours */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🚛 Mes Livraisons en Cours</h3>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {myDeliveries.length} active(s)
          </span>
        </div>
        
        {myDeliveries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune livraison en cours</p>
            <p className="text-sm">Prenez en charge une livraison ci-dessus pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myDeliveries.map((delivery) => (
              <div key={delivery._id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🎯</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {delivery.trackingId} • {delivery.deliveryFee}€
                      </h4>
                      <p className="text-sm text-gray-600">
                        Restaurant: {delivery.restaurantId.firstName} {delivery.restaurantId.lastName}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                    {delivery.status === 'assigned' ? '📋 Assignée' :
                     delivery.status === 'pickup' ? '📦 Récupération' :
                     delivery.status === 'in_transit' ? '🚛 En route' :
                     delivery.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">📍 Destination:</p>
                  <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {delivery.status === 'assigned' && (
                    <button
                      onClick={() => onUpdateStatus(delivery._id, 'pickup', 'Récupération en cours')}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      📦 Récupérer
                    </button>
                  )}
                  {delivery.status === 'pickup' && (
                    <button
                      onClick={() => onUpdateStatus(delivery._id, 'in_transit', 'En route vers destination')}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      🚛 En route
                    </button>
                  )}
                  {delivery.status === 'in_transit' && (
                    <button
                      onClick={() => onUpdateStatus(delivery._id, 'delivered', 'Livraison terminée')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      ✅ Livré
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
