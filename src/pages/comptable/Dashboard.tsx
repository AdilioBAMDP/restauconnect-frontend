import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import Header from '@/components/layout/Header';
import ComptableTab from '@/components/features/ComptableTab';
import MarketplaceCommunity from '@/components/common/MarketplaceCommunity';
import GlobalInfoSpace from '@/components/common/GlobalInfoSpace';
import CreateBoostCampaign from '@/pages/marketing/CreateBoostCampaign';
import { useAppStore } from '@/stores/appStore';

interface ComptablePageProps {
  onNavigate: (page: string) => void;
}

const ComptablePage: React.FC<ComptablePageProps> = () => {
  const { navigateTo } = useAppStore();
  const [showCampaigns, setShowCampaigns] = useState(false);

  if (showCampaigns) {
    return (
      <div className="min-h-screen bg-gray-50">
  
        
      <Header currentPage="comptable" onNavigate={(page) => navigateTo(page as any)} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setShowCampaigns(false)}
            className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Retour Module Comptable
          </button>
          <CreateBoostCampaign />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Module Comptable</h1>
            <p className="mt-2 text-lg text-gray-600">
              Gérez vos documents comptables et communiquez avec votre expert-comptable
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowCampaigns(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              💰 Mes Campagnes Pub
            </button>
            <button
              onClick={() => navigateTo('comptable' as any)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              ← Dashboard Comptable
            </button>
          </div>
        </div>

        {/* Comptable Tab Component */}
        <ComptableTab />

        {/* Composants communautaires et AI */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <GlobalInfoSpace userRole="comptable" />
          </div>
          <div className="lg:col-span-1">
            <MarketplaceCommunity userRole="comptable" />
          </div>
          <div className="lg:col-span-1">
          {/* AI Assistant désactivé */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComptablePage;
