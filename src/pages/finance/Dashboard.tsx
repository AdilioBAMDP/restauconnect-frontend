import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { logger } from '@/utils/logger';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import { PageName } from '@/services/NavigationManager';
import {
  Euro, TrendingUp, BarChart3, PieChart, Building, RefreshCw, 
  CreditCard, Download, ArrowLeft
} from 'lucide-react';
import Header from '@/components/layout/Header';

// Interface pour les statistiques financières restaurant
interface RestaurantFinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyAverage: number;
  customerCount: number;
  averageTicket: number;
  serviceCharges: number;
  transactionHistory: Array<{
    id: string;
    type: 'service_personnel' | 'service_artisan' | 'service_fournisseur';
    provider: string;
    amount: number;
    serviceCharge: number;
    status: 'completed' | 'pending' | 'cancelled';
    date: string;
    description: string;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

const FinancesPage: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);

  const [financialStats, setFinancialStats] = useState<RestaurantFinancialStats | null>(null);
  const [loadingFinancials, setLoadingFinancials] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState('last_month');

  // Chargement des données financières
  const loadFinancialStats = async () => {
    setLoadingFinancials(true);
    try {
      // TODO: Implémenter appel API réel pour les statistiques financières
      // const stats = await financialService.getRestaurantStats();
      // setFinancialStats(stats);
      
      // Pour l'instant, pas de données disponibles
      setFinancialStats(null);
    } catch (error) {
      logger.error('Erreur lors du chargement des données financières restaurant', error);
      setFinancialStats(null);
    } finally {
      setLoadingFinancials(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'service_personnel': return 'text-blue-600 bg-blue-100';
      case 'service_artisan': return 'text-green-600 bg-green-100';
      case 'service_fournisseur': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'service_personnel': return 'Personnel';
      case 'service_artisan': return 'Artisan';
      case 'service_fournisseur': return 'Fournisseur';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Filtrage des transactions
  const filteredTransactions = financialStats?.transactionHistory.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  }) || [];

  // ✅ NAVIGATION INTELLIGENTE - Correction audit octobre 2025
  const { userDashboard } = useUserDashboardNavigation();

  useEffect(() => {
    loadFinancialStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      
      
      <Header currentPage="finances" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigateToString(userDashboard)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au tableau de bord
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Euro className="w-8 h-8 text-green-600" />
                </div>
                💰 Finances Restaurant
              </h1>
              <p className="text-gray-600 mt-2">Gestion complète de vos finances et transactions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadFinancialStats}
                disabled={loadingFinancials}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loadingFinancials ? 'animate-spin' : ''}`} />
                {loadingFinancials ? 'Chargement...' : 'Actualiser'}
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {loadingFinancials ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des données financières...</p>
            </div>
          </div>
        ) : financialStats ? (
          <div className="space-y-8">
            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Euro className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-green-600 text-sm font-medium">+12.8%</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Chiffre d'Affaires Total</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.totalRevenue)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-blue-600 text-sm font-medium">Ce mois</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Revenus Mensuels</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.monthlyRevenue)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-purple-600 text-sm font-medium">{formatCurrency(financialStats.dailyAverage)}/j</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Ticket Moyen</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.averageTicket)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-red-600 text-sm font-medium">Frais plateforme</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Charges de Service</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.serviceCharges)}</p>
              </div>
            </div>

            {/* Évolution Mensuelle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Évolution du Chiffre d'Affaires
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {financialStats.monthlyBreakdown.map((month, index) => (
                  <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold text-gray-900">{month.month}</h5>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                        {month.transactions} services
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(month.revenue)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Moy. {formatCurrency(month.revenue / month.transactions)} par service
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <h4 className="text-xl font-semibold flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-green-600" />
                  Historique des Transactions
                </h4>
                
                <div className="flex gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tous les services</option>
                    <option value="service_artisan">Artisans</option>
                    <option value="service_fournisseur">Fournisseurs</option>
                    <option value="service_personnel">Personnel</option>
                  </select>
                  
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="last_week">7 derniers jours</option>
                    <option value="last_month">30 derniers jours</option>
                    <option value="last_quarter">3 derniers mois</option>
                    <option value="last_year">12 derniers mois</option>
                  </select>
                </div>
              </div>
              
              {/* Tableau des transactions */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Prestataire</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Montant</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Frais Service</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Statut</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">{transaction.provider}</td>
                        <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{transaction.description}</td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{formatCurrency(transaction.amount)}</td>
                        <td className="py-4 px-4 text-red-600 font-medium">+{formatCurrency(transaction.serviceCharge)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {getStatusLabel(transaction.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucune transaction trouvée pour les critères sélectionnés.</p>
                </div>
              )}
            </div>

            {/* Résumé financier */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Building className="w-6 h-6 text-blue-600" />
                Résumé Financier Restaurant
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <h5 className="font-semibold text-blue-900 mb-2">Clients Servis</h5>
                  <p className="text-3xl font-bold text-blue-600">{financialStats.customerCount}</p>
                  <p className="text-sm text-blue-700 mt-1">Clients total</p>
                </div>
                
                <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                  <h5 className="font-semibold text-green-900 mb-2">Revenus Quotidiens</h5>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(financialStats.dailyAverage)}</p>
                  <p className="text-sm text-green-700 mt-1">Moyenne par jour</p>
                </div>
                
                <div className="p-6 bg-orange-50 rounded-lg border border-orange-100">
                  <h5 className="font-semibold text-orange-900 mb-2">Marge Nette</h5>
                  <p className="text-3xl font-bold text-orange-600">
                    {((financialStats.totalRevenue - financialStats.serviceCharges) / financialStats.totalRevenue * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-orange-700 mt-1">Après frais plateforme</p>
                </div>
                
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
                  <h5 className="font-semibold text-purple-900 mb-2">Services Utilisés</h5>
                  <p className="text-3xl font-bold text-purple-600">{financialStats.transactionHistory.length}</p>
                  <p className="text-sm text-purple-700 mt-1">Transactions total</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune donnée financière disponible.</p>
            <button
              onClick={loadFinancialStats}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Charger les données
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancesPage;
