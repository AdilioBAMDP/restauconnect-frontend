import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Mail, Phone, MapPin } from 'lucide-react';
import { AccountingClient } from '@/services/financialServices';

interface ClientsTabProps {
  clients: AccountingClient[];
  searchTerm: string;
  clientFilter: string;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: string) => void;
  onClientClick: (client: AccountingClient) => void;
  onRefresh: () => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

const ClientsTab: React.FC<ClientsTabProps> = memo(({
  clients,
  searchTerm,
  clientFilter,
  onSearchChange,
  onFilterChange,
  onClientClick,
  onRefresh,
  getStatusColor,
  formatDate
}) => {
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = clientFilter === 'all' || client.status === clientFilter;
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, clientFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Mes clients</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={clientFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="pending">En attente</option>
          </select>

          <button
            onClick={onRefresh}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <motion.div
            key={client._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onClientClick(client)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-500">{client.company || 'Particulier'}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {client.email}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {client.phone || 'Non renseigné'}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {client.address || 'Adresse non renseignée'}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Documents:</span>
                <span className="font-medium">{client.documentsCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Dernière activité:</span>
                <span className="font-medium">{formatDate(client.lastActivity)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

ClientsTab.displayName = 'ClientsTab';

export default ClientsTab;
