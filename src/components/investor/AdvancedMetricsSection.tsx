import React from 'react';
import { 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  Zap
} from 'lucide-react';
import { PortfolioStats } from '@/types/investor.types';

interface AdvancedMetricsSectionProps {
  portfolioStats: PortfolioStats;
  showAdvancedMetrics: boolean;
}

const AdvancedMetricsSection: React.FC<AdvancedMetricsSectionProps> = ({ 
  portfolioStats, 
  showAdvancedMetrics 
}) => {
  if (!showAdvancedMetrics) return null;

  const advancedMetrics = [
    {
      title: 'Value at Risk (95%)',
      value: `-${Math.floor(portfolioStats.totalInvested * 0.12).toLocaleString()}€`,
      description: 'Perte maximale sur 1 mois',
      icon: AlertTriangle,
      color: 'text-red-500'
    },
    {
      title: 'Max Drawdown',
      value: '-8.3%',
      description: 'Plus forte baisse',
      icon: TrendingDown,
      color: 'text-red-500'
    },
    {
      title: 'Volatilité',
      value: '14.2%',
      description: 'Écart-type annualisé',
      icon: Activity,
      color: 'text-yellow-500'
    },
    {
      title: 'Alpha',
      value: '+5.2%',
      description: 'Surperformance vs marché',
      icon: Zap,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {advancedMetrics.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">{metric.title}</span>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AdvancedMetricsSection;