import React, { useEffect, useState, useMemo } from 'react';
import { GlobalAnnouncement, UserRole } from '@/types';
import { useBusinessStore } from '@/stores/businessStore';
import ContactModal from '@/components/modals/ContactModal';
import SearchFilters, { FilterState } from '@/components/layout/SearchFilters';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  Eye, 
  MousePointer, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Tag,
  Mail,
  MapPin,
  TrendingUp,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface GlobalInfoSpaceProps {
  userRole: UserRole;
  className?: string;
}

const GlobalInfoSpace: React.FC<GlobalInfoSpaceProps> = ({ userRole, className = '' }) => {
  const { 
    getAnnouncementsForRole, 
    recordAnnouncementInteraction
  } = useBusinessStore();

  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<string>>(new Set());
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // État pour la modal de contact
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string } | null>(null);

  // 🆕 ÉTAT DES FILTRES (NOUVEAU - SANS TOUCHER AU CODE EXISTANT)
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    sortBy: 'recent',
    location: ''
  });

  useEffect(() => {
    const filteredAnnouncements = getAnnouncementsForRole(userRole);
    setAnnouncements(filteredAnnouncements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // 🆕 FILTRAGE ET TRI DES ANNONCES (NOUVEAU - LOGIQUE AJOUTÉE)
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements];

    // Filtre recherche texte
    if (filters.searchText && filters.searchText.trim() !== '') {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter((announcement) => 
        announcement.title.toLowerCase().includes(searchLower) ||
        announcement.content.toLowerCase().includes(searchLower) ||
        announcement.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        announcement.authorName.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par type/catégorie
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((announcement) => announcement.type === filters.category);
    }

    // Filtre par priorité
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter((announcement) => announcement.priority === filters.priority);
    }

    // Filtre par localisation
    if (filters.location && filters.location.trim() !== '') {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter((announcement) => 
        announcement.location?.toLowerCase().includes(locationLower)
      );
    }

    // Filtre par période
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter((announcement) => {
        const createdDate = new Date(announcement.createdAt);
        const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        if (filters.dateRange === 'today') return diffDays === 0;
        if (filters.dateRange === 'week') return diffDays <= 7;
        if (filters.dateRange === 'month') return diffDays <= 30;
        return true;
      });
    }

    // Tri
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'recent':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'priority': {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          }
          case 'popular':
            return b.viewCount - a.viewCount;
          case 'expiring':
            if (!a.expiresAt && !b.expiresAt) return 0;
            if (!a.expiresAt) return 1;
            if (!b.expiresAt) return -1;
            return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [announcements, filters]);

  const getPriorityIcon = (priority: GlobalAnnouncement['priority']) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <Bell className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: GlobalAnnouncement['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50';
      case 'high':
        return 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50';
      case 'medium':
        return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50';
      case 'low':
        return 'border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleAnnouncementClick = (announcement: GlobalAnnouncement) => {
    recordAnnouncementInteraction({
      announcementId: announcement.id,
      userId: `user-${userRole}`,
      userRole,
      type: 'click'
    });

    const newExpanded = new Set(expandedAnnouncements);
    if (newExpanded.has(announcement.id)) {
      newExpanded.delete(announcement.id);
    } else {
      newExpanded.add(announcement.id);
    }
    setExpandedAnnouncements(newExpanded);
  };

  const handleContactClick = (announcement: GlobalAnnouncement) => {
    recordAnnouncementInteraction({
      announcementId: announcement.id,
      userId: `user-${userRole}`,
      userRole,
      type: 'contact'
    });
    
    if (announcement.contactEmail) {
      window.location.href = `mailto:${announcement.contactEmail}`;
    } else if (announcement.contactPhone) {
      window.location.href = `tel:${announcement.contactPhone}`;
    }
  };

  // Handler pour contacter l'auteur de l'annonce
  const handleContactAuthor = (announcement: GlobalAnnouncement) => {
    setSelectedUser({ 
      id: announcement.authorId, 
      name: announcement.authorName, 
      role: announcement.authorRole 
    });
    setContactModalOpen(true);
  };

  // Confirmer et créer/ouvrir conversation
  const handleConfirmContact = async () => {
    console.log('🎯 handleConfirmContact appelé ! selectedUser:', selectedUser);
    
    if (selectedUser) {
      // ✅ FIX CRITIQUE : Redirection directe avec URL complète
      const partnerId = encodeURIComponent(selectedUser.id);
      const partnerName = encodeURIComponent(selectedUser.name);
      const url = `/messages?conversation=start&partnerId=${partnerId}&partnerName=${partnerName}`;
      
      console.log('🚀 GlobalInfo: Redirection vers:', url);
      console.log('🚀 GlobalInfo: selectedUser:', selectedUser);
      
      setContactModalOpen(false);
      setSelectedUser(null);
      
      // Redirection directe - plus fiable
      window.location.href = url;
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j restant${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  };

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* 🎨 Container principal avec design ultra-moderne */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl shadow-2xl mb-6">
        
        {/* Image de fond décorative avec pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          ></div>
        </div>
        
        <div className="relative p-6">
          {/* 🎯 Header accordéon avec design premium */}
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-white/70 p-5 rounded-xl transition-all duration-300 border-2 border-white/50 bg-white/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.01] group"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <div className="flex items-center gap-4">
              {/* Icône animée avec effet glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 inline" />
                  Informations en temps réel
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  📢 Actualités et opportunités du secteur
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Badge compteur avec style moderne */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-40"></div>
                <span className="relative text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full border-2 border-white shadow-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {announcements.length} {announcements.length > 1 ? 'annonces' : 'annonce'}
                </span>
              </div>
              
              {/* Icône chevron animée */}
              <div className={`p-2 rounded-full transition-all duration-300 ${
                isAccordionOpen 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg rotate-180' 
                  : 'bg-white text-blue-600 shadow-md'
              }`}>
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 📋 Contenu accordéon avec animation */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isAccordionOpen ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}>
            {/* 🆕 COMPOSANT DE FILTRES (NOUVEAU - AJOUTÉ AU DÉBUT) */}
            {isAccordionOpen && (
              <SearchFilters
                type="infoglobale"
                onFilterChange={setFilters}
                currentFilters={filters}
                stats={{
                  totalResults: announcements.length,
                  filteredResults: filteredAnnouncements.length
                }}
              />
            )}

            <div className="space-y-4 bg-white/60 rounded-xl p-6 border-2 border-white/80 backdrop-blur-md shadow-inner">
              {filteredAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className={`relative border-l-4 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white border-2 border-gray-100 overflow-hidden group ${getPriorityColor(announcement.priority)}`}
                  onClick={() => handleAnnouncementClick(announcement)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image de fond avec effet de priorité */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                    <div className={`w-full h-full rounded-full blur-3xl ${
                      announcement.priority === 'urgent' ? 'bg-red-500' :
                      announcement.priority === 'high' ? 'bg-orange-500' :
                      announcement.priority === 'medium' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}></div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      {/* Icône avec effet glow */}
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity ${
                          announcement.priority === 'urgent' ? 'bg-red-400' :
                          announcement.priority === 'high' ? 'bg-orange-400' :
                          announcement.priority === 'medium' ? 'bg-blue-400' :
                          'bg-green-400'
                        }`}></div>
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 border-white">
                          {getPriorityIcon(announcement.priority)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* En-tête avec badges */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-xl group-hover:text-blue-600 transition-colors mb-2">
                              {announcement.title}
                            </h4>
                            
                            {/* Badges visuels */}
                            <div className="flex gap-2 flex-wrap items-center">
                              {/* Badge priorité */}
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                                announcement.priority === 'urgent' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                                announcement.priority === 'high' ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' :
                                announcement.priority === 'medium' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' :
                                'bg-green-100 text-green-700 border-2 border-green-300'
                              }`}>
                                {announcement.priority === 'urgent' && '🔥'}
                                {announcement.priority === 'high' && '⚡'}
                                {announcement.priority === 'medium' && '📌'}
                                {announcement.priority === 'low' && '✓'}
                                {announcement.priority.toUpperCase()}
                              </span>
                              
                              {/* Tags personnalisés */}
                              {announcement.tags.slice(0, 3).map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-full shadow-md"
                                  style={{
                                    background: `linear-gradient(135deg, ${
                                      idx % 3 === 0 ? '#3b82f6, #8b5cf6' :
                                      idx % 3 === 1 ? '#8b5cf6, #ec4899' :
                                      '#ec4899, #f59e0b'
                                    })`
                                  }}
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <p className="text-base text-gray-700 leading-relaxed font-medium mb-4">
                          {announcement.content}
                        </p>

                        {/* Section étendue */}
                        {expandedAnnouncements.has(announcement.id) && (
                          <div className="mt-5 space-y-4 pt-4 border-t-2 border-gray-100 animate-fadeIn">
                            {/* Localisation */}
                            {announcement.location && (
                              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border-2 border-blue-100 shadow-sm">
                                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold uppercase">Localisation</p>
                                  <p className="text-sm font-bold text-gray-800">{announcement.location}</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Contact */}
                            {(announcement.contactEmail || announcement.contactPhone) && (
                              <div className="space-y-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContactClick(announcement);
                                  }}
                                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold shadow-lg border-2 border-white"
                                >
                                  <Phone className="w-5 h-5" />
                                  Contacter maintenant
                                </button>
                                
                                {/* Infos de contact */}
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                  {announcement.contactEmail && (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-full border border-gray-200 font-medium flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {announcement.contactEmail}
                                    </span>
                                  )}
                                  {announcement.contactPhone && (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-full border border-gray-200 font-medium flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {announcement.contactPhone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* NOUVEAU : Bouton Contacter l'auteur via messagerie */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContactAuthor(announcement);
                              }}
                              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold shadow-lg border-2 border-white"
                            >
                              <MessageCircle className="w-5 h-5" />
                              Contacter {announcement.authorName}
                            </button>
                          </div>
                        )}

                        {/* 📊 Statistiques et interactions */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Compteur de vues */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full border border-gray-200">
                              <Eye className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold">{announcement.viewCount || 0}</span>
                            </div>
                            
                            {/* Compteur de clics */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full border border-gray-200">
                              <MousePointer className="w-4 h-4 text-green-500" />
                              <span className="font-semibold">{announcement.clickCount || 0}</span>
                            </div>
                            
                            {/* Temps restant */}
                            {announcement.expiresAt && (
                              <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-2 rounded-full border-2 border-orange-300">
                                <Clock className="w-4 h-4" />
                                {formatTimeRemaining(announcement.expiresAt)}
                              </div>
                            )}
                          </div>
                          
                          {/* Boutons d'action */}
                          <div className="flex items-center gap-2">
                            {/* Bouton "Voir détails sur page dédiée" */}
                            <a
                              href={`/information-globale#${announcement.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:gap-2 transition-all shadow-md hover:shadow-lg"
                            >
                              🔗 Détails complets
                            </a>
                            
                            {/* Bouton expand/collapse */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnnouncementClick(announcement);
                              }}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              {expandedAnnouncements.has(announcement.id) ? (
                                <>Voir moins <ChevronUp className="w-4 h-4" /></>
                              ) : (
                                <>Voir plus <ChevronDown className="w-4 h-4" /></>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de contact */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmContact}
        userName={selectedUser?.name || ''}
        userRole={selectedUser?.role || ''}
      />
    </div>
  );
};

export default GlobalInfoSpace;
