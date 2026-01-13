import React, { useState, useEffect } from 'react';
import { Plus, Search, Wrench, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface MaintenanceRecord {
  _id: string;
  vehicleId: string;
  vehicle: {
    registrationNumber: string;
    brand: string;
    model: string;
  };
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost: number;
  mileage: number;
  technician?: string;
  parts: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  notes?: string;
}

const MaintenanceList: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadMaintenanceRecords();
  }, []);

  const loadMaintenanceRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.vehicles || []);
    } catch (error) {
      console.error('Erreur chargement maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      scheduled: { color: 'bg-blue-100 text-blue-700', label: 'Planifiée', icon: '📅' },
      in_progress: { color: 'bg-yellow-100 text-yellow-700', label: 'En cours', icon: '🔧' },
      completed: { color: 'bg-green-100 text-green-700', label: 'Terminée', icon: '✅' },
      cancelled: { color: 'bg-gray-100 text-gray-700', label: 'Annulée', icon: '❌' }
    };
    return badges[status] || badges.scheduled;
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      preventive: { color: 'bg-green-100 text-green-700 border-green-300', label: 'Préventive' },
      corrective: { color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'Corrective' },
      emergency: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Urgence' }
    };
    return badges[type] || badges.preventive;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: records.length,
    scheduled: records.filter(r => r.status === 'scheduled').length,
    inProgress: records.filter(r => r.status === 'in_progress').length,
    totalCost: records.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.cost, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historique Maintenance</h2>
          <p className="text-gray-600 mt-1">Suivi des interventions sur votre flotte</p>
        </div>
        <button
          onClick={() => alert('Planifier maintenance à implémenter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Planifier maintenance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total interventions</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-blue-700">Planifiées</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-yellow-700">En cours</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-purple-700">Coûts totaux</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalCost.toLocaleString()}€</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (véhicule, description)..."
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
            <option value="scheduled">Planifiée</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="preventive">Préventive</option>
            <option value="corrective">Corrective</option>
            <option value="emergency">Urgence</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Aucune intervention trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const statusBadge = getStatusBadge(record.status);
            const typeBadge = getTypeBadge(record.type);
            
            return (
              <div key={record._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {record.vehicle.registrationNumber} - {record.vehicle.brand} {record.vehicle.model}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon} {statusBadge.label}
                      </span>
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${typeBadge.color}`}>
                        {typeBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{record.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">{record.cost.toLocaleString()}€</p>
                    <p className="text-xs text-gray-500">Coût total</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="text-xs text-gray-500">Planifiée le</p>
                      <p className="font-medium">{new Date(record.scheduledDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  {record.completedDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-gray-500">Terminée le</p>
                        <p className="font-medium">{new Date(record.completedDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wrench className="h-4 w-4" />
                    <div>
                      <p className="text-xs text-gray-500">Kilométrage</p>
                      <p className="font-medium">{record.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>

                {/* Pièces */}
                {record.parts.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pièces remplacées</p>
                    <div className="space-y-1">
                      {record.parts.map((part, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{part.name} (x{part.quantity})</span>
                          <span className="font-medium text-gray-900">{part.cost.toLocaleString()}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technicien & Notes */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {record.technician && <span>👨‍🔧 Technicien: {record.technician}</span>}
                  </div>
                  <button
                    onClick={() => alert('Détails maintenance à implémenter')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;
