import React, { useState, useEffect } from 'react';
import { Search, X, Filter, SlidersHorizontal, Calendar, MapPin, Star, Tag } from 'lucide-react';
import { UserRole } from '@/components/types';

// Types pour les filtres
export interface FilterState {
  searchText: string;
  category: string;
  priority?: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  role?: UserRole | 'all';
  verified?: boolean;
  visibility?: 'all' | 'public' | 'professionals' | 'role-specific';
  dateRange?: 'all' | 'today' | 'week' | 'month';
  sortBy: string;
  minLikes?: number;
  minViews?: number;
  location?: string;
}

interface SearchFiltersProps {
  type: 'marketplace' | 'infoglobale';
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  stats?: {
    totalResults: number;
    filteredResults: number;
  };
  availableCategories?: { value: string; label: string; icon?: string }[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  type,
  onFilterChange,
  currentFilters,
  stats,
  availableCategories = []
}) => {
  // États locaux pour les inputs
  const [searchInput, setSearchInput] = useState(currentFilters.searchText || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Catégories par défaut selon le type
  const defaultCategories = type === 'marketplace' ? [
    { value: 'all', label: '📋 Toutes', icon: '📋' },
    { value: 'annonce', label: '📢 Annonce', icon: '📢' },
    { value: 'conseil', label: '💡 Conseil', icon: '💡' },
    { value: 'partenariat', label: '🤝 Partenariat', icon: '🤝' },
    { value: 'offre', label: '🏷️ Offre', icon: '🏷️' },
    { value: 'demande', label: '💬 Demande', icon: '💬' },
    { value: 'actualite', label: '🌐 Actualité', icon: '🌐' }
  ] : [
    { value: 'all', label: '📋 Toutes', icon: '📋' },
    { value: 'promotion', label: '🎉 Promotion', icon: '🎉' },
    { value: 'urgent', label: '🚨 Urgent', icon: '🚨' },
    { value: 'collaboration', label: '🤝 Collaboration', icon: '🤝' },
    { value: 'event', label: '📅 Événement', icon: '📅' },
    { value: 'offer', label: '🎁 Offre', icon: '🎁' },
    { value: 'sponsored', label: '⭐ Sponsorisé', icon: '⭐' }
  ];

  const categories = availableCategories.length > 0 ? availableCategories : defaultCategories;

  // Options de tri selon le type
  const sortOptions = type === 'marketplace' ? [
    { value: 'recent', label: '🕐 Plus récent' },
    { value: 'popular', label: '❤️ Plus populaire' },
    { value: 'trending', label: '📈 Tendance' },
    { value: 'views', label: '👁️ Plus vues' }
  ] : [
    { value: 'recent', label: '🕐 Plus récent' },
    { value: 'priority', label: '⚡ Priorité' },
    { value: 'popular', label: '👁️ Plus vues' },
    { value: 'expiring', label: '⏰ Expire bientôt' }
  ];

  // Priorités pour Info Globale
  const priorityOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'urgent', label: '🚨 Urgent' },
    { value: 'high', label: '🔴 Haute' },
    { value: 'medium', label: '🟠 Moyenne' },
    { value: 'low', label: '🟢 Basse' }
  ];

  // Rôles pour Marketplace
  const roleOptions = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'fournisseur', label: '📦 Fournisseur' },
    { value: 'artisan', label: '🔧 Artisan' },
    { value: 'restaurant', label: '🍽️ Restaurant' },
    { value: 'community_manager', label: '📱 CM' },
    { value: 'banquier', label: '💰 Banquier' },
    { value: 'comptable', label: '📊 Comptable' },
    { value: 'investisseur', label: '💼 Investisseur' },
    { value: 'candidat', label: '👤 Candidat' }
  ];

  // Visibilité pour Marketplace
  const visibilityOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'public', label: '🌍 Public' },
    { value: 'professionals', label: '👔 Professionnels' },
    { value: 'role-specific', label: '🎯 Spécifique' }
  ];

  // Période
  const dateRangeOptions = [
    { value: 'all', label: 'Toute période' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ];

  // Recherche instantanée (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentFilters.searchText) {
        onFilterChange({ ...currentFilters, searchText: searchInput });
      }
    }, 300); // Délai de 300ms pour éviter trop d'appels

    return () => clearTimeout(timer);
  }, [searchInput, currentFilters, onFilterChange]);

  // Handlers
  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...currentFilters, category });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({ ...currentFilters, sortBy });
  };

  const handlePriorityChange = (priority: FilterState['priority']) => {
    onFilterChange({ ...currentFilters, priority });
  };

  const handleRoleChange = (role: FilterState['role']) => {
    onFilterChange({ ...currentFilters, role });
  };

  const handleVisibilityChange = (visibility: FilterState['visibility']) => {
    onFilterChange({ ...currentFilters, visibility });
  };

  const handleDateRangeChange = (dateRange: FilterState['dateRange']) => {
    onFilterChange({ ...currentFilters, dateRange });
  };

  const handleVerifiedChange = (checked: boolean) => {
    onFilterChange({ ...currentFilters, verified: checked });
  };

  const handleLocationChange = (location: string) => {
    onFilterChange({ ...currentFilters, location });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    onFilterChange({
      searchText: '',
      category: 'all',
      priority: 'all',
      role: 'all',
      verified: false,
      visibility: 'all',
      dateRange: 'all',
      sortBy: 'recent',
      minLikes: 0,
      minViews: 0,
      location: ''
    });
  };

  // Compter les filtres actifs
  const activeFiltersCount = [
    currentFilters.searchText && currentFilters.searchText !== '',
    currentFilters.category !== 'all',
    currentFilters.priority && currentFilters.priority !== 'all',
    currentFilters.role && currentFilters.role !== 'all',
    currentFilters.verified === true,
    currentFilters.visibility && currentFilters.visibility !== 'all',
    currentFilters.dateRange && currentFilters.dateRange !== 'all',
    currentFilters.location && currentFilters.location !== ''
  ].filter(Boolean).length;

  return (
    <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 rounded-xl p-4 shadow-md border-2 border-blue-100 mb-4">
      {/* Barre principale de filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Recherche textuelle */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={type === 'marketplace' ? '🔍 Rechercher dans la marketplace...' : '🔍 Rechercher une annonce...'}
              className="w-full pl-10 pr-10 py-2.5 border-2 border-blue-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/80 backdrop-blur-sm text-sm font-medium"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Catégorie */}
        <select
          value={currentFilters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2.5 border-2 border-blue-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/80 backdrop-blur-sm text-sm font-medium cursor-pointer hover:bg-blue-50"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Tri */}
        <select
          value={currentFilters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2.5 border-2 border-blue-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white/80 backdrop-blur-sm text-sm font-medium cursor-pointer hover:bg-blue-50"
        >
          {sortOptions.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>

        {/* Bouton filtres avancés */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            showAdvancedFilters || activeFiltersCount > 0
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-white/80 border-2 border-blue-200 text-gray-700 hover:bg-blue-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Bouton reset */}
        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="px-4 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        )}

        {/* Stats */}
        {stats && stats.filteredResults !== stats.totalResults && (
          <div className="ml-auto px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold border-2 border-blue-300">
            {stats.filteredResults} / {stats.totalResults} résultats
          </div>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t-2 border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Priorité (Info Globale uniquement) */}
            {type === 'infoglobale' && (
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  Priorité
                </label>
                <select
                  value={currentFilters.priority || 'all'}
                  onChange={(e) => handlePriorityChange(e.target.value as FilterState['priority'])}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all text-sm bg-white"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rôle auteur (Marketplace uniquement) */}
            {type === 'marketplace' && (
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Rôle auteur
                </label>
                <select
                  value={currentFilters.role || 'all'}
                  onChange={(e) => handleRoleChange(e.target.value as FilterState['role'])}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all text-sm bg-white"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Visibilité (Marketplace uniquement) */}
            {type === 'marketplace' && (
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Visibilité
                </label>
                <select
                  value={currentFilters.visibility || 'all'}
                  onChange={(e) => handleVisibilityChange(e.target.value as FilterState['visibility'])}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all text-sm bg-white"
                >
                  {visibilityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Période */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Période
              </label>
              <select
                value={currentFilters.dateRange || 'all'}
                onChange={(e) => handleDateRangeChange(e.target.value as FilterState['dateRange'])}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all text-sm bg-white"
              >
                {dateRangeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Localisation */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Localisation
              </label>
              <input
                type="text"
                value={currentFilters.location || ''}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Ville, région..."
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all text-sm bg-white"
              />
            </div>

            {/* Vérifiés uniquement (Marketplace) */}
            {type === 'marketplace' && (
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="verified-filter"
                  checked={currentFilters.verified || false}
                  onChange={(e) => handleVerifiedChange(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-200 cursor-pointer"
                />
                <label htmlFor="verified-filter" className="text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-1">
                  ✅ Vérifiés uniquement
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
