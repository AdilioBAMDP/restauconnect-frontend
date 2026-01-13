/**
 * =============================================
 * COMMUNITY MANAGER - ACTIONS MODULE
 * Actions pour le module Community Manager
 * =============================================
 */

import type { 
  CommunityManagerService, 
  CommunityManagerCampaign, 
  CommunityManagerClient, 
  CommunityManagerStats 
} from '@/types/index';

interface CMState {
  cmServices: CommunityManagerService[];
  cmCampaigns: CommunityManagerCampaign[];
  cmClients: CommunityManagerClient[];
  cmStats: CommunityManagerStats;
}

type SetState = (fn: (state: CMState) => Partial<CMState>) => void;
type GetState = () => CMState;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createCommunityManagerActions = (set: SetState, _get: GetState) => ({
  /**
   * SERVICES
   */
  createCMService: (serviceData: Omit<CommunityManagerService, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: CommunityManagerService = {
      ...serviceData,
      id: `cm-service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state: CMState) => ({
      cmServices: [newService, ...state.cmServices],
      cmStats: {
        ...state.cmStats,
        totalServices: state.cmStats.totalServices + 1,
        activeServices: serviceData.status === 'active' ? state.cmStats.activeServices + 1 : state.cmStats.activeServices
      }
    }));
  },

  updateCMService: (id: string, updates: Partial<CommunityManagerService>) => {
    set((state: CMState) => ({
      cmServices: state.cmServices.map((service: CommunityManagerService) =>
        service.id === id ? { 
          ...service, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : service
      )
    }));
  },

  deleteCMService: (id: string) => {
    set((state: CMState) => ({
      cmServices: state.cmServices.filter((service: CommunityManagerService) => service.id !== id),
      cmStats: {
        ...state.cmStats,
        totalServices: Math.max(0, state.cmStats.totalServices - 1)
      }
    }));
  },

  /**
   * CAMPAIGNS
   */
  createCMCampaign: (campaignData: Omit<CommunityManagerCampaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCampaign: CommunityManagerCampaign = {
      ...campaignData,
      id: `cm-campaign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state: CMState) => ({
      cmCampaigns: [newCampaign, ...state.cmCampaigns],
      cmStats: {
        ...state.cmStats,
        totalCampaigns: state.cmStats.totalCampaigns + 1,
        activeCampaigns: campaignData.status === 'active' ? state.cmStats.activeCampaigns + 1 : state.cmStats.activeCampaigns
      }
    }));
  },

  updateCMCampaign: (id: string, updates: Partial<CommunityManagerCampaign>) => {
    set((state: CMState) => ({
      cmCampaigns: state.cmCampaigns.map((campaign: CommunityManagerCampaign) =>
        campaign.id === id ? { 
          ...campaign, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : campaign
      )
    }));
  },

  deleteCMCampaign: (id: string) => {
    set((state: CMState) => ({
      cmCampaigns: state.cmCampaigns.filter((campaign: CommunityManagerCampaign) => campaign.id !== id),
      cmStats: {
        ...state.cmStats,
        totalCampaigns: Math.max(0, state.cmStats.totalCampaigns - 1)
      }
    }));
  },

  updateCampaignMetrics: (id: string, metrics: Partial<CommunityManagerCampaign['metrics']>) => {
    set((state: CMState) => ({
      cmCampaigns: state.cmCampaigns.map((campaign: CommunityManagerCampaign) =>
        campaign.id === id ? { 
          ...campaign, 
          metrics: { ...campaign.metrics, ...metrics },
          updatedAt: new Date().toISOString() 
        } : campaign
      )
    }));
  },

  /**
   * CLIENTS
   */
  addCMClient: (clientData: Omit<CommunityManagerClient, 'id'>) => {
    const newClient: CommunityManagerClient = {
      ...clientData,
      id: `cm-client-${Date.now()}`
    };
    set((state: CMState) => ({
      cmClients: [newClient, ...state.cmClients],
      cmStats: {
        ...state.cmStats,
        totalClients: state.cmStats.totalClients + 1,
        activeClients: clientData.status === 'active' ? state.cmStats.activeClients + 1 : state.cmStats.activeClients
      }
    }));
  },

  updateCMClient: (id: string, updates: Partial<CommunityManagerClient>) => {
    set((state: CMState) => ({
      cmClients: state.cmClients.map((client: CommunityManagerClient) =>
        client.id === id ? { ...client, ...updates } : client
      )
    }));
  },

  /**
   * STATS
   */
  updateCMStats: (stats: Partial<CommunityManagerStats>) => {
    set((state: CMState) => ({
      cmStats: {
        ...state.cmStats,
        ...stats
      }
    }));
  }
});
