import React, { useState, useEffect } from 'react';
import { Info, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';

interface EconomicIndicators {
  interestRate: number;
  interestRateTrend: 'up' | 'down' | 'stable';
  inflationRate: number;
  gdpGrowth: number;
  businessLoansVolume: number;
}

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  category: 'banking' | 'economy' | 'regulation';
  date: string;
  importance: 'high' | 'medium' | 'low';
}

const BankerInfoSection: React.FC = () => {
  const [indicators, setIndicators] = useState<EconomicIndicators>({
    interestRate: 4.25,
    interestRateTrend: 'stable',
    inflationRate: 2.8,
    gdpGrowth: 1.2,
    businessLoansVolume: 45200000
  });

  const [news] = useState<MarketNews[]>([
    {
      id: '1',
      title: 'Nouvelles réglementations Bâle IV',
      summary: 'Renforcement des exigences de fonds propres pour les banques européennes',
      category: 'regulation',
      date: new Date().toISOString(),
      importance: 'high'
    },
    {
      id: '2',
      title: 'Croissance du crédit aux PME',
      summary: 'Le volume de prêts aux petites entreprises augmente de 12% ce trimestre',
      category: 'economy',
      date: new Date().toISOString(),
      importance: 'medium'
    },
    {
      id: '3',
      title: 'Taux directeurs BCE maintenus',
      summary: 'La Banque Centrale Européenne maintient ses taux à 4.25%',
      category: 'banking',
      date: new Date().toISOString(),
      importance: 'high'
    }
  ]);

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      banking: { color: 'bg-blue-100 text-blue-700', label: 'Bancaire', icon: '🏦' },
      economy: { color: 'bg-green-100 text-green-700', label: 'Économie', icon: '📊' },
      regulation: { color: 'bg-red-100 text-red-700', label: 'Réglementation', icon: '📋' }
    };
    return badges[category] || badges.banking;
  };

  const getImportanceBadge = (importance: string) => {
    const badges: Record<string, { color: string; icon: string }> = {
      high: { color: 'border-red-300', icon: '🔴' },
      medium: { color: 'border-orange-300', icon: '🟠' },
      low: { color: 'border-green-300', icon: '🟢' }
    };
    return badges[importance] || badges.medium;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Informations Économiques</h3>
      </div>

      {/* Indicateurs économiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700 font-medium">Taux directeur</span>
            {indicators.interestRateTrend === 'up' ? (
              <TrendingUp className="h-5 w-5 text-red-600" />
            ) : indicators.interestRateTrend === 'down' ? (
              <TrendingDown className="h-5 w-5 text-green-600" />
            ) : (
              <span className="text-gray-600">➡️</span>
            )}
          </div>
          <p className="text-3xl font-bold text-blue-900">{indicators.interestRate.toFixed(2)}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-700 font-medium">Inflation</span>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900">{indicators.inflationRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-700 font-medium">Croissance PIB</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">+{indicators.gdpGrowth.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700 font-medium">Prêts entreprises</span>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{(indicators.businessLoansVolume / 1000000).toFixed(1)}M€</p>
        </div>
      </div>

      {/* Actualités */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Actualités du Secteur</h4>
        <div className="space-y-3">
          {news.map((article) => {
            const categoryBadge = getCategoryBadge(article.category);
            const importanceBadge = getImportanceBadge(article.importance);
            
            return (
              <div key={article.id} className={`bg-white border-l-4 ${importanceBadge.color} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{importanceBadge.icon}</span>
                    <h5 className="font-bold text-gray-900">{article.title}</h5>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${categoryBadge.color}`}>
                    {categoryBadge.icon} {categoryBadge.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                <p className="text-xs text-gray-500">
                  {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analyses & Prévisions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📈 Analyses & Prévisions</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-green-600 font-bold">↗</span>
            <p className="text-gray-700">
              <strong>Crédit aux entreprises:</strong> Tendance haussière prévue avec +8% au T4 2025
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <p className="text-gray-700">
              <strong>Taux d'intérêt:</strong> Stabilisation attendue jusqu'à fin 2025
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-orange-600 font-bold">⚠</span>
            <p className="text-gray-700">
              <strong>Risque sectoriel:</strong> Surveillance accrue du secteur restauration post-COVID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankerInfoSection;
