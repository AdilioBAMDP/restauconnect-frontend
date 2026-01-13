import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Target, 
  Bell,
  Zap,
  Plus,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';

// Composant temporaire pour les graphiques - Version améliorée
const DashboardStatsWithCharts: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
      Graphiques de Performance
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Évolution CA</h4>
        <div className="flex items-end space-x-1 h-20">
          {[65, 78, 82, 90, 85, 92, 88].map((height, i) => (
            <div key={i} className="bg-blue-500 rounded-t" style={{height: `${height}%`, width: '12px'}}></div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">7 derniers jours</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Taux de conversion</h4>
        <div className="flex items-center justify-center h-20">
          <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-gray-200 flex items-center justify-center">
            <span className="text-sm font-bold text-green-600">87%</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">Ce mois</p>
      </div>
    </div>
  </div>
);

interface LiveStats {
  dailyRevenue: number;
  monthlyRevenue: number;
  urgentCommands: number;
  stockAlerts: number;
}

interface NotificationData {
  clientName?: string;
  message?: string;
  amount?: number;
}

interface Notification {
  type: 'new_command' | 'stock_alert' | 'payment_received';
  data: NotificationData;
}

interface BusinessAnalytics {
  chiffreAffaire?: {
    evolution?: number;
  };
  performance?: {
    productivite?: number;
  };
}

interface ArtisanMainDashboardProps {
  liveStats: LiveStats;
  notifications: Notification[];
  mockBusinessAnalytics: BusinessAnalytics;
  onSetNotifications?: (notifications: Notification[]) => void;
  onSetActiveTab: (tab: string) => void;
  onShowNewCommandModal: () => void;
}

const ArtisanMainDashboard: React.FC<ArtisanMainDashboardProps> = ({
  liveStats,
  notifications,
  mockBusinessAnalytics,
  onSetNotifications,
  onSetActiveTab,
  onShowNewCommandModal
}) => {
  return (
    <div className="space-y-6">
      {/* Alertes en temps réel */}
      {notifications.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-blue-900">Notifications en temps réel</h3>
            </div>
            <button 
              onClick={() => onSetNotifications?.([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Effacer tout
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {notifications.slice(0, 3).map((notif, index) => (
              <div key={index} className="text-sm text-blue-800">
                • {notif.type === 'new_command' ? `Nouvelle commande de ${notif.data.clientName}` :
                   notif.type === 'stock_alert' ? notif.data.message :
                   `Paiement de ${notif.data.amount}€ reçu`}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* KPIs en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">CA Aujourd'hui</h3>
              <p className="text-2xl font-bold text-gray-900">{liveStats.dailyRevenue.toLocaleString()}€</p>
              <p className="text-xs text-green-600">+{((liveStats.dailyRevenue / 800) * 100).toFixed(0)}% vs objectif</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">CA Mensuel</h3>
              <p className="text-2xl font-bold text-gray-900">{liveStats.monthlyRevenue.toLocaleString()}€</p>
              <p className="text-xs text-blue-600">+{mockBusinessAnalytics?.chiffreAffaire?.evolution || 0}% vs mois dernier</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Urgences</h3>
              <p className="text-2xl font-bold text-gray-900">{liveStats.urgentCommands}</p>
              <p className="text-xs text-red-600">Interventions critiques</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Alertes Stock</h3>
              <p className="text-2xl font-bold text-gray-900">{liveStats.stockAlerts}</p>
              <p className="text-xs text-orange-600">Réapprovisionnement</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Performance</h3>
              <p className="text-2xl font-bold text-gray-900">{mockBusinessAnalytics?.performance?.productivite || 0}%</p>
              <p className="text-xs text-purple-600">Taux de productivité</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions rapides professionnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            Actions Rapides
          </h3>
          <div className="space-y-3">
            <button 
              onClick={onShowNewCommandModal}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Plus className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-900 font-medium">Nouvelle commande</span>
              </div>
              <span className="text-blue-600 text-xs">Ctrl+N</span>
            </button>
            
            <button 
              onClick={() => onSetActiveTab('inventaire')}
              className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Package className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-orange-900 font-medium">Vérifier stock</span>
              </div>
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">{liveStats.stockAlerts}</span>
            </button>
            
            <button 
              onClick={() => onSetActiveTab('planning')}
              className="w-full flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Calendar className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-purple-900 font-medium">Planifier tournée</span>
            </button>
            
            <button 
              onClick={() => onSetActiveTab('facturation')}
              className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-900 font-medium">Générer facture</span>
            </button>
          </div>
        </div>

        {/* Urgences du jour */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Urgences du jour
          </h3>
          <div className="space-y-3">
            {liveStats.urgentCommands > 0 ? (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Interventions critiques</p>
                    <p className="text-xs text-red-600">{liveStats.urgentCommands} intervention(s) en attente</p>
                  </div>
                </div>
                <button 
                  onClick={() => onSetActiveTab('commandes')}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Voir →
                </button>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <p className="text-sm text-green-700">Aucune urgence aujourd'hui</p>
              </div>
            )}
          </div>
        </div>

        {/* Planning du jour */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-purple-500 mr-2" />
            Planning du jour
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Prochaine intervention</p>
                  <p className="text-xs text-purple-600">Maintenance - Restaurant Le Bistrot</p>
                  <p className="text-xs text-purple-500">14h30 - 16h00</p>
                </div>
              </div>
              <button 
                onClick={() => onSetActiveTab('planning')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Voir →
              </button>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Aujourd'hui: 3 interventions</span>
              <span className="text-green-600">2 terminées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques de performance */}
      <DashboardStatsWithCharts />
    </div>
  );
};

export default ArtisanMainDashboard;