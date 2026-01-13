/**
 * 🛍️ PAGE MARKETPLACE COMMUNAUTAIRE - Version Complète
 * 
 * Page dédiée harmonisée avec MarketplaceCommunity du dashboard
 * Affiche tous les posts de la marketplace avec likes, bookmarks et interactions
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageName } from '../../services/NavigationManager';
import { 
  ShoppingCart, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Clock, 
  Eye,
  TrendingUp,
  Sparkles,
  Users,
  ChevronLeft,
  CheckCircle,
  Plus,
  Grid3x3,
  List
} from 'lucide-react';
import Header from '@/components/layout/Header';
import SearchFilters, { FilterState } from '@/components/layout/SearchFilters';
import ContactModal from '@/components/modals/ContactModal';
import { useBusinessStore, MarketplacePost } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRole } from '@/types';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';

const Marketplace: React.FC = () => {
  const { user } = useAuthStore();
  const { navigateTo } = useNavigation();
  
  // ✅ NAVIGATION INTELLIGENTE - Correction audit octobre 2025
  const { userDashboard } = useUserDashboardNavigation();
  const { 
    marketplacePosts,
    likeMarketplacePost,
    bookmarkMarketplacePost,
    fetchMarketplacePosts
  } = useBusinessStore();
  
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    category: '',
    sortBy: 'recent'
  });
  
  // États pour le modal de contact
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<MarketplacePost | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Charger les posts marketplace depuis MongoDB au montage
  useEffect(() => {
    fetchMarketplacePosts();
  }, [fetchMarketplacePosts]);

  // 🆕 Initialisation des filtres depuis les paramètres d'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam) {
      setFilters(prev => ({
        ...prev,
        role: filterParam as any // 'fournisseur' devient le rôle filtré
      }) as FilterState);
      console.log('🔍 Marketplace: Filtre appliqué depuis URL:', filterParam);
    }
  }, []);

  // 🆕 Détection du hash URL pour scroll vers le post
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Scroll vers le post après un court délai
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, []);

  // Fonction de filtrage
  const filteredPosts = useMemo(() => {
    // Protection : s'assurer que marketplacePosts est un tableau
    const posts = Array.isArray(marketplacePosts) ? marketplacePosts : [];
    
    // Filtrer les posts valides (avec auteur)
    let filtered = posts.filter(post => post && post.author && post.author.role);
    
    // Debug: compter les posts invalides
    const invalidPostsCount = posts.length - filtered.length;
    if (invalidPostsCount > 0) {
      console.warn(`Marketplace: ${invalidPostsCount} posts invalides filtrés (sans auteur ou rôle)`);
    }
    
    // Filtre par recherche (searchText pas search!)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par catégorie
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(post => post.category === filters.category);
    }

    // Filtre par rôle (role pas userRole!)
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(post => post.author.role === filters.role);
    }

    // Filtre par période
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(post => {
        const createdAt = new Date(post.createdAt);
        const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    // Tri
    if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [marketplacePosts, filters]);

  const getRoleColor = (role: UserRole) => {
    const colors = {
      restaurant: 'from-orange-500 to-red-500',
      supplier: 'from-green-500 to-teal-500',
      artisan: 'from-purple-500 to-pink-500',
      banker: 'from-blue-500 to-indigo-500',
      investor: 'from-yellow-500 to-orange-500',
      comptable: 'from-cyan-500 to-blue-500'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      restaurant: 'Restaurant',
      supplier: 'Fournisseur',
      artisan: 'Artisan',
      banker: 'Banquier',
      investor: 'Investisseur',
      comptable: 'Comptable'
    };
    return labels[role] || role;
  };

  const handleLike = async (post: MarketplacePost, e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user?.id || `user-${user?.role}`;
    
    // likeMarketplacePost gère le toggle automatiquement
    await likeMarketplacePost(post.id, userId);
  };

  const handleBookmark = async (post: MarketplacePost, e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user?.id || `user-${user?.role}`;
    
    // bookmarkMarketplacePost gère le toggle automatiquement
    await bookmarkMarketplacePost(post.id, userId);
  };

  const handleContactClick = (post: MarketplacePost, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(post);
    setShowContactModal(true);
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20">

      
      
      <Header currentPage="marketplace" onNavigate={(page: string) => navigateTo(page as PageName)} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎯 Header avec bouton retour */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo(userDashboard as PageName)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour au dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-full shadow-lg">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-500 inline" />
                    Marketplace Communautaire
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Échangez avec la communauté RestauConnect
                  </p>
                </div>
              </div>
            </div>

            {/* Badge compteur + toggles vue */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-40"></div>
                <span className="relative text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-full border-2 border-white shadow-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {filteredPosts.length} post{filteredPosts.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Toggles vue */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-lg border-2 border-purple-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' 
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' 
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

        {/* 🔍 Filtres de recherche */}
        <SearchFilters
          type="marketplace"
          onFilterChange={setFilters}
          currentFilters={filters}
          stats={{
            totalResults: Array.isArray(marketplacePosts) ? marketplacePosts.length : 0,
            filteredResults: filteredPosts.length
          }}
        />

        {/* 📋 Liste des posts */}
        <div className={`mt-6 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              id={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-purple-100 overflow-hidden group cursor-pointer"
            >
              {/* Bande de couleur du rôle */}
              <div className={`h-2 bg-gradient-to-r ${getRoleColor(post.author.role)}`}></div>

              <div className="p-6">
                {/* 👤 Auteur */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(post.author.role)} p-0.5`}>
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl font-bold text-gray-700">
                        {post.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {post.author.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                      {post.author.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className={`text-sm font-medium bg-gradient-to-r ${getRoleColor(post.author.role)} bg-clip-text text-transparent`}>
                      {getRoleLabel(post.author.role)}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>

                {/* 📄 Contenu */}
                <div className="mb-4">
                  {/* Afficher les 100 premiers caractères comme titre */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}
                  </h3>
                  {post.content.length > 100 && (
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Catégorie */}
                {post.category && (
                  <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md">
                    {post.category}
                  </span>
                )}

                {/* 📊 Interactions */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{post.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-semibold">{post.comments || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Like */}
                    <button
                      onClick={(e) => handleLike(post, e)}
                      className={`p-2 rounded-full transition-all ${
                        post.likedBy?.includes(user?.id || '')
                          ? 'bg-red-100 text-red-600'
                          : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title={`${post.likes || 0} likes`}
                    >
                      <Heart className={`w-5 h-5 ${post.likedBy?.includes(user?.id || '') ? 'fill-current' : ''}`} />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => handleBookmark(post, e)}
                      className={`p-2 rounded-full transition-all ${
                        post.bookmarkedBy?.includes(user?.id || '')
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title="Sauvegarder"
                    >
                      <Bookmark className={`w-5 h-5 ${post.bookmarkedBy?.includes(user?.id || '') ? 'fill-current' : ''}`} />
                    </button>

                    {/* Contact */}
                    <button
                      onClick={(e) => handleContactClick(post, e)}
                      className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all"
                      title="Contacter"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Message vide */}
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                <ShoppingCart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun post trouvé</h3>
              <p className="text-gray-600 mb-4">
                {filters.searchText || filters.category || filters.role
                  ? 'Essayez de modifier vos filtres'
                  : 'Aucun post disponible pour le moment'}
              </p>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
                <p className="text-sm text-blue-800">
                  <strong>Debug:</strong> {Array.isArray(marketplacePosts) ? marketplacePosts.length : 0} posts dans le store
                </p>
                {(!Array.isArray(marketplacePosts) || marketplacePosts.length === 0) && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('business-storage');
                      window.location.reload();
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    🔄 Réinitialiser le store (recharger la page)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bouton Créer un post */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all group"
          title="Créer un post"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </motion.button>
      </div>

      {/* Modal de contact */}
      {selectedPost && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false);
            setSelectedPost(null);
          }}
          onConfirm={() => {
            console.log('🚀 Marketplace: Contacter cliqué pour:', selectedPost.author.name);
            console.log('🚀 Marketplace: Redirection vers messages...');
            
            // Redirection vers la messagerie avec ouverture conversation avec l'auteur du post
            navigateTo('messages', {
              queryParams: {
                conversation: 'start',
                partnerId: selectedPost.author.id,
                partnerName: encodeURIComponent(selectedPost.author.name)
              }
            });
            
            console.log('🚀 Marketplace: Navigation vers messages lancée');
            setShowContactModal(false);
            setSelectedPost(null);
          }}
          userName={selectedPost.author.name}
          userRole={selectedPost.author.role}
        />
      )}
    </div>
  );
};

export default Marketplace;
