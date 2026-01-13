import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Download, Wallet, CreditCard } from 'lucide-react';

interface Earning {
  date: string;
  deliveries: number;
  amount: number;
  tips: number;
  bonus: number;
}

interface DriverEarningsProps {
  earnings: {
    daily: Earning[];
    weekly: number;
    monthly: number;
    total: number;
    pending: number;
  };
}

export function DriverEarnings({ earnings }: DriverEarningsProps) {
  const totalEarningsThisWeek = earnings.daily
    .slice(-7)
    .reduce((sum, day) => sum + day.amount + day.tips + day.bonus, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Gains</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Exporter</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Wallet className="w-6 h-6" />
            <span className="text-sm opacity-90">Cette semaine</span>
          </div>
          <div className="text-3xl font-bold">
            {totalEarningsThisWeek.toFixed(2)} €
          </div>
          <div className="flex items-center mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+15% vs semaine dernière</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-500">Ce mois</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {earnings.monthly.toFixed(2)} €
          </div>
          <p className="text-sm text-gray-600 mt-2">Total mensuel</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {earnings.total.toFixed(2)} €
          </div>
          <p className="text-sm text-gray-600 mt-2">Tous les gains</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-6 h-6 text-yellow-600" />
            <span className="text-sm text-gray-500">En attente</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {earnings.pending.toFixed(2)} €
          </div>
          <p className="text-sm text-gray-600 mt-2">À virer</p>
        </motion.div>
      </div>

      {/* Daily Earnings */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détail des gains quotidiens</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Livraisons</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Base</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pourboires</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {earnings.daily.slice(-14).reverse().map((day, index) => {
                const total = day.amount + day.tips + day.bonus;
                return (
                  <motion.tr
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {day.deliveries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {day.amount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                      +{day.tips.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-medium">
                      +{day.bonus.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      {total.toFixed(2)} €
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des gains</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Graphique des gains - À intégrer avec Chart.js</p>
        </div>
      </div>
    </div>
  );
}
