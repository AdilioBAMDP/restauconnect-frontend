import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft,
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  Eye,
  Filter,
  CheckCircle,
  Briefcase,
  Award,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useBusinessStore } from '@/stores/businessStore';
import ContactModal from '@/components/modals/ContactModal';
import { useNavigation } from '@/hooks/useNavigation';

// Mapping des IDs fictifs vers les vrais IDs MongoDB
const PARTNER_ID_MAP: Record<string, string> = {
  'partner-fournisseur-1': '507f1f77bcf86cd799439011', // Alimentation Premium
  'partner-fournisseur-2': '507f1f77bcf86cd799439012', // Marée Fraîche
  'partner-banquier-1': '507f1f77bcf86cd799439013',    // Banque Restaurant Pro
};

/**
 * Page d'annuaire des partenaires par catégorie
 * Affiche tous les partenaires d'un type donné avec filtres et recherche
 */
const PartnersListPage: React.FC = () => {
  const { navigateTo, currentPage } = useNavigation();
  const partners = useBusinessStore((state) => state.partners);

  // Extraire la catégorie depuis currentPage (ex: "partenaires-fournisseur" → "fournisseur")
  const category = currentPage.replace('partenaires-', '');

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<any>(null);

  // Mapping catégorie → rôle (const pour éviter warning React Hook)
  const categoryToRole = useMemo(() => ({
    'restaurant': 'restaurant',
    'fournisseur': 'fournisseur',
    'artisan': 'artisan',
    'transporteur': 'transporteur',
    'community-manager': 'community_manager',
    'banquier': 'banquier',
    'comptable': 'comptable',
    'investisseur': 'investisseur',
    'auditeur': 'auditeur',
    'demandeur-emploi': 'candidat'
  }), []);

  // Titres des catégories
  const categoryLabels: Record<string, string> = {
    'restaurant': 'Restaurants Partenaires',
    'fournisseur': 'Fournisseurs',
    'artisan': 'Artisans',
    'transporteur': 'Transporteurs',
    'community-manager': 'Community Managers',
    'banquier': 'Banquiers',
    'comptable': 'Comptables',
    'investisseur': 'Investisseurs',
    'auditeur': 'Auditeurs',
    'demandeur-emploi': 'Demandeurs d\'Emploi'
  };

  // Filtrer et trier les partenaires
  const filteredPartners = useMemo(() => {
    if (!category) return [];
    
    const role = categoryToRole[category];
    let filtered = partners.filter(p => p.role === role);

    // Recherche par nom ou spécialité
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par ville
    if (cityFilter) {
      filtered = filtered.filter(p =>
        p.location.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [partners, category, searchTerm, cityFilter, sortBy, categoryToRole]);

  // Villes uniques pour le filtre
  const availableCities = useMemo(() => {
    if (!category) return [];
    const role = categoryToRole[category];
    const cities = partners
      .filter(p => p.role === role)
      .map(p => p.location)
      .filter((v, i, a) => a.indexOf(v) === i);
    return cities;
  }, [partners, category, categoryToRole]);

  if (!category || !categoryToRole[category]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Catégorie invalide</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <button
            onClick={() => navigateTo('dashboard')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {categoryLabels[category]}
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredPartners.length} {filteredPartners.length > 1 ? 'partenaires trouvés' : 'partenaire trouvé'}
              </p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un partenaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtre ville */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">Toutes les villes</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'name')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="rating">Mieux notés</option>
                <option value="reviews">Plus d'avis</option>
                <option value="name">Nom (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des partenaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">Aucun partenaire trouvé</p>
            </div>
          ) : (
            filteredPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Photo de profil */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                  <img
                    src={partner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random&size=300`}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                  {partner.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {partner.ecoFriendly && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      🌱 Écologique
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {partner.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{partner.specialty}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{partner.location}</p>
                  </div>

                  {/* Note et avis */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{partner.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>{partner.reviewCount} avis</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {partner.badges.slice(0, 3).map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Prix et disponibilité */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Tarif</p>
                      <p className="font-semibold text-gray-900">{partner.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Disponibilité</p>
                      <p className="text-sm font-medium text-green-600">{partner.availability}</p>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Bouton Contacter cliqué pour:', partner.name);
                        setSelectedPartner(partner);
                        setShowContactModal(true);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contacter</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('👁️ Bouton Voir profil cliqué pour:', partner.name);
                        setViewingProfile(partner);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir profil</span>
                    </button>
                  </div>

                  {/* Expérience */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{partner.experience} d'expérience</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal de contact */}
      {selectedPartner && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false);
            setSelectedPartner(null);
          }}
          onConfirm={() => {
            console.log('💬 Confirmation contact pour:', selectedPartner.name, 'ID fictif:', selectedPartner.id);
            
            // Convertir l'ID fictif en vrai ID MongoDB
            const realUserId = PARTNER_ID_MAP[selectedPartner.id] || selectedPartner.id;
            console.log('🔄 ID réel MongoDB:', realUserId);
            
            // Redirection vers la messagerie avec ouverture conversation partenaire
            navigateTo('messages', {
              queryParams: {
                conversation: 'start',
                partnerId: realUserId, // ✅ Utilise le vrai ID MongoDB
                partnerName: selectedPartner.name
              }
            });
            setShowContactModal(false);
            setSelectedPartner(null);
          }}
          userName={selectedPartner.name}
          userRole={selectedPartner.role}
        />
      )}

      {/* Vue profil détaillé */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header du profil */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
              <button
                onClick={() => setViewingProfile(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <img
                  src={viewingProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingProfile.name)}&background=random&size=120`}
                  alt={viewingProfile.name}
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                />
                <div className="text-white mb-2">
                  <h2 className="text-2xl font-bold">{viewingProfile.name}</h2>
                  <p className="text-white/80">{viewingProfile.specialty}</p>
                </div>
              </div>
            </div>

            {/* Contenu du profil */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations principales */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{viewingProfile.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>{viewingProfile.rating}/5 ({viewingProfile.reviewCount} avis)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-blue-500" />
                      <span>{viewingProfile.experience} d'expérience</span>
                    </div>
                  </div>
                </div>

                {/* Tarifs et disponibilité */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tarif</p>
                      <p className="font-semibold">{viewingProfile.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disponibilité</p>
                      <p className="text-green-600 font-medium">{viewingProfile.availability}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Spécialités</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingProfile.badges.map((badge: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    // Redirection directe vers la messagerie avec conversation partenaire
                    navigateTo('messages', {
                      queryParams: {
                        conversation: 'start',
                        partnerId: viewingProfile.id,
                        partnerName: viewingProfile.name
                      }
                    });
                    setViewingProfile(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Contacter ce partenaire
                </button>
                <button
                  onClick={() => setViewingProfile(null)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PartnersListPage;
