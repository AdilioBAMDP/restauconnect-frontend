import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, PieChart, Target, Briefcase, 
  Activity, ArrowUpRight, ArrowDownRight, Star, Award
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface InvestorOverviewProps {
  stats: {
    totalInvested: number;
    currentValue: number;
    totalReturn: number;
    activeInvestments: number;
    portfolioGrowth: number;
    averageROI: number;
  };
  onNavigate?: (section: string) => void;
}

export function InvestorOverview({ stats, onNavigate }: InvestorOverviewProps) {
  const { navigateTo } = useAppStore();
  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      navigateTo(section as any);
    }
  };
  const returnRate = ((stats.currentValue - stats.totalInvested) / stats.totalInvested) * 100;
  const isPositive = returnRate >= 0;

  return (
    <div className="space-y-6">
      {/* Header Investisseur */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de Bord Investisseur</h1>
              <p className="text-emerald-100 text-lg">Gérez votre portefeuille d'investissements</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Activity className="w-5 h-5 text-green-300" />
            <span className="text-white font-medium">Actif</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigate('portfolio')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <PieChart className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Portfolio</span>
          </button>
          <button 
            onClick={() => handleNavigate('opportunities')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Target className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Opportunités</span>
          </button>
          <button 
            onClick={() => handleNavigate('transactions')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <DollarSign className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Transactions</span>
          </button>
          <button 
            onClick={() => handleNavigate('analytics')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <TrendingUp className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Analytics</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Investi</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalInvested.toLocaleString('fr-FR')} €
          </div>
          <p className="text-sm text-gray-600 mt-2">Capital investi</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Valeur Actuelle</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.currentValue.toLocaleString('fr-FR')} €
          </div>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(returnRate).toFixed(2)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">ROI Moyen</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.averageROI.toFixed(2)}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Retour sur investissement</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Investissements Actifs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.activeInvestments}
          </div>
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600">
              {stats.portfolioGrowth >= 0 ? '+' : ''}{stats.portfolioGrowth.toFixed(1)}% ce mois
            </span>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance du Portfolio</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Graphique de performance - À intégrer avec Chart.js</p>
        </div>
      </motion.div>
    </div>
  );
}
