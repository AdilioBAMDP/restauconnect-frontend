/**
 * 🏦 BANK STORE - Store complet pour les partenaires bancaires
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BankPartner,
  LoanOffer,
  BankConversation
} from '../types/bank.types';

interface BankState {
  // Data
  bankPartners: BankPartner[];
  loanOffers: LoanOffer[];
  conversations: BankConversation[];
  
  // Actions - Bank Partners
  addBankPartner: (bank: Omit<BankPartner, 'id'>) => void;
  updateBankPartner: (id: string, updates: Partial<BankPartner>) => void;
  getBanksByLocation: (city: string) => BankPartner[];
  getBanksByType: (type: BankPartner['type']) => BankPartner[];
  
  // Actions - Loan Offers
  addLoanOffer: (offer: Omit<LoanOffer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLoanOffer: (id: string, updates: Partial<LoanOffer>) => void;
  deleteLoanOffer: (id: string) => void;
  getLoanOffersByType: (type: LoanOffer['type']) => LoanOffer[];
  getLoanOffersByBank: (bankId: string) => LoanOffer[];
  
  // Actions - Conversations
  createConversation: (conversation: Omit<BankConversation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  sendMessage: (conversationId: string, message: BankConversation['messages'][0]) => void;
  markConversationAsRead: (conversationId: string) => void;
  updateConversationStatus: (conversationId: string, status: BankConversation['status']) => void;
}

export const useBankStore = create<BankState>()(
  persist(
    (set, get) => ({
      // ========== INITIAL STATE ==========
      bankPartners: [],
      loanOffers: [],
      conversations: [],

      // ========== BANK PARTNERS ACTIONS ==========
      
      addBankPartner: (bankData) => {
        const newBank: BankPartner = {
          ...bankData,
          id: `bank-${Date.now()}`
        };
        set((state) => ({
          bankPartners: [newBank, ...state.bankPartners]
        }));
      },

      updateBankPartner: (id, updates) => {
        set((state) => ({
          bankPartners: state.bankPartners.map(bank =>
            bank.id === id ? { ...bank, ...updates } : bank
          )
        }));
      },

      getBanksByLocation: (city) => {
        return get().bankPartners.filter(bank => 
          bank.location.city.toLowerCase() === city.toLowerCase()
        );
      },

      getBanksByType: (type) => {
        return get().bankPartners.filter(bank => bank.type === type);
      },

      // ========== LOAN OFFERS ACTIONS ==========
      
      addLoanOffer: (offerData) => {
        const newOffer: LoanOffer = {
          ...offerData,
          id: `loan-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          loanOffers: [newOffer, ...state.loanOffers]
        }));
      },

      updateLoanOffer: (id, updates) => {
        set((state) => ({
          loanOffers: state.loanOffers.map(offer =>
            offer.id === id ? { 
              ...offer, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } : offer
          )
        }));
      },

      deleteLoanOffer: (id) => {
        set((state) => ({
          loanOffers: state.loanOffers.filter(offer => offer.id !== id)
        }));
      },

      getLoanOffersByType: (type) => {
        return get().loanOffers.filter(offer => offer.type === type);
      },

      getLoanOffersByBank: (bankId) => {
        return get().loanOffers.filter(offer => offer.bankId === bankId);
      },

      // ========== CONVERSATIONS ACTIONS ==========
      
      createConversation: (conversationData) => {
        const newConversation: BankConversation = {
          ...conversationData,
          id: `bank-conv-${Date.now()}`,
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

      updateConversationStatus: (conversationId, status) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? {
              ...conv,
              status,
              updatedAt: new Date().toISOString()
            } : conv
          )
        }));
      }
    }),
    {
      name: 'bank-storage',
      partialize: (state) => ({
        bankPartners: state.bankPartners,
        loanOffers: state.loanOffers,
        conversations: state.conversations
      })
    }
  )
);
