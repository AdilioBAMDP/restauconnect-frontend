/**
 * OFFER STORE - Gestion d'état des offres (Information Globale + Marketplace)
 * 
 * Ce store gère :
 * - Liste des offres (Information Globale ciblées par rôle)
 * - Offres marketplace (publiques)
 * - Filtres et recherche
 * - Détails d'une offre
 * - Création/modification/suppression d'offres
 * - Réponses aux offres
 */

import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export type OfferZone = 'information-globale' | 'marketplace';
export type OfferStatus = 'active' | 'closed' | 'expired';
export type OfferCategory = 
  | 'produits'
  | 'services'
  | 'equipement'
  | 'fournisseurs'
  | 'partenariats'
  | 'financement'
  | 'autre';

export interface OfferResponse {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  zone: OfferZone;
  title: string;
  description: string;
  category: OfferCategory;
  
  // Métadonnées auteur
  authorId: string;
  authorName: string;
  authorRole: string;
  
  // Ciblage (Information Globale uniquement)
  targetRoles?: string[];
  
  // Flags
  isUrgent: boolean;
  urgentNotificationSent?: boolean;
  
  // Visibilité et engagement
  views: number;
  viewedBy: string[];
  responses: OfferResponse[];
  
  // Statut
  status: OfferStatus;
  expiresAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}

export interface OfferFilters {
  zone?: OfferZone;
  category?: OfferCategory;
  isUrgent?: boolean;
  search?: string;
  status?: OfferStatus;
  authorId?: string;
}

interface OfferState {
  // État
  offers: Offer[];
  currentOffer: Offer | null;
  filters: OfferFilters;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  
  // Actions - Lecture
  fetchOffers: (filters?: OfferFilters, page?: number) => Promise<void>;
  fetchOfferById: (id: string) => Promise<void>;
  fetchMyOffers: () => Promise<void>;
  
  // Actions - Écriture
  createOffer: (offerData: Partial<Offer>) => Promise<Offer | null>;
  updateOffer: (id: string, offerData: Partial<Offer>) => Promise<boolean>;
  deleteOffer: (id: string) => Promise<boolean>;
  closeOffer: (id: string) => Promise<boolean>;
  
  // Actions - Engagement
  respondToOffer: (offerId: string, message: string) => Promise<boolean>;
  viewOffer: (offerId: string) => Promise<void>;
  
  // Actions - Filtres
  setFilters: (filters: OfferFilters) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  
  // Actions - Utilitaires
  clearError: () => void;
  clearCurrentOffer: () => void;
}

