import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { InvestmentOpportunity } from '@/services/financialServices';
import { ActiveTab, DashboardView, PerformanceTimeframe, MarketFilters, RiskLevel } from '@/types/investor.types';

// Import des composants refactorisés
import TabNavigation from '@/components/investor/TabNavigation';
import DashboardOverview from '@/components/investor/DashboardOverview';
import MarketplaceView from '@/components/investor/MarketplaceView';
import AnalysisView from '@/components/investor/AnalysisView';
import PortfolioView from '@/components/investor/PortfolioView';
import RiskAnalysisModal from '@/components/investor/RiskAnalysisModal';

// Import des hooks personnalisés
import { useInvestorData } from '@/hooks/useInvestorData';
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics';
import { useRiskAnalysis } from '@/hooks/useRiskAnalysis';

interface InvestorDashboardProps {
  onNavigate?: (view: string) => void;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = () => {
  console.log('🏗️ InvestorDashboard: Composant monté/re-rendu (VERSION REFACTORISÉE)');
  
  const { navigateTo } = useAppStore();
  
  // États pour la navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dashboardView, setDashboardView] = useState<DashboardView>('overview');
  const [performanceTimeframe, setPerformanceTimeframe] = useState<PerformanceTimeframe>('6M');
  
  // État pour les filtres marketplace
  const [marketFilters, setMarketFilters] = useState<MarketFilters>({
    sortBy: 'roi',
    category: 'all',
    riskLevel: 'all',
    minAmount: 0,
    maxAmount: 100000
  });

  // Modal d'investissement
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [investmentShares, setInvestmentShares] = useState<number>(0);

  // Hooks personnalisés pour la logique métier
  const {
    loading,
    error,
    opportunities,
    portfolio,
    portfolioStats,
    filteredOpportunities,
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    loadData,
    handleInvest
  } = useInvestorData();

  const {
    portfolioMetrics,
    showAdvancedMetrics,
    setShowAdvancedMetrics,
    marketAlerts
  } = usePortfolioMetrics(portfolio, portfolioStats);

  const {
    showRiskAnalysis,
    selectedAnalysisOpportunity,
    analysisResults,
    analyzeRisk,
    closeRiskAnalysis
  } = useRiskAnalysis();

  // Gestionnaires d'événements
  const handleInvestClick = (opportunity: InvestmentOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowInvestModal(true);
  };

  // Wrapper pour setRiskFilter pour correspondre au type attendu par MarketplaceView
  const handleRiskFilterChange = (filter: string) => {
    setRiskFilter(filter as RiskLevel);
  };

  const handleInvestSubmit = async () => {
    if (!selectedOpportunity) return;

    const result = await handleInvest(selectedOpportunity._id, investmentAmount, investmentShares);
    
    if (result.success) {
      setShowInvestModal(false);
      setSelectedOpportunity(null);
      setInvestmentAmount(0);
      setInvestmentShares(0);
    }
  };

  const handleInvestFromAnalysis = (opportunity: InvestmentOpportunity, amount: number) => {
    setSelectedOpportunity(opportunity);
    setInvestmentAmount(amount);
    setShowInvestModal(true);
  };

  if (loading && opportunities.length === 0) {
    console.log('⏳ InvestorDashboard: Affichage du loader');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        
      <Header currentPage="investor-dashboard" onNavigate={(page) => navigateTo(page as any)} />

<div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des opportunités...</p>
          <p className="mt-2 text-sm text-gray-500">Debug: InvestorDashboard refactorisé monté</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="investor-dashboard" onNavigate={(page) => navigateTo(page as any)} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={0}
              avgRating={4.5}
              activeOffers={portfolio.length}
              currentUserRole="investisseur"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateTo(path as any)}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Navigation par onglets professionnelle */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Contenu des onglets */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            portfolioStats={portfolioStats}
            portfolioMetrics={portfolioMetrics}
            marketAlerts={marketAlerts}
            showAdvancedMetrics={showAdvancedMetrics}
            setShowAdvancedMetrics={setShowAdvancedMetrics}
            dashboardView={dashboardView}
            setDashboardView={setDashboardView}
            performanceTimeframe={performanceTimeframe}
            setPerformanceTimeframe={setPerformanceTimeframe}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            opportunities={filteredOpportunities}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            marketFilters={marketFilters}
            setMarketFilters={setMarketFilters}
            riskFilter={riskFilter}
            setRiskFilter={handleRiskFilterChange}
            onAnalyze={analyzeRisk}
            onInvest={handleInvestClick}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisView
            selectedOpportunity={selectedAnalysisOpportunity}
            onGoToMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView portfolio={portfolio} />
        )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'investissement - simplifiée */}
      {showInvestModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Investir dans {selectedOpportunity.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={investmentAmount || ''}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de parts
                </label>
                <input
                  type="number"
                  value={investmentShares || ''}
                  onChange={(e) => setInvestmentShares(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowInvestModal(false);
                  setSelectedOpportunity(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleInvestSubmit}
                disabled={!investmentAmount || !investmentShares}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'analyse de risque ultra-professionnelle */}
      <RiskAnalysisModal
        show={showRiskAnalysis}
        opportunity={selectedAnalysisOpportunity}
        analysis={analysisResults}
        onClose={closeRiskAnalysis}
        onInvest={handleInvestFromAnalysis}
      />
    </div>
  );
};

export default InvestorDashboard;
