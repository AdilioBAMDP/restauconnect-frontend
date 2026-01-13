import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, Activity, Star, TrendingUp, 
  CheckCircle, Award, Eye, Heart, Target, ExternalLink 
} from 'lucide-react';
import MarketplaceCommunity from '@/components/common/MarketplaceCommunity';

interface CMStats {
  activeClients: number;
  totalClients: number;
  monthlyRevenue: number;
  activeCampaigns: number;
  totalCampaigns: number;
  averageClientSatisfaction: number;
  retentionRate: number;
  totalReach: number;
  totalEngagement: number;
  conversionRate: number;
}

interface Campaign {
  id: string;
  title: string;
  restaurantName: string;
  budget: number;
  spent: number;
  status: string;
  platforms: string[];
  startDate: string;
  endDate: string;
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
    return_on_ad_spend: number;
  };
}

interface CommunityOverviewProps {
  cmStats: CMStats;
  topPerformingCampaign: Campaign | undefined;
  setActiveTab: (tab: 'overview' | 'campaigns' | 'clients' | 'services') => void;
}

export const CommunityOverview: React.FC<CommunityOverviewProps> = ({ 
  cmStats, 
  topPerformingCampaign,
  setActiveTab 
}) => {
  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{cmStats.activeClients}</p>
              <p className="text-sm text-gray-600">Clients Actifs</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{Math.round((cmStats.activeClients / cmStats.totalClients) * 100)}% taux d'activité</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{cmStats.monthlyRevenue}€</p>
              <p className="text-sm text-gray-600">Revenus Mensuels</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+23% vs mois dernier</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{cmStats.activeCampaigns}</p>
              <p className="text-sm text-gray-600">Campagnes Actives</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">{cmStats.totalCampaigns} total cette année</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{cmStats.averageClientSatisfaction}</p>
              <p className="text-sm text-gray-600">Satisfaction Client</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Award className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-yellow-600">{cmStats.retentionRate}% rétention</span>
          </div>
        </motion.div>
      </div>

      {/* Performance de la semaine */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de la Semaine</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{cmStats.totalReach.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Portée Totale</div>
            <div className="mt-2 flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600">+15% cette semaine</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{cmStats.totalEngagement.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Engagement Total</div>
            <div className="mt-2 flex items-center justify-center">
              <Heart className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+{cmStats.conversionRate}% conversion</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{cmStats.conversionRate}%</div>
            <div className="text-sm text-gray-600">Taux de Conversion</div>
            <div className="mt-2 flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-xs text-purple-600">Objectif: 15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campagne la plus performante */}
      {topPerformingCampaign && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🏆 Campagne Top Performance
              </h3>
              <h4 className="text-xl font-bold text-green-800">{topPerformingCampaign.title}</h4>
              <p className="text-gray-600 mb-3">{topPerformingCampaign.restaurantName}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ROAS:</span>
                  <div className="font-bold text-green-600">{topPerformingCampaign.metrics.return_on_ad_spend}x</div>
                </div>
                <div>
                  <span className="text-gray-500">Portée:</span>
                  <div className="font-bold text-blue-600">{topPerformingCampaign.metrics.reach.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Conversions:</span>
                  <div className="font-bold text-purple-600">{topPerformingCampaign.metrics.conversions}</div>
                </div>
                <div>
                  <span className="text-gray-500">Budget:</span>
                  <div className="font-bold text-gray-700">{topPerformingCampaign.spent}€/{topPerformingCampaign.budget}€</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('campaigns')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir Détails
            </button>
          </div>
        </div>
      )}
      
      {/* Marketplace Community */}
      <div>
        <MarketplaceCommunity userRole="community_manager" />
      </div>
      <div>
          {/* AI Assistant désactivé */}
      </div>
    </div>
  );
};
