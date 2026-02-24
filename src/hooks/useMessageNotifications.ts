import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useConversationStore } from '@/stores/conversationStore';
import { messageNotificationService } from '@/services/MessageNotificationService.tsx';

let socket: Socket | null = null;

/**
 * Hook pour gérer les notifications de messages en temps réel via Socket.io
 */
export const useMessageNotifications = (isAuthenticated: boolean, userId?: string) => {
  const { fetchUnreadCount, addMessageToConversation, currentConversation } = useConversationStore();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      // Déconnecter si pas authentifié
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    // Initialiser la connexion Socket.io
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socket = io(API_URL, {
      auth: {
        token: localStorage.getItem('auth_token')
      },
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 3,
      timeout: 5000
    });

    // Événement: Erreur de connexion (silencieux pour éviter le spam)
    socket.on('connect_error', () => {
      // Socket.IO non disponible sur ce backend, on arrête les tentatives
      socket?.disconnect();
    });

    // Événement: Connexion établie
    socket.on('connect', () => {
      console.log('✅ Socket.io connecté pour les notifications');
      
      // Rejoindre la room de l'utilisateur
      socket?.emit('join-user-room', userId);
    });

    // Événement: Nouveau message reçu
    socket.on('new-message', (data: {
      conversationId: string;
      message: {
        _id: string;
        senderId: string;
        senderName: string;
        senderRole: string;
        content: string;
        type: string;
        readBy: string[];
        createdAt: string;
      };
    }) => {
      console.log('📨 Nouveau message reçu via Socket.io:', data);

      const { conversationId, message } = data;

      // Ne pas notifier si c'est notre propre message
      if (message.senderId === userId) {
        return;
      }

      // Si on est déjà dans cette conversation, ajouter le message
      if (currentConversation?._id === conversationId) {
        addMessageToConversation(conversationId, {
          _id: message._id,
          senderId: message.senderId,
          senderName: message.senderName,
          senderRole: message.senderRole,
          content: message.content,
          type: message.type as 'text' | 'image' | 'file' | 'quote' | 'system',
          readBy: message.readBy,
          createdAt: message.createdAt
        });
      }

      // Afficher la notification toast
      messageNotificationService.showNewMessageNotification({
        conversationId,
        senderName: message.senderName,
        senderRole: message.senderRole,
        messagePreview: message.content.substring(0, 100)
      });

      // Rafraîchir le compteur
      fetchUnreadCount();
    });

    // Événement: Conversation marquée comme lue
    socket.on('conversation-read', (data: {
      conversationId: string;
      userId: string;
    }) => {
      console.log('✅ Conversation marquée comme lue:', data);
      
      // Rafraîchir le compteur
      fetchUnreadCount();
    });

    // Événement: Erreur
    socket.on('error', (error: Error | { message: string }) => {
      console.error('❌ Erreur Socket.io:', error);
    });

    // Événement: Déconnexion
    socket.on('disconnect', (reason: string) => {
      console.warn('⚠️ Socket.io déconnecté:', reason);
      
      // Tenter de reconnecter si la déconnexion n'est pas volontaire
      if (reason === 'io server disconnect') {
        socket?.connect();
      }
    });

    // Cleanup à la déconnexion
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('new-message');
        socket.off('conversation-read');
        socket.off('error');
        socket.off('disconnect');
        socket.disconnect();
        socket = null;
      }
    };
  }, [isAuthenticated, userId, fetchUnreadCount, addMessageToConversation, currentConversation]);

  return { socket };
};
