import { useState, useCallback } from 'react';
import { PortfolioMetrics, MarketAlert, PortfolioStats } from '@/types/investor.types';
import { Investment } from '@/services/financialServices';

// Fonction utilitaire pour déterminer le secteur d'un investissement
const getSectorFromInvestment = (investment: Investment): string => {
  // Pour l'instant, on utilise une logique simple basée sur l'ID ou des valeurs par défaut
  // Dans une vraie application, cela serait lié aux données de l'opportunité
  
  // Convertir opportunityId en string pour éviter l'erreur avec ObjectId
  const opportunityIdStr = typeof investment.opportunityId === 'string' 
    ? investment.opportunityId 
    : (investment.opportunityId as any)?.toString?.() || '';
  
  if (opportunityIdStr.includes('tech')) return 'Technology';
  if (opportunityIdStr.includes('food') || opportunityIdStr.includes('restaurant')) return 'Food & Beverage';
  if (opportunityIdStr.includes('retail')) return 'Retail';
  if (opportunityIdStr.includes('health')) return 'Healthcare';
  
  // Allocation par défaut basée sur l'index pour une distribution équilibrée
  const sectors = ['Food & Beverage', 'Technology', 'Retail', 'Healthcare'];
  const investmentIdStr = investment._id || '';
  const hash = investmentIdStr.length > 0 ? investmentIdStr.charCodeAt(0) % sectors.length : 0;
  return sectors[hash];
};

export const usePortfolioMetrics = (portfolio: Investment[], portfolioStats: PortfolioStats) => {
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([]);

  const calculatePortfolioMetrics = useCallback((): PortfolioMetrics => {
    const baseMetrics = {
      totalValue: portfolioStats.totalInvested,
      totalInvested: portfolioStats.totalInvested,
      unrealizedGains: Math.floor(portfolioStats.totalInvested * 0.185),
      realizedGains: 0,
      totalROI: 18.5,
      sharpeRatio: 1.67,
      volatility: 14.2,
      beta: 0.92,
      diversificationScore: 87,
      sectorAllocation: {},
      riskAllocation: {},
      monthlyReturns: [],
      valueAtRisk: Math.floor(portfolioStats.totalInvested * 0.12),
      maxDrawdown: 8.3
    };

    // Calcul de l'allocation sectorielle
    if (portfolio && portfolio.length > 0) {
      const sectorAllocation = portfolio.reduce((acc, inv) => {
        // Détermination du secteur basé sur l'opportunityId ou valeur par défaut
        const sector = getSectorFromInvestment(inv);
        acc[sector] = (acc[sector] || 0) + (inv.amount || 0);
        return acc;
      }, {} as Record<string, number>);

      baseMetrics.sectorAllocation = sectorAllocation;
    } else {
      // Allocation par défaut pour la démonstration
      baseMetrics.sectorAllocation = {
        'Food & Beverage': 45,
        'Technology': 30,
        'Retail': 15,
        'Healthcare': 10
      };
    }

    // Répartition par risque
    baseMetrics.riskAllocation = {
      'Faible': 35,
      'Modéré': 50,
      'Élevé': 15
    };

    return baseMetrics;
  }, [portfolio, portfolioStats]);

  const generateMarketAlerts = useCallback((): MarketAlert[] => {
    return [
      {
        id: 'alert-1',
        type: 'opportunity',
        severity: 'medium',
        title: 'Nouvelle Opportunité',
        description: 'Restaurant Italien Milan - ROI attendu 22%',
        timestamp: new Date(),
        actionRequired: false
      },
      {
        id: 'alert-2',
        type: 'portfolio',
        severity: 'low',
        title: 'Performance',
        description: 'Votre portfolio surperforme le marché de +5.2%',
        timestamp: new Date(),
        actionRequired: false
      },
      {
        id: 'alert-3',
        type: 'market',
        severity: 'medium',
        title: 'Secteur Tech',
        description: 'Volatilité accrue - surveillance recommandée',
        timestamp: new Date(),
        actionRequired: true
      }
    ];
  }, []);

  const portfolioMetrics = calculatePortfolioMetrics();

  return {
    portfolioMetrics,
    showAdvancedMetrics,
    setShowAdvancedMetrics,
    marketAlerts: marketAlerts.length > 0 ? marketAlerts : generateMarketAlerts(),
    setMarketAlerts,
    calculatePortfolioMetrics,
    generateMarketAlerts
  };
};