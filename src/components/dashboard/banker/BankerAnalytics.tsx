import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface BankerAnalyticsProps {
  analytics: {
    monthlyRevenue: number[];
    loansByType: { type: string; count: number; amount: number }[];
    performanceMetrics: {
      roi: number;
      growthRate: number;
      marketShare: number;
    };
  };
}

export function BankerAnalytics({ analytics }: BankerAnalyticsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">ROI Moyen</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{analytics.performanceMetrics.roi.toFixed(2)}%</div>
          <p className="text-sm opacity-90 mt-2">Retour sur investissement</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Croissance</span>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            +{analytics.performanceMetrics.growthRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Croissance annuelle</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Part de marché</span>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {analytics.performanceMetrics.marketShare.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Secteur restauration</p>
        </motion.div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des prêts</h3>
        <div className="space-y-4">
          {analytics.loansByType.map((type, index) => (
            <motion.div
              key={type.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{type.type}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{type.count} prêts</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {(type.amount / 1000).toFixed(0)}K €
                  </span>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-slate-700 h-2 rounded-full"
                  style={{ width: `${(type.amount / Math.max(...analytics.loansByType.map(l => l.amount))) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus mensuels</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Graphique des revenus - À intégrer avec Chart.js</p>
        </div>
      </div>
    </div>
  );
}
