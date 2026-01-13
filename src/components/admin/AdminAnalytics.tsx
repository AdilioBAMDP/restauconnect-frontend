import React, { useState } from 'react';

interface AnalyticsData {
  period: string;
  users: number;
  messages: number;
  connections: number;
  conversions: number;
}

interface ChartData {
  name: string;
  value: number;
  change: number;
}

const AdminAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Données simulées pour les analytics
  const analyticsData: AnalyticsData[] = [
    { period: '2024-09-01', users: 45, messages: 234, connections: 12, conversions: 8 },
    { period: '2024-09-02', users: 52, messages: 278, connections: 15, conversions: 11 },
    { period: '2024-09-03', users: 38, messages: 198, connections: 9, conversions: 6 },
    { period: '2024-09-04', users: 67, messages: 312, connections: 18, conversions: 14 },
    { period: '2024-09-05', users: 74, messages: 365, connections: 22, conversions: 16 },
    { period: '2024-09-06', users: 89, messages: 445, connections: 28, conversions: 21 },
    { period: '2024-09-07', users: 96, messages: 523, connections: 34, conversions: 25 }
  ];

  const kpiData: ChartData[] = [
    { name: 'Utilisateurs actifs', value: 1247, change: 12.5 },
    { name: 'Messages envoyés', value: 3456, change: 18.2 },
    { name: 'Connexions', value: 189, change: 5.7 },
    { name: 'Taux conversion', value: 23.4, change: -2.1 }
  ];

  const usersByRole = [
    { role: 'Restaurant', count: 342, percentage: 27.4, color: 'bg-blue-500' },
    { role: 'Artisan', count: 298, percentage: 23.9, color: 'bg-green-500' },
    { role: 'Fournisseur', count: 234, percentage: 18.8, color: 'bg-purple-500' },
    { role: 'Candidat', count: 287, percentage: 23.0, color: 'bg-orange-500' },
    { role: 'Community Manager', count: 45, percentage: 3.6, color: 'bg-pink-500' },
    { role: 'Banquier', count: 23, percentage: 1.8, color: 'bg-indigo-500' },
    { role: 'Admin', count: 18, percentage: 1.4, color: 'bg-red-500' }
  ];

  const activityData = [
    { time: '00h', value: 12 },
    { time: '04h', value: 8 },
    { time: '08h', value: 45 },
    { time: '12h', value: 89 },
    { time: '16h', value: 156 },
    { time: '20h', value: 134 },
    { time: '24h', value: 67 }
  ];

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return '7 derniers jours';
      case '30d': return '30 derniers jours';
      case '90d': return '90 derniers jours';
      case '1y': return '1 an';
      default: return '30 derniers jours';
    }
  };

  const exportReport = () => {
    // Simulation d'export de rapport
    const reportData = {
      period: getPeriodLabel(selectedPeriod),
      generated: new Date().toISOString(),
      kpis: kpiData,
      userDistribution: usersByRole,
      totalUsers: usersByRole.reduce((sum, role) => sum + role.count, 0)
    };
    
    // Créer un blob avec les données JSON
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Créer un lien de téléchargement
    const exportFileDefaultName = `restauconnect-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics & Statistiques</h2>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble des performances - {getPeriodLabel(selectedPeriod)}</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d' | '1y')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          <button 
            onClick={exportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Exporter rapport</span>
          </button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {kpi.name === 'Taux conversion' ? `${kpi.value}%` : kpi.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${
                kpi.change >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-sm font-medium ${
                  kpi.change >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  {kpi.change >= 0 ? '↗️' : '↘️'} {Math.abs(kpi.change)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    kpi.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.abs(kpi.change) * 4, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique des tendances (simulé) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances d'activité</h3>
        <div className="space-y-4">
          {analyticsData.slice(-7).map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600">
                {new Date(data.period).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(data.users / 100) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {data.users}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution des utilisateurs par rôle */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des utilisateurs par rôle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {usersByRole.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{role.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{role.count}</span>
                  <span className="text-xs text-gray-500">({role.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            {/* Graphique en anneaux simulé */}
            <div className="w-48 h-48 mx-auto relative">
              <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                {usersByRole.map((role, index) => {
                  const rotation = usersByRole.slice(0, index).reduce((sum, r) => sum + (r.percentage * 3.6), 0);
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 rounded-full`}
                      style={{
                        background: `conic-gradient(from ${rotation}deg, transparent 0deg, transparent ${rotation}deg, ${role.color.replace('bg-', '').replace('-500', '')} ${rotation}deg, ${role.color.replace('bg-', '').replace('-500', '')} ${rotation + (role.percentage * 3.6)}deg, transparent ${rotation + (role.percentage * 3.6)}deg)`,
                        clipPath: 'circle(50% at 50% 50%)'
                      }}
                    ></div>
                  );
                })}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {usersByRole.reduce((sum, role) => sum + role.count, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activité par heure */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité par tranche horaire (aujourd'hui)</h3>
        <div className="flex items-end justify-between space-x-2 h-32">
          {activityData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div 
                className="bg-blue-500 w-full rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                style={{ height: `${(data.value / Math.max(...activityData.map(d => d.value))) * 100}%` }}
                title={`${data.time}: ${data.value} actions`}
              ></div>
              <span className="text-xs text-gray-600">{data.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques de performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Temps de réponse moyen</span>
              <span className="font-semibold text-green-600">1.2s</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Taux de disponibilité</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Erreurs système</span>
              <span className="font-semibold text-red-600">0.01%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Satisfaction utilisateur</span>
              <span className="font-semibold text-blue-600">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top actions récentes</h3>
          <div className="space-y-3">
            {[
              { action: 'Inscription nouvel utilisateur', count: 23, trend: 'up' },
              { action: 'Message envoyé', count: 156, trend: 'up' },
              { action: 'Profil mis à jour', count: 45, trend: 'stable' },
              { action: 'Recherche effectuée', count: 89, trend: 'up' },
              { action: 'Connexion utilisateur', count: 234, trend: 'down' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.trend === 'up' ? 'bg-green-500' : 
                    item.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{item.action}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  <span className="text-xs">
                    {item.trend === 'up' ? '↗️' : item.trend === 'down' ? '↘️' : '➡️'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
