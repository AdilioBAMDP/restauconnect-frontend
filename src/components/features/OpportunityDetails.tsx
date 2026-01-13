import React, { useState } from 'react';
import { 
  ArrowLeft,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Star,
  Download,
  MessageSquare,
  Phone
} from 'lucide-react';

interface OpportunityDetailsProps {
  opportunityId: string;
  onBack: () => void;
  onInvest: (amount: number) => void;
}

const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({ 
  opportunityId, 
  onBack, 
  onInvest 
}) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents' | 'team'>('overview');

  // Données simulées pour l'opportunité
  const opportunity = {
    id: opportunityId,
    name: "Pizza Corner Expansion",
    type: "Restaurant",
    sector: "Pizzeria",
    location: "Paris 11e, République",
    description: "Expansion d'une pizzeria artisanale à succès vers un second emplacement premium dans le quartier République. Concept unique de pizzas bio au feu de bois avec des ingrédients locaux.",
    
    // Financials
    seekingAmount: 120000,
    minInvestment: 10000,
    maxInvestment: 50000,
    currentRaised: 75000,
    expectedReturn: { min: 15, max: 22 },
    paybackPeriod: "2-3 ans",
    
    // Scoring
    overallScore: 85,
    scores: {
      business: 88,
      financial: 82,
      market: 87,
      team: 84,
      risk: 79
    },
    
    // Risk
    riskLevel: "Medium",
    riskFactors: [
      "Concurrence locale élevée",
      "Dépendance aux prix des matières premières",
      "Saisonnalité des ventes"
    ],
    
    // Team
    team: [
      {
        name: "Marie Dubois",
        role: "Fondatrice & Chef",
        experience: "15 ans en restauration",
        photo: "/api/placeholder/60/60"
      },
      {
        name: "Pierre Martin",
        role: "Responsable Développement",
        experience: "10 ans en franchise",
        photo: "/api/placeholder/60/60"
      }
    ],
    
    // Documents
    documents: [
      { name: "Business Plan Complet", type: "PDF", size: "2.5 MB", verified: true },
      { name: "Comptes de Résultat 3 ans", type: "PDF", size: "1.2 MB", verified: true },
      { name: "Étude de Marché", type: "PDF", size: "3.1 MB", verified: true },
      { name: "Projections Financières", type: "Excel", size: "856 KB", verified: true }
    ],
    
    // Key metrics
    metrics: {
      currentRevenue: 240000,
      projectedRevenue: 450000,
      grossMargin: 68,
      breakEvenMonths: 18,
      employees: 8,
      yearFounded: 2019
    },

    // Timeline
    timeline: [
      { date: "Q1 2024", milestone: "Signature du bail", status: "completed" },
      { date: "Q2 2024", milestone: "Travaux d'aménagement", status: "in-progress" },
      { date: "Q3 2024", milestone: "Ouverture du second local", status: "upcoming" },
      { date: "Q4 2024", milestone: "Retour sur investissement", status: "upcoming" }
    ]
  };

  const calculateProjectedReturn = (amount: number) => {
    const returnRate = (opportunity.expectedReturn.min + opportunity.expectedReturn.max) / 2 / 100;
    return Math.round(amount * returnRate);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos du projet</h3>
        <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">CA Actuel</p>
              <p className="text-xl font-bold text-gray-900">{opportunity.metrics.currentRevenue.toLocaleString()}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">CA Projeté</p>
              <p className="text-xl font-bold text-gray-900">{opportunity.metrics.projectedRevenue.toLocaleString()}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Employés</p>
              <p className="text-xl font-bold text-gray-900">{opportunity.metrics.employees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Collecte de fonds</h3>
          <span className="text-sm text-gray-600">
            {Math.round((opportunity.currentRaised / opportunity.seekingAmount) * 100)}% collecté
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(opportunity.currentRaised / opportunity.seekingAmount) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{opportunity.currentRaised.toLocaleString()}€ collectés</span>
          <span>{opportunity.seekingAmount.toLocaleString()}€ objectif</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Roadmap du projet</h3>
        <div className="space-y-4">
          {opportunity.timeline.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${
                item.status === 'completed' ? 'bg-green-500' :
                item.status === 'in-progress' ? 'bg-blue-500' :
                'bg-gray-300'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{item.milestone}</p>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques Financières</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Marge Brute</span>
              <span className="font-semibold">{opportunity.metrics.grossMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seuil de Rentabilité</span>
              <span className="font-semibold">{opportunity.metrics.breakEvenMonths} mois</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Période de Remboursement</span>
              <span className="font-semibold">{opportunity.paybackPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Année de Création</span>
              <span className="font-semibold">{opportunity.metrics.yearFounded}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse de Score</h3>
          <div className="space-y-3">
            {Object.entries(opportunity.scores).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">
                  {key === 'business' ? 'Business Model' :
                   key === 'financial' ? 'Solidité Financière' :
                   key === 'market' ? 'Potentiel Marché' :
                   key === 'team' ? 'Équipe' : 'Gestion des Risques'}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        value >= 85 ? 'bg-green-500' :
                        value >= 70 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-sm">{value}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse des Risques</h3>
        <div className="space-y-3">
          {opportunity.riskFactors.map((risk, index) => (
            <div key={index} className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <span className="text-gray-700">{risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Disponibles</h3>
        <div className="space-y-3">
          {opportunity.documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                </div>
                {doc.verified && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe Dirigeante</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunity.team.map((member, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.experience}</p>
                <div className="flex space-x-2 mt-3">
                  <button className="p-2 text-gray-400 hover:text-blue-600">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{opportunity.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Score: {opportunity.overallScore}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation tabs */}
            <div className="bg-white border-b border-gray-200 rounded-t-xl">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                  { id: 'financials', label: 'Financiers', icon: PieChart },
                  { id: 'documents', label: 'Documents', icon: FileText },
                  { id: 'team', label: 'Équipe', icon: Users }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'financials' | 'documents' | 'team')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-b-xl min-h-96 p-6">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'financials' && renderFinancials()}
              {activeTab === 'documents' && renderDocuments()}
              {activeTab === 'team' && renderTeam()}
            </div>
          </div>

          {/* Investment Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {opportunity.expectedReturn.min}-{opportunity.expectedReturn.max}%
                  </p>
                  <p className="text-sm text-gray-600">Rendement attendu</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Min. d'investissement</p>
                    <p className="font-semibold">{opportunity.minInvestment.toLocaleString()}€</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Max. d'investissement</p>
                    <p className="font-semibold">{opportunity.maxInvestment.toLocaleString()}€</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Montant d'investissement
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    min={opportunity.minInvestment}
                    max={opportunity.maxInvestment}
                    step={1000}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {opportunity.minInvestment.toLocaleString()}€</span>
                    <span>Max: {opportunity.maxInvestment.toLocaleString()}€</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Rendement estimé:</strong> {calculateProjectedReturn(investmentAmount).toLocaleString()}€
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Basé sur un rendement moyen de {((opportunity.expectedReturn.min + opportunity.expectedReturn.max) / 2)}%
                  </p>
                </div>

                <button
                  onClick={() => onInvest(investmentAmount)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Investir maintenant
                </button>

                <div className="text-center">
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    Sauvegarder pour plus tard
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques Rapides</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Secteur</span>
                  <span className="font-medium">{opportunity.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{opportunity.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Niveau de risque</span>
                  <span className={`font-medium ${
                    opportunity.riskLevel === 'Low' ? 'text-green-600' :
                    opportunity.riskLevel === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {opportunity.riskLevel === 'Low' ? 'Faible' :
                     opportunity.riskLevel === 'Medium' ? 'Moyen' : 'Élevé'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remboursement</span>
                  <span className="font-medium">{opportunity.paybackPeriod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
