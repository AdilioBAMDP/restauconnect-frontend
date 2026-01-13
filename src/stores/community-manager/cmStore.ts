/**
 * 🎯 COMMUNITY MANAGER STORE - Store complet pour les community managers
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CommunityManagerService,
  CommunityManagerCampaign,
  CommunityManagerClient,
  CommunityManagerStats
} from '../types/cm.types';

interface CMState {
  // Data
  services: CommunityManagerService[];
  campaigns: CommunityManagerCampaign[];
  clients: CommunityManagerClient[];
  stats: CommunityManagerStats;
  
  // Actions - Services
  createService: (service: Omit<CommunityManagerService, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, updates: Partial<CommunityManagerService>) => void;
  deleteService: (id: string) => void;
  
  // Actions - Campaigns
  createCampaign: (campaign: Omit<CommunityManagerCampaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: string, updates: Partial<CommunityManagerCampaign>) => void;
  deleteCampaign: (id: string) => void;
  updateCampaignMetrics: (id: string, metrics: Partial<CommunityManagerCampaign['metrics']>) => void;
  
  // Actions - Clients
  addClient: (client: Omit<CommunityManagerClient, 'id'>) => void;
  updateClient: (id: string, updates: Partial<CommunityManagerClient>) => void;
  
  // Actions - Stats
  updateStats: (stats: Partial<CommunityManagerStats>) => void;
}

export const useCMStore = create<CMState>()(
  persist(
    (set) => ({
      // ========== INITIAL STATE ==========
      services: [],
      campaigns: [],
      clients: [],
      stats: {
        totalServices: 0,
        activeServices: 0,
        totalClients: 0,
        activeClients: 0,
        totalCampaigns: 0,
        activeCampaigns: 0,
        monthlyRevenue: 0,
        averageClientSatisfaction: 0,
        totalReach: 0,
        totalEngagement: 0,
        conversionRate: 0,
        retentionRate: 0
      },

      // ========== SERVICES ACTIONS ==========
      
      createService: (serviceData) => {
        const newService: CommunityManagerService = {
          ...serviceData,
          id: `cm-service-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          services: [newService, ...state.services],
          stats: {
            ...state.stats,
            totalServices: state.stats.totalServices + 1,
            activeServices: serviceData.status === 'active' ? state.stats.activeServices + 1 : state.stats.activeServices
          }
        }));
      },

      updateService: (id, updates) => {
        set((state) => ({
          services: state.services.map(service =>
            service.id === id ? { 
              ...service, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } : service
          )
        }));
      },

      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter(service => service.id !== id),
          stats: {
            ...state.stats,
            totalServices: Math.max(0, state.stats.totalServices - 1)
          }
        }));
      },

      // ========== CAMPAIGNS ACTIONS ==========
      
      createCampaign: (campaignData) => {
        const newCampaign: CommunityManagerCampaign = {
          ...campaignData,
          id: `cm-campaign-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          campaigns: [newCampaign, ...state.campaigns],
          stats: {
            ...state.stats,
            totalCampaigns: state.stats.totalCampaigns + 1,
            activeCampaigns: campaignData.status === 'active' ? state.stats.activeCampaigns + 1 : state.stats.activeCampaigns
          }
        }));
      },

      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map(campaign =>
            campaign.id === id ? { 
              ...campaign, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } : campaign
          )
        }));
      },

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter(campaign => campaign.id !== id),
          stats: {
            ...state.stats,
            totalCampaigns: Math.max(0, state.stats.totalCampaigns - 1)
          }
        }));
      },

      updateCampaignMetrics: (id, metrics) => {
        set((state) => ({
          campaigns: state.campaigns.map(campaign =>
            campaign.id === id ? { 
              ...campaign, 
              metrics: { ...campaign.metrics, ...metrics },
              updatedAt: new Date().toISOString() 
            } : campaign
          )
        }));
      },

      // ========== CLIENTS ACTIONS ==========
      
      addClient: (clientData) => {
        const newClient: CommunityManagerClient = {
          ...clientData,
          id: `cm-client-${Date.now()}`
        };
        set((state) => ({
          clients: [newClient, ...state.clients],
          stats: {
            ...state.stats,
            totalClients: state.stats.totalClients + 1,
            activeClients: clientData.status === 'active' ? state.stats.activeClients + 1 : state.stats.activeClients
          }
        }));
      },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map(client =>
            client.id === id ? { ...client, ...updates } : client
          )
        }));
      },

      // ========== STATS ACTIONS ==========
      
      updateStats: (statsData) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...statsData
          }
        }));
      }
    }),
    {
      name: 'cm-storage',
      partialize: (state) => ({
        services: state.services,
        campaigns: state.campaigns,
        clients: state.clients,
        stats: state.stats
      })
    }
  )
);
