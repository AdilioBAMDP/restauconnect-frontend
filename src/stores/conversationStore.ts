import { create } from 'zustand';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export type MessageType = 'text' | 'image' | 'file' | 'quote' | 'system';

export interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  type: MessageType;
  content: string;
  attachments?: Array<{
    url: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    type: 'image' | 'document' | 'archive';
  }>;
  quoteId?: string;
  quoteData?: {
    totalAmount: number;
    currency: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
  readBy: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Participant {
  userId: string;
  userName: string;
  userRole: string;
  lastReadAt?: string;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  offerId?: string;
  offerTitle?: string;
  messages: Message[];
  status: 'active' | 'archived' | 'blocked';
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: {
    [userId: string]: number;
  };
  myUnreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  totalUnread: number;
  unreadConversationsCount: number;
  fetchConversations: () => Promise<void>;
  fetchConversationById: (id: string) => Promise<void>;
  createConversation: (otherUserId: string, offerId?: string, partnerName?: string) => Promise<Conversation | null>;
  findOrCreateConversation: (otherUserId: string, otherUserName: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, type?: MessageType) => Promise<boolean>;
  sendMessageWithFiles: (conversationId: string, content: string, files?: File[]) => Promise<boolean>;
  markAsRead: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<boolean>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  addMessageToConversation: (conversationId: string, message: Message) => void;
  incrementUnreadCount: (conversationId: string) => void;
  clearError: () => void;
  clearCurrentConversation: () => void;
  calculateTotalUnread: () => void;
  fetchUnreadCount: () => Promise<void>;
}

// Helpers pour contourner les problèmes de types natifs
const hasLength = (arr: unknown): arr is { length: number } => {
  return !!(arr && typeof (arr as { length?: unknown }).length === 'number');
};

const arrayLength = (arr: unknown): number => {
  return hasLength(arr) ? arr.length : 0;
};

const arrayForEach = (arr: unknown, callback: (item: unknown) => void): void => {
  if (arr && typeof (arr as { forEach?: unknown }).forEach === 'function') {
    (arr as { forEach: (cb: (item: unknown) => void) => void }).forEach(callback);
  }
};

const arrayReduce = <T>(arr: unknown, callback: (acc: T, item: unknown) => T, initial: T): T => {
  if (arr && typeof (arr as { reduce?: unknown }).reduce === 'function') {
    return (arr as { reduce: (cb: (acc: T, item: unknown) => T, init: T) => T }).reduce(callback, initial);
  }
  return initial;
};

const arraySome = (arr: unknown, callback: (item: unknown) => boolean): boolean => {
  if (arr && typeof (arr as { some?: unknown }).some === 'function') {
    return (arr as { some: (cb: (item: unknown) => boolean) => boolean }).some(callback);
  }
  return false;
};

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isSending: false,
  error: null,
  totalUnread: 0,
  unreadConversationsCount: 0,

  fetchConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('🔍 STORE fetchConversations - response.data:', response.data);
      console.log('🔍 STORE fetchConversations - conversations extraites:', response.data.data?.conversations);
      set({
        conversations: response.data.data?.conversations || [],
        isLoading: false
      });
      get().calculateTotalUnread();
    } catch {
      set({
        conversations: [],
        error: 'Erreur lors du chargement des conversations',
        isLoading: false
      });
    }
  },

  fetchConversationById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ fetchConversationById response.data:', response.data);
      // CORRECTION: Le backend retourne { success: true, data: conversation }
      const conversation = response.data.data || response.data;
      const conversationWithMessages = {
        ...conversation,
        messages: conversation.messages || []
      };
      console.log('✅ conversationWithMessages:', conversationWithMessages);
      set({
        currentConversation: conversationWithMessages,
        isLoading: false
      });
      get().markAsRead(id);
    } catch {
      set({
        error: 'Erreur lors du chargement de la conversation',
        isLoading: false
      });
    }
  },

  createConversation: async (otherUserId: string, offerId?: string, partnerName?: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('auth_token');
      const isPartner = otherUserId.startsWith('partner-');
      const payload: {
        otherUserId: string;
        offerId?: string;
        isPartner: boolean;
        partnerName?: string;
        otherUserName?: string;
        otherUserRole?: string;
      } = { otherUserId, offerId, isPartner };
      if (isPartner && partnerName) {
        payload.partnerName = partnerName;
        payload.otherUserName = decodeURIComponent(partnerName);
        if (otherUserId.includes('banquier')) {
          payload.otherUserRole = 'banquier';
        } else if (otherUserId.includes('investisseur')) {
          payload.otherUserRole = 'investisseur';
        } else if (otherUserId.includes('restaurant')) {
          payload.otherUserRole = 'restaurant';
        } else if (otherUserId.includes('fournisseur')) {
          payload.otherUserRole = 'fournisseur';
        } else {
          payload.otherUserRole = 'partenaire';
        }
      }
      const response = await axios.post(`${API_URL}/conversations`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newConversation = response.data.data;
      set((state) => {
        const exists = state.conversations.some(c => c._id === newConversation._id);
        return {
          conversations: exists ? state.conversations : [newConversation, ...state.conversations],
          currentConversation: newConversation,
          isLoading: false
        };
      });
      return newConversation;
    } catch (error) {
      console.error('❌ createConversation: Erreur lors de la création de conversation', error);
      set({ isLoading: false, error: 'Impossible de créer la conversation' });
      return null;
    }
  },

  findOrCreateConversation: async (otherUserId: string) => {
    try {
      const conversationsArr = get().conversations;
      if (conversationsArr && arrayLength(conversationsArr) === 0) {
        await get().fetchConversations();
      }
      const existingConversation = get().conversations.find(conv =>
        conv.participants && arraySome(conv.participants, (p: unknown) => (p as Participant).userId === otherUserId)
      );
      if (existingConversation) {
        set({ currentConversation: existingConversation });
        try {
          const { NavigationManager } = await import('@/services/NavigationManager');
          NavigationManager.navigateTo('messages');
        } catch {
          const globalObj = globalThis as { location?: { hash: string } };
          if (typeof globalThis !== 'undefined' && globalObj.location) {
            globalObj.location.hash = '#messages';
            const eventObj = globalThis as { HashChangeEvent?: new(type: string) => Event; dispatchEvent?: (event: Event) => void };
            if (typeof eventObj.HashChangeEvent !== 'undefined' && eventObj.dispatchEvent) {
              eventObj.dispatchEvent(new eventObj.HashChangeEvent('hashchange'));
            }
          }
        }
      } else {
        let offerId: string | undefined = undefined;
        const win = globalThis as unknown as Window & { selectedAnnouncement?: { id: string } };
        if (typeof win !== 'undefined' && win.selectedAnnouncement) {
          offerId = win.selectedAnnouncement.id;
        }
        const newConversation = await get().createConversation(otherUserId, offerId);
        if (newConversation) {
          try {
            const { NavigationManager } = await import('@/services/NavigationManager');
            NavigationManager.navigateTo('messages');
          } catch {
            const windowObj = window as { location?: { hash: string } };
            if (typeof window !== 'undefined' && windowObj.location) {
              windowObj.location.hash = '#messages';
              const eventObj = window as { HashChangeEvent?: new(type: string) => Event; dispatchEvent?: (event: Event) => void };
              if (typeof eventObj.HashChangeEvent !== 'undefined' && eventObj.dispatchEvent) {
                eventObj.dispatchEvent(new eventObj.HashChangeEvent('hashchange'));
              }
            }
          }
        }
      }
    } catch {
      set({ error: 'Erreur lors de la création du contact' });
    }
  },

  sendMessage: async (conversationId: string, content: string, type: MessageType = 'text') => {
    try {
      set({ isSending: true, error: null });
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`,
        { content, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ sendMessage response.data:', response.data);
      // CORRECTION: Le backend retourne { success: true, data: conversation }
      const updatedConversation = response.data.data || response.data.conversation || response.data;
      console.log('✅ updatedConversation:', updatedConversation);
      set((state) => {
        return {
          conversations: state.conversations.map(c =>
            c._id === conversationId ? updatedConversation : c
          ),
          currentConversation: state.currentConversation?._id === conversationId
            ? updatedConversation
            : state.currentConversation,
          isSending: false
        };
      });
      // Rafraîchir le compteur après envoi
      await get().fetchUnreadCount();
      return true;
    } catch {
      set({ error: "Erreur lors de l'envoi du message", isSending: false });
      return false;
    }
  },

  sendMessageWithFiles: async (conversationId: string, content: string, files?: File[]) => {
    try {
      set({ isSending: true, error: null });
      const token = localStorage.getItem('auth_token');
      let attachments: Array<{
        url: string;
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        type: 'image' | 'document' | 'archive';
      }> = [];
      if (files && arrayLength(files) > 0) {
        const formData = new FormData();
        arrayForEach(files, (file: unknown) => {
          formData.append('files', file as File);
        });
        const uploadResponse = await axios.post(
          `${API_URL}/conversations/${conversationId}/upload-files`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        attachments = uploadResponse.data.data.files;
      }
      const response = await axios.post(
        `${API_URL}/conversations/${conversationId}/messages`,
        {
          content: content || '📎 Fichier(s) partagé(s)',
          type: 'text',
          attachments
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => {
        const updatedConversation = response.data.conversation || response.data.data;
        return {
          conversations: state.conversations.map(c =>
            c._id === conversationId ? updatedConversation : c
          ),
          currentConversation: state.currentConversation?._id === conversationId
            ? updatedConversation
            : state.currentConversation,
          isSending: false
        };
      });
      // Rafraîchir le compteur après envoi
      await get().fetchUnreadCount();
      return true;
    } catch {
      set({ error: "Erreur lors de l'envoi du message", isSending: false });
      return false;
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`${API_URL}/conversations/${conversationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        conversations: state.conversations.map(c =>
          c && c._id === conversationId ? { ...c, myUnreadCount: 0 } : c
        ),
        currentConversation: state.currentConversation?._id === conversationId
          ? { ...state.currentConversation, myUnreadCount: 0 }
          : state.currentConversation
      }));
      get().calculateTotalUnread();
    } catch {
      // Ne pas afficher d'erreur à l'utilisateur
    }
  },

  archiveConversation: async (conversationId: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('auth_token');
      await axios.patch(`${API_URL}/conversations/${conversationId}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        conversations: state.conversations.filter(c => c._id !== conversationId),
        currentConversation: state.currentConversation?._id === conversationId
          ? null
          : state.currentConversation,
        isLoading: false
      }));
      return true;
    } catch {
      set({ error: "Erreur lors de l'archivage de la conversation", isLoading: false });
      return false;
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_URL}/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        conversations: state.conversations.filter(c => c._id !== conversationId),
        currentConversation: state.currentConversation?._id === conversationId
          ? null
          : state.currentConversation,
        isLoading: false
      }));
      get().calculateTotalUnread();
      return true;
    } catch (error) {
      console.error('❌ deleteConversation: Erreur', error);
      set({ error: "Erreur lors de la suppression de la conversation", isLoading: false });
      return false;
    }
  },

  addMessageToConversation: (conversationId: string, message: Message) => {
    set((state) => {
      const updatedConversations = state.conversations.map(c => {
        if (c._id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, message],
            lastMessage: {
              content: message.content,
              senderId: message.senderId,
              createdAt: message.createdAt
            }
          };
        }
        return c;
      });
      const updatedCurrentConversation = state.currentConversation?._id === conversationId
        ? {
            ...state.currentConversation!,
            messages: [...state.currentConversation!.messages, message],
            lastMessage: {
              content: message.content,
              senderId: message.senderId,
              createdAt: message.createdAt
            }
          }
        : state.currentConversation;
      return {
        conversations: updatedConversations,
        currentConversation: updatedCurrentConversation
      };
    });
  },

  incrementUnreadCount: (conversationId: string) => {
    set((state) => ({
      conversations: state.conversations.map(c =>
        c._id === conversationId
          ? { ...c, myUnreadCount: (c.myUnreadCount || 0) + 1 }
          : c
      )
    }));
    get().calculateTotalUnread();
  },

  calculateTotalUnread: () => {
    const conversations = get().conversations;
    if (!conversations || arrayLength(conversations) === 0) {
      set({ totalUnread: 0 });
      return;
    }
    const total = arrayReduce(conversations, (sum: number, c: unknown) => {
      const conv = c as Conversation;
      if (!conv) return sum;
      return sum + (conv.myUnreadCount || 0);
    }, 0);
    set({ totalUnread: total });
  },

  fetchUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations/unread/count`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        set({ unreadConversationsCount: response.data.data.unreadConversations });
      }
    } catch (error) {
      console.error('❌ Erreur fetchUnreadCount:', error);
      set({ unreadConversationsCount: 0 });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentConversation: () => set({ currentConversation: null })
}));

export default useConversationStore;