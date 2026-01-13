/**
 * BOOST CAMPAIGN STORE - Zustand
 * 
 * Gestion centralisée des campagnes publicitaires
 * Synchronisé avec backend via API
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Type pour les données de campagne provenant du backend
interface BackendCampaign {
  _id: string;
  title: string;
  target: 'marketplace' | 'info' | 'both';
  plan: 'basic' | 'premium' | 'platinum';
  price: number;
  duration: number;
  status: 'active' | 'paused' | 'completed';
  createdAt?: string;
  startDate?: string;
  endDate: string;
  stats?: {
    views: number;
    clicks: number;
    ctr: number;
  };
  postIds?: string[];
}

export interface Campaign {
  id: string;
  title: string;
  target: 'marketplace' | 'infoglobale' | 'both';
  plan: 'basic' | 'premium' | 'platinum';
  price: number;
  duration: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  expiresAt: Date;
  stats: {
    views: number;
    clicks: number;
    ctr: number;
  };
  postIds: string[]; // IDs des posts boostés par cette campagne
}

interface BoostCampaignState {
  campaigns: Campaign[];
  totalSpent: number;
  avgROI: number;

  // Actions
  fetchCampaigns: () => Promise<void>;
  createCampaign: (data: {
    title: string;
    target: 'marketplace' | 'infoglobale' | 'both';
    plan: 'basic' | 'premium' | 'platinum';
    price: number;
    duration: number;
  }) => Promise<void>;
  pauseCampaign: (id: string) => void;
  resumeCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;
  updateCampaignStats: (id: string, stats: Partial<Campaign['stats']>) => void;
}

export const useBoostCampaignStore = create<BoostCampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      totalSpent: 0,
      avgROI: 0,

      fetchCampaigns: async () => {
        try {
          // Récupérer userId depuis localStorage
          const authUser = localStorage.getItem('auth_user');
          if (!authUser) {
            console.warn('[BOOST] Utilisateur non connecté');
            return;
          }

          const user = JSON.parse(authUser);
          const userId = user.id || user._id;
          const userRole = user.role;

          // Appel API backend
          const response = await fetch(`${API_URL}/boost-campaigns?userId=${userId}&userRole=${userRole}`);
          
          if (!response.ok) {
            throw new Error('Erreur récupération campagnes');
          }

          const data = await response.json();
          
          if (data.success) {
            // Mapper les campagnes backend vers le format frontend
            const campaigns: Campaign[] = data.campaigns.map((c: BackendCampaign) => ({
              id: c._id,
              title: c.title,
              target: c.target === 'info' ? 'infoglobale' : c.target,
              plan: c.plan,
              price: c.price,
              duration: c.duration,
              status: c.status,
              createdAt: new Date(c.createdAt || c.startDate || new Date()),
              expiresAt: new Date(c.endDate),
              stats: c.stats || { views: 0, clicks: 0, ctr: 0 },
              postIds: c.postIds || []
            }));

            // Calcul totalSpent
            const totalSpent = campaigns.reduce((sum, c) => sum + c.price, 0);
            
            // Calcul avgROI
            const avgROI = campaigns.length > 0
              ? campaigns.reduce((sum, c) => {
                  const baseViews = 100;
                  const roi = ((c.stats.views - baseViews) / c.price) * 100;
                  return sum + roi;
                }, 0) / campaigns.length
              : 0;

            set({ campaigns, totalSpent, avgROI: Math.round(avgROI) });
          }
        } catch (error) {
          console.error('[BOOST] Erreur fetch campagnes:', error);
        }
      },

      createCampaign: async (data) => {
        try {
          // Récupérer userId depuis localStorage
          const authUser = localStorage.getItem('auth_user');
          if (!authUser) {
            console.error('[BOOST] Utilisateur non connecté');
            return;
          }

          const user = JSON.parse(authUser);
          const userId = user.id || user._id;
          const userRole = user.role;

          // Appel API backend
          const response = await fetch(`${API_URL}/boost-campaigns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              userRole,
              title: data.title,
              target: data.target === 'infoglobale' ? 'info' : data.target,
              plan: data.plan,
              price: data.price,
              duration: data.duration,
              paymentMethod: 'simulation' // ou 'stripe' selon le mode
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur création campagne');
          }

          const result = await response.json();

          if (result.success) {
            console.log('[BOOST] Campagne créée avec succès:', result.campaign);

            // Rafraîchir la liste des campagnes
            await get().fetchCampaigns();
          }

        } catch (error) {
          console.error('[BOOST] Erreur création campagne:', error);
          throw error;
        }
      },

      pauseCampaign: (id) => {
        set(state => ({
          campaigns: state.campaigns.map(c =>
            c.id === id ? { ...c, status: 'paused' as const } : c
          )
        }));
        
        // TODO: Appel API backend
        // fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/boost/campaigns/${id}/pause`, { method: 'PATCH' });
        
        console.log(`[BOOST] Campagne ${id} mise en pause`);
      },

      resumeCampaign: (id) => {
        set(state => ({
          campaigns: state.campaigns.map(c =>
            c.id === id ? { ...c, status: 'active' as const } : c
          )
        }));
        
        // TODO: Appel API backend
        // fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/boost/campaigns/${id}/resume`, { method: 'PATCH' });
        
        console.log(`[BOOST] Campagne ${id} reprise`);
      },

      deleteCampaign: (id) => {
        const campaign = get().campaigns.find(c => c.id === id);
        
        if (campaign && window.confirm(`Voulez-vous vraiment arrêter la campagne "${campaign.title}" ?`)) {
          set(state => ({
            campaigns: state.campaigns.filter(c => c.id !== id)
          }));
          
          // TODO: Appel API backend
          // fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/boost/campaigns/${id}`, { method: 'DELETE' });
          
          console.log(`[BOOST] Campagne ${id} supprimée`);
        }
      },

      updateCampaignStats: (id, stats) => {
        set(state => ({
          campaigns: state.campaigns.map(c =>
            c.id === id
              ? { ...c, stats: { ...c.stats, ...stats } }
              : c
          )
        }));
        
        // Recalculer avgROI
        const campaigns = get().campaigns;
        const avgROI = campaigns.length > 0
          ? campaigns.reduce((sum, c) => {
              const baseViews = 100;
              const roi = ((c.stats.views - baseViews) / c.price) * 100;
              return sum + roi;
            }, 0) / campaigns.length
          : 0;

        set({ avgROI: Math.round(avgROI) });
      }
    }),
    {
      name: 'boost-campaign-storage',
      partialize: (state) => ({
        campaigns: state.campaigns,
        totalSpent: state.totalSpent,
        avgROI: state.avgROI
      })
    }
  )
);
