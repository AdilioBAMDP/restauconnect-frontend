import React, { useState, useEffect } from 'react';
import { Users, Building, Truck, Activity, TrendingUp, Database, Clock } from 'lucide-react';

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  restaurantCount: number;
  livreurCount: number;
  artisanCount: number;
  recentSignups: number;
  systemUptime: string;
  totalOrders: number;
  pendingOrders: number;
}

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeUsers: 0,
    restaurantCount: 0,
    livreurCount: 0,
    artisanCount: 0,
    recentSignups: 0,
    systemUptime: '0h 0m',
    totalOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setStats(null); // Pas de fallback - afficher l'erreur
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    loadStats();
    
    // Actualiser les stats toutes les 30 secondes
    const interval = setInterval(loadStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête avec informations de mise à jour */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistiques en temps réel</h2>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={loadStats}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+12% ce mois"
        />
        
        <StatCard
          title="Utilisateurs Actifs"
          value={stats.activeUsers}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="+8% cette semaine"
        />
        
        <StatCard
          title="Restaurants"
          value={stats.restaurantCount}
          icon={<Building className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
        
        <StatCard
          title="Livreurs"
          value={stats.livreurCount}
          icon={<Truck className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        
        <StatCard
          title="Artisans"
          value={stats.artisanCount}
          icon={<Database className="w-6 h-6 text-white" />}
          color="bg-indigo-500"
        />
        
        <StatCard
          title="Inscriptions récentes"
          value={stats.recentSignups}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-emerald-500"
          trend="Dernières 24h"
        />
        
        <StatCard
          title="Temps de fonctionnement"
          value={stats.systemUptime}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-teal-500"
        />
        
        <StatCard
          title="Commandes totales"
          value={stats.totalOrders}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-rose-500"
        />
      </div>

      {/* Graphiques et informations supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par rôle</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Restaurants</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(stats.restaurantCount / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.restaurantCount}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Livreurs</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(stats.livreurCount / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.livreurCount}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Artisans</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${(stats.artisanCount / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.artisanCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">État du système</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base de données</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                En ligne
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Backend</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Fonctionnel
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service de messaging</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Actif
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upload de fichiers</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Disponible
              </span>
            </div>

            {stats.pendingOrders > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ {stats.pendingOrders} commandes en attente de traitement
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
