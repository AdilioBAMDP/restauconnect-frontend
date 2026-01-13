import React, { useEffect, useState } from 'react';
import AdminKpiCard from './AdminKpiCard';
import ModerationStatsChart from './ModerationStatsChart';
import { Users, ShoppingBag, TrendingUp, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface GlobalStats {
  totalUsers?: number;
  activeUsers?: number;
  pendingRegistrations?: number;
  totalOffers?: number;
  activeOffers?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  [key: string]: unknown;
}

interface Offer {
  id: string;
  status?: string;
  [key: string]: unknown;
}

interface Application {
  id: string;
  status?: string;
  [key: string]: unknown;
}

interface Professional {
  id: string;
  status?: string;
  [key: string]: unknown;
}

interface AdminOverviewProps {
  globalStats?: GlobalStats;
  offers?: Offer[];
  applications?: Application[];
  professionals?: Professional[];
  onTabChange?: (tab: string) => void;
  [key: string]: unknown;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  globalStats = {},
  offers = [],
  applications = [],
  professionals = [],
  onTabChange
}) => {
  const [realStats, setRealStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingRegistrations: 0,
    totalOffers: 0,
    activeOffers: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    messages: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);

  const loadRealStats = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };

      // Charger toutes les stats en parallèle
      const [usersRes, walletRes, offersRes, msgsRes, appsRes, regsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users?page=1&limit=1000`, { headers }),
        axios.get(`${API_URL}/admin/platform-wallet`, { headers }),
        axios.get(`${API_URL}/admin/moderation/offers`, { headers }),
        axios.get(`${API_URL}/admin/moderation/messages`, { headers }),
        axios.get(`${API_URL}/applications`, { headers }),
        axios.get(`${API_URL}/admin/pending-registrations`, { headers })
      ]);

      const users = usersRes.data.data?.users || [];
      const wallet = walletRes.data.data;

      setRealStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.isActive !== false).length,
        pendingRegistrations: regsRes.data.data?.length || 0,
        totalOffers: offersRes.data.count || 0,
        activeOffers: offersRes.data.data?.filter((o: any) => o.status === 'active').length || 0,
        monthlyRevenue: wallet?.monthlyRevenue || 0,
        totalRevenue: wallet?.totalCommissionsCollected || 0,
        messages: msgsRes.data.count || 0,
        applications: appsRes.data.applications?.length || 0
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealStats();
  }, []);

  const stats = [
    {
      label: 'Utilisateurs Totaux',
      value: realStats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: () => onTabChange?.('users')
    },
    {
      label: 'Utilisateurs Actifs',
      value: realStats.activeUsers,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: () => onTabChange?.('users')
    },
    {
      label: 'Inscriptions en attente',
      value: realStats.pendingRegistrations,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      onClick: () => onTabChange?.('registrations')
    },
    {
      label: 'Offres Actives',
      value: realStats.activeOffers,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: () => onTabChange?.('moderation')
    },
    {
      label: 'Revenus Mensuels',
      value: `${realStats.monthlyRevenue.toFixed(2)} €`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      onClick: () => onTabChange?.('platform-revenues')
    },
    {
      label: 'Revenus Totaux',
      value: `${realStats.totalRevenue.toFixed(2)} €`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      onClick: () => onTabChange?.('platform-revenues')
    }
  ];

  const pendingItems = {
    registrations: realStats.pendingRegistrations,
    moderationOffers: 0, // À calculer si besoin
    moderationUsers: 0, // À calculer si besoin
    applications: realStats.applications
  };

  // Alertes critiques simulées (à relier à l'API ou au store si besoin)
  const criticalAlerts = [
    ...(offers.filter(o => o.status === 'failed').length > 0 ? [{
      type: 'transaction',
      message: `${offers.filter(o => o.status === 'failed').length} transaction(s) échouée(s) à traiter`,
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
      onClick: () => onTabChange?.('transactions')
    }] : []),
    // Ajoutez ici d'autres alertes critiques (sécurité, système, etc.)
  ];

  // Accès rapide vers modules clés
  const quickAccess = [
    { label: 'Transactions', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700', tab: 'transactions' },
    { label: 'Sécurité', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', tab: 'security' },
    { label: 'Paramètres', icon: TrendingUp, color: 'bg-indigo-100 text-indigo-700', tab: 'system' },
    { label: 'Analytics', icon: TrendingUp, color: 'bg-blue-100 text-blue-700', tab: 'analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton actualiser */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
        <button
          onClick={loadRealStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Bloc Alertes critiques */}
      {criticalAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            Alertes critiques
          </h3>
          {criticalAlerts.map((alert, idx) => {
            const Icon = alert.icon;
            return (
              <button
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left font-medium ${alert.color} hover:bg-red-200/60 transition`}
                onClick={alert.onClick}
              >
                <Icon className="w-5 h-5" />
                <span>{alert.message}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bloc Accès rapide */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-indigo-500" />
          Accès rapide
        </h3>
        <div className="flex flex-wrap gap-4">
          {quickAccess.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${item.color} hover:scale-105 transition`}
                onClick={() => onTabChange?.(item.tab)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer text-left w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-blue-600 mt-2">Cliquez pour voir →</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${stat.color} w-6 h-6`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Graphique de modération */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="text-blue-500" />
          Statistiques de modération
        </h3>
        <ModerationStatsChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminKpiCard 
          title="Utilisateurs inscrits" 
          value={realStats.totalUsers} 
          icon="👥" 
          color="border-blue-500" 
          onClick={() => onTabChange?.('users')}
        />
        <AdminKpiCard 
          title="Offres publiées" 
          value={realStats.totalOffers} 
          icon="📢" 
          color="border-green-500" 
          onClick={() => onTabChange?.('moderation')}
        />
        <AdminKpiCard 
          title="Candidatures reçues" 
          value={realStats.applications} 
          icon="📄" 
          color="border-purple-500" 
          onClick={() => onTabChange?.('users')}
        />
        <AdminKpiCard 
          title="Taux de conversion" 
          value="0%" 
          icon="🔄" 
          color="border-yellow-500" 
          onClick={() => onTabChange?.('analytics')}
        />
        <AdminKpiCard 
          title="Messages non lus" 
          value={realStats.messages} 
          icon="✉️" 
          color="border-pink-500" 
          onClick={() => onTabChange?.('moderation')}
        />
        <AdminKpiCard 
          title="Satisfaction" 
          value="0/5" 
          icon="⭐" 
          color="border-orange-500" 
          onClick={() => onTabChange?.('analytics')}
        />
        <AdminKpiCard 
          title="Croissance 30j" 
          value="0%" 
          icon="📈" 
          color="border-indigo-500" 
          onClick={() => onTabChange?.('analytics')}
        />
        <AdminKpiCard 
          title="Utilisateurs actifs" 
          value={realStats.activeUsers} 
          icon="✅" 
          color="border-teal-500" 
          onClick={() => onTabChange?.('users')}
        />
      </div>
      
      {/* Alertes critiques */}
      {realStats.pendingRegistrations > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">
            <strong>⚠️ {globalStats.pendingValidations} comptes en attente de validation</strong>
          </div>
        )}
        {globalStats.urgentOffers > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded">
            <strong>🚨 {globalStats.urgentOffers} offres urgentes actives</strong>
          </div>
        )}
      {/* Pending Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="text-orange-500" />
  export default AdminOverview;
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onTabChange?.('registrations')}
            className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Inscriptions</span>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                {pendingItems.registrations}
              </span>
            </div>
            <p className="text-xs text-gray-500">Nouvelles inscriptions à valider</p>
          </button>

          <button
            onClick={() => onTabChange?.('moderation')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Offres</span>
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
                {pendingItems.moderationOffers}
              </span>
            </div>
            <p className="text-xs text-gray-500">Offres à modérer</p>
          </button>

          <button
            onClick={() => onTabChange?.('moderation')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Professionnels</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                {pendingItems.moderationUsers}
              </span>
            </div>
            <p className="text-xs text-gray-500">Profils à valider</p>
          </button>

          <button
            onClick={() => onTabChange?.('users')}
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Candidatures</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                {pendingItems.applications}
              </span>
            </div>
            <p className="text-xs text-gray-500">Candidatures en attente</p>
          </button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">État des Offres</h3>
          <div className="space-y-3">
            <button
              onClick={() => onTabChange?.('moderation')}
              className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600 w-5 h-5" />
                <span className="text-sm">Offres Actives</span>
              </div>
              <span className="font-semibold text-green-600">
                {realStats.activeOffers}
              </span>
            </button>
            <button
              onClick={() => onTabChange?.('moderation')}
              className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="text-orange-600 w-5 h-5" />
                <span className="text-sm">En Attente</span>
              </div>
              <span className="font-semibold text-orange-600">0</span>
            </button>
            <button
              onClick={() => onTabChange?.('moderation')}
              className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <XCircle className="text-red-600 w-5 h-5" />
                <span className="text-sm">Rejetées</span>
              </div>
              <span className="font-semibold text-red-600">0</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">État des Professionnels</h3>
          <div className="space-y-3">
            <button
              onClick={() => onTabChange?.('users')}
              className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600 w-5 h-5" />
                <span className="text-sm">Validés</span>
              </div>
              <span className="font-semibold text-green-600">
                {realStats.activeUsers}
              </span>
            </button>
            <button
              onClick={() => onTabChange?.('registrations')}
              className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="text-orange-600 w-5 h-5" />
                <span className="text-sm">En Attente</span>
              </div>
              <span className="font-semibold text-orange-600">
                {realStats.pendingRegistrations}
              </span>
            </button>
            <button
              onClick={() => onTabChange?.('users')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="text-blue-600 w-5 h-5" />
                <span className="text-sm">Total</span>
              </div>
              <span className="font-semibold text-blue-600">
                {realStats.totalUsers}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
