import React, { useState } from 'react';
import { User, Mail, Phone, Building, MapPin, Shield, Calendar } from 'lucide-react';
import ChangePasswordForm from '../common/ChangePasswordForm';

interface UserProfileSettingsProps {
  user?: {
    username?: string;
    email?: string;
    role?: string;
    phone?: string;
    companyName?: string;
    location?: string | { city?: string; address?: string };
    createdAt?: string;
  };
}

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  const roleLabels: Record<string, string> = {
    restaurant: '🍽️ Restaurant',
    artisan: '🔧 Artisan',
    fournisseur: '📦 Fournisseur',
    candidat: '👤 Candidat',
    community_manager: '📢 Community Manager',
    banquier: '🏦 Banquier',
    investisseur: '💼 Investisseur',
    comptable: '📊 Comptable',
    livreur: '🚗 Livreur',
    admin: '🛡️ Admin',
    super_admin: '⚡ Super Admin'
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getLocationText = (location?: string | { city?: string; address?: string }) => {
    if (!location) return 'Non renseignée';
    if (typeof location === 'string') return location;
    return `${location.city || ''} ${location.address || ''}`.trim() || 'Non renseignée';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username || 'Utilisateur'}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {roleLabels[user?.role || ''] || user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Informations personnelles
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5 inline mr-2" />
              Sécurité
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Vos informations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user?.email || 'Non renseigné'}</p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  {user?.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Entreprise */}
                  {user?.companyName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Entreprise</p>
                        <p className="font-medium text-gray-900">{user.companyName}</p>
                      </div>
                    </div>
                  )}

                  {/* Localisation */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Localisation</p>
                      <p className="font-medium text-gray-900">{getLocationText(user?.location)}</p>
                    </div>
                  </div>

                  {/* Date de création */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Membre depuis</p>
                      <p className="font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>ℹ️ Modification du profil :</strong> Pour modifier vos informations personnelles, 
                    contactez un administrateur ou utilisez la section dédiée de votre dashboard.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Changer votre mot de passe</h2>
                <ChangePasswordForm 
                  onSuccess={() => {
                    // Optionnel: rediriger ou afficher un message
                  }}
                  standalone={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;
