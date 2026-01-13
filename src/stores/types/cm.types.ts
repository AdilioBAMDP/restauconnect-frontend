/**
 * Types pour le module Community Manager
 */

export interface CommunityManagerService {
  id: string;
  name: string;
  category: 'social-media' | 'advertising' | 'photography' | 'content-creation' | 'consulting';
  description: string;
  price: number;
  priceType: 'fixed' | 'per-hour' | 'per-month' | 'per-campaign';
  duration: string;
  deliverables: string[];
  features: string[];
  status: 'active' | 'paused' | 'archived';
  clientsCount: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityManagerCampaign {
  id: string;
  restaurantId: string;
  restaurantName: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  objectives: Array<{
    type: 'followers' | 'engagement' | 'bookings' | 'sales' | 'reach';
    target: number;
    current: number;
  }>;
  platforms: Array<'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'linkedin' | 'google-ads'>;
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    followers: number;
    cost_per_click: number;
    return_on_ad_spend: number;
  };
  deliverables: Array<{
    id: string;
    type: 'post' | 'story' | 'video' | 'ad' | 'report';
    title: string;
    description: string;
    platform: string;
    status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
    dueDate: string;
    completedAt?: string;
    metrics?: {
      likes?: number;
      comments?: number;
      shares?: number;
      views?: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityManagerClient {
  id: string;
  restaurantId: string;
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  restaurantType: string;
  activeCampaigns: number;
  totalSpent: number;
  contractStartDate: string;
  contractEndDate?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  servicesUsed: string[];
  satisfactionRating: number;
  lastActivity: string;
  notes?: string;
}

export interface CommunityManagerStats {
  totalServices: number;
  activeServices: number;
  totalClients: number;
  activeClients: number;
  totalCampaigns: number;
  activeCampaigns: number;
  monthlyRevenue: number;
  averageClientSatisfaction: number;
  totalReach: number;
  totalEngagement: number;
  conversionRate: number;
  retentionRate: number;
}
