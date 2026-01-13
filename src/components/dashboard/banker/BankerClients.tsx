import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Star, Phone, Mail, MapPin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  business: string;
  location: string;
  phone: string;
  email: string;
  totalLoans: number;
  activeLoans: number;
  creditScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface BankerClientsProps {
  clients: Client[];
}

export function BankerClients({ clients }: BankerClientsProps) {
  const getScoreBadge = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 650) return { label: 'Bon', color: 'bg-blue-100 text-blue-800' };
    if (score >= 550) return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Faible', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Portefeuille Clients</h2>
        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="w-5 h-5" />
          <span className="font-semibold">{clients.length} clients</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client, index) => {
          const scoreBadge = getScoreBadge(client.creditScore);
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{client.business}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-900">{client.creditScore}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {client.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {client.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {client.email}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{client.activeLoans}</div>
                  <p className="text-xs text-gray-600">Prêts actifs</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{client.totalLoans}</div>
                  <p className="text-xs text-gray-600">Total prêts</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${scoreBadge.color}`}>
                    {scoreBadge.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
