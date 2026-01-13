import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface MarketplaceOffer {
  _id: string;
  title: string;
  description: string;
  client: {
    companyName: string;
    rating?: number;
  };
  route: {
    origin: string;
    destination: string;
    distance: number;
  };
  cargo: {
    type: string;
    weight: number;
    volume: number;
  };
  pricing: {
    proposedRate: number;
    paymentTerms: string;
  };
  schedule: {
    pickupDate: string;
    deliveryDate: string;
    flexibility: 'strict' | 'flexible';
  };
  status: 'open' | 'in_bidding' | 'awarded' | 'closed';
  bidsCount: number;
  postedAt: string;
}

const MarketplaceList: React.FC = () => {
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargoType, setFilterCargoType] = useState<string>('all');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/marketplace', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffers(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      open: { color: 'bg-green-100 text-green-700', label: '🟢 Ouvert' },
      in_bidding: { color: 'bg-blue-100 text-blue-700', label: '💬 En enchères' },
      awarded: { color: 'bg-purple-100 text-purple-700', label: '👑 Attribué' },
      closed: { color: 'bg-gray-100 text-gray-700', label: '🔒 Fermé' }
    };
    return badges[status] || badges.open;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.route.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCargoType = filterCargoType === 'all' || offer.cargo.type === filterCargoType;
    return matchesSearch && matchesCargoType;
  });

  const stats = {
    total: offers.length,
    open: offers.filter(o => o.status === 'open').length,
    inBidding: offers.filter(o => o.status === 'in_bidding').length,
    totalValue: offers.reduce((sum, o) => sum + o.pricing.proposedRate, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Marketplace B2B</h2>
        <p className="text-gray-600 mt-1">Trouvez de nouvelles missions de transport</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Offres disponibles</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-green-700">Ouvertes</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.open}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-blue-700">En enchères</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inBidding}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-purple-700">Valeur totale</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalValue.toLocaleString()}€</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (titre, client, origine, destination)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCargoType}
            onChange={(e) => setFilterCargoType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types de cargo</option>
            <option value="general">Général</option>
            <option value="refrigerated">Réfrigéré</option>
            <option value="fragile">Fragile</option>
            <option value="hazardous">Dangereux</option>
          </select>
        </div>
      </div>

      {/* Liste des offres */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">Aucune offre disponible</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => {
            const statusBadge = getStatusBadge(offer.status);
            
            return (
              <div key={offer._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-green-600">{offer.pricing.proposedRate.toLocaleString()}€</p>
                    <p className="text-xs text-gray-500">{offer.pricing.paymentTerms}</p>
                  </div>
                </div>

                {/* Client */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{offer.client.companyName}</span>
                  {offer.client.rating && (
                    <span className="text-xs text-yellow-600">⭐ {offer.client.rating.toFixed(1)}</span>
                  )}
                </div>

                {/* Route */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Origine</p>
                      <p className="text-sm text-gray-900">{offer.route.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Destination</p>
                      <p className="text-sm text-gray-900">{offer.route.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Distance</p>
                      <p className="text-sm text-gray-900">{offer.route.distance} km</p>
                    </div>
                  </div>
                </div>

                {/* Cargo & Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cargo</p>
                    <p className="font-medium">
                      {offer.cargo.type} - {offer.cargo.weight}kg - {offer.cargo.volume}m³
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Planning</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(offer.schedule.pickupDate).toLocaleDateString('fr-FR')} → {new Date(offer.schedule.deliveryDate).toLocaleDateString('fr-FR')}
                      </span>
                      {offer.schedule.flexibility === 'flexible' && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Flexible</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>💬 {offer.bidsCount} offre(s)</span>
                    <span>📅 Publié {new Date(offer.postedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <button
                    onClick={() => alert('Soumettre offre à implémenter')}
                    disabled={offer.status !== 'open'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {offer.status === 'open' ? 'Soumettre une offre' : 'Fermé'}
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
          💡 <strong>Marketplace B2B:</strong> Trouvez des missions récurrentes ou ponctuelles auprès d'entreprises 
          vérifiées. Soumettez vos offres et développez votre activité.
        </p>
      </div>
    </div>
  );
};

export default MarketplaceList;
