import React, { useState } from 'react';
import MobileDownloadManager from './MobileDownloadManager';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    maxFileSize: number;
    sessionTimeout: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    passwordMinLength: number;
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
    loginAttempts: number;
    lockoutDuration: number;
  };
  features: {
    enableNotifications: boolean;
    enableFileUpload: boolean;
    enableGeolocation: boolean;
    enableAnalytics: boolean;
    enableChat: boolean;
  };
  limits: {
    maxUsersPerRole: { [key: string]: number };
    dailyMessageLimit: number;
    storageQuota: number;
  };
}

const AdminSystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'security' | 'features' | 'limits' | 'mobile'>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'RestauConnect',
      siteDescription: 'Plateforme de mise en relation pour l\'industrie de la restauration',
      maintenanceMode: false,
      allowRegistrations: true,
      maxFileSize: 10, // MB
      sessionTimeout: 60 // minutes
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@restauconnect.com',
      smtpPassword: '••••••••',
      fromEmail: 'noreply@restauconnect.com',
      fromName: 'RestauConnect'
    },
    security: {
      passwordMinLength: 8,
      requireEmailVerification: true,
      enableTwoFactor: false,
      loginAttempts: 5,
      lockoutDuration: 15 // minutes
    },
    features: {
      enableNotifications: true,
      enableFileUpload: true,
      enableGeolocation: true,
      enableAnalytics: true,
      enableChat: true
    },
    limits: {
      maxUsersPerRole: {
        restaurant: 1000,
        artisan: 1000,
        fournisseur: 500,
        candidat: 2000,
        community_manager: 10,
        banquier: 50
      },
      dailyMessageLimit: 100,
      storageQuota: 1000 // GB
    }
  });

  const updateConfig = (section: keyof SystemConfig, field: string, value: unknown) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedConfig = (section: keyof SystemConfig, parentField: string, field: string, value: unknown) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const sectionConfig = newConfig[section] as unknown as Record<string, Record<string, unknown>>;
      sectionConfig[parentField] = {
        ...((prev[section] as unknown as Record<string, Record<string, unknown>>)[parentField] || {}),
        [field]: value
      };
      return newConfig;
    });
    setHasChanges(true);
  };

  const saveConfig = () => {
    // Simulation de sauvegarde
    setHasChanges(false);
    
    // Simulation d'une notification de succès
    alert('Configuration sauvegardée avec succès !');
  };

  const resetConfig = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?')) {
      // Ici on pourrait recharger la config par défaut
      setHasChanges(false);
      alert('Configuration réinitialisée !');
    }
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `restauconnect-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const tabs = [
    { key: 'general', label: 'Général', icon: '⚙️' },
    { key: 'email', label: 'Email', icon: '📧' },
    { key: 'security', label: 'Sécurité', icon: '🔒' },
    { key: 'features', label: 'Fonctionnalités', icon: '🚀' },
    { key: 'limits', label: 'Limites', icon: '📊' },
    { key: 'mobile', label: 'Apps Mobiles', icon: '📱' }
  ] as const;

  const renderGeneralConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
          <input
            type="text"
            value={config.general.siteName}
            onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeout de session (minutes)</label>
          <input
            type="number"
            value={config.general.sessionTimeout}
            onChange={(e) => updateConfig('general', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
        <textarea
          value={config.general.siteDescription}
          onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taille max des fichiers (MB)</label>
          <input
            type="number"
            value={config.general.maxFileSize}
            onChange={(e) => updateConfig('general', 'maxFileSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={config.general.maintenanceMode}
            onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
            Mode maintenance (le site sera inaccessible aux utilisateurs)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRegistrations"
            checked={config.general.allowRegistrations}
            onChange={(e) => updateConfig('general', 'allowRegistrations', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="allowRegistrations" className="ml-2 block text-sm text-gray-700">
            Autoriser les nouvelles inscriptions
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Serveur SMTP</label>
          <input
            type="text"
            value={config.email.smtpHost}
            onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Port SMTP</label>
          <input
            type="number"
            value={config.email.smtpPort}
            onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur SMTP</label>
          <input
            type="email"
            value={config.email.smtpUser}
            onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe SMTP</label>
          <input
            type="password"
            value={config.email.smtpPassword}
            onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email expéditeur</label>
          <input
            type="email"
            value={config.email.fromEmail}
            onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom expéditeur</label>
          <input
            type="text"
            value={config.email.fromName}
            onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Longueur min. mot de passe</label>
          <input
            type="number"
            value={config.security.passwordMinLength}
            onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tentatives de connexion max</label>
          <input
            type="number"
            value={config.security.loginAttempts}
            onChange={(e) => updateConfig('security', 'loginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Durée de blocage (min)</label>
          <input
            type="number"
            value={config.security.lockoutDuration}
            onChange={(e) => updateConfig('security', 'lockoutDuration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireEmailVerification"
            checked={config.security.requireEmailVerification}
            onChange={(e) => updateConfig('security', 'requireEmailVerification', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-700">
            Vérification email obligatoire
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableTwoFactor"
            checked={config.security.enableTwoFactor}
            onChange={(e) => updateConfig('security', 'enableTwoFactor', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-700">
            Authentification à deux facteurs
          </label>
        </div>
      </div>
    </div>
  );

  const renderFeaturesConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(config.features).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                {key === 'enableNotifications' && 'Notifications'}
                {key === 'enableFileUpload' && 'Upload de fichiers'}
                {key === 'enableGeolocation' && 'Géolocalisation'}
                {key === 'enableAnalytics' && 'Analytics'}
                {key === 'enableChat' && 'Chat en temps réel'}
              </h4>
              <p className="text-sm text-gray-500">
                {key === 'enableNotifications' && 'Notifications push et email'}
                {key === 'enableFileUpload' && 'Upload d\'images et documents'}
                {key === 'enableGeolocation' && 'Recherche par localisation'}
                {key === 'enableAnalytics' && 'Suivi des statistiques'}
                {key === 'enableChat' && 'Messagerie instantanée'}
              </p>
            </div>
            <div className="ml-4">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateConfig('features', key, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLimitsConfig = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Limites par rôle d'utilisateur</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(config.limits.maxUsersPerRole).map(([role, limit]) => (
            <div key={role} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 capitalize">{role}</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => updateNestedConfig('limits', 'maxUsersPerRole', role, parseInt(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Messages par jour (par utilisateur)</label>
          <input
            type="number"
            value={config.limits.dailyMessageLimit}
            onChange={(e) => updateConfig('limits', 'dailyMessageLimit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quota de stockage total (GB)</label>
          <input
            type="number"
            value={config.limits.storageQuota}
            onChange={(e) => updateConfig('limits', 'storageQuota', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'email': return renderEmailConfig();
      case 'security': return renderSecurityConfig();
      case 'features': return renderFeaturesConfig();
      case 'limits': return renderLimitsConfig();
      case 'mobile': return <MobileDownloadManager userRole="super_admin" />;
      default: return renderGeneralConfig();
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configuration système</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez les paramètres globaux de l'application</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 font-medium">● Modifications non sauvegardées</span>
          )}
          <button 
            onClick={exportConfig}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>📤</span>
            <span>Exporter</span>
          </button>
          <button 
            onClick={resetConfig}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>
          <button 
            onClick={saveConfig}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              hasChanges 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>💾</span>
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu de configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminSystemConfig;
