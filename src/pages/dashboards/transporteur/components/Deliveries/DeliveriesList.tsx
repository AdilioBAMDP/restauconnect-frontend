import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, MapPin, Clock, User } from 'lucide-react';
import axios from 'axios';

interface Delivery {
  _id: string;
  deliveryNumber: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  pickupAddress: string;
  deliveryAddress: string;
  scheduledDate: string;
  estimatedDuration: number;
  distance: number;
  driver?: {
    name: string;
    phone: string;
  };
  vehicle?: {
    registrationNumber: string;
    type: string;
  };
  cargo: {
    description: string;
    weight: number;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

const DeliveriesList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/deliveries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error('Erreur chargement livraisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      pending: { color: 'bg-gray-100 text-gray-700', label: 'En attente', icon: '⏳' },
      assigned: { color: 'bg-blue-100 text-blue-700', label: 'Assignée', icon: '👤' },
      in_transit: { color: 'bg-yellow-100 text-yellow-700', label: 'En transit', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-700', label: 'Livrée', icon: '✅' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Annulée', icon: '❌' }
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      low: { color: 'bg-green-100 text-green-700 border-green-300', label: 'Basse' },
      normal: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Normale' },
      high: { color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'Haute' },
      urgent: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Urgente' }
    };
    return badges[priority] || badges.normal;
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          delivery.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || delivery.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Livraisons</h2>
          <p className="text-gray-600 mt-1">Planifiez et suivez vos livraisons</p>
        </div>
        <button
          onClick={() => alert('Formulaire création livraison à implémenter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nouvelle livraison
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total livraisons</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-700">En attente</p>
          <p className="text-3xl font-bold text-gray-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-yellow-700">En transit</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.inTransit}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-green-700">Livrées</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.delivered}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (numéro, adresse)..."
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
            <option value="pending">En attente</option>
            <option value="assigned">Assignée</option>
            <option value="in_transit">En transit</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="normal">Normale</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Aucune livraison trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => {
            const statusBadge = getStatusBadge(delivery.status);
            const priorityBadge = getPriorityBadge(delivery.priority);
            
            return (
              <div key={delivery._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{delivery.deliveryNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon} {statusBadge.label}
                      </span>
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{delivery.cargo.description} - {delivery.cargo.weight}kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Planifiée le</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(delivery.scheduledDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Enlèvement</p>
                      <p className="text-sm text-gray-900">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Livraison</p>
                      <p className="text-sm text-gray-900">{delivery.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{delivery.estimatedDuration}h estimé</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{delivery.distance}km</span>
                  </div>
                  {delivery.driver && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{delivery.driver.name}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => alert('Assigner livraison à implémenter')}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Assigner
                  </button>
                  <button
                    onClick={() => alert('Suivi en temps réel à implémenter')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Suivre
                  </button>
                  <button
                    onClick={() => alert('Détails livraison à implémenter')}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Détails
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

export default DeliveriesList;
