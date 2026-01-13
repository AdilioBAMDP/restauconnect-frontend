import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Award, Package, Clock } from 'lucide-react';

interface EarningRecord {
  date: string;
  deliveries: number;
  distance: number;
  earnings: number;
  tips: number;
  hours: number;
}

const DriverEarningsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const [weeklyEarnings] = useState<EarningRecord[]>([
    { date: '2024-10-07', deliveries: 12, distance: 45.3, earnings: 138, tips: 24, hours: 8 },
    { date: '2024-10-06', deliveries: 10, distance: 38.7, earnings: 115, tips: 18, hours: 7 },
    { date: '2024-10-05', deliveries: 15, distance: 52.1, earnings: 172, tips: 32, hours: 9 },
    { date: '2024-10-04', deliveries: 11, distance: 41.2, earnings: 128, tips: 21, hours: 7.5 },
    { date: '2024-10-03', deliveries: 13, distance: 47.8, earnings: 145, tips: 27, hours: 8 },
    { date: '2024-10-02', deliveries: 14, distance: 49.5, earnings: 158, tips: 29, hours: 8.5 },
    { date: '2024-10-01', deliveries: 9, distance: 35.2, earnings: 102, tips: 15, hours: 6.5 }
  ]);

  const totalDeliveries = weeklyEarnings.reduce((sum, r) => sum + r.deliveries, 0);
  const totalEarnings = weeklyEarnings.reduce((sum, r) => sum + r.earnings, 0);
  const totalTips = weeklyEarnings.reduce((sum, r) => sum + r.tips, 0);
  const totalHours = weeklyEarnings.reduce((sum, r) => sum + r.hours, 0);
  const avgPerHour = Math.round((totalEarnings + totalTips) / totalHours);
  const totalDistance = weeklyEarnings.reduce((sum, r) => sum + r.distance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                Mes Gains
              </h1>
              <p className="text-gray-600 mt-2">Suivez vos revenus et performances</p>
            </div>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </motion.div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Gagné</p>
                <p className="text-3xl font-bold">{totalEarnings + totalTips}€</p>
                <p className="text-sm text-green-100 mt-1">+{totalTips}€ en pourboires</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-200" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Livraisons</p>
                <p className="text-2xl font-bold text-blue-600">{totalDeliveries}</p>
                <p className="text-sm text-gray-500 mt-1">{totalDistance.toFixed(1)} km</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Gain/Heure</p>
                <p className="text-2xl font-bold text-purple-600">{avgPerHour}€</p>
                <p className="text-sm text-gray-500 mt-1">{totalHours}h travaillées</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Performance</p>
                <p className="text-2xl font-bold text-orange-600">Excellent</p>
                <p className="text-sm text-gray-500 mt-1">Top 10%</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>
        </div>

        {/* Graphique revenus par jour */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Revenus Journaliers
          </h2>

          <div className="space-y-4">
            {weeklyEarnings.map((record) => {
              const total = record.earnings + record.tips;
              const maxTotal = Math.max(...weeklyEarnings.map(r => r.earnings + r.tips));
              const percentage = (total / maxTotal) * 100;

              return (
                <div key={record.date} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-24">
                        {new Date(record.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{record.deliveries} courses</span>
                        <span>•</span>
                        <span>{record.hours}h</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{total}€</p>
                        <p className="text-xs text-gray-500">{record.earnings}€ + {record.tips}€</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Détails hebdomadaires */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Détails de la Semaine
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraisons</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heures</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gains</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pourboires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">€/h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {weeklyEarnings.map((record, index) => {
                  const hourlyRate = Math.round((record.earnings + record.tips) / record.hours);
                  
                  return (
                    <motion.tr key={record.date} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.deliveries}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.distance} km</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.hours}h</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{record.earnings}€</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">+{record.tips}€</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">{record.earnings + record.tips}€</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{hourlyRate}€</td>
                    </motion.tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">TOTAL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totalDeliveries}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totalDistance.toFixed(1)} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totalHours}h</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totalEarnings}€</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">+{totalTips}€</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">{totalEarnings + totalTips}€</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{avgPerHour}€</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverEarningsPage;
