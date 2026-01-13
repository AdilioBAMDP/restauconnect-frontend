/**
 * USER DIRECTORY - Répertoire utilisateurs pour messagerie
 * 
 * Permet de :
 * - Filtrer utilisateurs par zone géographique (pays, région, ville, rayon KM)
 * - Filtrer par rôle
 * - Rechercher par nom
 * - Démarrer une conversation
 */

import React, { useEffect } from 'react';
import { useUserDirectoryStore } from '@/stores/userDirectoryStore';
import { Search, MapPin, Users, MessageSquare } from 'lucide-react';

interface UserDirectoryProps {
  onSelectUser: (userId: string, userName: string) => void;
}

// Fonction pour obtenir la couleur du rôle (même logique que ConversationList)
const getRoleColor = (role: string): string => {
  const colors: { [key: string]: string } = {
    restaurant: 'bg-orange-100 text-orange-700',
    fournisseur: 'bg-blue-100 text-blue-700',
    artisan: 'bg-purple-100 text-purple-700',
    livreur: 'bg-green-100 text-green-700',
    banquier: 'bg-yellow-100 text-yellow-700',
    investisseur: 'bg-pink-100 text-pink-700',
    comptable: 'bg-gray-100 text-gray-700'
  };
  return colors[role] || 'bg-gray-100 text-gray-700';
};

// Fonction pour obtenir l'initiale pour avatar
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function UserDirectory({ onSelectUser }: UserDirectoryProps) {
  const {
    users,
    isLoading,
    error,
    filters,
    fetchUsers,
    setFilters,
    clearFilters,
    clearError
  } = useUserDirectoryStore();

  // Charger les utilisateurs au montage
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex flex-col h-full">
      
      {/* Header avec filtres */}
      <div className="p-4 border-b bg-gray-50">
        
        {/* Titre */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Répertoire des partenaires
            </h2>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Réinitialiser filtres
          </button>
        </div>

        {/* Recherche */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Filtres géographiques */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          
          {/* Pays */}
          <select
            value={filters.country}
            onChange={(e) => setFilters({ country: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          >
            <option value="">Tous les pays</option>
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Luxembourg">Luxembourg</option>
          </select>

          {/* Région */}
          <select
            value={filters.region}
            onChange={(e) => setFilters({ region: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          >
            <option value="">Toutes les régions</option>
            <option value="Île-de-France">Île-de-France</option>
            <option value="Provence-Alpes-Côte d'Azur">PACA</option>
            <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
            <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
            <option value="Occitanie">Occitanie</option>
            <option value="Grand Est">Grand Est</option>
            <option value="Hauts-de-France">Hauts-de-France</option>
            <option value="Normandie">Normandie</option>
            <option value="Bretagne">Bretagne</option>
            <option value="Pays de la Loire">Pays de la Loire</option>
            <option value="Centre-Val de Loire">Centre-Val de Loire</option>
            <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
            <option value="Corse">Corse</option>
          </select>

          {/* Ville */}
          <input
            type="text"
            placeholder="Ville..."
            value={filters.city}
            onChange={(e) => setFilters({ city: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />

          {/* Rayon KM */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Rayon (km)"
              value={filters.radius || ''}
              onChange={(e) => setFilters({ radius: Number(e.target.value) || 0 })}
              min="0"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
            <span className="text-xs text-gray-500">km</span>
          </div>
        </div>

        {/* Filtre rôle */}
        <select
          value={filters.role}
          onChange={(e) => setFilters({ role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        >
          <option value="all">Tous les rôles</option>
          <option value="restaurant">🏪 Restaurants</option>
          <option value="fournisseur">📦 Fournisseurs</option>
          <option value="artisan">🔧 Artisans</option>
          <option value="livreur">🚚 Livreurs</option>
          <option value="banquier">💰 Banquiers</option>
          <option value="investisseur">💼 Investisseurs</option>
          <option value="comptable">📊 Comptables</option>
          <option value="accountant">📊 Comptables (Accountant)</option>
          <option value="legal_advisor">⚖️ Conseillers Juridiques</option>
          <option value="insurance_broker">🛡️ Courtiers Assurance</option>
          <option value="credit_manager">💳 Gestionnaires Crédit</option>
          <option value="community_manager">📱 Community Managers</option>
          <option value="partnership_manager">🤝 Gestionnaires Partenariats</option>
        </select>

        {/* Compteur résultats */}
        {!isLoading && (
          <div className="mt-3 text-sm text-gray-600">
            {users.length} partenaire{users.length > 1 ? 's' : ''} trouvé{users.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Liste utilisateurs */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Chargement...</p>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => { clearError(); fetchUsers(); }}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Liste */}
        {!isLoading && !error && (
          <div className="divide-y">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <Users className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-center">Aucun partenaire trouvé</p>
                <p className="text-sm text-center mt-2">Essayez de modifier les filtres</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => onSelectUser(user._id, user.name)}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {getInitials(user.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        {user.verified && (
                          <span className="text-green-500" title="Vérifié">✓</span>
                        )}
                      </div>

                      {/* Rôle */}
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>

                      {/* Localisation */}
                      {user.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">
                            {user.location.city}
                            {user.location.region && `, ${user.location.region}`}
                            {user.location.country && user.location.country !== 'France' && ` (${user.location.country})`}
                          </span>
                        </div>
                      )}

                      {/* Nom entreprise */}
                      {user.companyName && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {user.companyName}
                        </p>
                      )}
                    </div>

                    {/* Bouton Message */}
                    <button
                      className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5 text-sm opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUser(user._id, user.name);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
