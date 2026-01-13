/**
 * 🎯 OFFERS STORE - Store pour les offres restaurant
 * 
 * Responsabilité: Gérer les offres d'emploi/services et applications
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  RestaurantOffer,
  Application,
  Message,
  RestaurantStats
} from '../types/offers.types';
import { Professional } from '../types/common.types';

// ========== STATE INTERFACE ==========

interface OffersState {
  // Data
  offers: RestaurantOffer[];
  professionals: Professional[];
  applications: Application[];
  messages: Message[];
  stats: RestaurantStats;
  
  // Actions - Offers
  createOffer: (offer: Omit<RestaurantOffer, 'id' | 'createdAt' | 'applicationsCount'>) => void;
  updateOffer: (id: string, updates: Partial<RestaurantOffer>) => void;
  deleteOffer: (id: string) => void;
  
  // Actions - Professionals
  searchProfessionals: (query: string, filters?: {
    role?: string;
    location?: string;
    urgent?: boolean;
    ecoFriendly?: boolean;
  }) => Professional[];
  createProfessional: (professional: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, updates: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  toggleProfessionalVerification: (id: string) => void;
  suspendProfessional: (id: string, reason?: string) => void;
  
  // Actions - Applications
  applyToOffer: (offerId: string, professionalId: string, message: string, proposedPrice?: string) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  
  // Actions - Messages
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Actions - Moderation
  approveMessage: (messageId: string) => void;
  rejectMessage: (messageId: string) => void;
  validateOffer: (offerId: string) => void;
  rejectOffer: (offerId: string, reason?: string) => void;
  flagContent: (type: 'message' | 'offer' | 'professional', id: string, reason: string) => void;
  
  // Actions - Stats
  updateStats: (stats: Partial<RestaurantStats>) => void;
}

// ========== STORE IMPLEMENTATION ==========

export const useOffersStore = create<OffersState>()(
  persist(
    (set, get) => ({
      // ========== INITIAL STATE ==========
      offers: [],
      professionals: [],
      applications: [],
      messages: [],
      stats: {
        dailyOrders: 0,
        activeStaff: 0,
        todayReservations: 0,
        averageRating: 0,
        monthlyRevenue: 0,
        pendingApplications: 0,
        unreadMessages: 0
      },

      // ========== OFFERS ACTIONS ==========
      
      createOffer: (offerData) => {
        const newOffer: RestaurantOffer = {
          ...offerData,
          id: `offer-${Date.now()}`,
          createdAt: new Date().toISOString(),
          applicationsCount: 0,
          restaurantId: 'restaurant-1'
        };
        set((state) => ({
          offers: [newOffer, ...state.offers]
        }));
      },

      updateOffer: (id, updates) => {
        set((state) => ({
          offers: state.offers.map(offer => 
            offer.id === id ? { ...offer, ...updates } : offer
          )
        }));
      },

      deleteOffer: (id) => {
        set((state) => ({
          offers: state.offers.filter(offer => offer.id !== id)
        }));
      },

      // ========== PROFESSIONALS ACTIONS ==========
      
      searchProfessionals: (query, filters = {}) => {
        const { professionals } = get();
        let results = professionals;

        if (query) {
          results = results.filter(pro => 
            pro.name.toLowerCase().includes(query.toLowerCase()) ||
            pro.specialty.toLowerCase().includes(query.toLowerCase()) ||
            pro.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
          );
        }

        if (filters.role && filters.role !== 'all') {
          results = results.filter(pro => pro.role === filters.role);
        }

        if (filters.location) {
          results = results.filter(pro => 
            pro.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }

        if (filters.urgent) {
          results = results.filter(pro => 
            pro.availability.toLowerCase().includes('disponible') ||
            pro.badges.some(badge => badge.toLowerCase().includes('urgence'))
          );
        }

        if (filters.ecoFriendly) {
          results = results.filter(pro => pro.ecoFriendly);
        }

        return results.sort((a, b) => b.rating - a.rating);
      },

      createProfessional: (professionalData) => {
        const newProfessional: Professional = {
          ...professionalData,
          id: `pro-${Date.now()}`,
        };

        set((state) => ({
          professionals: [newProfessional, ...state.professionals]
        }));
      },

      updateProfessional: (id, updates) => {
        set((state) => ({
          professionals: state.professionals.map(pro => 
            pro.id === id ? { ...pro, ...updates } : pro
          )
        }));
      },

      deleteProfessional: (id) => {
        set((state) => ({
          professionals: state.professionals.filter(pro => pro.id !== id),
          applications: state.applications.filter(app => app.professionalId !== id),
          messages: state.messages.filter(msg => msg.fromId !== id && msg.toId !== id)
        }));
      },

      toggleProfessionalVerification: (id) => {
        set((state) => ({
          professionals: state.professionals.map(pro => 
            pro.id === id ? { ...pro, verified: !pro.verified } : pro
          )
        }));
      },

      suspendProfessional: (id, reason = 'Suspension administrative') => {
        set((state) => ({
          professionals: state.professionals.map(pro => 
            pro.id === id ? { 
              ...pro, 
              verified: false,
              description: `[SUSPENDU: ${reason}] ${pro.description}`
            } : pro
          )
        }));
      },

      // ========== APPLICATIONS ACTIONS ==========
      
      applyToOffer: (offerId, professionalId, message, proposedPrice) => {
        const newApplication: Application = {
          id: `app-${Date.now()}`,
          offerId,
          professionalId,
          message,
          proposedPrice,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          applications: [newApplication, ...state.applications],
          offers: state.offers.map(offer => 
            offer.id === offerId 
              ? { ...offer, applicationsCount: offer.applicationsCount + 1 }
              : offer
          ),
          stats: {
            ...state.stats,
            pendingApplications: state.stats.pendingApplications + 1
          }
        }));
      },

      updateApplicationStatus: (applicationId, status) => {
        set((state) => ({
          applications: state.applications.map(app => 
            app.id === applicationId ? { ...app, status } : app
          )
        }));
      },

      // ========== MESSAGES ACTIONS ==========
      
      sendMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: `msg-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false
        };

        set((state) => ({
          messages: [newMessage, ...state.messages],
          stats: {
            ...state.stats,
            unreadMessages: state.stats.unreadMessages + 1
          }
        }));
      },

      markMessageAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          ),
          stats: {
            ...state.stats,
            unreadMessages: Math.max(0, state.stats.unreadMessages - 1)
          }
        }));
      },

      // ========== MODERATION ACTIONS ==========
      
      approveMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { 
              ...msg, 
              content: `[APPROUVÉ] ${msg.content}`
            } : msg
          )
        }));
      },

      rejectMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== messageId)
        }));
      },

      validateOffer: (offerId) => {
        set((state) => ({
          offers: state.offers.map(offer => 
            offer.id === offerId ? { 
              ...offer, 
              status: 'active' as const,
              description: `[VALIDÉ] ${offer.description}`
            } : offer
          )
        }));
      },

      rejectOffer: (offerId, reason = 'Non conforme aux conditions') => {
        set((state) => ({
          offers: state.offers.map(offer => 
            offer.id === offerId ? { 
              ...offer, 
              status: 'paused' as const,
              description: `[REJETÉ: ${reason}] ${offer.description}`
            } : offer
          )
        }));
      },

      flagContent: (type, id, reason) => {
        if (type === 'professional') {
          set((state) => ({
            professionals: state.professionals.map(pro => 
              pro.id === id ? { 
                ...pro, 
                description: `[SIGNALÉ: ${reason}] ${pro.description}`
              } : pro
            )
          }));
        }
      },

      // ========== STATS ACTIONS ==========
      
      updateStats: (newStats) => {
        set((state) => ({
          stats: { ...state.stats, ...newStats }
        }));
      }
    }),
    {
      name: 'offers-storage',
      partialize: (state) => ({
        offers: state.offers,
        professionals: state.professionals,
        applications: state.applications,
        messages: state.messages,
        stats: state.stats
      })
    }
  )
);
