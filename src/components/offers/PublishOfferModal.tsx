import React, { useState } from 'react';
import { X, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOfferStore, type Offer } from '@/stores/offerStore';

interface PublishOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  editOffer?: Offer;
}

const PublishOfferModal: React.FC<PublishOfferModalProps> = ({ 
  isOpen, 
  onClose,
  editOffer 
}) => {
  const { createOffer, updateOffer } = useOfferStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: editOffer?.title || '',
    description: editOffer?.description || '',
    category: editOffer?.category || 'produits',
    zone: editOffer?.zone || 'marketplace',
    targetRoles: editOffer?.targetRoles || [],
    isUrgent: editOffer?.isUrgent || false,
    expiresAt: editOffer?.expiresAt 
      ? new Date(editOffer.expiresAt).toISOString().split('T')[0] 
      : ''
  });

  const categories = [
    { value: 'produits', label: 'Produits' },
    { value: 'services', label: 'Services' },
    { value: 'equipement', label: 'Équipement' },
    { value: 'fournisseurs', label: 'Fournisseurs' },
    { value: 'partenariats', label: 'Partenariats' },
    { value: 'financement', label: 'Financement' },
    { value: 'autre', label: 'Autre' }
  ];

  const zones = [
    { value: 'marketplace', label: 'Marketplace (Public)' },
    { value: 'information-globale', label: 'Informations en temps réel (Ciblé)' }
  ];

  const roles = [
    { value: 'artisan', label: 'Artisan' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'fournisseur', label: 'Fournisseur' },
    { value: 'livreur', label: 'Livreur' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => {
      const roles = prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role];
      return { ...prev, targetRoles: roles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }

    if (formData.zone === 'information-globale' && formData.targetRoles.length === 0) {
      toast.error('Veuillez sélectionner au moins un rôle cible pour Informations en temps réel');
      return;
    }

    setIsSubmitting(true);

    try {
      const offerData = {
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        targetRoles: formData.zone === 'marketplace' ? [] : formData.targetRoles
      };

      if (editOffer) {
        await updateOffer(editOffer._id, offerData);
        toast.success('Offre mise à jour avec succès');
      } else {
        await createOffer(offerData);
        toast.success('Offre publiée avec succès');
      }

      onClose();
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        category: 'produits',
        zone: 'marketplace',
        targetRoles: [],
        isUrgent: false,
        expiresAt: ''
      });
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {editOffer ? 'Modifier l\'offre' : 'Publier une offre'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Titre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'offre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Recherche fournisseur de fruits et légumes bio"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Décrivez votre offre en détail..."
              />
            </div>

            {/* Catégorie */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone de publication *
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {zones.map(zone => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.zone === 'marketplace' 
                  ? 'Visible par tous les utilisateurs' 
                  : 'Visible uniquement par les rôles sélectionnés'}
              </p>
            </div>

            {/* Rôles cibles (si Informations en temps réel) */}
            {formData.zone === 'information-globale' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôles cibles *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(role => (
                    <label
                      key={role.value}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetRoles.includes(role.value)}
                        onChange={() => handleRoleToggle(role.value)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date d'expiration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration (optionnel)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Urgent */}
            <div className="mb-6">
              <label className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Marquer comme urgent
                    </div>
                    <div className="text-xs text-gray-500">
                      Les offres urgentes seront mises en avant et notifieront immédiatement les utilisateurs ciblés
                    </div>
                  </div>
                </div>
              </label>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publication...
                  </>
                ) : (
                  editOffer ? 'Mettre à jour' : 'Publier'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublishOfferModal;
