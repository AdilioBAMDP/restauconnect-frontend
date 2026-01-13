import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingDown, CheckCircle, Plus } from 'lucide-react';

export interface InventoryItem {
  id: string;
  product: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastRestocked: string;
  value: number;
}


import axios from 'axios';

export function ArtisanInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/artisan/inventory')
      .then(res => {
        setInventory(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.response?.data?.error || err.message || 'Erreur chargement inventaire');
        setLoading(false);
      });
  }, []);

  const onRestockItem = (id: string) => {
    // TODO: ouvrir un modal ou faire un appel API pour réapprovisionnement
    alert('Réapprovisionnement à implémenter pour l\'article ' + id);
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const outOfStock = inventory.filter(item => item.currentStock === 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current === 0) return { label: 'Rupture', color: 'bg-red-600', textColor: 'text-red-600' };
    if (current <= min) return { label: 'Faible', color: 'bg-orange-600', textColor: 'text-orange-600' };
    if (percentage >= 75) return { label: 'Optimal', color: 'bg-green-600', textColor: 'text-green-600' };
    return { label: 'Moyen', color: 'bg-yellow-600', textColor: 'text-yellow-600' };
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Chargement de l'inventaire...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-red-600">Erreur : {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestion du Stock</h2>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium">
              {lowStockItems.length} produit{lowStockItems.length > 1 ? 's' : ''} en stock faible
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-medium">Total articles</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{inventory.length}</div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-medium">Valeur stock</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">
            {totalValue.toLocaleString('fr-FR')} €
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-700 font-medium">Stock faible</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-900">{lowStockItems.length}</div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700 font-medium">Rupture</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-900">{outOfStock.length}</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock actuel</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Min / Max</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valeur</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item, index) => {
                const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock);
                const percentage = (item.currentStock / item.maxStock) * 100;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.product}</div>
                      <div className="text-sm text-gray-500">
                        Dernier réappro: {new Date(item.lastRestocked).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-lg font-bold ${stockLevel.textColor}`}>
                        {item.currentStock}
                      </div>
                      <div className="text-xs text-gray-500">{item.unit}</div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2 w-20 mx-auto">
                        <div 
                          className={`h-2 rounded-full ${stockLevel.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                      {item.minStock} / {item.maxStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.currentStock === 0 ? 'bg-red-100 text-red-800' :
                        item.currentStock <= item.minStock ? 'bg-orange-100 text-orange-800' :
                        percentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stockLevel.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {item.value.toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onRestockItem(item.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Réappro</span>
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
