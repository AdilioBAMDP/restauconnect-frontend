import React from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';

interface Opportunity {
  id: string;
  projectName: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  expectedReturn: number;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketplaceOpportunitiesProps {
  opportunitiesData: Opportunity[];
  navigateTo: (page: string) => void;
}

export const MarketplaceOpportunities: React.FC<MarketplaceOpportunitiesProps> = ({ 
  opportunitiesData,
  navigateTo 
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Opportunités d'Investissement</h2>
        <button
          onClick={() => navigateTo('marketplace')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Voir Plus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunitiesData.map((opp) => (
          <div key={opp.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{opp.projectName}</h3>
                <p className="text-sm text-gray-600">{opp.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(opp.riskLevel)}`}>
                {opp.riskLevel === 'low' ? 'Faible' : opp.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-blue-600" />
                <span>{opp.raisedAmount.toLocaleString()}€ / {opp.targetAmount.toLocaleString()}€</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((opp.raisedAmount / opp.targetAmount) * 100, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +{opp.expectedReturn}%
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  {opp.duration}
                </span>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Min. {opp.minInvestment.toLocaleString()}€</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Investir Maintenant
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
