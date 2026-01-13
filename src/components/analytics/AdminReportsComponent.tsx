import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/components/utils/logger';
import { 
  BarChart3, 
  LineChart, 
  Download, 
  TrendingUp, 
  FileText, 
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw
} from 'lucide-react';

interface MonthlyCommissions {
  current: number;
  previous: number;
  growth: number;
}

interface CommissionData {
  periodData: Array<{
    _id: { year: number; month: number; day?: number };
    totalCommissions: number;
    transactionCount: number;
    avgCommission: number;
  }>;
  summary: {
    totalCommissions: number;
    totalTransactions: number;
    avgCommissionPerTransaction: number;
  };
}

interface TransferData {
  totalTransfers: number;
  totalAmount: number;
  successRate: number;
  automationRate: number;
}

interface UserData {
  topCommissionGenerators: Array<{
    _id: string;
    userType: string;
    totalCommissions: number;
    transactionCount: number;
  }>;
}

interface TrendComparison {
  revenue: { current: number; previous: number; change: number; trend: string };
  transactions: { current: number; previous: number; change: number; trend: string };
}

interface PredictionData {
  nextPeriod: { expectedRevenue: number; expectedTransactions: number; confidence: string };
}

interface ReportData {
  period: {
    start: string;
    end: string;
    duration: string;
  };
  summary: {
    currentBalance: number;
    totalCommissionsCollected: number;
    monthlyCommissions: MonthlyCommissions;
    averageDailyRevenue: number;
  };
  details: {
    commissions?: CommissionData;
    transfers?: TransferData;
    users?: UserData;
  };
  trends: {
    comparison: TrendComparison;
    prediction: PredictionData;
    analysis: string[];
  };
  generatedAt: string;
}

interface FilterParams {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month';
  reportType: string;
  includeUsers: boolean;
  includeCommissions: boolean;
  includeTransfers: boolean;
}

const AdminReportsComponent: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'exports'>('overview');
  const [filters, setFilters] = useState<FilterParams>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    groupBy: 'day',
    reportType: 'revenue_summary',
    includeUsers: true,
    includeCommissions: true,
    includeTransfers: true
  });

  // Génération du rapport
  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation de données pour le développement
      const mockData: ReportData = {
        period: {
          start: filters.startDate,
          end: filters.endDate,
          duration: `${Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours`
        },
        summary: {
          currentBalance: 25430.50,
          totalCommissionsCollected: 89765.30,
          monthlyCommissions: {
            current: 12350.75,
            previous: 10890.25,
            growth: 13.4
          },
          averageDailyRevenue: 412.25
        },
        details: {
          commissions: {
            periodData: [
              { _id: { year: 2024, month: 10, day: 1 }, totalCommissions: 450.30, transactionCount: 12, avgCommission: 37.53 },
              { _id: { year: 2024, month: 10, day: 2 }, totalCommissions: 523.80, transactionCount: 15, avgCommission: 34.92 },
              { _id: { year: 2024, month: 10, day: 3 }, totalCommissions: 389.20, transactionCount: 9, avgCommission: 43.24 }
            ],
            summary: {
              totalCommissions: 1363.30,
              totalTransactions: 36,
              avgCommissionPerTransaction: 37.87
            }
          },
          transfers: {
            totalTransfers: 3,
            totalAmount: 15000,
            successRate: 100,
            automationRate: 67
          },
          users: {
            topCommissionGenerators: [
              { _id: 'user_1', userType: 'restaurant', totalCommissions: 1250.50, transactionCount: 25 },
              { _id: 'user_2', userType: 'artisan', totalCommissions: 980.30, transactionCount: 18 },
              { _id: 'user_3', userType: 'fournisseur', totalCommissions: 756.20, transactionCount: 15 }
            ]
          }
        },
        trends: {
          comparison: {
            revenue: { current: 1363.30, previous: 1205.40, change: 13.1, trend: 'up' },
            transactions: { current: 36, previous: 32, change: 12.5, trend: 'up' }
          },
          prediction: {
            nextPeriod: { expectedRevenue: 1542.20, expectedTransactions: 41, confidence: 'high' }
          },
          analysis: [
            '📈 Excellente croissance des revenus: +13.1%',
            '🚀 Forte augmentation de l\'activité: +12.5% transactions'
          ]
        },
        generatedAt: new Date().toISOString()
      };

      setReportData(mockData);
    } catch (error) {
      logger.error('Erreur lors de la génération du rapport', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Export CSV
  const exportCSV = async () => {
    if (!reportData) return;
    
    try {
      const csvContent = generateCSVContent();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rapport_revenus_${filters.startDate}_${filters.endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      logger.error('Erreur lors de l\'export CSV', error);
    }
  };

  // Génération contenu CSV
  const generateCSVContent = (): string => {
    if (!reportData) return '';
    
    let csv = 'Type,Valeur\n';
    csv += `Période de,${reportData.period.start}\n`;
    csv += `Période à,${reportData.period.end}\n`;
    csv += `Solde actuel,${reportData.summary.currentBalance}\n`;
    csv += `Total commissions,${reportData.summary.totalCommissionsCollected}\n`;
    csv += `Revenu quotidien moyen,${reportData.summary.averageDailyRevenue}\n`;
    
    if (reportData.details.commissions) {
      csv += '\nDate,Commissions,Transactions,Moyenne\n';
      reportData.details.commissions.periodData.forEach((period) => {
        const date = `${period._id.year}-${period._id.month}-${period._id.day || '01'}`;
        csv += `${date},${period.totalCommissions},${period.transactionCount},${period.avgCommission}\n`;
      });
    }
    
    return csv;
  };

  // Chargement initial
  useEffect(() => {
    generateReport();
  }, [generateReport]);

  // Render des métriques clés
  const renderKeyMetrics = () => {
    if (!reportData) return null;

    const metrics = [
      {
        title: 'Revenus Période',
        value: `${reportData.details.commissions?.summary.totalCommissions.toFixed(2)}€`,
        change: reportData.trends.comparison.revenue.change,
        trend: reportData.trends.comparison.revenue.trend,
        icon: Euro
      },
      {
        title: 'Transactions',
        value: reportData.details.commissions?.summary.totalTransactions.toString(),
        change: reportData.trends.comparison.transactions.change,
        trend: reportData.trends.comparison.transactions.trend,
        icon: BarChart3
      },
      {
        title: 'Revenu Moyen/Jour',
        value: `${reportData.summary.averageDailyRevenue.toFixed(2)}€`,
        change: 0,
        trend: 'neutral' as const,
        icon: TrendingUp
      },
      {
        title: 'Prédiction Prochaine Période',
        value: `${reportData.trends.prediction.nextPeriod.expectedRevenue.toFixed(2)}€`,
        change: 0,
        trend: 'neutral' as const,
        icon: LineChart
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                metric.trend === 'up' ? 'bg-green-100 text-green-600' :
                metric.trend === 'down' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <metric.icon className="w-5 h-5" />
              </div>
              {metric.change !== 0 && (
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(metric.change)}%
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rapports Financiers</h2>
            <p className="text-gray-600">Analyses détaillées et exports des données financières</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Génération...' : 'Actualiser'}
            </button>
            
            <button
              onClick={exportCSV}
              disabled={!reportData || loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Groupement</label>
            <select
              value={filters.groupBy}
              onChange={(e) => setFilters(prev => ({ ...prev, groupBy: e.target.value as 'day' | 'week' | 'month' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Par jour</option>
              <option value="week">Par semaine</option>
              <option value="month">Par mois</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type rapport</label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="revenue_summary">Résumé revenus</option>
              <option value="commission_details">Détails commissions</option>
              <option value="user_performance">Performance utilisateurs</option>
              <option value="transfer_analytics">Analytics transferts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'charts', label: 'Graphiques', icon: LineChart },
              { id: 'exports', label: 'Exports', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'charts' | 'exports')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {renderKeyMetrics()}
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Résumé de Performance
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        +{reportData?.trends.comparison.revenue.change}%
                      </div>
                      <div className="text-sm text-green-700">Croissance revenus</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {reportData?.details.commissions?.summary.totalTransactions}
                      </div>
                      <div className="text-sm text-blue-700">Transactions période</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {reportData?.details.users?.topCommissionGenerators.length}
                      </div>
                      <div className="text-sm text-purple-700">Utilisateurs actifs</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Graphiques Interactifs</h3>
                  <p className="text-gray-500">Les graphiques avancés seront disponibles dans la prochaine version</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'exports' && (
              <motion.div
                key="exports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-900">Export CSV</h3>
                    </div>
                    <p className="text-green-700 text-sm mb-4">
                      Exportez les données en format CSV pour analyse externe
                    </p>
                    <button
                      onClick={exportCSV}
                      disabled={!reportData}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      Télécharger CSV
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-blue-900">Export PDF</h3>
                    </div>
                    <p className="text-blue-700 text-sm mb-4">
                      Rapport formaté PDF pour présentation
                    </p>
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Bientôt disponible
                    </button>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-purple-900">Rapports Programmés</h3>
                    </div>
                    <p className="text-purple-700 text-sm mb-4">
                      Automatisation des rapports périodiques
                    </p>
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Configuration
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsComponent;
