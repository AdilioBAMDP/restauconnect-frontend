import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, TrendingUp, Mail, Phone, MapPin, Award, Euro } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  loyalty: 'bronze' | 'silver' | 'gold';
}

const ArtisanCustomersPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/artisan/customers')
      .then(res => {
        setCustomers(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement des clients');
        setLoading(false);
      });
  }, []);

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / (customers.reduce((sum, c) => sum + c.totalOrders, 0) || 1);

  const getLoyaltyColor = (loyalty: string) => {
    const colors = { bronze: 'bg-orange-100 text-orange-700', silver: 'bg-gray-100 text-gray-700', gold: 'bg-yellow-100 text-yellow-700' };
    return colors[loyalty as keyof typeof colors] || '';
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement des clients…</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="artisan-customers" onNavigate={navigateTo} />
      
      <div className="max-w-7xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Mes Clients
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revenu Total</p>
                <p className="text-2xl font-bold text-green-600">{totalRevenue.toFixed(2)}€</p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Panier Moyen</p>
                <p className="text-2xl font-bold text-purple-600">{avgOrderValue.toFixed(2)}€</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          {customers.map((customer, i) => (
            <motion.div key={customer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-600">Client #{customer.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLoyaltyColor(customer.loyalty)}`}>
                  <Award className="w-3 h-3 inline mr-1" />
                  {customer.loyalty.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{customer.totalSpent.toFixed(2)}€</p>
                  <p className="text-xs text-gray-500">Total Dépensé</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{customer.lastOrder}</p>
                  <p className="text-xs text-gray-500">Dernière Commande</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtisanCustomersPage;
