import React from 'react';
import { AlertCircle, Eye, MessageCircle, Calendar } from 'lucide-react';
import type { Offer } from '@/stores/offerStore';

interface OfferCardProps {
  offer: Offer;
  onClick?: () => void;
  showActions?: boolean;
  variant?: 'compact' | 'full';
  onRespond?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  offer, 
  onClick, 
  showActions = false,
  variant = 'compact',
  onRespond
}) => {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      produits: 'Produits',
      services: 'Services',
      equipement: 'Équipement',
      fournisseurs: 'Fournisseurs',
      partenariats: 'Partenariats',
      financement: 'Financement',
      autre: 'Autre'
    };
    return labels[category] || category;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Actif',
      closed: 'Fermé',
      expired: 'Expiré'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Empêcher la propagation si on clique sur le bouton répondre
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleRespondClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRespond?.();
  };

  if (variant === 'full') {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
          offer.isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
        onClick={handleCardClick}
      >
        <div className="p-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {offer.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-500 text-white">
                <AlertCircle className="w-3 h-3" />
                URGENT
              </span>
            )}
            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">
              {getCategoryLabel(offer.category)}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(offer.status)}`}>
              {getStatusLabel(offer.status)}
            </span>
          </div>

          {/* Titre */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {offer.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            {offer.description}
          </p>

          {/* Métadonnées et Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{offer.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{offer.responses.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(offer.createdAt)}</span>
              </div>
            </div>

            {/* Bouton Répondre */}
            {showActions && offer.status === 'active' && onRespond && (
              <button
                onClick={handleRespondClick}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Répondre
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variant compact (par défaut)
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
        offer.isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {offer.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-500 text-white">
              <AlertCircle className="w-3 h-3" />
              URGENT
            </span>
          )}
          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">
            {getCategoryLabel(offer.category)}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {offer.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {offer.description}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{offer.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{offer.responses.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(offer.createdAt)}</span>
            </div>
          </div>

          {/* Bouton Répondre */}
          {showActions && offer.status === 'active' && onRespond && (
            <button
              onClick={handleRespondClick}
              className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-xs font-medium"
            >
              Répondre
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
