import React from 'react';
import { MapPin, Clock, Euro, User, Check, MessageSquare, Briefcase, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  location: string;
  urgent: boolean;
}

interface Intervention {
  id: string;
  offer?: Offer;
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledDate: Date;
  proposedPrice?: string;
}

interface ArtisanMyInterventionsProps {
  interventions: Intervention[];
  onShowMessageModal: () => void;
  onSetSelectedRestaurant: (restaurantId: string) => void;
  onNavigateToRequests: () => void;
}

export const ArtisanMyInterventions: React.FC<ArtisanMyInterventionsProps> = ({
  interventions,
  onShowMessageModal,
  onSetSelectedRestaurant,
  onNavigateToRequests
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes interventions planifiées</h2>
      
      <div className="space-y-6">
        {interventions.map((intervention) => (
          <div key={intervention.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{intervention.offer?.title || 'Intervention'}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    intervention.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    intervention.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {intervention.status === 'scheduled' ? '📅 Planifiée' :
                     intervention.status === 'in-progress' ? '🔧 En cours' : '✅ Terminée'}
                  </span>
                  {intervention.offer?.urgent && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      URGENT
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3">{intervention.offer?.description}</p>
                
                {intervention.proposedPrice && (
                  <div className="bg-green-50 p-3 rounded-lg mb-3">
                    <span className="font-medium text-green-900">Tarif convenu: {intervention.proposedPrice}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {intervention.offer?.location || 'Non spécifié'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {intervention.scheduledDate.toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-1" />
                    {intervention.proposedPrice || 'Sur devis'}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Restaurant client
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <Check className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-green-800">Intervention acceptée</p>
                  <p className="text-xs text-green-600">Contact restaurant:</p>
                  <p className="text-xs text-green-600">01 42 00 00 00</p>
                </div>
                
                <button
                  onClick={() => {
                    onSetSelectedRestaurant('restaurant-1');
                    onShowMessageModal();
                  }}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Contacter
                </button>
                
                {intervention.status === 'scheduled' && (
                  <button
                    onClick={() => toast.success('Intervention marquée comme en cours')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                  >
                    🔧 Commencer
                  </button>
                )}
                
                {intervention.status === 'in-progress' && (
                  <button
                    onClick={() => toast.success('Intervention terminée !')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    ✅ Terminer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {interventions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune intervention planifiée</h3>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore d'interventions planifiées</p>
            <button
              onClick={onNavigateToRequests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voir les demandes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
