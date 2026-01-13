import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2, DollarSign, Users, TrendingUp, 
  Briefcase, Shield, Award, FileText
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface BankerOverviewProps {
  stats: {
    totalLoans: number;
    activeLoans: number;
    totalFunded: number;
    averageInterestRate: number;
    clientsCount: number;
    defaultRate: number;
  };
  onNavigate?: (section: string) => void;
}

export function BankerOverview({ stats, onNavigate }: BankerOverviewProps) {
  const { navigateTo } = useAppStore();
  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      navigateTo(section as any);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header Banquier */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-700 via-gray-800 to-zinc-800 p-8 rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de Bord Banquier</h1>
              <p className="text-gray-200 text-lg">Gestion des prêts et financement</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Shield className="w-5 h-5 text-green-300" />
            <span className="text-white font-medium">Certifié</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigate('loans')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Briefcase className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Prêts</span>
          </button>
          <button 
            onClick={() => handleNavigate('clients')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Users className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Clients</span>
          </button>
          <button 
            onClick={() => handleNavigate('analytics')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <TrendingUp className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Analytics</span>
          </button>
          <button 
            onClick={() => handleNavigate('risk')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <FileText className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Risques</span>
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
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Prêts Actifs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeLoans}</div>
          <p className="text-sm text-gray-600 mt-2">Sur {stats.totalLoans} total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Capital Investi</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(stats.totalFunded / 1000000).toFixed(1)}M €
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">+8% ce trimestre</span>
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
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Clients</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.clientsCount}</div>
          <p className="text-sm text-gray-600 mt-2">Portefeuille actif</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Taux Moyen</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.averageInterestRate.toFixed(2)}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Taux d'intérêt</p>
        </motion.div>
      </div>

      {/* Risk Indicator */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs de Risque</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Taux de Défaut</span>
              <span className={`text-sm font-semibold ${
                stats.defaultRate < 2 ? 'text-green-600' :
                stats.defaultRate < 5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.defaultRate.toFixed(2)}%
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  stats.defaultRate < 2 ? 'bg-green-600' :
                  stats.defaultRate < 5 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(stats.defaultRate * 10, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(100 - stats.defaultRate).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Taux de Remboursement</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">AAA</div>
            <p className="text-sm text-gray-600">Score de Crédit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
