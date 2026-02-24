/**
 * NOTIFICATION STORE - Gestion d'état des notifications
 * 
 * Ce store gère :
 * - Liste des notifications
 * - Compteur de notifications non lues
 * - Notifications temps réel via Socket.io
 * - Marquage comme lu
 * - Archivage et suppression
 * - Groupement par type
 */

import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export type NotificationType = 
  | 'offer-urgent'      // Nouvelle offre urgente
  | 'offer-response'    // Réponse à votre offre
  | 'offer-closed'      // Offre fermée
  | 'message-new'       // Nouveau message chat
  | 'quote-received'    // Nouveau devis reçu
  | 'quote-accepted'    // Devis accepté
  | 'quote-rejected'    // Devis rejeté
  | 'quote-viewed'      // Devis consulté
  | 'system'            // Notification système
  | 'other';            // Autre

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  _id: string;
  userId: string;
  userRole: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  
  // Données structurées
  data: {
    offerId?: string;
    conversationId?: string;
    quoteId?: string;
    senderId?: string;
    [key: string]: unknown;
  };
  
  // Action
  actionUrl?: string;
  actionLabel?: string;
  
  // Groupement
  groupKey?: string;
  
  // État
  read: boolean;
  readAt?: string;
  archived: boolean;
  
  // Canaux d'envoi
  sentViaSocket?: boolean;
  sentViaPush?: boolean;
  sentViaEmail?: boolean;
  
  // Expiration
  expiresAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  // État
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Filtres
  showOnlyUnread: boolean;
  filterByType: NotificationType | null;
  
  // Actions - Lecture
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
  getUnreadCount: () => Promise<void>;
  
  // Actions - Écriture
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  archiveNotification: (notificationId: string) => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  
  // Actions - Socket.io (appelées par les listeners)
  addNotification: (notification: Notification) => void;
  
  // Actions - Filtres
  toggleShowUnread: () => void;
  setTypeFilter: (type: NotificationType | null) => void;
  
  // Actions - Utilitaires
  clearError: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // État initial
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  showOnlyUnread: false,
  filterByType: null,
  
  // Récupérer les notifications
  fetchNotifications: async (unreadOnly: boolean = false) => {
    try {
      set({ isLoading: true, error: null });
      
      const token = localStorage.getItem('authToken');
      const params = unreadOnly ? { unread: true } : {};
      
      const response = await axios.get(`${API_URL}/notifications`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        notifications: response.data.notifications,
        isLoading: false
      });
      
      // Mettre à jour le compteur
      get().getUnreadCount();
      
    } catch (error: unknown) {
      console.error('❌ Erreur fetch notifications:', error);
      const err = error as { response?: { data?: { message?: string } } };
      set({
        error: err.response?.data?.message || 'Erreur lors du chargement des notifications',
        isLoading: false
      });
    }
  },
  
  // Récupérer le compteur de notifications non lues
  getUnreadCount: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/notifications/unread/count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        unreadCount: response.data.count
      });
      
    } catch (error: unknown) {
      console.error('❌ Erreur unread count:', error);
      // Ne pas afficher d'erreur à l'utilisateur
    }
  },
  
  // Marquer une notification comme lue
  markAsRead: async (notificationId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`${API_URL}/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Mettre à jour localement
      set((state) => ({
        notifications: state.notifications.map(n => 
          n._id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      
      try {
        set({ isLoading: true, error: null });
        const params = unreadOnly ? { unread: true } : {};
        const response = await axios.get(`${API_URL}/notifications`, {
          params,
          headers: getAuthHeaders()
        });
        set({
          notifications: response.data.notifications,
          isLoading: false
        });
        // Mettre à jour le compteur
        get().getUnreadCount();
      } catch (error: unknown) {
        console.error('❌ Erreur fetch notifications:', error);
        const err = error as { response?: { data?: { message?: string } } };
        set({
          error: err.response?.data?.message || 'Erreur lors du chargement des notifications',
          isLoading: false
        });
      }
          read: true, 
          readAt: new Date().toISOString() 
        try {
          const response = await axios.get(`${API_URL}/notifications/unread/count`, {
            headers: getAuthHeaders()
          });
          set({
            unreadCount: response.data.count
          });
        } catch (error: unknown) {
          console.error('❌ Erreur unread count:', error);
          // Ne pas afficher d'erreur à l'utilisateur
        }
  },
  
  // Archiver une notification
  archiveNotification: async (notificationId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`${API_URL}/notifications/${notificationId}/archive`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Retirer de la liste
      set((state) => ({
        notifications: state.notifications.filter(n => n._id !== notificationId)
      }));
      
      try {
        await axios.patch(`${API_URL}/notifications/${notificationId}/read`, {}, {
          headers: getAuthHeaders()
        });
        set((state) => {
          const notification = state.notifications.find(n => n._id === notificationId);
          const wasUnread = notification && !notification.read;
          return {
            notifications: state.notifications.filter(n => n._id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          };
        });
        return true;
      } catch (error: unknown) {
        console.error('❌ Erreur mark notification as read:', error);
        const err = error as { response?: { data?: { message?: string } } };
        set({
          error: err.response?.data?.message || 'Erreur lors du marquage comme lu'
        });
        return false;
      }
        return {
          notifications: state.notifications.filter(n => n._id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        };
      });
      
      return true;
      
    } catch (error: unknown) {
      console.error('❌ Erreur delete notification:', error);
      const err = error as { response?: { data?: { message?: string } } };
      set({
        error: err.response?.data?.message || 'Erreur lors de la suppression'
      });
      return false;
    }
  },
  
  // Ajouter une notification reçue via Socket.io
  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },
  
  // Toggle affichage non lues uniquement
  toggleShowUnread: () => {
    set((state) => {
      const newShowOnlyUnread = !state.showOnlyUnread;
      return { showOnlyUnread: newShowOnlyUnread };
    });
    
    // Recharger avec le nouveau filtre
    get().fetchNotifications(get().showOnlyUnread);
  },
  
  // Filtrer par type
  setTypeFilter: (type: NotificationType | null) => {
    set({ filterByType: type });
  },
  
  // Utilitaires
  clearError: () => set({ error: null }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 })
}));

export default useNotificationStore;
