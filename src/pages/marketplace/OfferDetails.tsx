/**
 * OFFER DETAILS PAGE - Détails d'une offre
 * 
 * Cette page affiche les détails complets d'une offre :
 * - Informations complètes
 * - Liste des réponses
 * - Formulaire pour répondre
 * - Actions (modifier/supprimer si propriétaire)
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  MessageCircle, 
  Calendar, 
  User, 
  AlertCircle,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useOfferStore } from '@/stores/offerStore';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useNavigation } from '@/hooks/useNavigation';
import toast from 'react-hot-toast';
import { PageName } from '@/services/NavigationManager';

const OfferDetails: React.FC = () => {
  const { user } = useAuthStore();
  const { currentOffer, isLoading, fetchOfferById, respondToOffer, closeOffer, deleteOffer } = useOfferStore();
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);
  
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer l'offerId depuis URL
  const urlParams = new URLSearchParams(window.location.search);
  const offerId = urlParams.get('offerId') || undefined;

  useEffect(() => {
    if (offerId) {
      fetchOfferById(offerId);
    }
  }, [offerId, fetchOfferById]);

  const handleBack = () => {
    if (currentOffer?.zone === 'information-globale') {
      navigateToString('information-globale');
    } else {
      navigateToString('marketplace');
    }
  };

  const handleRespond = async () => {
    if (!responseMessage.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }

    if (!currentOffer) return;

    setIsSubmitting(true);
    const success = await respondToOffer(currentOffer._id, responseMessage);
    setIsSubmitting(false);

    if (success) {
      toast.success('Réponse envoyée avec succès !');
      setResponseMessage('');
      // Recharger l'offre pour voir la nouvelle réponse
      fetchOfferById(currentOffer._id);
    } else {
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleCloseOffer = async () => {
    if (!currentOffer) return;
    
    if (!confirm('Êtes-vous sûr de vouloir fermer cette offre ?')) return;

    const success = await closeOffer(currentOffer._id);
    if (success) {
      toast.success('Offre fermée avec succès');
      fetchOfferById(currentOffer._id);
    } else {
      toast.error('Erreur lors de la fermeture de l\'offre');
    }
  };

  const handleDeleteOffer = async () => {
    if (!currentOffer) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) return;

    const success = await deleteOffer(currentOffer._id);
    if (success) {
      toast.success('Offre supprimée avec succès');
      handleBack();
    } else {
      toast.error('Erreur lors de la suppression de l\'offre');
    }
  };

  if (isLoading || !currentOffer) {
    return (
      <div className="min-h-screen bg-gray-50">
  
        
      <Header currentPage="offer-details" onNavigate={navigateToString} />

<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Chargement de l'offre...</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === currentOffer.authorId;
  const canRespond = !isOwner && currentOffer.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Carte principale de l'offre */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {currentOffer.isUrgent && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                      <AlertCircle className="w-4 h-4" />
                      URGENT
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                    {currentOffer.category}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    currentOffer.status === 'active' ? 'bg-green-100 text-green-700' :
                    currentOffer.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentOffer.status === 'active' ? 'Active' :
                     currentOffer.status === 'closed' ? 'Fermée' : 'Expirée'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentOffer.title}</h1>
              </div>

              {/* Actions propriétaire */}
              {isOwner && (
                <div className="flex items-center gap-2">
                  {currentOffer.status === 'active' && (
                    <>
                      <button
                        onClick={handleCloseOffer}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Fermer l'offre"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier l'offre"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleDeleteOffer}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer l'offre"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{currentOffer.description}</p>
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Auteur</p>
                  <p className="text-sm font-medium">{currentOffer.authorName}</p>
                  <p className="text-xs text-gray-500">{currentOffer.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Vues</p>
                  <p className="text-sm font-medium">{currentOffer.views}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Réponses</p>
                  <p className="text-sm font-medium">{currentOffer.responses.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Publiée le</p>
                  <p className="text-sm font-medium">
                    {new Date(currentOffer.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de réponse */}
        {canRespond && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Répondre à cette offre
            </h2>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Saisissez votre message de réponse..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  if (currentOffer && currentOffer.authorId !== user?.id) {
                    navigateTo('conversation', { 
                      queryParams: {
                        conversationId: `new_${currentOffer.authorId}`,
                        recipientId: currentOffer.authorId,
                        recipientName: currentOffer.authorName 
                      }
                    });
                  }
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Démarrer une conversation
              </button>
              <button
                onClick={handleRespond}
                disabled={isSubmitting || !responseMessage.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer la réponse
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Liste des réponses */}
        {currentOffer.responses.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Réponses ({currentOffer.responses.length})
            </h2>
            <div className="space-y-4">
              {currentOffer.responses.map((response, index) => (
                <div key={response._id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{response.userName}</p>
                      <p className="text-sm text-gray-500">{response.userRole}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(response.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
                  
                  {isOwner && (
                    <div className="mt-3 flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Créer conversation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentOffer.responses.length === 0 && !canRespond && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune réponse pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;
