import React from 'react';
import { motion } from 'framer-motion';
import {
  Truck, Package, DollarSign, Clock, 
  TrendingUp, Star, Award, Navigation, CheckCircle
} from 'lucide-react';
import { PartnersDirectory } from '@/components/dashboard/PartnersDirectory';
import { useAppStore } from '@/stores/appStore';

interface DriverOverviewProps {
  stats: {
    totalDeliveries: number;
    completedToday: number;
    totalEarnings: number;
    monthlyEarnings: number;
    rating: number;
    onTimeRate: number;
    activeRoute: boolean;
  };
  onNavigate?: (section: string) => void;
}

export function DriverOverview({ stats, onNavigate }: DriverOverviewProps) {
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
      {/* Header Chauffeur */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de Bord Chauffeur</h1>
              <p className="text-blue-100 text-lg">Gérez vos livraisons et itinéraires</p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm ${
            stats.activeRoute ? 'bg-green-500/20' : 'bg-white/10'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              stats.activeRoute ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-white font-medium">
              {stats.activeRoute ? 'En livraison' : 'Disponible'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigate('routes')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Navigation className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Itinéraires</span>
          </button>
          <button 
            onClick={() => handleNavigate('deliveries')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Package className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Livraisons</span>
          </button>
          <button 
            onClick={() => handleNavigate('earnings')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <DollarSign className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Gains</span>
          </button>
          <button 
            onClick={() => handleNavigate('schedule')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Clock className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Planning</span>
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
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Aujourd'hui</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.completedToday}
          </div>
          <p className="text-sm text-gray-600 mt-2">Livraisons complétées</p>
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
            <span className="text-sm text-gray-500">Ce mois</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.monthlyEarnings.toLocaleString('fr-FR')} €
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12% vs mois dernier</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Note moyenne</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">
              {stats.rating.toFixed(1)}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(stats.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Basé sur {stats.totalDeliveries} livraisons</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Ponctualité</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.onTimeRate}%
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${stats.onTimeRate}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Active Route Card */}
      {stats.activeRoute && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-600 rounded-full">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Itinéraire actif</h3>
                <p className="text-sm text-gray-600">3 livraisons restantes</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Voir l'itinéraire
            </button>
          </div>
        </motion.div>
      )}

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance du mois</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</div>
            <p className="text-sm text-gray-600">Total livraisons</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalEarnings.toLocaleString('fr-FR')} €
            </div>
            <p className="text-sm text-gray-600">Total gains</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">Top 10%</div>
            <p className="text-sm text-gray-600">Classement</p>
          </div>
        </div>
      </div>

      {/* Répertoire des Partenaires */}
      <div>
        <PartnersDirectory currentUserRole="transporteur" showPublishButton={true} />
      </div>
    </div>
  );
}
