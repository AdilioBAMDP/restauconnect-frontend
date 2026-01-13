/**
 * 📊 ACCOUNTANT STORE - Store complet pour les comptables
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AccountantProfile,
  AccountingDocument,
  AccountantConversation,
  AccountingAlert
} from '../types/accountant.types';

interface AccountantState {
  // Data
  accountantProfile: AccountantProfile | null;
  documents: AccountingDocument[];
  conversations: AccountantConversation[];
  alerts: AccountingAlert[];
  
  // Actions - Accountant Profile
  assignAccountant: (profile: AccountantProfile) => void;
  updateAccountantProfile: (updates: Partial<AccountantProfile>) => void;
  
  // Actions - Documents
  uploadDocument: (document: Omit<AccountingDocument, 'id' | 'uploadedAt'>) => void;
  updateDocumentStatus: (id: string, status: AccountingDocument['status']) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByType: (type: AccountingDocument['type']) => AccountingDocument[];
  getDocumentsByPeriod: (startDate: string, endDate: string) => AccountingDocument[];
  
  // Actions - Conversations
  createConversation: (conversation: Omit<AccountantConversation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  sendMessage: (conversationId: string, message: AccountantConversation['messages'][0]) => void;
  markConversationAsRead: (conversationId: string) => void;
  
  // Actions - Alerts
  addAlert: (alert: Omit<AccountingAlert, 'id' | 'createdAt'>) => void;
  markAlertAsRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  getUnreadAlerts: () => AccountingAlert[];
}

export const useAccountantStore = create<AccountantState>()(
  persist(
    (set, get) => ({
      // ========== INITIAL STATE ==========
      accountantProfile: null,
      documents: [],
      conversations: [],
      alerts: [],

      // ========== ACCOUNTANT PROFILE ACTIONS ==========
      
      assignAccountant: (profile) => {
        set({ accountantProfile: profile });
      },

      updateAccountantProfile: (updates) => {
        set((state) => ({
          accountantProfile: state.accountantProfile 
            ? { ...state.accountantProfile, ...updates }
            : null
        }));
      },

      // ========== DOCUMENTS ACTIONS ==========
      
      uploadDocument: (documentData) => {
        const newDocument: AccountingDocument = {
          ...documentData,
          id: `doc-${Date.now()}`
        };
        set((state) => ({
          documents: [newDocument, ...state.documents]
        }));
      },

      updateDocumentStatus: (id, status) => {
        set((state) => ({
          documents: state.documents.map(doc =>
            doc.id === id ? { ...doc, status } : doc
          )
        }));
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter(doc => doc.id !== id)
        }));
      },

      getDocumentsByType: (type) => {
        return get().documents.filter(doc => doc.type === type);
      },

      getDocumentsByPeriod: (startDate, endDate) => {
        return get().documents.filter(doc => {
          const docDate = new Date(doc.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return docDate >= start && docDate <= end;
        });
      },

      // ========== CONVERSATIONS ACTIONS ==========
      
      createConversation: (conversationData) => {
        const newConversation: AccountantConversation = {
          ...conversationData,
          id: `acc-conv-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations]
        }));
      },

      sendMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? {
              ...conv,
              messages: [...conv.messages, message],
              updatedAt: new Date().toISOString()
            } : conv
          )
        }));
      },

      markConversationAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? {
              ...conv,
              messages: conv.messages.map(msg => ({ ...msg, read: true })),
              updatedAt: new Date().toISOString()
            } : conv
          )
        }));
      },

      // ========== ALERTS ACTIONS ==========
      
      addAlert: (alertData) => {
        const newAlert: AccountingAlert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          alerts: [newAlert, ...state.alerts]
        }));
      },

      markAlertAsRead: (id) => {
        set((state) => ({
          alerts: state.alerts.map(alert =>
            alert.id === id ? { ...alert, isRead: true } : alert
          )
        }));
      },

      dismissAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter(alert => alert.id !== id)
        }));
      },

      getUnreadAlerts: () => {
        return get().alerts.filter(alert => !alert.isRead);
      }
    }),
    {
      name: 'accountant-storage',
      partialize: (state) => ({
        accountantProfile: state.accountantProfile,
        documents: state.documents,
        conversations: state.conversations,
        alerts: state.alerts
      })
    }
  )
);
