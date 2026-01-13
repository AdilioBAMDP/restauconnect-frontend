import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Package, DollarSign, Users, Clock, Activity } from 'lucide-react';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';

interface AnalyticsData {
  revenue: {
    today: number;
    week: number;
    month: number;
    trend: number;
  };
  deliveries: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  drivers: {
    active: number;
    available: number;
    busy: number;
  };
  orders: {
    total: number;
    avgValue: number;
    topCategory: string;
  };
}

interface TimeSeriesData {
  time: string;
  orders: number;
  revenue: number;
  deliveries: number;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: { today: 0, week: 0, month: 0, trend: 0 },
    deliveries: { total: 0, completed: 0, inProgress: 0, pending: 0 },
    drivers: { active: 0, available: 0, busy: 0 },
    orders: { total: 0, avgValue: 0, topCategory: '' }
  });

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // TODO: Implémenter appel API réel pour les analytics
        // const data = await analyticsService.getAnalytics();
        // setAnalytics(data.analytics);
        // setTimeSeriesData(data.timeSeries);
        
        // Pour l'instant, pas de données disponibles
        setAnalytics(null);
        setTimeSeriesData([]);
      } catch (error) {
        console.error('Erreur chargement analytics:', error);
        setAnalytics(null);
        setTimeSeriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const deliveryStatusData = [
    { name: 'Terminées', value: analytics.deliveries.completed },
    { name: 'En cours', value: analytics.deliveries.inProgress },
    { name: 'En attente', value: analytics.deliveries.pending },
  ];

  const driverStatusData = [
    { name: 'Disponibles', value: analytics.drivers.available },
    { name: 'Occupés', value: analytics.drivers.busy },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Chargement analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={0}
              avgRating={4.5}
              activeOffers={analytics?.orders?.total || 0}
              currentUserRole="analytics"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => {}}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics en Temps Réel</h1>
          <p className="text-gray-600 mt-2">Tableau de bord des performances</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.revenue.today.toFixed(2)}€
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{analytics.revenue.trend}% vs hier
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          {/* Deliveries Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livraisons Totales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.deliveries.total}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {analytics.deliveries.completed} terminées
                </p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.orders.total}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Panier moyen: {analytics.orders.avgValue.toFixed(2)}€
                </p>
              </div>
              <Activity className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          {/* Drivers Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livreurs Actifs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.drivers.active}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {analytics.drivers.available} disponibles
                </p>
              </div>
              <Users className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue & Orders Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📈 Revenus & Commandes (24h)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  name="Revenus (€)"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stackId="2"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  name="Commandes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Deliveries Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📦 Statut des Livraisons
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deliveries Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚚 Livraisons (24h)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="deliveries" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Livraisons"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Driver Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              👥 Statut des Livreurs
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={driverStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Updates Indicator */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center">
          <Clock className="w-5 h-5 text-green-600 mr-2 animate-pulse" />
          <span className="text-green-800 font-medium">
            Données mises à jour en temps réel • Dernière mise à jour: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
