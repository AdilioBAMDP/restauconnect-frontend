import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, 
  Target, Award 
} from 'lucide-react';

interface InvestorAnalyticsProps {
  analytics: {
    portfolioPerformance: {
      month: string;
      value: number;
    }[];
    sectorDistribution: {
      sector: string;
      percentage: number;
      value: number;
    }[];
    topPerformers: {
      restaurant: string;
      roi: number;
      amount: number;
    }[];
    riskMetrics: {
      riskScore: number;
      diversification: number;
      volatility: number;
    };
  };
}

export function InvestorAnalytics({ analytics }: InvestorAnalyticsProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { label: 'Faible', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 70) return { label: 'Modéré', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Élevé', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskLevel = getRiskLevel(analytics.riskMetrics.riskScore);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Score de Risque</span>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end space-x-3">
            <div className="text-3xl font-bold text-gray-900">
              {analytics.riskMetrics.riskScore}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskLevel.bg} ${riskLevel.color}`}>
              {riskLevel.label}
            </span>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                analytics.riskMetrics.riskScore <= 30 ? 'bg-green-600' :
                analytics.riskMetrics.riskScore <= 70 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${analytics.riskMetrics.riskScore}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Diversification</span>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {analytics.riskMetrics.diversification}%
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.riskMetrics.diversification >= 80 ? 'Excellente' :
             analytics.riskMetrics.diversification >= 60 ? 'Bonne' : 'À améliorer'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Volatilité</span>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {analytics.riskMetrics.volatility}%
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.riskMetrics.volatility <= 15 ? 'Stable' :
             analytics.riskMetrics.volatility <= 30 ? 'Modérée' : 'Élevée'}
          </p>
        </motion.div>
      </div>

      {/* Sector Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution par Secteur</h3>
        <div className="space-y-4">
          {analytics.sectorDistribution.map((sector, index) => (
            <motion.div
              key={sector.sector}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{sector.sector}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {sector.value.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {sector.percentage}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sector.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="space-y-4">
          {analytics.topPerformers.map((performer, index) => (
            <motion.div
              key={performer.restaurant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900">{performer.restaurant}</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Investi</p>
                  <p className="font-semibold text-gray-900">
                    {performer.amount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {performer.roi >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`text-lg font-bold ${
                    performer.roi >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {performer.roi >= 0 ? '+' : ''}{performer.roi.toFixed(2)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance sur 12 mois</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Graphique de performance mensuelle - À intégrer avec Chart.js</p>
        </div>
      </div>
    </div>
  );
}
