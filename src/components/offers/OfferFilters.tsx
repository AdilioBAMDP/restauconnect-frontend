import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface OfferFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  showZoneFilter?: boolean;
  defaultZone?: 'information-globale' | 'marketplace' | 'all';
}

export interface FilterValues {
  search: string;
  category: string;
  zone?: 'information-globale' | 'marketplace' | 'all';
  urgent?: boolean;
  status?: 'active' | 'closed' | 'expired' | 'all';
}

const OfferFilters: React.FC<OfferFiltersProps> = ({ 
  onFilterChange, 
  showZoneFilter = false,
  defaultZone = 'all'
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    category: '',
    zone: defaultZone,
    urgent: false,
    status: 'all'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'produits', label: 'Produits' },
    { value: 'services', label: 'Services' },
    { value: 'equipement', label: 'Équipement' },
    { value: 'fournisseurs', label: 'Fournisseurs' },
    { value: 'partenariats', label: 'Partenariats' },
    { value: 'financement', label: 'Financement' },
    { value: 'autre', label: 'Autre' }
  ];

  const zones = [
    { value: 'all', label: 'Toutes les zones' },
    { value: 'information-globale', label: 'Informations en temps réel' },
    { value: 'marketplace', label: 'Marketplace' }
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'closed', label: 'Fermé' },
    { value: 'expired', label: 'Expiré' }
  ];

  const handleFilterChange = (
    key: keyof FilterValues, 
    value: string | boolean | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('category', e.target.value);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('zone', e.target.value as FilterValues['zone']);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('status', e.target.value as FilterValues['status']);
  };

  const handleUrgentToggle = () => {
    handleFilterChange('urgent', !filters.urgent);
  };

  const clearFilters = () => {
    const clearedFilters: FilterValues = {
      search: '',
      category: '',
      zone: defaultZone,
      urgent: false,
      status: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.category !== '' || 
    filters.urgent === true || 
    filters.status !== 'all' ||
    (showZoneFilter && filters.zone !== 'all');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Barre de recherche principale */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une offre..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            showAdvanced ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            {/* Zone (si activé) */}
            {showZoneFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zone
                </label>
                <select
                  value={filters.zone}
                  onChange={handleZoneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  {zones.map(zone => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgent uniquement */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.urgent}
                  onChange={handleUrgentToggle}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Urgent uniquement
                </span>
              </label>
            </div>
          </div>

          {/* Bouton effacer les filtres */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferFilters;
