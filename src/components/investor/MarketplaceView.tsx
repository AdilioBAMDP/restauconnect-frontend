import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Calculator 
} from 'lucide-react';
import { InvestmentOpportunity } from '@/services/financialServices';
import { MarketFilters } from '@/types/investor.types';

interface MarketplaceViewProps {
  opportunities: InvestmentOpportunity[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  marketFilters: MarketFilters;
  setMarketFilters: (filters: MarketFilters) => void;
  riskFilter: string;
  setRiskFilter: (filter: string) => void;
  onAnalyze: (opportunity: InvestmentOpportunity) => void;
  onInvest: (opportunity: InvestmentOpportunity) => void;
  onRefresh: () => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  opportunities,
  searchTerm,
  setSearchTerm,
  marketFilters,
  setMarketFilters,
  riskFilter,
  setRiskFilter,
  onAnalyze,
  onInvest,
  onRefresh
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'funded': return 'text-blue-600 bg-blue-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres marketplace avancés */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Marketplace des Investissements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <select
            value={marketFilters.sortBy}
            onChange={(e) => setMarketFilters({...marketFilters, sortBy: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="roi">ROI décroissant</option>
            <option value="amount">Montant décroissant</option>
            <option value="risk">Risque croissant</option>
            <option value="progress">Progression</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tous les risques</option>
            <option value="low">Risque faible</option>
            <option value="medium">Risque moyen</option>
            <option value="high">Risque élevé</option>
          </select>

          <input
            type="number"
            placeholder="Montant min €"
            value={marketFilters.minAmount || ''}
            onChange={(e) => setMarketFilters({...marketFilters, minAmount: Number(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />

          <button
            onClick={onRefresh}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Appliquer
          </button>
        </div>

        {/* Liste des opportunités améliorée */}
        <div className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune opportunité d'investissement trouvée
            </div>
          ) : (
            opportunities.map((opportunity) => (
              <motion.div
                key={opportunity._id || Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {opportunity.title || 'Opportunité sans titre'}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(opportunity.riskLevel || 'medium')}`}>
                      {opportunity.riskLevel || 'medium'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opportunity.status || 'open')}`}>
                      {opportunity.status || 'open'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAnalyze(opportunity)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Calculator className="h-4 w-4 mr-1" />
                      Analyser
                    </button>
                    <button
                      onClick={() => onInvest(opportunity)}
                      disabled={opportunity.status !== 'open'}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Investir
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {opportunity.description || 'Description non disponible'}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Objectif:</span>
                    <span className="ml-2 font-medium">
                      {(opportunity.targetAmount || 0).toLocaleString()}€
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Collecté:</span>
                    <span className="ml-2 font-medium">
                      {(opportunity.raisedAmount || 0).toLocaleString()}€
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">ROI Attendu:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {opportunity.expectedROI || 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Secteur:</span>
                    <span className="ml-2 font-medium">
                      {opportunity.sector || 'Non spécifié'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(((opportunity.raisedAmount || 0) / (opportunity.targetAmount || 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.round(((opportunity.raisedAmount || 0) / (opportunity.targetAmount || 1)) * 100)}% collecté
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceView;