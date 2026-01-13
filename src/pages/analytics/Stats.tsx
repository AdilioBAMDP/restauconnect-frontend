import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { 
  TrendingUp, 
  Users, 
  Euro, 
  Clock, 
  BarChart3, 

  Calendar,
  Target,
  Award,
  Activity,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';

interface StatsPageProps {
  onNavigate: (page: string) => void;
}

const StatsPage: React.FC<StatsPageProps> = () => {
  const { navigateTo } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { navigateToUserDashboard } = useUserDashboardNavigation();

  const stats = {
    revenue: {
      current: 12450,
      previous: 10200,
      growth: 22.1
    },
    users: {
      current: 1847,
      previous: 1654,
      growth: 11.7
    },
    orders: {
      current: 342,
      previous: 298,
      growth: 14.8
    },
    avgOrder: {
      current: 89.5,
      previous: 82.3,
      growth: 8.7
    }
  };

  const chartData = [
    { name: 'Jan', value: 8500 },
    { name: 'Fév', value: 9200 },
    { name: 'Mar', value: 10100 },
    { name: 'Avr', value: 11300 },
    { name: 'Mai', value: 12450 },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string;
    change: number;
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`h-4 w-4 ${change < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      
      
      <Header currentPage="stats" onNavigate={(page) => navigateTo(page as any)} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigateToUserDashboard(navigateTo)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </button>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques</h1>
            <p className="text-gray-600">Analysez les performances de votre activité</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Chiffre d'affaires"
            value={`${stats.revenue.current.toLocaleString()}€`}
            change={stats.revenue.growth}
            icon={Euro}
            color="bg-green-500"
          />
          <StatCard
            title="Utilisateurs actifs"
            value={stats.users.current.toLocaleString()}
            change={stats.users.growth}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Commandes"
            value={stats.orders.current.toString()}
            change={stats.orders.growth}
            icon={Target}
            color="bg-purple-500"
          />
          <StatCard
            title="Panier moyen"
            value={`${stats.avgOrder.current}€`}
            change={stats.avgOrder.growth}
            icon={TrendingUp}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Évolution du chiffre d'affaires</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{item.name}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / 12450) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-orange-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="w-20 text-sm font-medium text-gray-900 text-right">
                    {item.value.toLocaleString()}€
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Activité récente</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">15 nouvelles commandes</p>
                  <p className="text-sm text-gray-600">Aujourd'hui</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">+23%</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">8 nouveaux clients</p>
                  <p className="text-sm text-gray-600">Cette semaine</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">+15%</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Temps moyen: 24min</p>
                  <p className="text-sm text-gray-600">Traitement commande</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">-8%</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">12 RDV planifiés</p>
                  <p className="text-sm text-gray-600">Cette semaine</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">+5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Métriques de performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">94%</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Satisfaction client</h4>
              <p className="text-sm text-gray-600">Basé sur 156 avis</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">89%</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Taux de conversion</h4>
              <p className="text-sm text-gray-600">Visiteurs → Clients</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4.8</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Note moyenne</h4>
              <p className="text-sm text-gray-600">Sur 5 étoiles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
