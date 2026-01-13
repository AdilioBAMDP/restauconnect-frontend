import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, Users, DollarSign, Activity, Award } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';

const GeneralAnalyticsPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const kpis = [
    { label: 'Utilisateurs Actifs', value: '1,247', trend: '+12%', icon: Users, color: 'blue' },
    { label: 'Revenus', value: '84,523€', trend: '+18%', icon: DollarSign, color: 'green' },
    { label: 'Transactions', value: '3,456', trend: '+8%', icon: Activity, color: 'purple' },
    { label: 'Satisfaction', value: '4.8/5', trend: '+0.2', icon: Award, color: 'orange' }
  ];

  const activityData = [
    { category: 'Restaurants', users: 342, transactions: 1245, revenue: 35420 },
    { category: 'Artisans', users: 156, transactions: 890, revenue: 18650 },
    { category: 'Fournisseurs', users: 89, transactions: 567, revenue: 15280 },
    { category: 'Investisseurs', users: 124, transactions: 423, revenue: 8950 },
    { category: 'Livreurs', users: 235, transactions: 1890, revenue: 6223 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="analytics" onNavigate={navigateTo} />
      
      <div className="max-w-7xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Analytics Générales
              </h1>
              <p className="text-gray-600 mt-2">Vue d'ensemble de la plateforme Web Spider</p>
            </div>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </motion.div>

        {/* KPIs Globaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">{kpi.label}</p>
                <kpi.icon className={`w-8 h-8 text-${kpi.color}-600`} />
              </div>
              <p className={`text-2xl font-bold text-${kpi.color}-600`}>{kpi.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 text-green-600`} />
                <span className="text-sm font-medium text-green-600">{kpi.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activité par Catégorie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Activité par Catégorie d'Utilisateurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateurs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moy/User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activityData.map((data, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{data.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">{data.users}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-purple-600 font-semibold">{data.transactions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">{data.revenue.toLocaleString()}€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{Math.round(data.revenue / data.users)}€</td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">TOTAL</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                    {activityData.reduce((sum, d) => sum + d.users, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-purple-600">
                    {activityData.reduce((sum, d) => sum + d.transactions, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                    {activityData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700">
                    {Math.round(activityData.reduce((sum, d) => sum + d.revenue, 0) / activityData.reduce((sum, d) => sum + d.users, 0))}€
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* Graphiques de croissance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Croissance Mensuelle</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Nouveaux Utilisateurs</span>
                <span className="text-2xl font-bold">+156</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Croissance</span>
                <span className="text-xl font-semibold text-green-300">+12.4%</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Performance Revenus</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Ce Mois</span>
                <span className="text-2xl font-bold">84,523€</span>
              </div>
              <div className="flex justify-between items-center">
                <span>vs Mois Précédent</span>
                <span className="text-xl font-semibold text-yellow-300">+18.2%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAnalyticsPage;
