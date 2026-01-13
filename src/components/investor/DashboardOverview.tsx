import React, { useState } from 'react';
import { Gauge, CandlestickChart } from 'lucide-react';
import { PortfolioMetrics, DashboardView, PerformanceTimeframe, PortfolioStats, MarketAlert } from '@/types/investor.types';
import MetricsCards from './MetricsCards';
import AdvancedMetricsSection from './AdvancedMetricsSection';
import MarketAlerts from './MarketAlerts';

interface DashboardOverviewProps {
  portfolioStats: PortfolioStats;
  portfolioMetrics: PortfolioMetrics;
  marketAlerts: MarketAlert[];
  showAdvancedMetrics: boolean;
  setShowAdvancedMetrics: (show: boolean) => void;
  dashboardView: DashboardView;
  setDashboardView: (view: DashboardView) => void;
  performanceTimeframe: PerformanceTimeframe;
  setPerformanceTimeframe: (timeframe: PerformanceTimeframe) => void;
  onNavigateToTab?: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  portfolioStats,
  portfolioMetrics,
  marketAlerts,
  showAdvancedMetrics,
  setShowAdvancedMetrics,
  dashboardView,
  setDashboardView,
  performanceTimeframe,
  setPerformanceTimeframe,
  onNavigateToTab
}) => {
  // États locaux pour les boutons dynamiques
  const [chartType, setChartType] = useState<'linear' | 'log'>('linear');
  const [isRebalancing, setIsRebalancing] = useState(false);

  // Handler pour le rééquilibrage du portfolio
  const handleRebalance = async () => {
    setIsRebalancing(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Ici on pourrait appeler une vraie API de rééquilibrage
      console.log('Portfolio rééquilibré avec succès');
    } catch (error) {
      console.error('Erreur lors du rééquilibrage:', error);
    } finally {
      setIsRebalancing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Sélecteur de vue du dashboard */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {(['overview', 'detailed', 'analytics'] as DashboardView[]).map((view) => (
            <button
              key={view}
              onClick={() => setDashboardView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dashboardView === view 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {view === 'overview' ? 'Vue d\'ensemble' : 
               view === 'detailed' ? 'Détaillé' : 'Analytics'}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <select
            value={performanceTimeframe}
            onChange={(e) => setPerformanceTimeframe(e.target.value as PerformanceTimeframe)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="1M">1 Mois</option>
            <option value="3M">3 Mois</option>
            <option value="6M">6 Mois</option>
            <option value="1Y">1 An</option>
            <option value="2Y">2 Ans</option>
          </select>
          <button
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
          >
            <Gauge className="h-4 w-4 mr-1" />
            Métriques Avancées
          </button>
        </div>
      </div>

      {/* Statistiques principales améliorées */}
      <MetricsCards 
        portfolioStats={portfolioStats} 
        onMetricClick={(destination) => onNavigateToTab?.(destination)}
      />

      {/* Métriques avancées (conditionnelles) */}
      <AdvancedMetricsSection 
        portfolioStats={portfolioStats}
        showAdvancedMetrics={showAdvancedMetrics} 
      />

      {/* Alertes de marché */}
      <MarketAlerts 
        alerts={marketAlerts} 
        onAlertClick={(destination) => onNavigateToTab?.(destination)}
      />

      {/* Graphiques avancés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Portfolio Améliorée */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Performance Portfolio</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setChartType('linear')}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  chartType === 'linear' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                Linéaire
              </button>
              <button 
                onClick={() => setChartType('log')}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  chartType === 'log' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                Log
              </button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded flex items-center justify-center">
            <div className="text-center">
              <CandlestickChart className="h-16 w-16 text-purple-400 mx-auto mb-3" />
              <p className="text-purple-600 font-medium">
                Graphique Performance Avancé ({chartType === 'linear' ? 'Linéaire' : 'Logarithmique'})
              </p>
              <p className="text-sm text-gray-600">ROI cumulé: +18.5% vs benchmark +13.2%</p>
              <div className="flex justify-center space-x-4 mt-2 text-xs">
                <span className="text-green-600">▲ Meilleur: +3.2%</span>
                <span className="text-red-600">▼ Pire: -1.8%</span>
              </div>
              {chartType === 'log' && (
                <p className="text-xs text-blue-600 mt-1">
                  Mode logarithmique - Variations relatives optimisées
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Allocation Sectorielle Améliorée */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Allocation Sectorielle</h3>
            <button 
              onClick={handleRebalance}
              disabled={isRebalancing}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isRebalancing 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isRebalancing ? 'Rééquilibrage...' : 'Rééquilibrer'}
            </button>
          </div>
          <div className="h-64">
            <div className="space-y-3">
              {Object.entries(portfolioMetrics.sectorAllocation).map(([sector, allocation], index) => {
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500'];
                const performances = ['+12.3%', '+24.1%', '+8.7%', '+15.2%'];
                
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600">{sector}</div>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${colors[index] || 'bg-gray-500'} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${allocation}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-gray-600">{allocation}%</div>
                    <div className="w-16 text-sm text-green-600 font-medium">{performances[index] || '+0%'}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Score de diversification:</span>
                <span className="font-medium text-green-600">{portfolioMetrics.diversificationScore}/100 (Très bon)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques de risque avancées */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analyse de Risque Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Répartition par Risque</h4>
            {Object.entries(portfolioMetrics.riskAllocation).map(([level, percentage], index) => {
              const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500'];
              return (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{level}</div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[index] || 'bg-gray-500'} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm text-gray-600">{percentage}%</div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Corrélations</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">vs CAC 40:</span>
                <span className="font-medium">0.72</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">vs Crypto:</span>
                <span className="font-medium">0.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">vs Immobilier:</span>
                <span className="font-medium">0.43</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Stress Tests</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Récession -20%:</span>
                <span className="font-medium text-red-600">-12.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inflation +5%:</span>
                <span className="font-medium text-orange-600">-3.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Crise sectorielle:</span>
                <span className="font-medium text-yellow-600">-8.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;