/**
 * 📊 PAGE INFORMATION EN TEMPS RÉEL
 * 
 * Affiche les informations en temps réel du système :
 * - Notifications récentes
 * - Nouvelles commandes
 * - Nouveaux messages
 * - Activité récente
 * - Alertes système
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  ShoppingCart, 
  MessageCircle, 
  AlertCircle,
  Clock,
  Users,
  Activity
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';
import { useBusinessStore } from '@/stores/businessStore';

interface RealtimeNotification {
  id: string;
  type: 'order' | 'message' | 'alert' | 'activity';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  userName?: string;
}

const InformationGlobale: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { globalAnnouncements, fetchGlobalAnnouncements } = useBusinessStore();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'message' | 'alert'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les vraies annonces depuis l'API
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 [InformationGlobale] Chargement des annonces...');
      setIsLoading(true);
      
      try {
        await fetchGlobalAnnouncements();
        console.log('✅ [InformationGlobale] Annonces chargées:', globalAnnouncements.length);
      } catch (error) {
        console.error('❌ [InformationGlobale] Erreur chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Refresh automatique toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [fetchGlobalAnnouncements]);

  // Convertir les announcements en notifications
  useEffect(() => {
    if (globalAnnouncements.length > 0) {
      const convertedNotifications: RealtimeNotification[] = globalAnnouncements.map(ann => ({
        id: ann.id,
        type: ann.priority === 'urgent' ? 'alert' : 'activity',
        title: ann.title,
        message: ann.content,
        timestamp: new Date(ann.createdAt),
        read: false,
        userName: ann.createdBy?.name || 'Système'
      }));
      setNotifications(convertedNotifications);
      console.log('📝 [InformationGlobale] Notifications converties:', convertedNotifications.length);
    }
  }, [globalAnnouncements]);

  const getIconByType = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const stats = {
    totalNotifications: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    orders: notifications.filter(n => n.type === 'order').length,
    messages: notifications.filter(n => n.type === 'message').length,
    alerts: notifications.filter(n => n.type === 'alert').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header currentPage="information-globale" onNavigate={navigateTo} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Information en temps réel
          </h1>
          <p className="text-gray-600">
            Suivez l'activité de votre plateforme en temps réel
          </p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
              </div>
              <Bell className="w-10 h-10 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.orders}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-green-600">{stats.messages}</p>
              </div>
              <MessageCircle className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.alerts}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tout ({stats.totalNotifications})
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'order'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Commandes ({stats.orders})
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'message'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Messages ({stats.messages})
            </button>
            <button
              onClick={() => setActiveTab('alert')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'alert'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Alertes ({stats.alerts})
            </button>
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-20 animate-spin" />
              <p className="text-lg text-gray-500">Chargement des informations...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getIconByType(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(notification.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        {notification.userName && (
                          <p className="text-sm text-gray-500">
                            <Users className="w-4 h-4 inline mr-1" />
                            {notification.userName}
                          </p>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Nouveau
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg mb-2">Aucune notification pour le moment</p>
                  <p className="text-sm">Les informations apparaîtront ici en temps réel</p>
                  <p className="text-xs mt-4 text-gray-400">
                    Debug: {globalAnnouncements.length} annonces dans le store
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformationGlobale;
