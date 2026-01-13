import { useState, useEffect } from 'react';
import { Users, Target, BarChart3, Settings, Megaphone } from 'lucide-react';
import axios from 'axios';
import { useBusinessStore } from '@/stores/businessStore';
import GlobalInfoSpace from '@/components/common/GlobalInfoSpace';
import Header from '@/components/layout/Header';
import CreateBoostCampaign from '@/pages/marketing/CreateBoostCampaign';
import { CommunityOverview, CampaignsList, ClientsList, ServicesList } from '@/components/dashboard/community';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useNavigation } from '@/hooks/useNavigation';

interface CommunityManagerDashboardProps {
  navigateTo: (page: string) => void;
}

export default function CommunityManagerDashboard({ navigateTo }: CommunityManagerDashboardProps) {
  const { 
    cmServices, 
    cmCampaigns, 
    cmClients, 
    cmStats 
  } = useBusinessStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'clients' | 'services' | 'boost-campaigns'>('overview');
  const [realCampaigns, setRealCampaigns] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Charger les vraies données depuis l'API
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');
        
        if (!token) {
          console.log('⚠️ Pas de token trouvé');
          setLoading(false);
          return;
        }

        // Charger les campaigns et analytics en parallèle
        const [campaignsRes, analyticsRes] = await Promise.all([
          axios.get('/api/community-manager/campaigns', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/community-manager/analytics', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (campaignsRes.data.success) {
          // Transformer les campaigns API en format dashboard
          const transformedCampaigns = campaignsRes.data.campaigns.map((camp: any) => ({
            id: camp._id,
            title: camp.title,
            description: camp.description,
            type: camp.type,
            status: camp.status,
            budget: camp.budget,
            startDate: camp.startDate,
            endDate: camp.endDate,
            metrics: {
              reach: camp.analytics?.reach || 0,
              engagement: camp.analytics?.engagement || 0,
              clicks: camp.analytics?.clicks || 0,
              conversions: camp.analytics?.conversions || 0,
              return_on_ad_spend: camp.analytics?.conversions > 0 ? (camp.analytics.conversions * 30) / camp.budget : 0
            },
            targetAudience: camp.targetAudience || [],
            clientId: camp.clientId
          }));
          
          setRealCampaigns(transformedCampaigns);
        }

        if (analyticsRes.data.success) {
          setRealStats({
            totalCampaigns: analyticsRes.data.summary.totalCampaigns,
            activeCampaigns: analyticsRes.data.summary.activeCampaigns,
            totalReach: analyticsRes.data.totals.reach,
            totalEngagement: analyticsRes.data.totals.engagement,
            totalClicks: analyticsRes.data.totals.clicks,
            totalConversions: analyticsRes.data.totals.conversions,
            monthlyRevenue: analyticsRes.data.summary.totalBudget
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur chargement données CM:', error);
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  // Utiliser les vraies données si disponibles, sinon fallback sur store
  const displayCampaigns = realCampaigns.length > 0 ? realCampaigns : cmCampaigns;
  const displayStats = realStats || cmStats;

  // Calcul de la campagne la plus performante pour CommunityOverview
  const topPerformingCampaign = displayCampaigns.length > 0 ? displayCampaigns.reduce((top, campaign) => 
    campaign.metrics.return_on_ad_spend > (top.metrics.return_on_ad_spend || 0) ? campaign : top
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50">

      
      <Header currentPage="community-manager-dashboard" onNavigate={navigateTo} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={cmClients.length}
              avgRating={4.5}
              activeOffers={displayCampaigns.length}
              currentUserRole="community_manager"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateTo(path)}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-8">Chargement des données...</div>
            ) : (
            <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => navigateTo('community-manager-dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mb-4"
              >
                ← Dashboard Community Manager
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Community Manager</h1>
              <p className="text-gray-600">Gérez vos services marketing et vos campagnes clients</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs - EN HAUT */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                { id: 'campaigns', label: 'Campagnes', icon: Target },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'services', label: 'Services', icon: Settings },
                { id: 'boost-campaigns', label: '💰 Mes Campagnes Pub', icon: Megaphone }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'campaigns' | 'clients' | 'services' | 'boost-campaigns')}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vue d'ensemble - Performance et Marketplace */}
          {activeTab === 'overview' && (
            <>
              <div className="mb-8">
                <CommunityOverview 
                  cmStats={displayStats} 
                  topPerformingCampaign={topPerformingCampaign || undefined}
                  setActiveTab={setActiveTab}
                />
              </div>

              {/* Espace Information Global */}
              <div className="mb-8">
                <GlobalInfoSpace userRole="community_manager" />
              </div>
            </>
          )}

          {/* Content - Autres onglets */}
          <div>
            {activeTab === 'campaigns' && <CampaignsList cmCampaigns={displayCampaigns} />}
            {activeTab === 'clients' && <ClientsList cmClients={cmClients} />}
            {activeTab === 'services' && <ServicesList cmServices={cmServices} navigateTo={navigateTo} />}
            {activeTab === 'boost-campaigns' && <CreateBoostCampaign />}
          </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
