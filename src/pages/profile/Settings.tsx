import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save,
  Bell,
  Shield,
  Globe,
  Palette,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { navigateTo } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Utilisation des vraies données utilisateur et store
  const { user } = useAuthStore();
  const { setLanguage, setCurrency, setTheme, language, currency, theme } = useAppStore();
  
  // Paramètres utilisateur réels basés sur les données connectées
  const [userSettings, setUserSettings] = useState({
    profile: {
      name: 'Utilisateur Demo',
      email: 'demo@restauconnect.fr',
      phone: '+33 6 12 34 56 78',
      address: '123 Rue de la Paix, 75001 Paris',
      bio: 'Passionné de restauration et d\'innovation culinaire'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      phoneVisible: false,
      emailVisible: true
    },
    appearance: {
      theme: 'light',
      language: 'fr',
      timezone: 'Europe/Paris'
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette }
  ];

  const handleSave = () => {
    toast.success('Paramètres sauvegardés avec succès !');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-orange-600" />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{userSettings.profile.name}</h3>
          <p className="text-gray-600">Membre depuis janvier 2024</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-2" />
            Nom complet
          </label>
          <input
            type="text"
            value={userSettings.profile.name}
            onChange={(e) => setUserSettings({...userSettings, profile: {...userSettings.profile, name: e.target.value}})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-2" />
            Email
          </label>
          <input
            type="email"
            value={userSettings.profile.email}
            onChange={(e) => setUserSettings({...userSettings, profile: {...userSettings.profile, email: e.target.value}})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-2" />
            Téléphone
          </label>
          <input
            type="tel"
            value={userSettings.profile.phone}
            onChange={(e) => setUserSettings({...userSettings, profile: {...userSettings.profile, phone: e.target.value}})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-2" />
            Adresse
          </label>
          <input
            type="text"
            value={userSettings.profile.address}
            onChange={(e) => setUserSettings({...userSettings, profile: {...userSettings.profile, address: e.target.value}})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={userSettings.profile.bio}
          onChange={(e) => setUserSettings({...userSettings, profile: {...userSettings.profile, bio: e.target.value}})}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Notifications par email</h4>
              <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userSettings.notifications.email}
              onChange={(e) => setUserSettings({
                ...userSettings, 
                notifications: {...userSettings.notifications, email: e.target.checked}
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-5 w-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Notifications push</h4>
              <p className="text-sm text-gray-600">Recevoir les notifications sur votre appareil</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userSettings.notifications.push}
              onChange={(e) => setUserSettings({
                ...userSettings, 
                notifications: {...userSettings.notifications, push: e.target.checked}
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Profil visible</h4>
            <p className="text-sm text-gray-600">Permettre aux autres utilisateurs de voir votre profil</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userSettings.privacy.profileVisible}
              onChange={(e) => setUserSettings({
                ...userSettings, 
                privacy: {...userSettings.privacy, profileVisible: e.target.checked}
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="inline h-4 w-4 mr-2" />
          Langue
        </label>
        <select 
          value={userSettings.appearance.language}
          onChange={(e) => setUserSettings({
            ...userSettings, 
            appearance: {...userSettings.appearance, language: e.target.value}
          })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette className="inline h-4 w-4 mr-2" />
          Thème
        </label>
        <select 
          value={userSettings.appearance.theme}
          onChange={(e) => setUserSettings({
            ...userSettings, 
            appearance: {...userSettings.appearance, theme: e.target.value}
          })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
          <option value="auto">Automatique</option>
        </select>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      
            <Header currentPage="settings" onNavigate={(page) => navigateTo(page as any)} />

{/* Header de navigation */}
      {/* Header removed - using standalone page */}
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8">
              <h1 className="text-2xl font-bold text-white">Paramètres</h1>
              <p className="text-orange-100 mt-2">Gérez vos préférences et paramètres de compte</p>
            </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-600 border border-orange-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}

                {/* Save button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