export const useOfferStore = create<OfferState>((set, get) => ({
  // État initial
  offers: [],
  currentOffer: null,
  filters: {},
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  
  // Récupérer les offres avec filtres
  fetchOffers: async (filters?: OfferFilters, page?: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentFilters = filters || get().filters;
      const currentPage = page || get().page;
      
      // Construire query params
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: get().limit,
        ...currentFilters
      };
      
      const response = await axios.get(`${API_URL}/offers`, {
        params,
        headers: getAuthHeaders()
      });
      
      set({
        offers: response.data.offers,
        total: response.data.total,
        page: currentPage,
        filters: currentFilters,
        isLoading: false
      });
      
    } catch (error) {
      console.error('❌ Erreur fetch offers:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des offres',
        isLoading: false
      });
    }
  },
  
  // Récupérer une offre par ID
  fetchOfferById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.get(`${API_URL}/offers/${id}`, {
        headers: getAuthHeaders()
      });
      
      set({
        currentOffer: response.data.offer,
        isLoading: false
      });
      
    } catch (error) {
      console.error('❌ Erreur fetch offer:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement de l\'offre',
        isLoading: false
      });
    }
  },
  
  // Récupérer mes offres
  fetchMyOffers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.get(`${API_URL}/offers`, {
        params: { myOffers: true },
        headers: getAuthHeaders()
      });
      
      set({
        offers: response.data.offers,
        total: response.data.total,
        isLoading: false
      });
      
    } catch (error) {
      console.error('❌ Erreur fetch my offers:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement de vos offres',
        isLoading: false
      });
    }
  },
  
  // Créer une nouvelle offre
  createOffer: async (offerData: Partial<Offer>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post(`${API_URL}/offers`, offerData, {
        headers: getAuthHeaders()
      });
      
      // Ajouter l'offre à la liste
      set((state) => ({
        offers: [response.data.offer, ...state.offers],
        total: state.total + 1,
        isLoading: false
      }));
      
      return response.data.offer;
      
    } catch (error) {
      console.error('❌ Erreur create offer:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'offre',
        isLoading: false
      });
      return null;
    }
  },
  
  // Mettre à jour une offre
  updateOffer: async (id: string, offerData: Partial<Offer>) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.patch(`${API_URL}/offers/${id}`, offerData, {
        headers: getAuthHeaders()
      });
      
      // Mettre à jour dans la liste
      set((state) => ({
        offers: state.offers.map(offer => 
          offer._id === id ? response.data.offer : offer
        ),
        currentOffer: state.currentOffer?._id === id ? response.data.offer : state.currentOffer,
        isLoading: false
      }));
      
      return true;
      
    } catch (error) {
      console.error('❌ Erreur update offer:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'offre',
        isLoading: false
      });
      return false;
    }
  },
  
  // Supprimer une offre
  deleteOffer: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await axios.delete(`${API_URL}/offers/${id}`, {
        headers: getAuthHeaders()
      });
      
      // Retirer de la liste
      set((state) => ({
        offers: state.offers.filter(offer => offer._id !== id),
        total: state.total - 1,
        currentOffer: state.currentOffer?._id === id ? null : state.currentOffer,
        isLoading: false
      }));
      
      return true;
      
    } catch (error) {
      console.error('❌ Erreur delete offer:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'offre',
        isLoading: false
      });
      return false;
    }
  },
  
  // Fermer une offre
  closeOffer: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await axios.post(`${API_URL}/offers/${id}/close`, {}, {
        headers: getAuthHeaders()
      });
      
      // Mettre à jour le statut
      set((state) => ({
        offers: state.offers.map(offer => 
          offer._id === id ? { ...offer, status: 'closed' as OfferStatus } : offer
        ),
        currentOffer: state.currentOffer?._id === id 
          ? { ...state.currentOffer, status: 'closed' as OfferStatus } 
          : state.currentOffer,
        isLoading: false
      }));
      
      return true;
      
    } catch (error) {
      console.error('❌ Erreur close offer:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la fermeture de l\'offre',
        isLoading: false
      });
      return false;
    }
  },
  
  // Répondre à une offre
  respondToOffer: async (offerId: string, message: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post(`${API_URL}/offers/${offerId}/respond`, 
        { message },
        {
          headers: getAuthHeaders()
        }
      );
      
      // Mettre à jour l'offre avec la nouvelle réponse
      set((state) => ({
        currentOffer: state.currentOffer?._id === offerId 
          ? response.data.offer 
          : state.currentOffer,
        isLoading: false
      }));
      
      return true;
      
    } catch (error) {
      console.error('❌ Erreur respond to offer:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi de la réponse',
        isLoading: false
      });
      return false;
    }
  },
  
  // Incrémenter le compteur de vues
  viewOffer: async (offerId: string) => {
    try {
      await axios.post(`${API_URL}/offers/${offerId}/view`, {}, {
        headers: getAuthHeaders()
      });
      
      // Mettre à jour localement (optionnel)
      set((state) => ({
        currentOffer: state.currentOffer?._id === offerId
          ? { ...state.currentOffer, views: state.currentOffer.views + 1 }
          : state.currentOffer
      }));
      
    } catch (error) {
      console.error('❌ Erreur view offer:', error);
      // Ne pas afficher d'erreur à l'utilisateur pour le tracking
    }
  },
  
  // Définir les filtres
  setFilters: (filters: OfferFilters) => {
    set({ filters, page: 1 });
    get().fetchOffers(filters, 1);
  },
  
  // Réinitialiser les filtres
  clearFilters: () => {
    set({ filters: {}, page: 1 });
    get().fetchOffers({}, 1);
  },
  
  // Changer de page
  setPage: (page: number) => {
    set({ page });
    get().fetchOffers(get().filters, page);
  },
  
  // Utilitaires
  clearError: () => set({ error: null }),
  clearCurrentOffer: () => set({ currentOffer: null })
}));

export default useOfferStore;
