/**
 * ?? PAGE INFORMATIONS EN TEMPS R�EL - Version Compl�te
 * 
 * Page d�di�e harmonis�e avec GlobalInfoSpace du dashboard
 * Affiche toutes les annonces globales avec filtres avanc�s et interactions
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  Eye,
  TrendingUp,
  Sparkles,
  Users,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Grid3x3,
  List
} from 'lucide-react';
import Header from '@/components/layout/Header';
import SearchFilters, { FilterState } from '@/components/layout/SearchFilters';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { UserRole, GlobalAnnouncement, AnnouncementType } from '@/types';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import { PageName } from '@/services/NavigationManager';

const InformationGlobale: React.FC = () => {
  const { user } = useAuthStore();
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);
  
  // 🔄 NAVIGATION INTELLIGENTE - Correction audit octobre 2025
  const { userDashboard } = useUserDashboardNavigation();
  const { 
    globalAnnouncements,
    recordAnnouncementInteraction,
    fetchGlobalAnnouncements
  } = useBusinessStore();
  
  // 🔄 Charger les annonces depuis MongoDB au montage + refresh automatique
  useEffect(() => {
    console.log('🔄 GlobalInfo mounted - fetching announcements...');
    fetchGlobalAnnouncements();
    
    // 🔄 Refresh automatique toutes les 30 secondes pour info en temps réel
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refresh des annonces globales...');
      fetchGlobalAnnouncements();
    }, 30000); // 30 secondes
    
    // Cleanup à la destruction du composant
    return () => clearInterval(intervalId);
  }, [fetchGlobalAnnouncements]);
  
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    category: '',
    sortBy: 'recent'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<string>>(new Set());

  // 📍 Détection du hash URL pour auto-expand une annonce
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setExpandedAnnouncements(new Set([hash]));
      // Scroll vers l'annonce après un court délai
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, []);

  const announcements = useMemo(() => {
    console.log('📢 GlobalAnnouncements depuis MongoDB:', globalAnnouncements.length);
    
    // Filtrer par rôle si connecté
    if (!user?.role) {
      return globalAnnouncements;
    }
    
    return globalAnnouncements.filter(ann => 
      !ann.targetAudience?.length || 
      ann.targetAudience.includes(user.role as string)
    );
  }, [globalAnnouncements, user?.role]);

  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements];

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchLower) ||
        announcement.content.toLowerCase().includes(searchLower) ||
        announcement.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(announcement => announcement.type === filters.category);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === filters.priority);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(announcement => {
        const createdAt = new Date(announcement.createdAt);
        const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => b.viewCount - a.viewCount);
    } else if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [announcements, filters]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'from-red-500 to-orange-500',
      high: 'from-orange-500 to-yellow-500',
      medium: 'from-blue-500 to-cyan-500',
      low: 'from-green-500 to-teal-500'
    };
    return colors[priority as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Info className="w-4 h-4" />;
      case 'medium': return <Bell className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'promotion': return '?';
      case 'urgent': return '??';
      case 'collaboration': return '??';
      case 'event': return '??';
      case 'offer': return '??';
      case 'sponsored': return '?';
      default: return '??';
    }
  };

  const handleAnnouncementClick = (announcement: GlobalAnnouncement) => {
    recordAnnouncementInteraction({
      announcementId: announcement.id,
      userId: user?.id || `user-${user?.role}`,
      userRole: user?.role as UserRole || 'restaurant',
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
      userId: user?.id || `user-${user?.role}`,
      userRole: user?.role as UserRole || 'restaurant',
      type: 'contact'
    });

    console.log('?? Contact:', announcement.authorName, announcement.contactEmail, announcement.contactPhone);
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '� l instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20">

      
      
      <Header currentPage="information-globale" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigateToString(userDashboard)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour au dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-md opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white rounded-full shadow-lg">
                    <Bell className="w-8 h-8" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-500 inline" />
                    Informations en Temps R�el
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    Annonces cibl�es pour votre r�le
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur opacity-40"></div>
                <span className="relative text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-full border-2 border-white shadow-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {filteredAnnouncements.length} annonce{filteredAnnouncements.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-lg border-2 border-orange-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Vue grille"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Vue liste"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <SearchFilters
          type="infoglobale"
          onFilterChange={setFilters}
          currentFilters={filters}
          stats={{
            totalResults: announcements.length,
            filteredResults: filteredAnnouncements.length
          }}
        />

        <div className={`mt-6 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredAnnouncements.map((announcement, index) => {
            const isExpanded = expandedAnnouncements.has(announcement.id);
            
            return (
              <motion.div
                key={announcement.id}
                id={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-orange-100 overflow-hidden group cursor-pointer"
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <div className={`h-2 bg-gradient-to-r ${getPriorityColor(announcement.priority)}`}></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(announcement.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getPriorityColor(announcement.priority)} text-white shadow-md`}>
                            {getPriorityIcon(announcement.priority)}
                            {announcement.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        ?? {announcement.clickCount}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {announcement.title}
                    </h3>
                    <p className={`text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {announcement.content}
                    </p>
                    {announcement.content.length > 150 && (
                      <button
                        className="text-orange-600 text-sm font-semibold mt-2 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnnouncementClick(announcement);
                        }}
                      >
                        {isExpanded ? 'Voir moins' : 'Voir plus'}
                      </button>
                    )}
                  </div>

                  {announcement.tags && announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {announcement.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {(announcement.contactPhone || announcement.contactEmail || announcement.location) && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4 border border-orange-200">
                      <p className="text-xs font-bold text-orange-700 mb-2">CONTACT</p>
                      <div className="space-y-2 text-sm">
                        {announcement.contactPhone && (
                          <div key={`${announcement.id}-phone`} className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-orange-500" />
                            <a href={`tel:${announcement.contactPhone}`} className="hover:text-orange-600 transition-colors">
                              {announcement.contactPhone}
                            </a>
                          </div>
                        )}
                        {announcement.contactEmail && (
                          <div key={`${announcement.id}-email`} className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-4 h-4 text-orange-500" />
                            <a href={`mailto:${announcement.contactEmail}`} className="hover:text-orange-600 transition-colors">
                              {announcement.contactEmail}
                            </a>
                          </div>
                        )}
                        {announcement.location && (
                          <div key={`${announcement.id}-location`} className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span>{announcement.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">{announcement.authorName}</span>
                      <span className="text-gray-400">�</span>
                      <span className="text-orange-600 font-medium">{announcement.authorRole}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(announcement);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold"
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredAnnouncements.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-4">
                <Bell className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune annonce trouv�e</h3>
              <p className="text-gray-600 mb-4">
                {filters.searchText || filters.category || filters.priority
                  ? 'Essayez de modifier vos filtres'
                  : 'Aucune annonce disponible pour le moment'}
              </p>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg inline-block">
                <p className="text-sm text-orange-800">
                  <strong>Debug:</strong> {announcements.length} annonces dans le store
                </p>
                {announcements.length === 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('business-storage');
                      window.location.reload();
                    }}
                    className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                  >
                    ?? R�initialiser le store (recharger la page)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformationGlobale;
