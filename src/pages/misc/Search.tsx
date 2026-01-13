import React, { useState, useMemo, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  Clock, 
  Shield, 
  Euro, 
  MessageCircle,
  Briefcase,
  Award,
  Heart,
  Send
} from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';

interface SearchPageProps {
  onNavigate?: (page: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = () => {
  const { navigateTo } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [ecoFilter, setEcoFilter] = useState(false);
  const { navigateToUserDashboard } = useUserDashboardNavigation();
  const [urgentFilter, setUrgentFilter] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');

  // Stores avec données réelles
  const { professionals, sendMessage } = useBusinessStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as any);
  }, [navigateTo]);

  // Filtres pour les rôles (TOUS les 8 rôles professionnels)
  const roleFilters = [
    { id: 'all', label: 'Tous les profils', count: professionals.length },
    { id: 'artisan', label: 'Artisans', count: professionals.filter(p => p.role === 'artisan').length },
    { id: 'candidat', label: 'Candidats emploi', count: professionals.filter(p => p.role === 'candidat').length },
    { id: 'fournisseur', label: 'Fournisseurs', count: professionals.filter(p => p.role === 'fournisseur').length },
    { id: 'community_manager', label: 'Community Managers', count: professionals.filter(p => p.role === 'community_manager').length },
    { id: 'banquier', label: 'Banquiers', count: professionals.filter(p => p.role === 'banquier').length },
    { id: 'investisseur', label: 'Investisseurs', count: professionals.filter(p => p.role === 'investisseur').length },
    { id: 'comptable', label: 'Comptables', count: professionals.filter(p => p.role === 'comptable').length },
    { id: 'restaurant', label: 'Restaurants', count: professionals.filter(p => p.role === 'restaurant').length }
  ];

  // Localisation unique des professionnels
  const availableLocations = Array.from(new Set(professionals.map(p => p.location))).sort();

  // Fonction de recherche avec filtres
  const filteredProfessionals = useMemo(() => {
    let filtered = professionals;

    // Filtre par rôle
    if (selectedRole !== 'all') {
      filtered = filtered.filter(p => p.role === selectedRole);
    }

    // Filtre par recherche texte
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.specialty.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }

    // Filtre par localisation
    if (selectedLocation) {
      filtered = filtered.filter(p => p.location === selectedLocation);
    }

    // Filtre éco-responsable
    if (ecoFilter) {
      filtered = filtered.filter(p => p.ecoFriendly);
    }

    // Filtre disponibilité urgente
    if (urgentFilter) {
      filtered = filtered.filter(p => 
        p.availability.toLowerCase().includes('immédiatement') ||
        p.availability.toLowerCase().includes('maintenant') ||
        p.badges.some(badge => badge.toLowerCase().includes('urgence'))
      );
    }

    // Tri par note puis par nombre d'avis
    return filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [professionals, selectedRole, searchTerm, selectedLocation, ecoFilter, urgentFilter]);

  // Fonction pour envoyer un message
  const handleSendMessage = (professionalId: string, professionalName: string) => {
    const subject = (document.getElementById('messageSubject') as HTMLInputElement)?.value;
    if (subject && messageContent) {
      sendMessage({
        fromId: 'restaurant-1', // ID du restaurant actuel
        toId: professionalId,
        fromName: 'Restaurant Le Comptoir',
        toName: professionalName,
        subject,
        content: messageContent
      });
      toast.success('Message envoyé !');
      setShowMessageModal(false);
      setMessageContent('');
      setSelectedProfessional(null);
    } else {
      toast.error('Veuillez remplir tous les champs');
    }
  };

  // Fonction pour obtenir la couleur du badge selon le rôle (TOUS les rôles)
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'artisan': return 'bg-blue-100 text-blue-800';
      case 'candidat': return 'bg-green-100 text-green-800';
      case 'fournisseur': return 'bg-purple-100 text-purple-800';
      case 'community_manager': return 'bg-pink-100 text-pink-800';
      case 'banquier': return 'bg-indigo-100 text-indigo-800';
      case 'investisseur': return 'bg-violet-100 text-violet-800';
      case 'comptable': return 'bg-red-100 text-red-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le label du rôle (TOUS les rôles)
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'artisan': return '🔧 Artisan';
      case 'candidat': return '👤 Candidat';
      case 'fournisseur': return '📦 Fournisseur';
      case 'community_manager': return '📱 Community Manager';
      case 'banquier': return '🏦 Banquier';
      case 'investisseur': return '💰 Investisseur';
      case 'comptable': return '📊 Comptable';
      case 'restaurant': return '🍽️ Restaurant';
      default: return '👤 Professionnel';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      
      <Header currentPage="search" onNavigate={(page) => navigateTo(page as any)} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header de recherche */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recherche de professionnels</h1>
              <p className="text-gray-600 mt-2">Trouvez les meilleurs profils pour votre restaurant</p>
            </div>
            <button
              onClick={() => navigateToUserDashboard(navigateTo)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              ← Retour dashboard
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, spécialité, compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Toutes les villes</option>
              {availableLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-6 py-3 border rounded-lg ${
                showFilters ? 'bg-orange-100 border-orange-300 text-orange-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ecoFilter}
                    onChange={(e) => setEcoFilter(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">🌱 Éco-responsable uniquement</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={urgentFilter}
                    onChange={(e) => setUrgentFilter(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">⚡ Disponible en urgence</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Filtres par rôle */}
        <div className="flex flex-wrap gap-2 mb-6">
          {roleFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedRole(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRole === filter.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Résultats */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            <strong>{filteredProfessionals.length}</strong> professionnel{filteredProfessionals.length > 1 ? 's' : ''} trouvé{filteredProfessionals.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Liste des professionnels */}
        <div className="grid gap-6">
          {filteredProfessionals.map((professional) => (
            <div key={professional.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{professional.name}</h3>
                        {professional.verified && (
                          <Shield className="w-5 h-5 text-green-500" />
                        )}
                        {professional.ecoFriendly && (
                          <Heart className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(professional.role)}`}>
                          {getRoleLabel(professional.role)}
                        </span>
                        <p className="text-gray-600">{professional.specialty}</p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {professional.location}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {professional.rating} ({professional.reviewCount} avis)
                        </div>
                        <div className="flex items-center">
                          <Euro className="w-4 h-4 mr-1" />
                          {professional.price}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {professional.availability}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{professional.description}</p>

                  {/* Compétences */}
                  {professional.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {professional.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                            {skill}
                          </span>
                        ))}
                        {professional.skills.length > 4 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                            +{professional.skills.length - 4} autres
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  {professional.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {professional.badges.map((badge, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedProfessional(professional.id);
                        setShowMessageModal(true);
                      }}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contacter
                    </button>
                    
                    <button
                      onClick={() => navigateTo('offers')}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Voir mes offres
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Aucun résultat */}
          {filteredProfessionals.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun professionnel trouvé</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedLocation('');
                  setEcoFilter(false);
                  setUrgentFilter(false);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Modal Message */}
        {showMessageModal && selectedProfessional && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contacter {professionals.find(p => p.id === selectedProfessional)?.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <input
                    type="text"
                    placeholder="Objet de votre message"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    id="messageSubject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                    placeholder="Décrivez votre besoin..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageContent('');
                    setSelectedProfessional(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const prof = professionals.find(p => p.id === selectedProfessional);
                    if (prof) {
                      handleSendMessage(prof.id, prof.name);
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
