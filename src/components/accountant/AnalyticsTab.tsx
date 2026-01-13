import React, { memo, useMemo } from 'react';

interface MockDocument {
  _id: string;
  type: string;
  [key: string]: any;
}

interface AccountantStats {
  activeClients: number;
  totalDocuments: number;
  pendingTasks: number;
  monthlyRevenue: number;
  urgentAlerts: number;
  completedTasks: number;
}

interface AnalyticsTabProps {
  stats: AccountantStats;
  documents: MockDocument[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = memo(({ stats, documents }) => {
  const documentsByType = useMemo(() => {
    return documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [documents]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques clients</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total des clients:</span>
            <span className="font-medium">{stats.activeClients}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Documents traités:</span>
            <span className="font-medium text-green-600">{stats.completedTasks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">En cours de traitement:</span>
            <span className="font-medium text-blue-600">{stats.pendingTasks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chiffre d'affaires mensuel:</span>
            <span className="font-medium text-purple-600">{stats.monthlyRevenue.toLocaleString()}€</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par type de document</h3>
        <div className="space-y-2">
          {Object.entries(documentsByType).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-gray-600 capitalize">{type.replace('-', ' ')}:</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-gray-500 text-center">Aucun document disponible</p>
          )}
        </div>
      </div>
    </div>
  );
});

AnalyticsTab.displayName = 'AnalyticsTab';

export default AnalyticsTab;
