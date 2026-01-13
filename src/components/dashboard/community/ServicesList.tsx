import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Award } from 'lucide-react';
import { getStatusColor, getCategoryIcon } from '@/utils/dashboard/communityHelpers';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  priceType: string;
  status: string;
  clientsCount: number;
  successRate: number;
}

interface ServicesListProps {
  cmServices: Service[];
  navigateTo: (page: string) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({ cmServices, navigateTo }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Mes Services</h3>
        <button 
          onClick={() => navigateTo('community-manager-services')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  {getCategoryIcon(service.category)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{service.price}€</div>
                <div className="text-xs text-gray-500">{service.priceType.replace('-', '/')}</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {service.clientsCount} clients
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                {service.successRate}% succès
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                Modifier
              </button>
              <button className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                Statistiques
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
