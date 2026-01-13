import React, { memo, useMemo } from 'react';
import { Plus, Upload, Calculator, BarChart3, CheckCircle, Eye } from 'lucide-react';

interface MockDocument {
  _id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

interface MockAlert {
  _id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  isResolved: boolean;
  [key: string]: any;
}

interface DashboardTabProps {
  documents: MockDocument[];
  alerts: MockAlert[];
  onCreateDocument: () => void;
  onResolveAlert: (alertId: string) => void;
  onViewAllDocuments: () => void;
  onViewAllAlerts: () => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

const DashboardTab: React.FC<DashboardTabProps> = memo(({
  documents,
  alerts,
  onCreateDocument,
  onResolveAlert,
  onViewAllDocuments,
  onViewAllAlerts,
  getStatusColor,
  formatDate
}) => {
  const urgentAlerts = useMemo(() => {
    return alerts
      .filter(alert => alert.priority === 'urgent' && !alert.isResolved)
      .slice(0, 5);
  }, [alerts]);

  const recentDocuments = useMemo(() => {
    return documents.slice(0, 5);
  }, [documents]);

  return (
    <div className="space-y-8">
      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={onCreateDocument}
            className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Nouveau document</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Upload className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Importer des fichiers</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Calculator className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium">Calculateur fiscal</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <BarChart3 className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-600 font-medium">Rapport mensuel</span>
          </button>
        </div>
      </div>

      {/* Tâches urgentes et récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertes urgentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Alertes urgentes</h2>
              <button
                onClick={onViewAllAlerts}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {urgentAlerts.map((alert) => (
              <div key={alert._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Échéance: {formatDate(alert.dueDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => onResolveAlert(alert._id)}
                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Résoudre
                  </button>
                </div>
              </div>
            ))}
            {urgentAlerts.length === 0 && (
              <div className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-gray-500">Aucune alerte urgente</p>
              </div>
            )}
          </div>
        </div>

        {/* Documents récents */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Documents récents</h2>
              <button
                onClick={onViewAllDocuments}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentDocuments.map((document) => (
              <div key={document._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {document.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Type: {document.type} • Créé le {formatDate(document.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardTab.displayName = 'DashboardTab';

export default DashboardTab;
