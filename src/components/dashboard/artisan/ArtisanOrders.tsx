import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package, User, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: { product: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  deliveryDate?: string;
}

interface ArtisanOrdersProps {
  orders: Order[];
}

export function ArtisanOrders({ orders }: ArtisanOrdersProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      processing: 'En préparation',
      completed: 'Terminée',
      cancelled: 'Annulée'
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
        <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'processing', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Toutes' : 
               f === 'pending' ? 'En attente' :
               f === 'processing' ? 'En cours' : 'Terminées'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">Commande #{order.orderNumber}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <User className="w-4 h-4" />
                    <span>{order.customer}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{item.product}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(order.date).toLocaleDateString('fr-FR')}
                </div>
                {order.deliveryDate && (
                  <div className="flex items-center text-blue-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Livraison: {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{order.total.toFixed(2)} €</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
