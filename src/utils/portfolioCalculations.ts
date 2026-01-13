import { Investment } from '@/services/financialServices';
import { PortfolioMetrics, PortfolioStats } from '@/types/investor.types';

// Type pour les opportunités d'investissement
interface InvestmentOpportunity {
  expectedROI?: number;
  targetAmount?: number;
  raisedAmount?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

// Extension de Investment avec secteur
interface InvestmentWithSector extends Investment {
  sector?: string;
}

export const sortOpportunities = (opportunities: InvestmentOpportunity[], sortBy: string) => {
  return [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return (b.expectedROI || 0) - (a.expectedROI || 0);
      case 'amount':
        return (b.targetAmount || 0) - (a.targetAmount || 0);
      case 'risk': {
        const riskOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        return riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder];
      }
      case 'progress': {
        const progressA = ((a.raisedAmount || 0) / (a.targetAmount || 1)) * 100;
        const progressB = ((b.raisedAmount || 0) / (b.targetAmount || 1)) * 100;
        return progressB - progressA;
      }
      default:
        return 0;
    }
  });
};

export const calculateBasicPortfolioMetrics = (portfolio: Investment[], portfolioStats: PortfolioStats): Partial<PortfolioMetrics> => {
  if (!portfolio || portfolio.length === 0) {
    return {
      totalValue: portfolioStats.totalInvested || 0,
      totalInvested: portfolioStats.totalInvested || 0,
      unrealizedGains: 0,
      realizedGains: 0,
      totalROI: 0,
      diversificationScore: 0
    };
  }
  
  const totalValue = portfolio.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const avgROI = portfolio.reduce((sum, inv) => sum + (inv.roi || 0), 0) / portfolio.length;
  
  // Calcul simple de la diversification
  const sectors = new Set(portfolio.map(inv => (inv as InvestmentWithSector).sector || 'Unknown'));
  const diversificationScore = Math.min(sectors.size * 20, 100); // Max 100 pour 5+ secteurs
  
  return {
    totalValue,
    totalInvested: portfolioStats.totalInvested,
    unrealizedGains: Math.max(0, totalValue - portfolioStats.totalInvested),
    realizedGains: 0,
    totalROI: avgROI,
    diversificationScore
  };
};

export const calculatePerformanceMetrics = (totalInvested: number) => {
  // Métriques simulées pour la démonstration
  return {
    sharpeRatio: 1.67,
    volatility: 14.2,
    beta: 0.92,
    alpha: 5.2,
    maxDrawdown: 8.3,
    valueAtRisk: Math.floor(totalInvested * 0.12)
  };
};

export const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'text-green-600 bg-green-100';
    case 'funded': return 'text-blue-600 bg-blue-100';
    case 'closed': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};