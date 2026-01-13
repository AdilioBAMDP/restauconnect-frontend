import React from 'react';
import { motion } from 'framer-motion';
import {
  Scissors, Package, ShoppingCart, DollarSign,
  TrendingUp, Star, Award, Users
} from 'lucide-react';
import { PartnersDirectory } from '@/components/dashboard/PartnersDirectory';
import { useAppStore } from '@/stores/appStore';

interface ArtisanOverviewProps {
  stats: {
    totalProducts: number;
    activeOrders: number;
    monthlyRevenue: number;
    rating: number;
    inventoryValue: number;
    customersCount: number;
  };
  onNavigate?: (section: string) => void;
}

export function ArtisanOverview({ stats, onNavigate }: ArtisanOverviewProps) {
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
      {/* Header Artisan */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-8 rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de Bord Artisan</h1>
              <p className="text-orange-100 text-lg">Gérez vos produits et commandes</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Award className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">Artisan Vérifié</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigate('products')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Package className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Produits</span>
          </button>
          <button 
            onClick={() => handleNavigate('orders')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <ShoppingCart className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Commandes</span>
          </button>
          <button 
            onClick={() => handleNavigate('inventory')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Package className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Stock</span>
          </button>
          <button 
            onClick={() => handleNavigate('customers')}
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Users className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-medium">Clients</span>
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
            <div className="p-3 bg-amber-100 rounded-lg">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Produits</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
          <p className="text-sm text-gray-600 mt-2">Catalogue actif</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Commandes</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeOrders}</div>
          <p className="text-sm text-gray-600 mt-2">En cours</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Revenus</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.monthlyRevenue.toLocaleString('fr-FR')} €
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">+18% ce mois</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Note</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</div>
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
          <p className="text-sm text-gray-600 mt-2">{stats.customersCount} clients</p>
        </motion.div>
      </div>

      {/* Inventory Value */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <Package className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.inventoryValue.toLocaleString('fr-FR')} €
            </div>
            <p className="text-sm text-gray-600">Valeur du stock</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">+24%</div>
            <p className="text-sm text-gray-600">Croissance mensuelle</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.customersCount}</div>
            <p className="text-sm text-gray-600">Clients réguliers</p>
          </div>
        </div>
      </div>

      {/* Annuaire Partenaires */}
      <div>
        <PartnersDirectory currentUserRole="artisan" showPublishButton={true} />
      </div>
    </div>
  );
}
