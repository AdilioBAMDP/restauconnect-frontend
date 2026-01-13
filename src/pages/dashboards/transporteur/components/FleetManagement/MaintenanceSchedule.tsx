import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import axios from 'axios';

interface MaintenanceAlert {
  vehicleId: string;
  registrationNumber: string;
  brand: string;
  model: string;
  alertType: 'insurance' | 'technical_control' | 'scheduled_maintenance';
  expiryDate: string;
  daysRemaining: number;
  severity: 'critical' | 'warning' | 'info';
}

const MaintenanceSchedule: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  useEffect(() => {
    loadMaintenanceAlerts();
  }, []);

  const loadMaintenanceAlerts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Charger tous les véhicules
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const vehicles = response.data.vehicles || [];
      const alertsList: MaintenanceAlert[] = [];
      
      // Générer les alertes pour chaque véhicule
      vehicles.forEach((vehicle: any) => {
        const today = new Date();
        
        // Alerte assurance
        if (vehicle.insuranceExpiry) {
          const expiryDate = new Date(vehicle.insuranceExpiry);
          const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysRemaining <= 30) {
            alertsList.push({
              vehicleId: vehicle._id,
              registrationNumber: vehicle.registrationNumber,
              brand: vehicle.brand,
              model: vehicle.model,
              alertType: 'insurance',
              expiryDate: vehicle.insuranceExpiry,
              daysRemaining,
              severity: daysRemaining <= 0 ? 'critical' : daysRemaining <= 7 ? 'warning' : 'info'
            });
          }
        }
        
        // Alerte contrôle technique
        if (vehicle.technicalControlExpiry) {
          const expiryDate = new Date(vehicle.technicalControlExpiry);
          const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysRemaining <= 30) {
            alertsList.push({
              vehicleId: vehicle._id,
              registrationNumber: vehicle.registrationNumber,
              brand: vehicle.brand,
              model: vehicle.model,
              alertType: 'technical_control',
              expiryDate: vehicle.technicalControlExpiry,
              daysRemaining,
              severity: daysRemaining <= 0 ? 'critical' : daysRemaining <= 7 ? 'warning' : 'info'
            });
          }
        }
      });
      
      // Trier par criticité puis par date
      alertsList.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        if (a.severity !== b.severity) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return a.daysRemaining - b.daysRemaining;
      });
      
      setAlerts(alertsList);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = filterSeverity === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filterSeverity);

  const stats = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'insurance': return 'Assurance';
      case 'technical_control': return 'Contrôle technique';
      case 'scheduled_maintenance': return 'Maintenance planifiée';
      default: return type;
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default: return <Wrench className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertBgColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getDaysRemainingText = (days: number) => {
    if (days <= 0) return `Expiré depuis ${Math.abs(days)} jour(s)`;
    if (days === 1) return 'Expire demain';
    return `Expire dans ${days} jour(s)`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Planning Maintenance</h2>
        <p className="text-gray-600 mt-1">Alertes et échéances à surveiller</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-red-700">Critique</p>
              <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-orange-700">Attention</p>
              <p className="text-3xl font-bold text-orange-600">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700">À surveiller</p>
              <p className="text-3xl font-bold text-blue-600">{stats.info}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-700">Filtrer par criticité:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les alertes</option>
            <option value="critical">Critiques seulement</option>
            <option value="warning">Attention seulement</option>
            <option value="info">À surveiller</option>
          </select>
        </div>
      </div>

      {/* Liste des alertes */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium text-lg">Aucune alerte</p>
          <p className="text-gray-600 mt-2">Tous vos véhicules sont à jour !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => (
            <div
              key={`${alert.vehicleId}-${alert.alertType}-${index}`}
              className={`${getAlertBgColor(alert.severity)} border-2 rounded-lg p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.severity)}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{alert.registrationNumber}</h3>
                      <span className="text-sm text-gray-600">
                        {alert.brand} {alert.model}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {getAlertTypeLabel(alert.alertType)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Date d'expiration: {new Date(alert.expiryDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    alert.severity === 'critical' ? 'bg-red-600 text-white' :
                    alert.severity === 'warning' ? 'bg-orange-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {getDaysRemainingText(alert.daysRemaining)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            💡 <strong>Conseil:</strong> Planifiez vos renouvellements au moins 15 jours avant l'expiration 
            pour éviter toute immobilisation de véhicule.
          </p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceSchedule;
