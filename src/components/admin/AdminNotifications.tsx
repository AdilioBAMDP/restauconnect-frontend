import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Users, DollarSign, MessageSquare } from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';

interface AdminNotification {
  id: string;
  type: 'new_user' | 'new_application' | 'high_value_transaction' | 'flagged_content' | 'system_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export default function AdminNotifications() {
  const { professionals, applications, messages } = useBusinessStore();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());

  // Générer des notifications basées sur les vraies données
  useEffect(() => {
    const newNotifications: AdminNotification[] = [];
    const now = Date.now();
    // const checkInterval = 30000; // 30 secondes

    // Nouveaux utilisateurs (derniers professionnels ajoutés)
    const recentProfessionals = professionals.filter(pro => {
      const createdTime = new Date(pro.experience || Date.now()).getTime();
      return createdTime > lastCheck;
    });

    recentProfessionals.forEach(pro => {
      newNotifications.push({
        id: `new_user_${pro.id}`,
        type: 'new_user',
        title: 'Nouvel utilisateur inscrit',
        message: `${pro.name} (${pro.role}) vient de s'inscrire à ${pro.location}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      });
    });

    // Nouvelles candidatures importantes
    const recentApplications = applications.filter(app => {
      const createdTime = new Date(app.createdAt).getTime();
      return createdTime > lastCheck;
    });

    recentApplications.forEach(app => {
      const professional = professionals.find(p => p.id === app.professionalId);
      newNotifications.push({
        id: `new_app_${app.id}`,
        type: 'new_application',
        title: 'Nouvelle candidature',
        message: `${professional?.name || 'Professionnel'} a postulé pour une offre`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'low'
      });
    });

    // Transactions importantes (candidatures acceptées avec gros montants)
    const highValueTransactions = applications.filter(app => 
      app.status === 'accepted' && app.proposedPrice && 
      parseFloat(app.proposedPrice.replace(/[€\s]/g, '')) > 2000
    );

    if (highValueTransactions.length > 0) {
      newNotifications.push({
        id: `high_value_${Date.now()}`,
        type: 'high_value_transaction',
        title: 'Transaction importante',
        message: `${highValueTransactions.length} transaction(s) > 2000€ détectée(s)`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high'
      });
    }

    // Utilisateurs problématiques (rating très bas)
    const problematicUsers = professionals.filter(pro => pro.rating < 2 && pro.reviewCount > 3);
    if (problematicUsers.length > 0) {
      newNotifications.push({
        id: `flagged_users_${Date.now()}`,
        type: 'flagged_content',
        title: 'Utilisateurs signalés',
        message: `${problematicUsers.length} utilisateur(s) avec rating < 2/5 à surveiller`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high'
      });
    }

    // Messages non lus nombreux
    const unreadMessagesCount = messages.filter(msg => !msg.read).length;
    if (unreadMessagesCount > 10) {
      newNotifications.push({
        id: `unread_messages_${Date.now()}`,
        type: 'system_alert',
        title: 'Beaucoup de messages non lus',
        message: `${unreadMessagesCount} messages en attente de modération`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      });
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 20)); // Garder les 20 dernières
    }

    setLastCheck(now);
  }, [professionals, applications, messages, lastCheck]);

  // Socket.IO désactivé — le backend Railway ne supporte pas Socket.IO
  // Les notifications se basent sur les données du store en temps réel

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'new_user': return <Users className="w-4 h-4" />;
      case 'new_application': return <MessageSquare className="w-4 h-4" />;
      case 'high_value_transaction': return <DollarSign className="w-4 h-4" />;
      case 'flagged_content': return <AlertTriangle className="w-4 h-4" />;
      case 'system_alert': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: AdminNotification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Bouton notifications */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel des notifications */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications Admin</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Tout lire
                </button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune notification récente
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
