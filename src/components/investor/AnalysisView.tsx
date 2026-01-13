import React from 'react';
import { Shield } from 'lucide-react';
import { InvestmentOpportunity } from '@/services/financialServices';

interface AnalysisViewProps {
  selectedOpportunity: InvestmentOpportunity | null;
  onGoToMarketplace: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  selectedOpportunity,
  onGoToMarketplace 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Outil d'Analyse de Risque Professionnel</h3>
      
      {!selectedOpportunity ? (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Sélectionnez une opportunité depuis le Marketplace</p>
          <p className="text-sm text-gray-400">pour lancer une analyse de risque complète</p>
          <button
            onClick={onGoToMarketplace}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Aller au Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-900">{selectedOpportunity.title}</h4>
            <p className="text-sm text-gray-600">{selectedOpportunity.description}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              L'analyse de risque est en cours... Veuillez patienter pendant que nos algorithmes 
              IA analysent cette opportunité d'investissement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;