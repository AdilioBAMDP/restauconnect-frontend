import React, { useState, useMemo } from 'react';
import { 
  Calculator,
  TrendingUp,
  PieChart,
  BarChart3,
  DollarSign,
  Percent,
  Target,
  AlertTriangle,
  Info,
  Download,
  Share2
} from 'lucide-react';

interface FinancialToolsProps {
  onNavigate?: (page: string) => void;
}

const FinancialTools: React.FC<FinancialToolsProps> = () => {
  const [activeCalculator, setActiveCalculator] = useState<'roi' | 'risk' | 'valuation' | 'portfolio'>('roi');
  
  // ROI Calculator State
  const [roiInputs, setRoiInputs] = useState({
    initialInvestment: 10000,
    expectedReturn: 15,
    timeHorizon: 3,
    reinvestment: true
  });

  // Risk Calculator State
  const [riskInputs, setRiskInputs] = useState({
    portfolioValue: 100000,
    volatility: 20,
    diversification: 'high',
    riskTolerance: 'moderate'
  });

  // Portfolio Optimization State
  const [portfolioInputs, setPortfolioInputs] = useState({
    totalAmount: 50000,
    riskProfile: 'balanced',
    sectors: {
      restaurant: 40,
      artisan: 30,
      franchise: 20,
      foodtech: 10
    }
  });

  // Calculate ROI
  const roiResults = useMemo(() => {
    const { initialInvestment, expectedReturn, timeHorizon, reinvestment } = roiInputs;
    const rate = expectedReturn / 100;
    
    let finalValue: number;
    if (reinvestment) {
      finalValue = initialInvestment * Math.pow(1 + rate, timeHorizon);
    } else {
      finalValue = initialInvestment * (1 + rate * timeHorizon);
    }
    
    const totalReturn = finalValue - initialInvestment;
    const totalReturnPercent = (totalReturn / initialInvestment) * 100;
    const annualizedReturn = reinvestment ? expectedReturn : expectedReturn;
    
    return {
      finalValue: Math.round(finalValue),
      totalReturn: Math.round(totalReturn),
      totalReturnPercent: Math.round(totalReturnPercent * 100) / 100,
      annualizedReturn: Math.round(annualizedReturn * 100) / 100
    };
  }, [roiInputs]);

  // Calculate Risk Score
  const riskScore = useMemo(() => {
    const { volatility, diversification, riskTolerance } = riskInputs;
    
    let score = 50; // Base score
    
    // Adjust for volatility
    score += (20 - volatility) * 2;
    
    // Adjust for diversification
    const diversificationBonus = {
      high: 20,
      medium: 10,
      low: -10
    };
    score += diversificationBonus[diversification as keyof typeof diversificationBonus];
    
    // Adjust for risk tolerance
    const toleranceAdjustment = {
      conservative: -10,
      moderate: 0,
      aggressive: 10
    };
    score += toleranceAdjustment[riskTolerance as keyof typeof toleranceAdjustment];
    
    return Math.max(0, Math.min(100, score));
  }, [riskInputs]);

  const renderROICalculator = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres d'Investissement</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant Initial (€)
              </label>
              <input
                type="number"
                value={roiInputs.initialInvestment}
                onChange={(e) => setRoiInputs(prev => ({ ...prev, initialInvestment: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rendement Attendu (% par an)
              </label>
              <input
                type="number"
                value={roiInputs.expectedReturn}
                onChange={(e) => setRoiInputs(prev => ({ ...prev, expectedReturn: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période (années)
              </label>
              <input
                type="number"
                value={roiInputs.timeHorizon}
                onChange={(e) => setRoiInputs(prev => ({ ...prev, timeHorizon: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reinvestment"
                checked={roiInputs.reinvestment}
                onChange={(e) => setRoiInputs(prev => ({ ...prev, reinvestment: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reinvestment" className="ml-2 block text-sm text-gray-700">
                Réinvestir les gains (intérêts composés)
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats de Simulation</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Valeur Finale</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{roiResults.finalValue.toLocaleString()}€</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Gain Total</span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                +{roiResults.totalReturn.toLocaleString()}€ ({roiResults.totalReturnPercent}%)
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Percent className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-800">Rendement Annualisé</span>
              </div>
              <p className="text-xl font-bold text-purple-900">{roiResults.annualizedReturn}%</p>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Ces calculs sont des estimations basées sur les paramètres saisis. 
                  Les rendements réels peuvent varier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Projetée</h3>
        <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Graphique d'évolution du capital sur {roiInputs.timeHorizon} ans</p>
            <p className="text-sm text-gray-500 mt-1">
              De {roiInputs.initialInvestment.toLocaleString()}€ à {roiResults.finalValue.toLocaleString()}€
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRiskAnalyzer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Inputs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de Risque</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeur du Portefeuille (€)
              </label>
              <input
                type="number"
                value={riskInputs.portfolioValue}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, portfolioValue: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volatilité Moyenne (%)
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={riskInputs.volatility}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, volatility: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Faible (5%)</span>
                <span className="font-medium">{riskInputs.volatility}%</span>
                <span>Élevée (50%)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau de Diversification
              </label>
              <select
                value={riskInputs.diversification}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, diversification: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="low">Faible (1-3 secteurs)</option>
                <option value="medium">Moyenne (4-6 secteurs)</option>
                <option value="high">Élevée (7+ secteurs)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tolérance au Risque
              </label>
              <select
                value={riskInputs.riskTolerance}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, riskTolerance: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="conservative">Conservateur</option>
                <option value="moderate">Modéré</option>
                <option value="aggressive">Agressif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risk Results */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score de Risque</h3>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
              riskScore >= 70 ? 'bg-green-100' :
              riskScore >= 40 ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <span className={`text-3xl font-bold ${
                riskScore >= 70 ? 'text-green-600' :
                riskScore >= 40 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {riskScore}
              </span>
            </div>
            <p className={`mt-2 font-medium ${
              riskScore >= 70 ? 'text-green-600' :
              riskScore >= 40 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {riskScore >= 70 ? 'Risque Faible' :
               riskScore >= 40 ? 'Risque Modéré' :
               'Risque Élevé'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Perte Potentielle Maximum</h4>
              <p className="text-xl font-bold text-red-600">
                -{Math.round(riskInputs.portfolioValue * riskInputs.volatility / 100).toLocaleString()}€
              </p>
              <p className="text-sm text-gray-500">Basé sur la volatilité de {riskInputs.volatility}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diversification</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        riskInputs.diversification === 'high' ? 'bg-green-500 w-full' :
                        riskInputs.diversification === 'medium' ? 'bg-yellow-500 w-2/3' :
                        'bg-red-500 w-1/3'
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm font-medium capitalize">{riskInputs.diversification}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommandations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskScore < 40 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Risque Élevé Détecté</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Considérez diversifier davantage votre portefeuille ou réduire l'exposition aux actifs volatils.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {riskInputs.diversification === 'low' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Améliorer la Diversification</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Investir dans plus de secteurs pourrait réduire le risque global.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPortfolioOptimizer = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimisation de Portefeuille</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant Total à Investir (€)
              </label>
              <input
                type="number"
                value={portfolioInputs.totalAmount}
                onChange={(e) => setPortfolioInputs(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profil de Risque
              </label>
              <select
                value={portfolioInputs.riskProfile}
                onChange={(e) => setPortfolioInputs(prev => ({ ...prev, riskProfile: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="conservative">Conservateur</option>
                <option value="balanced">Équilibré</option>
                <option value="growth">Croissance</option>
                <option value="aggressive">Agressif</option>
              </select>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Répartition par Secteur (%)</h4>
              {Object.entries(portfolioInputs.sectors).map(([sector, percentage]) => (
                <div key={sector}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm text-gray-700 capitalize">
                      {sector === 'foodtech' ? 'Food Tech' : sector}
                    </label>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setPortfolioInputs(prev => ({
                        ...prev,
                        sectors: {
                          ...prev.sectors,
                          [sector]: newValue
                        }
                      }));
                    }}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Allocation Recommandée</h4>
            <div className="space-y-3">
              {Object.entries(portfolioInputs.sectors).map(([sector, percentage]) => {
                const amount = Math.round(portfolioInputs.totalAmount * percentage / 100);
                return (
                  <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {sector === 'foodtech' ? 'Food Tech' : sector}
                      </p>
                      <p className="text-sm text-gray-600">{percentage}% du portefeuille</p>
                    </div>
                    <p className="font-bold text-gray-900">{amount.toLocaleString()}€</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">Métriques du Portefeuille</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Rendement Attendu:</span>
                  <span className="font-medium">12-18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Risque Estimé:</span>
                  <span className="font-medium">Modéré</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Score de Diversification:</span>
                  <span className="font-medium">8.5/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderValuationTool = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outil d'Évaluation d'Entreprise</h3>
        <div className="text-center py-12">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Outil d'évaluation avancé en cours de développement</p>
          <p className="text-sm text-gray-500 mt-2">
            Prochainement : Méthodes DCF, multiples sectoriels, analyse comparative
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Outils d'Analyse Financière</h1>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'roi', label: 'Calculateur ROI', icon: Calculator },
              { id: 'risk', label: 'Analyse de Risque', icon: AlertTriangle },
              { id: 'portfolio', label: 'Optimisation Portfolio', icon: PieChart },
              { id: 'valuation', label: 'Évaluation', icon: Target }
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveCalculator(tool.id as 'roi' | 'risk' | 'valuation' | 'portfolio')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeCalculator === tool.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tool.icon className="h-4 w-4" />
                <span>{tool.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCalculator === 'roi' && renderROICalculator()}
        {activeCalculator === 'risk' && renderRiskAnalyzer()}
        {activeCalculator === 'portfolio' && renderPortfolioOptimizer()}
        {activeCalculator === 'valuation' && renderValuationTool()}
      </div>
    </div>
  );
};

export default FinancialTools;
