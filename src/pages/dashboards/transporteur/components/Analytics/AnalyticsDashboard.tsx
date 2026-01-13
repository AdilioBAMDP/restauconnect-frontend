import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, Users } from 'lucide-react';
import axios from 'axios';

interface AnalyticsData {
  revenue: {
    total: number;
    byPeriod: Array<{ period: string; amount: number }>;
    growth: number;
  };
  costs: {
    total: number;
    fuel: number;
    maintenance: number;
    salaries: number;
    insurance: number;
    other: number;
  };
  performance: {
    totalDeliveries: number;
    completionRate: number;
    averageDeliveryTime: number;
    onTimeRate: number;
  };
  fleet: {
    totalVehicles: number;
    activeVehicles: number;
    utilizationRate: number;
    averageAge: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/transporteur-tms/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Chargement des données...</p>
      </div>
    );
  }

  if (!data || !data.revenue || !data.costs) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">Aucune donnée disponible</p>
      </div>
    );
  }

  const profit = (data.revenue?.total || 0) - (data.costs?.total || 0);
  const profitMargin = (data.revenue?.total || 0) > 0 ? (profit / data.revenue.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>
          <p className="text-gray-600 mt-1">Indicateurs clés de performance</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Chiffre d'affaires */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              data.revenue.growth >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {data.revenue.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(data.revenue.growth).toFixed(1)}%
            </div>
          </div>
          <p className="text-sm opacity-90">Chiffre d'affaires</p>
          <p className="text-3xl font-bold mt-1">{data.revenue.total.toLocaleString()}€</p>
        </div>

        {/* Coûts */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm opacity-90">Coûts totaux</p>
          <p className="text-3xl font-bold mt-1">{data.costs.total.toLocaleString()}€</p>
        </div>

        {/* Profit */}
        <div className={`bg-gradient-to-br ${profit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} text-white rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              {profit >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
            </div>
            <span className="text-sm font-medium">Marge: {profitMargin.toFixed(1)}%</span>
          </div>
          <p className="text-sm opacity-90">Résultat net</p>
          <p className="text-3xl font-bold mt-1">{profit.toLocaleString()}€</p>
        </div>

        {/* Livraisons */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">{data.performance.completionRate.toFixed(0)}% réussite</span>
          </div>
          <p className="text-sm opacity-90">Livraisons</p>
          <p className="text-3xl font-bold mt-1">{data.performance.totalDeliveries}</p>
        </div>
      </div>

      {/* Répartition des coûts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Coûts</h3>
          <div className="space-y-4">
            {[
              { label: 'Carburant', amount: data.costs.fuel, color: 'bg-red-500' },
              { label: 'Salaires', amount: data.costs.salaries, color: 'bg-blue-500' },
              { label: 'Maintenance', amount: data.costs.maintenance, color: 'bg-orange-500' },
              { label: 'Assurances', amount: data.costs.insurance, color: 'bg-green-500' },
              { label: 'Autres', amount: data.costs.other, color: 'bg-gray-500' }
            ].map((cost) => {
              const percentage = data.costs.total > 0 ? (cost.amount / data.costs.total) * 100 : 0;
              return (
                <div key={cost.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{cost.label}</span>
                    <span className="text-gray-900 font-bold">{cost.amount.toLocaleString()}€ ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${cost.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance flotte */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de la Flotte</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Véhicules actifs</span>
                <span className="text-lg font-bold text-gray-900">
                  {data.fleet.activeVehicles} / {data.fleet.totalVehicles}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${(data.fleet.activeVehicles / data.fleet.totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Taux d'utilisation</span>
                <span className="text-lg font-bold text-gray-900">{data.fleet.utilizationRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${data.fleet.utilizationRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Livraisons à l'heure</span>
                <span className="text-lg font-bold text-gray-900">{data.performance.onTimeRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full"
                  style={{ width: `${data.performance.onTimeRate}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{data.fleet.averageAge.toFixed(1)}</p>
                <p className="text-xs text-gray-600">Âge moyen (années)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{data.performance.averageDeliveryTime.toFixed(1)}</p>
                <p className="text-xs text-gray-600">Durée moy. (heures)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Recommandations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profitMargin < 10 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-sm font-medium text-orange-900">⚠️ Marge faible</p>
              <p className="text-xs text-orange-700 mt-1">Votre marge bénéficiaire est inférieure à 10%. Analysez vos coûts.</p>
            </div>
          )}
          {data.fleet.utilizationRate < 70 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-yellow-900">📊 Utilisation sous-optimale</p>
              <p className="text-xs text-yellow-700 mt-1">Taux d'utilisation flotte à {data.fleet.utilizationRate.toFixed(0)}%. Optimisez vos tournées.</p>
            </div>
          )}
          {data.performance.onTimeRate < 90 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <p className="text-sm font-medium text-red-900">⏰ Ponctualité à améliorer</p>
              <p className="text-xs text-red-700 mt-1">Seulement {data.performance.onTimeRate.toFixed(0)}% de livraisons à l'heure.</p>
            </div>
          )}
          {data.costs.fuel / data.costs.total > 0.4 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-900">⛽ Coûts carburant élevés</p>
              <p className="text-xs text-blue-700 mt-1">Le carburant représente {((data.costs.fuel / data.costs.total) * 100).toFixed(0)}% des coûts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
