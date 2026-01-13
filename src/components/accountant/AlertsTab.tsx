import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';

interface MockAlert {
  _id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AlertsTabProps {
  alerts: MockAlert[];
  searchTerm: string;
  alertFilter: string;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: string) => void;
  onResolveAlert: (alertId: string) => void;
  onRefresh: () => void;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
}

const AlertsTab: React.FC<AlertsTabProps> = memo(({
  alerts,
  searchTerm,
  alertFilter,
  onSearchChange,
  onFilterChange,
  onResolveAlert,
  onRefresh,
  getPriorityColor,
  formatDate
}) => {
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = alertFilter === 'all' || 
                           (alertFilter === 'urgent' && alert.priority === 'urgent') ||
                           (alertFilter === 'unresolved' && !alert.isResolved);
      return matchesSearch && matchesFilter;
    });
  }, [alerts, searchTerm, alertFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Alertes fiscales</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une alerte..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={alertFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les alertes</option>
            <option value="urgent">Urgentes uniquement</option>
            <option value="unresolved">Non résolues</option>
          </select>

          <button
            onClick={onRefresh}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <motion.div
            key={alert._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              alert.priority === 'urgent' ? 'border-l-red-500' : 
              alert.priority === 'high' ? 'border-l-orange-500' : 'border-l-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.priority === 'urgent' ? 'text-red-600' : 
                    alert.priority === 'high' ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                  <h3 className="text-lg font-medium text-gray-900">
                    {alert.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                  {alert.isResolved && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                      Résolu
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">
                  <strong>Client:</strong> {alert.clientName}
                </p>
                
                <p className="text-gray-700 mb-3">
                  {alert.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Créée le {formatDate(alert.createdAt)}</span>
                  <span className="text-red-600 font-medium">
                    Échéance: {formatDate(alert.dueDate)}
                  </span>
                </div>
              </div>
              
              {!alert.isResolved && (
                <div className="ml-6 flex space-x-2">
                  <button
                    onClick={() => onResolveAlert(alert._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Résoudre
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

AlertsTab.displayName = 'AlertsTab';

export default AlertsTab;
