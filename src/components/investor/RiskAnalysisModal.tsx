import React from 'react';
import { 
  Brain, 
  FileText, 
  Download, 
  Plus, 
  Gauge, 
  Banknote, 
  Clock, 
  Award, 
  AlertTriangle, 
  BarChart4, 
  Building 
} from 'lucide-react';
import { AdvancedAnalysis, RiskFactor } from '@/types/investor.types';
import { InvestmentOpportunity } from '@/services/financialServices';

interface RiskAnalysisModalProps {
  show: boolean;
  opportunity: InvestmentOpportunity | null;
  analysis: AdvancedAnalysis | null;
  onClose: () => void;
  onInvest?: (opportunity: InvestmentOpportunity, amount: number) => void;
}

const RiskAnalysisModal: React.FC<RiskAnalysisModalProps> = ({
  show,
  opportunity,
  analysis,
  onClose,
  onInvest
}) => {
  if (!show || !opportunity) return null;

  const handleInvestRecommended = () => {
    if (analysis && onInvest) {
      onInvest(opportunity, analysis.maxRecommendedAmount);
    }
    onClose();
  };

  const handleDownloadReport = () => {
    if (!analysis || !opportunity) return;
    
    // Création du contenu du rapport
    const reportContent = `
RAPPORT D'ANALYSE DE RISQUE - Web Spider
===========================================

Opportunité: ${opportunity.title}
Date d'analyse: ${new Date().toLocaleDateString('fr-FR')}

RÉSUMÉ EXÉCUTIF
===============
Score de Risque: ${analysis.riskScore}/100
Niveau de Confiance: ${analysis.confidenceLevel}%
Montant Recommandé: ${analysis.maxRecommendedAmount}€

FACTEURS DE RISQUE
==================
${analysis.factors.map(factor => `- ${factor.name}: Score ${factor.score}/100 (${factor.status})`).join('\n')}

RECOMMANDATIONS
===============
${analysis.recommendation}

HORIZON D'INVESTISSEMENT
========================
Recommandé: ${analysis.timeHorizon}

ANALYSE SECTORIELLE
===================
Croissance: ${analysis.sectorAnalysis.growth}%
Concurrence: ${analysis.sectorAnalysis.competition}%
Régulation: ${analysis.sectorAnalysis.regulation}%

MÉTRIQUES
=========
Score ESG: ${analysis.esgScore}/100
Volatilité: ${analysis.volatility}
Tendance Marché: ${analysis.marketTrend}
Risque de Liquidité: ${analysis.liquidityRisk}%

STRESS TESTS
============
${analysis.stressTestResults.map(test => `- ${test.scenario}: Impact ${test.impact}%`).join('\n')}

Ce rapport a été généré automatiquement par l'IA d'analyse de Web Spider.
    `;

    // Création et téléchargement du fichier
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-analyse-${opportunity.title.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-y-auto m-4">
        {/* Header de la modal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8" />
              <div>
                <h3 className="text-2xl font-bold">Analyse de Risque IA Ultra-Professionnelle</h3>
                <p className="text-blue-100">Algorithmes avancés • Simulation Monte Carlo • Analyse ESG</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FileText className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {opportunity && analysis && (
            <div className="space-y-8">
              {/* Opportunité analysée */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{opportunity.title}</h4>
                    <p className="text-gray-600 mt-1">{opportunity.description}</p>
                    <div className="flex space-x-4 mt-3 text-sm">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Secteur: {opportunity.sector || 'Non spécifié'}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        Objectif: {opportunity.targetAmount?.toLocaleString()}€
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        ROI Attendu: {opportunity.expectedROI}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{analysis.riskScore}/100</div>
                    <p className="text-sm text-gray-500">Score Global</p>
                    <div className="text-sm text-purple-600 font-medium">
                      Confiance: {analysis.confidenceLevel}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Métriques principales ultra-pro */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Score de Risque</p>
                      <p className="text-2xl font-bold">{analysis.riskScore}/100</p>
                      <p className="text-xs">
                        {analysis.riskScore > 80 ? 'Excellent' : 
                         analysis.riskScore > 65 ? 'Bon' : 
                         analysis.riskScore > 50 ? 'Modéré' : 'Risqué'}
                      </p>
                    </div>
                    <Gauge className="h-8 w-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Montant Max</p>
                      <p className="text-xl font-bold">{analysis.maxRecommendedAmount?.toLocaleString()}€</p>
                      <p className="text-xs">Allocation recommandée</p>
                    </div>
                    <Banknote className="h-8 w-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Horizon Temps</p>
                      <p className="text-lg font-bold">{analysis.timeHorizon}</p>
                      <p className="text-xs">Investissement moyen terme</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Score ESG</p>
                      <p className="text-xl font-bold">{analysis.esgScore}/100</p>
                      <p className="text-xs">Impact durable</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Risque Liquidité</p>
                      <p className="text-xl font-bold">{analysis.liquidityRisk}%</p>
                      <p className="text-xs">
                        {analysis.liquidityRisk < 20 ? 'Faible' : 
                         analysis.liquidityRisk < 40 ? 'Modéré' : 'Élevé'}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </div>
              </div>

              {/* Analyse des facteurs ultra-détaillée */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarChart4 className="h-6 w-6 text-blue-600 mr-2" />
                    <h5 className="text-lg font-bold text-gray-900">Analyse Multi-Facteurs</h5>
                  </div>
                  <div className="space-y-4">
                    {analysis.factors.map((factor: RiskFactor, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-800">{factor.name}</span>
                            {factor.trend && (
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                factor.trend === 'up' ? 'bg-green-100 text-green-600' :
                                factor.trend === 'down' ? 'bg-red-100 text-red-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {factor.trend === 'up' ? '↗️' : factor.trend === 'down' ? '↘️' : '→'}
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-bold text-gray-900">{factor.score}%</span>
                        </div>
                        
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                factor.status === 'excellent' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                factor.status === 'good' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                factor.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                                'bg-gradient-to-r from-red-400 to-red-600'
                              }`}
                              style={{ width: `${factor.score}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {factor.description && (
                          <p className="text-xs text-gray-600 mt-2">{factor.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Analyse sectorielle */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Building className="h-6 w-6 text-green-600 mr-2" />
                      <h5 className="text-lg font-bold text-gray-900">Analyse Sectorielle</h5>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysis.sectorAnalysis.growth}%</div>
                        <p className="text-xs text-gray-600">Croissance</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{analysis.sectorAnalysis.competition}%</div>
                        <p className="text-xs text-gray-600">Concurrence</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysis.sectorAnalysis.regulation}%</div>
                        <p className="text-xs text-gray-600">Régulation</p>
                      </div>
                    </div>
                  </div>

                  {/* Stress Testing */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                      <h5 className="text-lg font-bold text-gray-900">Stress Testing</h5>
                    </div>
                    <div className="space-y-3">
                      {analysis.stressTestResults.map((test, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">{test.scenario}</span>
                          <span className={`text-sm font-bold ${
                            test.impact > 30 ? 'text-red-600' :
                            test.impact > 15 ? 'text-orange-600' : 'text-yellow-600'
                          }`}>
                            -{test.impact}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommandation finale ultra-pro */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-gray-900 mb-2">Recommandation IA</h5>
                    <p className="text-gray-700 mb-4">{analysis.recommendation}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border">
                        <span className="text-gray-500">Volatilité attendue:</span>
                        <span className="ml-2 font-medium">{analysis.volatility}</span>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <span className="text-gray-500">Tendance marché:</span>
                        <span className="ml-2 font-medium">{analysis.marketTrend}</span>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <span className="text-gray-500">Niveau confiance:</span>
                        <span className="ml-2 font-medium text-blue-600">{analysis.confidenceLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Fermer l'Analyse
                </button>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleDownloadReport}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger Rapport
                  </button>
                  
                  <button
                    onClick={handleInvestRecommended}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Investir Montant Recommandé
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisModal;