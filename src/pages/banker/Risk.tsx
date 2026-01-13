import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface RiskMetric {
  category: string;
  value: number;
  threshold: number;
  status: 'safe' | 'warning' | 'danger';
  trend: 'up' | 'down' | 'stable';
}

interface PortfolioSegment {
  type: string;
  exposure: number;
  percentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  defaultRate: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  date: string;
}

const BankerRiskPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Métriques de risque
  const [riskMetrics] = useState<RiskMetric[]>([
    {
      category: 'Taux de Défaut',
      value: 2.3,
      threshold: 5.0,
      status: 'safe',
      trend: 'down'
    },
    {
      category: 'Ratio Prêts/Dépôts',
      value: 78,
      threshold: 85,
      status: 'safe',
      trend: 'stable'
    },
    {
      category: 'Concentration Risque',
      value: 68,
      threshold: 70,
      status: 'warning',
      trend: 'up'
    },
    {
      category: 'Provisions pour Pertes',
      value: 3.2,
      threshold: 3.0,
      status: 'warning',
      trend: 'up'
    }
  ]);

  // Segmentation du portefeuille
  const [portfolioSegments] = useState<PortfolioSegment[]>([
    {
      type: 'Restaurants',
      exposure: 205000,
      percentage: 45,
      riskLevel: 'medium',
      defaultRate: 2.5
    },
    {
      type: 'Artisans',
      exposure: 105000,
      percentage: 23,
      riskLevel: 'low',
      defaultRate: 1.2
    },
    {
      type: 'Fournisseurs',
      exposure: 145000,
      percentage: 32,
      riskLevel: 'low',
      defaultRate: 0.8
    }
  ]);

  // Alertes
  const [alerts] = useState<Alert[]>([
    {
      id: 'A001',
      type: 'warning',
      title: 'Concentration de Risque Élevée',
      message: 'Le portefeuille présente une concentration de 68% sur le secteur restauration',
      date: '2024-10-07'
    },
    {
      id: 'A002',
      type: 'danger',
      title: 'Client en Défaut de Paiement',
      message: 'Café du Commerce (ID: C007) n\'a pas effectué son paiement mensuel',
      date: '2024-10-05'
    },
    {
      id: 'A003',
      type: 'info',
      title: 'Amélioration du Score Moyen',
      message: 'Le score de crédit moyen du portefeuille a augmenté de 5 points ce mois',
      date: '2024-10-03'
    },
    {
      id: 'A004',
      type: 'warning',
      title: 'Provisions Insuffisantes',
      message: 'Les provisions pour pertes sont légèrement au-dessus du seuil recommandé',
      date: '2024-10-01'
    }
  ]);

  const totalExposure = portfolioSegments.reduce((sum, seg) => sum + seg.exposure, 0);
  const avgDefaultRate = portfolioSegments.reduce((sum, seg) => sum + seg.defaultRate * seg.percentage / 100, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'danger': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'danger': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-600" />
                Gestion des Risques
              </h1>
              <p className="text-gray-600 mt-2">
                Analyse et surveillance du portefeuille de prêts
              </p>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'month' | 'quarter' | 'year')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </motion.div>

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Exposition Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalExposure.toLocaleString()}€
                </p>
              </div>
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Taux de Défaut Moyen</p>
                <p className="text-2xl font-bold text-green-600">
                  {avgDefaultRate.toFixed(1)}%
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Alertes Actives</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => a.type === 'warning' || a.type === 'danger').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Score de Santé</p>
                <p className="text-2xl font-bold text-green-600">85/100</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Métriques de Risque */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Indicateurs de Risque Clés
            </h2>

            <div className="space-y-6">
              {riskMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {metric.category}
                      </span>
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                      {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === 'safe' ? 'bg-green-600' :
                          metric.status === 'warning' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${(metric.value / metric.threshold) * 100}%` }}
                      />
                    </div>
                    <div
                      className="absolute top-0 w-0.5 h-2 bg-gray-400"
                      style={{ left: '100%' }}
                      title={`Seuil: ${metric.threshold}%`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Actuel: {metric.value}%</span>
                    <span>Seuil: {metric.threshold}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Segmentation du Portefeuille */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-purple-600" />
              Répartition du Portefeuille
            </h2>

            <div className="space-y-4">
              {portfolioSegments.map((segment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{segment.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(segment.riskLevel)}`}>
                      {getRiskLevelLabel(segment.riskLevel)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Exposition</span>
                      <span className="font-semibold text-gray-900">
                        {segment.exposure.toLocaleString()}€
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Part du portefeuille</span>
                      <span className="font-semibold text-gray-900">
                        {segment.percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taux de défaut</span>
                      <span className={`font-semibold ${
                        segment.defaultRate < 2 ? 'text-green-600' :
                        segment.defaultRate < 5 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {segment.defaultRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Exposition</span>
                <span className="font-bold text-gray-900">
                  {totalExposure.toLocaleString()}€
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alertes et Recommandations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-purple-600" />
            Alertes et Recommandations
          </h2>

          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <span className="text-xs text-gray-500">{alert.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BankerRiskPage;
