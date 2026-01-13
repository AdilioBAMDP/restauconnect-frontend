import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import PublishOfferModal from '@/components/offers/PublishOfferModal';
import PartnerCard from './PartnerCard';
import { useNavigation } from '@/hooks/useNavigation';

interface PartnersDirectoryProps {
  currentUserRole: string;
  showPublishButton?: boolean;
}

/**
 * Composant générique d'annuaire partenaires
 * Affiche toutes les catégories de partenaires SAUF le rôle de l'utilisateur connecté
 * Utilisable dans tous les dashboards
 */
export const PartnersDirectory: React.FC<PartnersDirectoryProps> = ({ 
  currentUserRole,
  showPublishButton = true 
}) => {
  const { navigateTo } = useNavigation();
  const partners = useBusinessStore((state) => state.partners);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Toutes les catégories disponibles
  const allCategories = [
    { category: 'restaurant', role: 'restaurant', label: 'Restaurants' },
    { category: 'fournisseur', role: 'fournisseur', label: 'Fournisseurs' },
    { category: 'artisan', role: 'artisan', label: 'Artisans' },
    { category: 'transporteur', role: 'transporteur', label: 'Transporteurs' },
    { category: 'community-manager', role: 'community_manager', label: 'Community Managers' },
    { category: 'banquier', role: 'banquier', label: 'Banquiers' },
    { category: 'comptable', role: 'comptable', label: 'Comptables' },
    { category: 'investisseur', role: 'investisseur', label: 'Investisseurs' },
    { category: 'auditeur', role: 'auditeur', label: 'Auditeurs' },
    { category: 'demandeur-emploi', role: 'candidat', label: 'Demandeurs d\'emploi' }
  ];

  // Filtrer pour exclure le rôle de l'utilisateur connecté
  const availableCategories = allCategories.filter(cat => cat.role !== currentUserRole);

  // Compter le nombre de partenaires par catégorie
  const getPartnerCount = (role: string) => {
    return partners.filter(p => p.role === role).length;
  };

  // Navigation vers la page marketplace avec filtre par catégorie
  const handleNavigate = (category: string) => {
    navigateTo('marketplace', { 
      queryParams: { 
        filter: category 
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header avec bouton Nouvelle Offre */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Annuaire Partenaires</h3>
          <p className="text-sm text-gray-600 mt-1">Trouvez vos partenaires professionnels</p>
        </div>
        {showPublishButton && (
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Publier une offre</span>
          </button>
        )}
      </div>

      {/* Grille des cartes partenaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCategories.map((cat) => (
          <PartnerCard
            key={cat.category}
            category={cat.category}
            count={getPartnerCount(cat.role)}
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      {/* Modal pour publier une offre */}
      {showPublishButton && (
        <PublishOfferModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
};
