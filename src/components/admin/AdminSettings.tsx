import { useState } from 'react';
import { Settings, Save, RotateCcw, Shield, DollarSign, Mail, Users, AlertTriangle } from 'lucide-react';

interface PlatformSettings {
  commission: {
    rate: number; // Pourcentage de commission
    minimumAmount: number; // Montant minimum pour commission
  };
  moderation: {
    autoApprove: boolean; // Auto-approbation des messages
    flagThreshold: number; // Seuil de signalements avant action
    ratingThreshold: number; // Rating minimum acceptable
  };
  notifications: {
    emailEnabled: boolean;
    adminEmail: string;
    dailyReports: boolean;
    instantAlerts: boolean;
  };
  users: {
    autoVerification: boolean; // Vérification automatique
    maxApplicationsPerDay: number;
    suspensionDuration: number; // En jours
  };
  platform: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxUsers: number;
  };
}

export default function AdminSettings() {
  const [showSettings, setShowSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Paramètres par défaut (normalement stockés en base)
  const [settings, setSettings] = useState<PlatformSettings>({
    commission: {
      rate: 15, // 15% de commission
      minimumAmount: 50
    },
    moderation: {
      autoApprove: false,
      flagThreshold: 3,
      ratingThreshold: 2.0
    },
    notifications: {
      emailEnabled: true,
      adminEmail: 'admin@restauconnect.fr',
      dailyReports: true,
      instantAlerts: true
    },
    users: {
      autoVerification: false,
      maxApplicationsPerDay: 10,
      suspensionDuration: 7
    },
    platform: {
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsers: 10000
    }
  });

  const [originalSettings] = useState<PlatformSettings>({ ...settings });

  const updateSetting = (category: keyof PlatformSettings, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Dans un vrai système, cela ferait un appel API
    // Simulation de sauvegarde
    alert('Paramètres sauvegardés avec succès !');
    setHasChanges(false);
    
    // Fermer le panneau
    setShowSettings(false);
  };

  const resetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir rétablir les paramètres par défaut ?')) {
      setSettings({ ...originalSettings });
      setHasChanges(true);
    }
  };

  if (!showSettings) {
    return (
      <button
        onClick={() => setShowSettings(true)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Paramètres de la plateforme"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Paramètres de la Plateforme</h2>
            <p className="text-sm text-gray-600 mt-1">Configuration globale de RestauConnect</p>
          </div>
          <div className="flex space-x-2">
            {hasChanges && (
              <>
                <button
                  onClick={resetSettings}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Réinitialiser
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Sauvegarder
                </button>
              </>
            )}
            <button
              onClick={() => setShowSettings(false)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Commission */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Commission & Revenus</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de Commission (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settings.commission.rate}
                    onChange={(e) => updateSetting('commission', 'rate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Commission prélevée sur chaque transaction réussie
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant Minimum (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.commission.minimumAmount}
                    onChange={(e) => updateSetting('commission', 'minimumAmount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Modération */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Modération</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto-approbation des messages
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.moderation.autoApprove}
                    onChange={(e) => updateSetting('moderation', 'autoApprove', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seuil de Signalements
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.moderation.flagThreshold}
                    onChange={(e) => updateSetting('moderation', 'flagThreshold', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating Minimum Acceptable
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={settings.moderation.ratingThreshold}
                    onChange={(e) => updateSetting('moderation', 'ratingThreshold', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Notifications Email
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) => updateSetting('notifications', 'emailEnabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Admin
                  </label>
                  <input
                    type="email"
                    value={settings.notifications.adminEmail}
                    onChange={(e) => updateSetting('notifications', 'adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Rapports Quotidiens
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.dailyReports}
                    onChange={(e) => updateSetting('notifications', 'dailyReports', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Alertes Instantanées
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.instantAlerts}
                    onChange={(e) => updateSetting('notifications', 'instantAlerts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Gestion Utilisateurs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Gestion Utilisateurs</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Vérification Automatique
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.users.autoVerification}
                    onChange={(e) => updateSetting('users', 'autoVerification', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Candidatures/Jour
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.users.maxApplicationsPerDay}
                    onChange={(e) => updateSetting('users', 'maxApplicationsPerDay', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée Suspension (jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.users.suspensionDuration}
                    onChange={(e) => updateSetting('users', 'suspensionDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Plateforme */}
            <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Paramètres Plateforme</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Mode Maintenance
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.platform.maintenanceMode}
                    onChange={(e) => updateSetting('platform', 'maintenanceMode', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Inscriptions Ouvertes
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.platform.registrationEnabled}
                    onChange={(e) => updateSetting('platform', 'registrationEnabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Utilisateurs
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={settings.platform.maxUsers}
                    onChange={(e) => updateSetting('platform', 'maxUsers', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu des impacts */}
          {hasChanges && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Aperçu des Changements</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Commission: {settings.commission.rate}% sur les transactions</p>
                <p>• Seuil modération: {settings.moderation.flagThreshold} signalements</p>
                <p>• Email admin: {settings.notifications.adminEmail}</p>
                <p>• Limite candidatures: {settings.users.maxApplicationsPerDay}/jour</p>
                {settings.platform.maintenanceMode && (
                  <p className="text-red-600 font-medium">⚠️ Mode maintenance activé</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
