import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { logger } from '@/utils/logger';
import {
  Euro, TrendingUp, BarChart3, PieChart, Package, RefreshCw, 
  CreditCard, ArrowLeft, Truck, DollarSign
} from 'lucide-react';
import Header from '@/components/layout/Header';

// Interface pour les statistiques financières fournisseur
interface SupplierFinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  deliveredOrders: number;
  pendingPayments: number;
  averageOrderValue: number;
  commissionRate: number;
  deliveryHistory: Array<{
    id: string;
    restaurant: string;
    amount: number;
    commission: number;
    status: 'delivered' | 'pending' | 'cancelled';
    date: string;
    products: string[];
  }>;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

const SupplierRevenusPage: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as any);
  }, [navigateTo]);

  const [financialStats, setFinancialStats] = useState<SupplierFinancialStats | null>(null);
  const [loadingFinancials, setLoadingFinancials] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState('last_month');

  // Chargement des données financières fournisseur
  const loadFinancialStats = async () => {
    setLoadingFinancials(true);
    try {
      // TODO: Implémenter appel API réel pour les statistiques financières fournisseur
      // const stats = await supplierService.getFinancialStats();
      // setFinancialStats(stats);
      
      // Pour l'instant, pas de données disponibles
      setFinancialStats(null);
    } catch (error) {
      logger.error('Erreur lors du chargement des données financières fournisseur', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getFilteredDeliveries = () => {
    if (!financialStats) return [];
    
    let filtered = financialStats.deliveryHistory;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === filterStatus);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  useEffect(() => {
    loadFinancialStats();
  }, [dateRange]);

  if (!financialStats && loadingFinancials) {
    return (
      <div className="min-h-screen bg-gray-50">
  
        
      <Header currentPage="supplier-revenus" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des données financières...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigateTo('supplier-dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au Dashboard
          </button>
        </div>

        {/* Titre de la page */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                💼 Mes Revenus
              </h1>
              <p className="text-gray-600 mt-2">Suivi de vos livraisons et revenus de fournisseur</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadFinancialStats}
                disabled={loadingFinancials}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loadingFinancials ? 'animate-spin' : ''}`} />
                {loadingFinancials ? 'Actualisation...' : 'Actualiser'}
              </button>
            </div>
          </div>
        </div>

        {financialStats && (
          <>
            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Euro className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-purple-600 text-sm font-medium">+12.8%</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Revenus Totaux</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.totalRevenue)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-green-600 text-sm font-medium">Ce mois</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Revenus Mensuels</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.monthlyRevenue)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-blue-600 text-sm font-medium">{financialStats.deliveredOrders} livr.</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Valeur Moyenne/Commande</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.averageOrderValue)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-orange-600 text-sm font-medium">{financialStats.commissionRate}%</div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Paiements Pendants</h3>
                <p className="text-2xl font-bold text-gray-900">{financialStats.pendingPayments}</p>
              </div>
            </div>

            {/* Évolution Mensuelle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Évolution des Revenus
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {financialStats.monthlyBreakdown.map((month, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{month.month}</h4>
                      <span className="text-sm text-gray-600">{month.orders} commandes</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(month.revenue)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtres et Historique des Livraisons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  Historique des Livraisons
                </h3>
                
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="delivered">Livrés</option>
                    <option value="pending">En attente</option>
                    <option value="cancelled">Annulés</option>
                  </select>
                  
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="last_month">Dernier mois</option>
                    <option value="last_3_months">3 derniers mois</option>
                    <option value="last_6_months">6 derniers mois</option>
                    <option value="current_year">Cette année</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Restaurant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Produits</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Commission</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredDeliveries().map((delivery) => (
                      <tr key={delivery.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{delivery.restaurant}</td>
                        <td className="py-3 px-4 text-gray-600">{delivery.products.join(', ')}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(delivery.amount)}</td>
                        <td className="py-3 px-4 text-red-600 font-medium">-{formatCurrency(delivery.commission)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(delivery.status)}`}>
                            {getStatusLabel(delivery.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(delivery.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Informations Commission */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Informations Tarifaires
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Commission Web Spider</h4>
                  <p className="text-2xl font-bold text-red-600">{financialStats.commissionRate}%</p>
                  <p className="text-sm text-red-700">Prélevée sur chaque vente</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Vous Recevez</h4>
                  <p className="text-2xl font-bold text-green-600">{(100 - financialStats.commissionRate).toFixed(1)}%</p>
                  <p className="text-sm text-green-700">Du montant de vos ventes</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierRevenusPage;
