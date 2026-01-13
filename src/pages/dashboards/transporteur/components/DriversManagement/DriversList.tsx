import React, { useState, useEffect } from 'react';
import { Plus, Search, Award, Phone, Calendar, Star } from 'lucide-react';
import axios from 'axios';

interface DriverEmployee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseCategories: string[];
  hireDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  rating?: number;
  totalDeliveries?: number;
}

const DriversList: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error('Erreur chargement chauffeurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      active: { color: 'bg-green-100 text-green-700', label: 'Actif' },
      on_leave: { color: 'bg-orange-100 text-orange-700', label: 'En congé' },
      inactive: { color: 'bg-gray-100 text-gray-700', label: 'Inactif' }
    };
    return badges[status] || badges.inactive;
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining <= 30 && daysRemaining > 0;
  };

  const isLicenseExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    onLeave: drivers.filter(d => d.status === 'on_leave').length,
    licenseExpiring: drivers.filter(d => isLicenseExpiringSoon(d.licenseExpiry)).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Chauffeurs</h2>
          <p className="text-gray-600 mt-1">Gérez vos employés chauffeurs</p>
        </div>
        <button
          onClick={() => alert('Formulaire ajout chauffeur à implémenter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un chauffeur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total chauffeurs</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-green-700">Actifs</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-orange-700">En congé</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{stats.onLeave}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-red-700">Permis à renouveler</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{stats.licenseExpiring}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (nom, email, permis)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="on_leave">En congé</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">Aucun chauffeur trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDrivers.map((driver) => {
            const statusBadge = getStatusBadge(driver.status);
            const licenseExpired = isLicenseExpired(driver.licenseExpiry);
            const licenseExpiring = isLicenseExpiringSoon(driver.licenseExpiry);
            
            return (
              <div key={driver._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {driver.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{driver.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                        {driver.rating && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Star className="h-3 w-3 fill-current" />
                            {driver.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>Permis: {driver.licenseNumber}</span>
                    <span className="text-xs text-gray-500">
                      ({driver.licenseCategories.join(', ')})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Embauché le {new Date(driver.hireDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Alerte permis */}
                {licenseExpired && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-red-900 font-medium">
                      ⚠️ Permis expiré le {new Date(driver.licenseExpiry).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                {!licenseExpired && licenseExpiring && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-orange-900 font-medium">
                      ⏰ Permis expire le {new Date(driver.licenseExpiry).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}

                {/* Stats */}
                {driver.totalDeliveries !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500">Livraisons effectuées</p>
                    <p className="text-2xl font-bold text-gray-900">{driver.totalDeliveries}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => alert('Voir performances à implémenter')}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Performances
                  </button>
                  <button
                    onClick={() => alert('Modifier chauffeur à implémenter')}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Suivi des permis:</strong> Vous recevrez des alertes automatiques 30 jours avant 
          l'expiration des permis de conduire pour éviter toute immobilisation.
        </p>
      </div>
    </div>
  );
};

export default DriversList;
