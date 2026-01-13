import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, MapPin, User } from 'lucide-react';

interface Delivery {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  phone: string;
  packages: number;
  status: 'pending' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';
  pickupTime: string;
  deliveryTime?: string;
  estimatedTime: string;
  distance: number;
  earnings: number;
  tip?: number;
  notes?: string;
}

const DriverDeliveriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [deliveries] = useState<Delivery[]>([
    {
      id: 'DEL-001',
      orderNumber: 'CMD-2024-001',
      customerName: 'Restaurant Le Gourmet',
      address: '15 Rue de Rivoli, 75001 Paris',
      phone: '+33 1 42 34 56 78',
      packages: 3,
      status: 'delivered',
      pickupTime: '09:00',
      deliveryTime: '09:35',
      estimatedTime: '09:30',
      distance: 4.2,
      earnings: 12,
      tip: 5,
      notes: 'Livraison sans problème'
    },
    {
      id: 'DEL-002',
      orderNumber: 'CMD-2024-002',
      customerName: 'Bistrot Moderne',
      address: '28 Avenue des Champs-Élysées, 75008 Paris',
      phone: '+33 1 48 76 54 32',
      packages: 2,
      status: 'delivered',
      pickupTime: '09:45',
      deliveryTime: '10:18',
      estimatedTime: '10:15',
      distance: 3.8,
      earnings: 10,
      tip: 3
    },
    {
      id: 'DEL-003',
      orderNumber: 'CMD-2024-003',
      customerName: 'Café Parisien',
      address: '45 Rue du Faubourg Saint-Honoré, 75008 Paris',
      phone: '+33 1 42 65 43 21',
      packages: 1,
      status: 'in-transit',
      pickupTime: '10:30',
      estimatedTime: '10:45',
      distance: 2.5,
      earnings: 8
    },
    {
      id: 'DEL-004',
      orderNumber: 'CMD-2024-004',
      customerName: 'Brasserie du Quartier',
      address: '12 Boulevard Saint-Germain, 75005 Paris',
      phone: '+33 1 43 26 78 90',
      packages: 4,
      status: 'picked-up',
      pickupTime: '11:00',
      estimatedTime: '11:20',
      distance: 5.1,
      earnings: 15
    },
    {
      id: 'DEL-005',
      orderNumber: 'CMD-2024-005',
      customerName: 'Pizzeria Napoli',
      address: '67 Rue de la Roquette, 75011 Paris',
      phone: '+33 4 91 12 34 56',
      packages: 2,
      status: 'pending',
      pickupTime: '11:45',
      estimatedTime: '12:00',
      distance: 6.3,
      earnings: 12
    },
    {
      id: 'DEL-006',
      orderNumber: 'CMD-2024-006',
      customerName: 'Boulangerie Bio',
      address: '89 Avenue Parmentier, 75011 Paris',
      phone: '+33 4 76 23 45 67',
      packages: 3,
      status: 'pending',
      pickupTime: '12:15',
      estimatedTime: '12:30',
      distance: 4.7,
      earnings: 11
    },
    {
      id: 'DEL-007',
      orderNumber: 'CMD-2024-007',
      customerName: 'Restaurant Fusion',
      address: '34 Rue Oberkampf, 75011 Paris',
      phone: '+33 1 48 05 67 89',
      packages: 2,
      status: 'failed',
      pickupTime: '08:30',
      deliveryTime: '09:15',
      estimatedTime: '09:00',
      distance: 3.2,
      earnings: 0,
      notes: 'Client absent, pas de réponse'
    }
  ]);

  const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;
  const totalEarnings = deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + d.earnings + (d.tip || 0), 0);
  const inProgress = deliveries.filter(d => d.status === 'in-transit' || d.status === 'picked-up').length;
  const failed = deliveries.filter(d => d.status === 'failed').length;

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'in-transit': return 'text-blue-600 bg-blue-50';
      case 'picked-up': return 'text-purple-600 bg-purple-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in-transit': return <Package className="w-4 h-4" />;
      case 'picked-up': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'in-transit': return 'En transit';
      case 'picked-up': return 'Récupérée';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Mes Livraisons
          </h1>
          <p className="text-gray-600 mt-2">Historique et suivi de vos livraisons</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Livrées</p>
                <p className="text-2xl font-bold text-green-600">{completedDeliveries}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">En Cours</p>
                <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Gains du Jour</p>
                <p className="text-2xl font-bold text-purple-600">{totalEarnings}€</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Échecs</p>
                <p className="text-2xl font-bold text-red-600">{failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>
        </div>

        {/* Filtres */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">Tous</option>
                <option value="delivered">Livrées</option>
                <option value="in-transit">En transit</option>
                <option value="picked-up">Récupérées</option>
                <option value="pending">En attente</option>
                <option value="failed">Échecs</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Liste */}
        <div className="space-y-4">
          {filteredDeliveries.map((delivery, index) => (
            <motion.div key={delivery.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{delivery.customerName}</h3>
                      <p className="text-sm text-gray-600">{delivery.orderNumber}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {getStatusIcon(delivery.status)}
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{delivery.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{delivery.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{delivery.packages} colis • {delivery.distance} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Récup: {delivery.pickupTime} • Livr: {delivery.estimatedTime}</span>
                    </div>
                  </div>

                  {delivery.notes && (
                    <div className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                      {delivery.notes}
                    </div>
                  )}
                </div>

                <div className="md:w-48 border-l border-gray-200 pl-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Rémunération</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Course</span>
                      <span className="font-semibold">{delivery.earnings}€</span>
                    </div>
                    {delivery.tip && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pourboire</span>
                        <span className="font-semibold text-green-600">+{delivery.tip}€</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-purple-600">{delivery.earnings + (delivery.tip || 0)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucune livraison trouvée</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DriverDeliveriesPage;
