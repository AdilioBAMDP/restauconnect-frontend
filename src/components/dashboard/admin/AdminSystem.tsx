import React, { useState } from 'react';
import { Server, Database, Shield, AlertTriangle, CheckCircle, RefreshCw, Settings } from 'lucide-react';

interface GlobalStats {
  systemHealth?: 'healthy' | 'warning' | 'critical';
  databaseStatus?: 'connected' | 'disconnected';
  apiStatus?: 'online' | 'offline';
  uptime?: number;
  [key: string]: unknown;
}

interface AdminSystemProps {
  globalStats?: GlobalStats;
  [key: string]: unknown;
}

export const AdminSystem: React.FC<AdminSystemProps> = ({ globalStats = {} }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);

  const systemStatus = {
    health: globalStats.systemHealth || 'healthy',
    database: globalStats.databaseStatus || 'connected',
    api: globalStats.apiStatus || 'online',
    uptime: globalStats.uptime || 0
  };

  const handleBackup = () => {
    setBackupInProgress(true);
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
    }, 3000);
  };

  const handleMaintenanceToggle = () => {
    setMaintenanceMode(!maintenanceMode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'online':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'critical':
      case 'disconnected':
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'online':
        return 'bg-green-100';
      case 'warning':
        return 'bg-orange-100';
      case 'critical':
      case 'disconnected':
      case 'offline':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="text-blue-600 w-6 h-6" />
              <h3 className="font-semibold">État du Système</h3>
            </div>
            <div className={`${getStatusBg(systemStatus.health)} px-3 py-1 rounded-full`}>
              <span className={`text-sm font-semibold ${getStatusColor(systemStatus.health)}`}>
                {systemStatus.health === 'healthy' ? 'Sain' : systemStatus.health === 'warning' ? 'Avertissement' : 'Critique'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-semibold">{Math.floor(systemStatus.uptime / 3600)}h</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="text-purple-600 w-6 h-6" />
              <h3 className="font-semibold">Base de Données</h3>
            </div>
            <div className={`${getStatusBg(systemStatus.database)} px-3 py-1 rounded-full`}>
              <span className={`text-sm font-semibold ${getStatusColor(systemStatus.database)}`}>
                {systemStatus.database === 'connected' ? 'Connectée' : 'Déconnectée'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connexions</span>
              <span className="font-semibold">12/50</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="text-green-600 w-6 h-6" />
              <h3 className="font-semibold">API</h3>
            </div>
            <div className={`${getStatusBg(systemStatus.api)} px-3 py-1 rounded-full`}>
              <span className={`text-sm font-semibold ${getStatusColor(systemStatus.api)}`}>
                {systemStatus.api === 'online' ? 'En Ligne' : 'Hors Ligne'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Requêtes/min</span>
              <span className="font-semibold">245</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance & Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="text-orange-600" />
            Mode Maintenance
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Activer le mode maintenance pour effectuer des opérations de maintenance sur la plateforme.
            </p>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Mode Maintenance</p>
                <p className="text-sm text-gray-600">
                  {maintenanceMode ? 'Activé - Les utilisateurs ne peuvent pas accéder' : 'Désactivé - Système en fonctionnement normal'}
                </p>
              </div>
              <button
                onClick={handleMaintenanceToggle}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  maintenanceMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {maintenanceMode ? 'Désactiver' : 'Activer'}
              </button>
            </div>
            {maintenanceMode && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <AlertTriangle className="text-orange-600 w-5 h-5" />
                <p className="text-sm text-orange-700">
                  Mode maintenance actif - Les utilisateurs verront une page de maintenance
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="text-blue-600" />
            Sauvegarde
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Créer une sauvegarde complète de la base de données.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">Dernière sauvegarde</p>
                  <p className="text-sm text-gray-600">Il y a 2 heures</p>
                </div>
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <button
                onClick={handleBackup}
                disabled={backupInProgress}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  backupInProgress
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {backupInProgress ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Sauvegarde en cours...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    Créer une Sauvegarde
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Logs Système Récents</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { time: '10:45:23', level: 'info', message: 'Système démarré avec succès' },
            { time: '10:45:45', level: 'info', message: 'Connexion base de données établie' },
            { time: '10:46:12', level: 'warning', message: 'Utilisation mémoire à 75%' },
            { time: '10:47:03', level: 'info', message: 'API prête à recevoir des requêtes' },
            { time: '10:48:15', level: 'error', message: 'Échec de connexion utilisateur - IP: 192.168.1.100' },
            { time: '10:49:30', level: 'info', message: 'Sauvegarde automatique effectuée' }
          ].map((log, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg text-sm">
              <span className="text-gray-500 font-mono">{log.time}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  log.level === 'error'
                    ? 'bg-red-100 text-red-700'
                    : log.level === 'warning'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {log.level.toUpperCase()}
              </span>
              <span className="text-gray-700">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
