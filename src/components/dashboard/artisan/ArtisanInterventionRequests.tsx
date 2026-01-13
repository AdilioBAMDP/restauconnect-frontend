import React from 'react';
import { Search, MapPin, Clock, Euro, User, Filter, AlertTriangle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: string;
  urgent: boolean;
  type: string;
  createdAt: string;
  applicationsCount: number;
  requirements: string[];
  images?: string[];
}

interface ArtisanInterventionRequestsProps {
  offers: Offer[];
  searchTerm: string;
  locationFilter: string;
  urgentOnly: boolean;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onUrgentChange: (value: boolean) => void;
  onApplyToOffer: (offerId: string) => void;
  onShowMessageModal: () => void;
  onSetSelectedRestaurant: (restaurantId: string) => void;
  getTimeAgo: (dateString: string) => string;
}

export const ArtisanInterventionRequests: React.FC<ArtisanInterventionRequestsProps> = ({
  offers,
  searchTerm,
  locationFilter,
  urgentOnly,
  onSearchChange,
  onLocationChange,
  onUrgentChange,
  onApplyToOffer,
  onShowMessageModal,
  onSetSelectedRestaurant,
  getTimeAgo
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Offres disponibles</h2>
        <p className="text-gray-600">{offers.length} demandes d'intervention dans votre spécialité</p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Localisation..."
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg">
            <input
              type="checkbox"
              checked={urgentOnly}
              onChange={(e) => onUrgentChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Urgent seulement</span>
          </label>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-1" />
            Spécialisé: Plomberie
          </div>
        </div>
      </div>

      {/* Liste des Offres */}
      <div className="space-y-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{offer.title}</h3>
                  {offer.urgent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      URGENT
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    offer.type === 'service' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {offer.type === 'service' ? 'Service' : 'Personnel'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{offer.description}</p>

                {/* Galerie de photos du problème */}
                {offer.images && offer.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      📷 Photos du problème ({offer.images.length})
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {offer.images.map((url, idx) => (
                        <div 
                          key={idx}
                          className="relative group cursor-pointer"
                          onClick={() => window.open(`http://localhost:3001${url}`, '_blank')}
                        >
                          <img 
                            src={`http://localhost:3001${url}`}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-all"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23eee"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">❌</text></svg>';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                              Voir en grand
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cliquez sur une photo pour l'agrandir
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {offer.location}
                  </div>
                  {offer.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Euro className="w-4 h-4 mr-1" />
                      {offer.budget}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {getTimeAgo(offer.createdAt)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {offer.applicationsCount} candidature{offer.applicationsCount > 1 ? 's' : ''}
                  </div>
                </div>

                {offer.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Exigences :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {offer.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => onApplyToOffer(offer.id)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    offer.urgent 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {offer.urgent ? '🚨 Répondre URGENT' : '📝 Faire un devis'}
                </button>
                <button
                  onClick={() => {
                    onSetSelectedRestaurant('restaurant-1');
                    onShowMessageModal();
                  }}
                  className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Questions
                </button>
                <button
                  onClick={() => toast.success('Demande déclinée')}
                  className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  ❌ Décliner
                </button>
              </div>
            </div>
          </div>
        ))}

        {offers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande d'intervention</h3>
            <p className="text-gray-600">Les restaurants qui ont besoin de vos services vous contacteront ici</p>
          </div>
        )}
      </div>
    </div>
  );
};
