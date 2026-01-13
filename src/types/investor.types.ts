// Types pour le système d'investissement ultra-professionnel
export interface RiskFactor {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

export interface AdvancedAnalysis {
  riskScore: number;
  confidenceLevel: number;
  factors: RiskFactor[];
  recommendation: string;
  maxRecommendedAmount: number;
  timeHorizon: string;
  volatility: string;
  marketTrend: string;
  sectorAnalysis: {
    growth: number;
    competition: number;
    regulation: number;
  };
  esgScore: number;
  liquidityRisk: number;
  stressTestResults: {
    scenario: string;
    impact: number;
  }[];
}

export interface PortfolioMetrics {
  totalValue: number;
  totalInvested: number;
  unrealizedGains: number;
  realizedGains: number;
  totalROI: number;
  sharpeRatio: number;
  volatility: number;
  beta: number;
  diversificationScore: number;
  sectorAllocation: { [sector: string]: number };
  riskAllocation: { [risk: string]: number };
  monthlyReturns: number[];
  valueAtRisk: number;
  maxDrawdown: number;
}

export interface MarketAlert {
  id: string;
  type: 'opportunity' | 'risk' | 'market' | 'portfolio';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  actionRequired: boolean;
  relatedOpportunity?: string;
}

export interface InvestorDashboardProps {
  onNavigate?: (view: string) => void;
}

export interface MarketFilters {
  sortBy: string;
  category: string;
  riskLevel: string;
  minAmount: number;
  maxAmount: number;
}

export interface PortfolioStats {
  totalInvested: number;
  totalConfirmed: number;
  count: number;
}

export type DashboardView = 'overview' | 'detailed' | 'analytics';
export type ActiveTab = 'dashboard' | 'marketplace' | 'analysis' | 'portfolio';
export type PerformanceTimeframe = '1M' | '3M' | '6M' | '1Y' | '2Y';
export type RiskLevel = 'low' | 'medium' | 'high' | 'all';