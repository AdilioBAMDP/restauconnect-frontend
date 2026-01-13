import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, Building, DollarSign } from 'lucide-react';
import axios from 'axios';

interface MarketplaceOffer {
  _id: string;
  title: string;
  client: {
    companyName: string;
  };
  category: 'financing' | 'investment' | 'partnership' | 'service';
  amount: number;
  interestRate?: number;
  term?: number;
  description: string;
  postedAt: string;
}

const BankerMarketplaceSection: React.FC = () => {
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      // Simulation de données pour la démo
      setOffers([
        {
          _id: '1',
          title: 'Financement expansion restaurant',
          client: { companyName: 'Restaurant Le Gourmet' },
          category: 'financing',
          amount: 150000,
          interestRate: 3.5,
          term: 60,
          description: 'Recherche financement pour ouverture 2ème établissement',
          postedAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Investissement flotte de transport',
          client: { companyName: 'Transport Express SAS' },
          category: 'investment',
          amount: 500000,
          interestRate: 4.2,
          term: 84,
          description: 'Achat de 10 nouveaux véhicules frigorifiques',
          postedAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Erreur chargement marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      financing: { color: 'bg-blue-100 text-blue-700', label: 'Financement', icon: '💰' },
      investment: { color: 'bg-purple-100 text-purple-700', label: 'Investissement', icon: '📈' },
      partnership: { color: 'bg-green-100 text-green-700', label: 'Partenariat', icon: '🤝' },
      service: { color: 'bg-orange-100 text-orange-700', label: 'Service', icon: '🎯' }
    };
    return badges[category] || badges.financing;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Store className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Marketplace Financier</h3>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune offre disponible</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const badge = getCategoryBadge(offer.category);
            return (
              <div key={offer._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900">{offer.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Building className="h-4 w-4" />
                      <span>{offer.client.companyName}</span>
                    </div>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-green-600">{offer.amount.toLocaleString()}€</p>
                    {offer.interestRate && (
                      <p className="text-xs text-gray-500">{offer.interestRate}% / {offer.term} mois</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Publié {new Date(offer.postedAt).toLocaleDateString('fr-FR')}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Soumettre offre
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 Trouvez des opportunités de financement pour restaurants, transporteurs et artisans vérifiés
        </p>
      </div>
    </div>
  );
};

export default BankerMarketplaceSection;
