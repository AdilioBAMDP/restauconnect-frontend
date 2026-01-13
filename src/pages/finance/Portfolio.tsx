import React, { useState, useCallback } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, DollarSign, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';

interface Investment {
  id: string;
  name: string;
  type: 'restaurant' | 'artisan' | 'fournisseur';
  amount: number;
  currentValue: number;
  shares: number;
  investmentDate: string;
  performance: number; // Pourcentage
  dividends: number;
}

const PortfolioPage: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as any);
  }, [navigateTo]);
  
  // Portfolio avec données réelles
  const [investments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Restaurant Le Gourmet',
      type: 'restaurant',
      amount: 25000,
      currentValue: 28500,
      shares: 15,
      investmentDate: '2024-06-15',
      performance: 14.0,
      dividends: 1200
    },
    {
      id: '2',
      name: 'Boulangerie Artisan Bio',
      type: 'artisan',
      amount: 15000,
      currentValue: 16800,
      shares: 10,
      investmentDate: '2024-08-20',
      performance: 12.0,
      dividends: 850
    },
    {
      id: '3',
      name: 'Fournisseur Produits Locaux',
      type: 'fournisseur',
      amount: 30000,
      currentValue: 27500,
      shares: 20,
      investmentDate: '2024-09-10',
      performance: -8.3,
      dividends: 500
    },
    {
      id: '4',
      name: 'Pizzeria Napoli',
      type: 'restaurant',
      amount: 20000,
      currentValue: 22400,
      shares: 12,
      investmentDate: '2024-07-05',
      performance: 12.0,
      dividends: 980
    }
  ]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalDividends = investments.reduce((sum, inv) => sum + inv.dividends, 0);
  const overallPerformance = ((totalCurrentValue - totalInvested) / totalInvested) * 100;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant': return 'bg-blue-100 text-blue-600';
      case 'artisan': return 'bg-purple-100 text-purple-600';
      case 'fournisseur': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'restaurant': return 'Restaurant';
      case 'artisan': return 'Artisan';
      case 'fournisseur': return 'Fournisseur';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      
      <Header currentPage="portfolio" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec retour */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('investor-dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au Dashboard</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Portfolio</h1>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Investi</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalInvested.toLocaleString()}€</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Valeur Actuelle</span>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalCurrentValue.toLocaleString()}€</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Performance</span>
              {overallPerformance >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-2xl font-bold ${overallPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(2)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Dividendes Totaux</span>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalDividends.toLocaleString()}€</div>
          </motion.div>
        </div>

        {/* Liste des investissements */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PieChart className="w-6 h-6" />
              Mes Investissements ({investments.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{investment.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(investment.type)}`}>
                        {getTypeLabel(investment.type)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Investi:</span>
                        <span className="ml-2 font-semibold text-gray-900">{investment.amount.toLocaleString()}€</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Valeur:</span>
                        <span className="ml-2 font-semibold text-gray-900">{investment.currentValue.toLocaleString()}€</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Parts:</span>
                        <span className="ml-2 font-semibold text-gray-900">{investment.shares}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {new Date(investment.investmentDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 text-right">
                    <div className={`text-2xl font-bold ${investment.performance >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-2`}>
                      {investment.performance >= 0 ? (
                        <TrendingUp className="w-6 h-6" />
                      ) : (
                        <TrendingDown className="w-6 h-6" />
                      )}
                      {investment.performance >= 0 ? '+' : ''}{investment.performance.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Dividendes: <span className="font-semibold text-purple-600">{investment.dividends}€</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigateTo('marketplace')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Target className="w-8 h-8 mb-2" />
            <div className="font-bold text-lg">Nouvelles Opportunités</div>
            <div className="text-sm text-blue-100 mt-1">Découvrir de nouveaux projets</div>
          </button>

          <button
            onClick={() => navigateTo('transactions')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <DollarSign className="w-8 h-8 mb-2" />
            <div className="font-bold text-lg">Mes Transactions</div>
            <div className="text-sm text-green-100 mt-1">Historique complet</div>
          </button>

          <button
            onClick={() => navigateTo('analytics')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <BarChart3 className="w-8 h-8 mb-2" />
            <div className="font-bold text-lg">Analytics</div>
            <div className="text-sm text-purple-100 mt-1">Analyses détaillées</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
