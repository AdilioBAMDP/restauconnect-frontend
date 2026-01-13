import React from 'react';
import { Activity, ArrowRight, MessageSquare, FileText, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  [key: string]: unknown;
}

interface CompleteActivitiesProps {
  realActivities?: ActivityItem[];
  onNavigate?: (path: string) => void;
  [key: string]: unknown;
}

export const CompleteActivities: React.FC<CompleteActivitiesProps> = ({
  realActivities = [],
  onNavigate
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      case 'order':
        return FileText;
      case 'offer':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-blue-600 bg-blue-100';
      case 'order':
        return 'text-green-600 bg-green-100';
      case 'offer':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="text-emerald-600 w-5 h-5" />
          Activités Récentes
        </h3>
        {realActivities.length > 0 && (
          <button
            onClick={() => onNavigate?.('activities')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {realActivities.length > 0 ? (
          realActivities.slice(0, 5).map((activity) => {
            const Icon = activity.icon || getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => onNavigate?.(`activity-${activity.id}`)}
              >
                <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-gray-600 mt-1 truncate">{activity.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucune activité récente</p>
          </div>
        )}
      </div>
    </div>
  );
};
