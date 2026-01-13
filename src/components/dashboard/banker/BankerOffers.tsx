import React from 'react';
import { Plus, Edit, Eye } from 'lucide-react';

interface BankOffer {
  id: number;
  type: string;
  title: string;
  amount: string;
  rate: string;
  duration: string;
  description: string;
  conditions: string;
  status: string;
  applications: number;
}

interface BankerOffersProps {
  bankOffers: BankOffer[];
}

const BankerOffers: React.FC<BankerOffersProps> = ({ bankOffers }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mes Offres de Crédit</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Offre</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bankOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                  {offer.type}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
              </div>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {offer.status === 'active' ? 'Actif' : 'Brouillon'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Montant:</span>
                <span className="text-sm font-medium">{offer.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taux:</span>
                <span className="text-sm font-medium text-green-600">{offer.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Durée:</span>
                <span className="text-sm font-medium">{offer.duration}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{offer.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{offer.applications} demandes</span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankerOffers;
