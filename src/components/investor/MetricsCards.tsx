import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Coins, 
  Star, 
  Award, 
  Shield, 
  Radar, 
  Layers,
  Percent
} from 'lucide-react';
import { PortfolioStats } from '@/types/investor.types';

interface MetricsCardsProps {
  portfolioStats: PortfolioStats;
  onMetricClick?: (metricType: string) => void;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ portfolioStats, onMetricClick }) => {
  const metrics = [
    {
      title: 'Total Investi',
      value: `${portfolioStats.totalInvested.toLocaleString()}€`,
      change: '+12.5% ce mois',
      icon: Wallet,
      gradient: 'from-purple-500 to-purple-600',
      bgIcon: 'bg-purple-400 bg-opacity-30',
      destination: 'transactions'
    },
    {
      title: 'Valeur Portfolio',
      value: `${Math.floor(portfolioStats.totalInvested * 1.185).toLocaleString()}€`,
      change: 'ROI: +18.5%',
      icon: CreditCard,
      gradient: 'from-green-500 to-green-600',
      bgIcon: 'bg-green-400 bg-opacity-30',
      destination: 'portfolio'
    },
    {
      title: 'Plus-values',
      value: `+${Math.floor(portfolioStats.totalInvested * 0.185).toLocaleString()}€`,
      change: '18.5%',
      icon: Coins,
      gradient: 'from-blue-500 to-blue-600',
      bgIcon: 'bg-blue-400 bg-opacity-30',
      changeIcon: Percent,
      destination: 'transactions'
    },
    {
      title: 'Sharpe Ratio',
      value: '1.67',
      change: 'Excellent',
      icon: Award,
      gradient: 'from-orange-500 to-orange-600',
      bgIcon: 'bg-orange-400 bg-opacity-30',
      changeIcon: Star,
      destination: 'analytics'
    },
    {
      title: 'Beta Portfolio',
      value: '0.92',
      change: 'Défensif',
      icon: Radar,
      gradient: 'from-indigo-500 to-indigo-600',
      bgIcon: 'bg-indigo-400 bg-opacity-30',
      changeIcon: Shield,
      destination: 'analytics'
    },
    {
      title: 'Diversification',
      value: '87/100',
      change: 'Très bon',
      icon: Layers,
      gradient: 'from-teal-500 to-teal-600',
      bgIcon: 'bg-teal-400 bg-opacity-30',
      destination: 'portfolio'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const ChangeIcon = metric.changeIcon || TrendingUp;
        
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onMetricClick?.(metric.destination)}
            className={`bg-gradient-to-r ${metric.gradient} rounded-lg shadow p-6 text-white cursor-pointer transition-all hover:scale-105 hover:shadow-xl`}
            title={`Cliquer pour voir ${metric.title === 'Total Investi' || metric.title === 'Plus-values' ? 'les transactions' : metric.title === 'Valeur Portfolio' || metric.title === 'Diversification' ? 'le portfolio' : 'les analytics'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-80 text-sm">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <div className="flex items-center mt-1">
                  <ChangeIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{metric.change}</span>
                </div>
              </div>
              <div className={`p-3 ${metric.bgIcon} rounded-lg`}>
                <Icon className="h-8 w-8" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsCards;