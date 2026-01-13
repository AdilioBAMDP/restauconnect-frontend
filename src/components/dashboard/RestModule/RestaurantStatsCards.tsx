import React from 'react';
import { TrendingUp, BarChart3, Users, DollarSign } from 'lucide-react';

interface StatsCard {
  id: string;
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }> | string;
  color: string;
  bgColor: string;
  change?: number;
  [key: string]: unknown;
}

// Map des icônes par nom
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'DollarSign': DollarSign,
  'BarChart3': BarChart3,
  'Users': Users,
  'TrendingUp': TrendingUp,
};

interface CompleteStatsCardsProps {
  statsCards?: StatsCard[];
  onNavigate?: (page: string) => void;
  [key: string]: unknown;
}

export const CompleteStatsCards: React.FC<CompleteStatsCardsProps> = ({ statsCards = [], onNavigate }) => {
  
  // Fonction pour gérer le clic sur une carte de stats
  const handleCardClick = (label: string) => {
    if (!onNavigate) return;
    
    // Navigation selon le label de la carte
    switch (label) {
      case 'Chiffre d\'Affaires':
        onNavigate('finances'); // Ouvre la page des finances
        break;
      case 'Commandes':
      case 'Confirmées':
      case 'Livrées':
        onNavigate('orders'); // Ouvre la page des commandes
        break;
      case 'Professionnels':
      case 'Clients':
        onNavigate('search'); // Ouvre la recherche de professionnels
        break;
      case 'Croissance':
        onNavigate('restaurant-analytics'); // Ouvre la page des statistiques
        break;
      default:
        onNavigate('orders');
    }
  };
  const defaultStats: StatsCard[] = [
    {
      id: '1',
      label: 'Chiffre d\'Affaires',
      value: '0 €',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 0
    },
    {
      id: '2',
      label: 'Commandes',
      value: '0',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: 0
    },
    {
      id: '3',
      label: 'Professionnels',
      value: '0',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 0
    },
    {
      id: '4',
      label: 'Croissance',
      value: '0%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 0
    }
  ];

  const stats = statsCards.length > 0 ? statsCards : defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        // Résoudre l'icône: soit c'est déjà un composant, soit c'est un string qu'on mappe
        const Icon = typeof stat.icon === 'string' 
          ? iconMap[stat.icon] || DollarSign 
          : stat.icon;
        
        return (
          <div 
            key={stat.id} 
            onClick={() => handleCardClick(stat.label)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105 transform"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(stat.label);
              }
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`${stat.color} w-6 h-6`} />
              </div>
              {stat.change !== undefined && stat.change !== 0 && (
                <span
                  className={`text-sm font-semibold ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            {onNavigate && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                👆 Cliquez pour voir les détails
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
