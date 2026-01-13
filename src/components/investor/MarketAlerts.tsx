import React from 'react';
import { Bell } from 'lucide-react';
import { MarketAlert } from '@/types/investor.types';

interface MarketAlertsProps {
  alerts: MarketAlert[];
  onAlertClick?: (alertType: string) => void;
}

const MarketAlerts: React.FC<MarketAlertsProps> = ({ alerts, onAlertClick }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Bell className="h-5 w-5 text-amber-600 mr-2" />
        <h3 className="text-lg font-medium text-amber-800">Alertes du Marché</h3>
        <span className="ml-auto text-sm text-amber-600">Temps réel</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            onClick={() => onAlertClick?.('marketplace')}
            className="bg-white rounded-lg p-3 border border-amber-200 cursor-pointer transition-all hover:border-amber-400 hover:shadow-md"
            title="Cliquer pour voir les opportunités"
          >
            <div className="flex items-center mb-2">
              <div className={`w-2 h-2 ${getSeverityColor(alert.severity)} rounded-full mr-2`}></div>
              <span className="text-sm font-medium text-gray-700">{alert.title}</span>
            </div>
            <p className="text-xs text-gray-600">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketAlerts;