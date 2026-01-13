import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package, Eye, Phone, Star } from 'lucide-react';
import { getOrderStatusColor, getOrderStatusLabel } from '@/utils/dashboard/supplierHelpers';

interface SupplierStats {
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalClients: number;
  totalProducts: number;
}

interface OrderItem {
  productName: string;
  quantity: number;
}

interface Order {
  id: string;
  restaurantName: string;
  status: string;
  items: OrderItem[];
  orderDate: string;
  expectedDelivery?: string;
  totalAmount: number;
}

interface Client {
  id: string;
  restaurantName: string;
  totalOrders: number;
  lastOrder: string;
  totalSpent: number;
  rating: number;
}

interface SupplierOverviewProps {
  supplierStats: SupplierStats;
  supplierOrders: Order[];
  supplierClients: Client[];
  setActiveTab: (tab: 'overview' | 'catalog' | 'orders' | 'clients' | 'banques' | 'analytics' | 'wms') => void;
}

export const SupplierOverview: React.FC<SupplierOverviewProps> = ({
  supplierStats,
  supplierOrders,
  supplierClients,
  setActiveTab
}) => {
  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-gray-900">{supplierStats.monthlyRevenue}€</p>
              <p className="text-xs text-green-600">+12% ce mois</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-gray-900">{supplierStats.totalOrders}</p>
              <p className="text-xs text-blue-600">{supplierStats.pendingOrders} en attente</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clients Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{supplierStats.totalClients}</p>
              <p className="text-xs text-purple-600">Actifs ce mois</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Articles Catalogue</p>
              <p className="text-2xl font-bold text-gray-900">{supplierStats.totalProducts}</p>
              <p className="text-xs text-orange-600">En stock</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-2 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Commandes Récentes</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir toutes →
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {supplierOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">#{order.id}</h4>
                    <span className="text-gray-500">•</span>
                    <span className="font-medium text-blue-600 text-sm">{order.restaurantName}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {order.items.map(item => `${item.productName} x${item.quantity}`).join(' • ')}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>📅 {new Date(order.orderDate).toLocaleDateString('fr-FR')}</span>
                    {order.expectedDelivery && (
                      <span>🚚 {new Date(order.expectedDelivery).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">{order.totalAmount}€</p>
                  <div className="flex space-x-1 mt-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                      <Phone className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Clients */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Meilleurs Clients</h3>
        </div>
        <div className="p-3">
          <div className="space-y-2">
            {supplierClients.map((client, index) => (
              <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{client.restaurantName}</h4>
                    <p className="text-xs text-gray-600">{client.totalOrders} commandes • {new Date(client.lastOrder).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">{client.totalSpent}€</p>
                  <div className="flex items-center justify-end space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{client.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant - Désactivé */}
    </div>
  );
};
