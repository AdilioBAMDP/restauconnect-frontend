import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, CheckCircle, XCircle, Phone, MessageSquare } from 'lucide-react';

interface Delivery {
  id: string;
  orderNumber: string;
  restaurant: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: number;
  scheduledTime: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  payment: number;
  notes?: string;
}

interface DriverDeliveriesProps {
  deliveries: Delivery[];
}

export function DriverDeliveries({ deliveries }: DriverDeliveriesProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');

  const filteredDeliveries = deliveries.filter(d => 
    filter === 'all' || d.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_transit':
        return <Package className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      in_transit: 'En transit',
      delivered: 'Livrée',
      failed: 'Échouée'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Livraisons</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'in_transit', 'delivered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Toutes' : 
               f === 'pending' ? 'En attente' :
               f === 'in_transit' ? 'En cours' : 'Livrées'}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDeliveries.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-gray-500 bg-white rounded-lg shadow">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucune livraison trouvée</p>
          </div>
        ) : (
          filteredDeliveries.map((delivery, index) => (
            <motion.div
              key={delivery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">#{delivery.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{delivery.restaurant}</p>
                  </div>
                </div>
                {getStatusBadge(delivery.status)}
              </div>

              {/* Customer Info */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{delivery.customer.name}</p>
                    <p className="text-sm text-gray-600">{delivery.customer.address}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{delivery.scheduledTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{delivery.items} article{delivery.items > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {delivery.notes && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note: </span>
                    {delivery.notes}
                  </p>
                </div>
              )}

              {/* Payment */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Paiement</span>
                <span className="text-lg font-bold text-green-600">
                  {delivery.payment.toFixed(2)} €
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
