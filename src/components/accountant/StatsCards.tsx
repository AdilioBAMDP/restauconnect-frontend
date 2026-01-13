import React, { memo } from 'react';
import { Users, FileText, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AccountantStats {
  activeClients: number;
  totalDocuments: number;
  pendingTasks: number;
  monthlyRevenue: number;
  urgentAlerts: number;
  completedTasks: number;
}

interface StatsCardsProps {
  stats: AccountantStats;
}

const StatsCards: React.FC<StatsCardsProps> = memo(({ stats }) => {
  const statsConfig = [
    {
      icon: Users,
      label: 'Clients actifs',
      value: stats.activeClients,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: FileText,
      label: 'Documents',
      value: stats.totalDocuments,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Tâches en attente',
      value: stats.pendingTasks,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'CA mensuel',
      value: `${stats.monthlyRevenue.toLocaleString()}€`,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: AlertTriangle,
      label: 'Alertes urgentes',
      value: stats.urgentAlerts,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: CheckCircle,
      label: 'Tâches terminées',
      value: stats.completedTasks,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;
