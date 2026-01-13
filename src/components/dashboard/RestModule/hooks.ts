// Custom hooks for Complete Dashboard
import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { ShoppingCart, Package, FileText, MessageCircle } from 'lucide-react';
import { apiClient } from '@/services/api';

export const useMainStatCards = () => {
  const [stats, setStats] = useState({
    activeOffers: 0,
    totalUsers: 0,
    revenue: 0,
    growth: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/orders/stats');
        
        if (response.data.success) {
          setStats({
            activeOffers: response.data.data.total || 0,
            totalUsers: response.data.data.completed || 0,
            revenue: response.data.data.revenue || 0,
            growth: response.data.data.pending || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return stats;
};

export const useMainStatsCards = () => {
  const [statsCards, setStatsCards] = useState([
    {
      id: '1',
      label: 'Chiffre d\'Affaires',
      value: '0 €',
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 0
    },
    {
      id: '2',
      label: 'Commandes',
      value: '0',
      icon: 'BarChart3',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: 0
    },
    {
      id: '3',
      label: 'Professionnels',
      value: '0',
      icon: 'Users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 0
    },
    {
      id: '4',
      label: 'Croissance',
      value: '0%',
      icon: 'TrendingUp',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 0
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/restaurant/orders/stats');
        
        if (response.data.success && response.data.data) {
          const stats = response.data.data;
          const growth = stats.total > 0 ? Math.round(((stats.delivered / stats.total) * 100)) : 0;
          
          setStatsCards([
            {
              id: '1',
              label: 'Chiffre d\'Affaires',
              value: `${stats.revenue?.toFixed(2) || '0'} €`,
              icon: 'DollarSign',
              color: 'text-green-600',
              bgColor: 'bg-green-100',
              change: stats.revenue > 0 ? 15 : 0
            },
            {
              id: '2',
              label: 'Commandes',
              value: `${stats.total || '0'}`,
              icon: 'BarChart3',
              color: 'text-blue-600',
              bgColor: 'bg-blue-100',
              change: stats.total > 0 ? 8 : 0
            },
            {
              id: '3',
              label: 'Professionnels',
              value: `${stats.confirmed || '0'}`,
              icon: 'Users',
              color: 'text-purple-600',
              bgColor: 'bg-purple-100',
              change: stats.confirmed > 0 ? 5 : 0
            },
            {
              id: '4',
              label: 'Croissance',
              value: `${growth}%`,
              icon: 'TrendingUp',
              color: 'text-orange-600',
              bgColor: 'bg-orange-100',
              change: growth > 0 ? growth : 0
            }
          ]);
        }
      } catch (error) {
        console.error('❌ Erreur statistiques restaurant:', error);
        // Garder les valeurs à 0 en cas d'erreur
      }
    };

    fetchStats();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return statsCards;
};

export const useRealActivities = () => {
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    timestamp: Date | string;
  }>>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Récupérer les données en parallèle avec apiClient
        const [ordersRes, deliveriesRes, conversationsRes] = await Promise.all([
          apiClient.get('/orders').catch(() => null),
          apiClient.get('/tms/deliveries/my-deliveries').catch(() => null),
          apiClient.get('/conversations').catch(() => null)
        ]);

        const allActivities: Array<{
          id: string;
          type: string;
          title: string;
          description?: string;
          timestamp: Date | string;
        }> = [];

        // Activités des commandes
        if (ordersRes?.data) {
          const ordersData = ordersRes.data;
          const orders = ordersData.orders || ordersData.data || [];
            orders.slice(0, 5).forEach((order: any) => {
              const statusLabels: Record<string, string> = {
                'pending': 'Nouvelle commande en attente',
                'confirmed': 'Commande confirmée',
                'in_progress': 'Commande en préparation',
                'ready_for_pickup': 'Commande prête pour enlèvement',
                'completed': 'Commande livrée',
                'cancelled': 'Commande annulée'
              };
              allActivities.push({
                id: `order-${order._id}`,
                type: 'order',
                title: statusLabels[order.status] || 'Nouvelle activité commande',
                description: `Commande #${order.orderNumber || order._id?.slice(-6)} - ${order.totalAmount?.toFixed(2) || '0'}€`,
                timestamp: order.updatedAt || order.createdAt || new Date()
              });
            });
        }

        // Activités des livraisons
        if (deliveriesRes?.data) {
          deliveriesRes.data.forEach((delivery: any) => {
              const statusLabels: Record<string, string> = {
                'assigned': 'Livreur assigné',
                'pickup_pending': 'En attente de récupération',
                'picked_up': 'Colis récupéré',
                'in_transit': 'Livraison en cours',
                'delivered': 'Livré avec succès'
              };
              allActivities.push({
                id: `delivery-${delivery._id}`,
                type: 'delivery',
                title: statusLabels[delivery.status] || 'Mise à jour livraison',
                description: `Livraison par ${delivery.driverName || 'livreur'} - Commande #${delivery.orderId?.slice(-6)}`,
              timestamp: delivery.updatedAt || delivery.createdAt || new Date()
            });
          });
        }

        // Activités des conversations/messages
        if (conversationsRes?.data) {
          conversationsRes.data.forEach((conversation: any) => {
              if (conversation.lastMessage) {
                allActivities.push({
                  id: `message-${conversation._id}`,
                  type: 'message',
                  title: 'Nouveau message reçu',
                  description: `${conversation.lastMessage.content?.slice(0, 50) || 'Message'}...`,
                  timestamp: conversation.lastMessage.createdAt || conversation.updatedAt || new Date()
                });
              }
            });
        }

        // Trier par date (plus récent en premier)
        allActivities.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        });

        setActivities(allActivities.slice(0, 10));
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return activities;
};

export const useRealStats = () => {
  return {
    activeOffers: 12,
    totalUsers: 156,
    revenue: 15420,
    growth: 8.5
  };
};

export const useQuickActions = () => {
  const { navigateTo } = useAppStore();
  
  return [
    {
      id: 'new-order',
      label: 'Nouvelle Commande',
      icon: ShoppingCart,
      color: 'text-blue-600',
      onClick: () => navigateTo('supplier-selection')
    },
    {
      id: 'view-orders',
      label: 'Mes Commandes',
      icon: Package,
      color: 'text-green-600',
      onClick: () => navigateTo('orders')
    },
    {
      id: 'inventory',
      label: 'Inventaire',
      icon: FileText,
      color: 'text-purple-600',
      onClick: () => navigateTo('inventory')
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      color: 'text-orange-600',
      onClick: () => navigateTo('messages')
    }
  ];
};
