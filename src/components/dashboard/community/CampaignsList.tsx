import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import { getStatusColor } from '@/utils/dashboard/communityHelpers';

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

interface CampaignsListProps {
  cmCampaigns: Campaign[];
}

export const CampaignsList: React.FC<CampaignsListProps> = ({ cmCampaigns }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Campagnes Marketing</h3>
        <button 
          onClick={() => console.log('Créer nouvelle campagne - Modal à implémenter')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Campagne
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cmCampaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{campaign.title}</h4>
                <p className="text-sm text-gray-600">{campaign.restaurantName}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{campaign.spent}€</div>
                <div className="text-xs text-gray-500">sur {campaign.budget}€</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Portée:</span>
                <div className="font-semibold">{campaign.metrics.reach.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Engagement:</span>
                <div className="font-semibold">{campaign.metrics.engagement.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Conversions:</span>
                <div className="font-semibold">{campaign.metrics.conversions}</div>
              </div>
              <div>
                <span className="text-gray-500">ROAS:</span>
                <div className="font-semibold text-green-600">{campaign.metrics.return_on_ad_spend}x</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {campaign.platforms.map((platform) => (
                <span key={platform} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {platform}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Gérer →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
