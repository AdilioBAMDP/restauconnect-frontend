import React from 'react';
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import type { ApplicationStats } from '../../types/application';

interface ApplicationStatsProps {
  stats: ApplicationStats | null;
  loading?: boolean;
}

export const ApplicationStatsComponent: React.FC<ApplicationStatsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }
  
  const statsData = [
    {
      label: 'Total',
      value: stats.total,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'En attente',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Approuvées',
      value: stats.approved,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Rejetées',
      value: stats.rejected,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];
  
  const approvalRate = stats.total > 0 
    ? ((stats.approved / (stats.approved + stats.rejected)) * 100).toFixed(0)
    : 0;
  
  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div 
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                {stats.total > 0 ? `${((stat.value / stats.total) * 100).toFixed(0)}% du total` : 'Aucune donnée'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Approval Rate */}
      {(stats.approved + stats.rejected) > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Taux d'approbation</h3>
                <p className="text-sm text-gray-600">
                  {stats.approved} approuvées sur {stats.approved + stats.rejected} traitées
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-orange-600">{approvalRate}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
