import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Clock, CheckCircle, Package, Filter, Euro, User } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';
import axios from 'axios';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  date: string;
  deliveryTime?: string;
}

const ArtisanOrdersPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/artisan/orders')
      .then(res => {
        setOrders(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement des commandes');
        setLoading(false);
      });
  }, []);

  const filtered = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700',
      preparing: 'bg-blue-100 text-blue-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-purple-100 text-purple-700'
    };
    return colors[status as keyof typeof colors] || '';
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement des commandes…</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const getStatusLabel = (status: string) => {
    const labels = { pending: 'En attente', preparing: 'En préparation', ready: 'Prête', delivered: 'Livrée' };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="artisan-orders" onNavigate={navigateTo} />
      
      <div className="max-w-7xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            Mes Commandes
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Commandes', value: orders.length, icon: ShoppingBag, color: 'blue' },
            { label: 'En Préparation', value: orders.filter(o => o.status === 'preparing').length, icon: Clock, color: 'orange' },
            { label: 'Prêtes', value: orders.filter(o => o.status === 'ready').length, icon: CheckCircle, color: 'green' },
            { label: 'Revenu', value: `${totalRevenue.toFixed(2)}€`, icon: Euro, color: 'purple' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="preparing">En préparation</option>
              <option value="ready">Prêtes</option>
              <option value="delivered">Livrées</option>
            </select>
          </div>
        </motion.div>

        <div className="space-y-4">
          {filtered.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{order.items} articles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{order.date}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{order.total.toFixed(2)}€</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtisanOrdersPage;
