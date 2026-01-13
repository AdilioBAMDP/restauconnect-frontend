import React, { useState } from 'react';
import { Package, MapPin, Calendar, User, Truck, Plus, Search, Filter } from 'lucide-react';

interface Delivery {
  _id: string;
  referenceNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: number;
  estimatedDuration: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  cargoType: string;
  weight: number;
  assignedDriver?: {
    firstName: string;
    lastName: string;
  };
  assignedVehicle?: {
    registrationNumber: string;
    type: string;
  };
  scheduledDate: string;
}

const DeliveryCard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      _id: '1',
      referenceNumber: 'LIV-2025-001',
      pickupAddress: 'Paris 15ème',
      deliveryAddress: 'Lyon 3ème',
      distance: 465,
      estimatedDuration: 300,
      status: 'assigned',
      priority: 'high',
      cargoType: 'Produits alimentaires',
      weight: 1200,
      assignedDriver: { firstName: 'Jean', lastName: 'Dupont' },
      assignedVehicle: { registrationNumber: 'AB-123-CD', type: 'Frigorifique' },
      scheduledDate: new Date().toISOString()
    },
    {
      _id: '2',
      referenceNumber: 'LIV-2025-002',
      pickupAddress: 'Marseille',
      deliveryAddress: 'Nice',
      distance: 200,
      estimatedDuration: 150,
      status: 'pending',
      priority: 'urgent',
      cargoType: 'Matériel médical',
      weight: 450,
      scheduledDate: new Date(Date.now() + 86400000).toISOString()
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

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
      low: { color: 'bg-green-100 text-green-700', label: 'Basse' },
      normal: { color: 'bg-blue-100 text-blue-700', label: 'Normale' },
      high: { color: 'bg-orange-100 text-orange-700', label: 'Haute' },
      urgent: { color: 'bg-red-100 text-red-700 font-bold', label: 'URGENT' }
    };
    return badges[priority] || badges.normal;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || delivery.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Livraisons</h3>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle livraison
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une livraison..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="assigned">Assignée</option>
          <option value="in_transit">En transit</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toutes priorités</option>
          <option value="low">Basse</option>
          <option value="normal">Normale</option>
          <option value="high">Haute</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Liste des livraisons */}
      {filteredDeliveries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune livraison trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => {
            const statusBadge = getStatusBadge(delivery.status);
            const priorityBadge = getPriorityBadge(delivery.priority);

            return (
              <div key={delivery._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{delivery.referenceNumber}</h4>
                        <p className="text-sm text-gray-600">{delivery.cargoType} • {delivery.weight}kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon} {statusBadge.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Itinéraire */}
                  <div className="mb-4 pl-2 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Enlèvement</p>
                        <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Livraison</p>
                        <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="text-sm font-semibold text-gray-900">{delivery.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Durée estimée</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDuration(delivery.estimatedDuration)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date planifiée</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(delivery.scheduledDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Heure</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(delivery.scheduledDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Assignation */}
                  {delivery.assignedDriver && delivery.assignedVehicle ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {delivery.assignedDriver.firstName} {delivery.assignedDriver.lastName}
                          </p>
                          <p className="text-xs text-gray-600">Chauffeur assigné</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{delivery.assignedVehicle.registrationNumber}</p>
                          <p className="text-xs text-gray-600">{delivery.assignedVehicle.type}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">⚠️ Livraison non assignée</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                  {delivery.status === 'pending' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                      Assigner
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
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

export default DeliveryCard;
