import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Heart,
  Share2,
  Search,
  Tag,
  Clock,
  Eye,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Globe,
  Plus,
  ChevronDown,
  Bookmark,
  Sparkles,
  CheckCircle,
  Send
} from 'lucide-react';
import { UserRole } from '@/types';
import { useBusinessStore, MarketplacePost } from '@/stores/businessStore';
import { useConversationStore } from '@/stores/conversationStore';
import ContactModal from '@/components/modals/ContactModal';
import SearchFilters, { FilterState } from '@/components/layout/SearchFilters';

interface MarketplaceCommunityProps {
  userRole: UserRole;
  className?: string;
}

const MarketplaceCommunity: React.FC<MarketplaceCommunityProps> = ({ userRole, className = '' }) => {
  // Utiliser le store Zustand au lieu de useState local
  const marketplacePosts = useBusinessStore((state) => state.marketplacePosts);
  const fetchMarketplacePosts = useBusinessStore((state) => state.fetchMarketplacePosts);
  const addMarketplacePost = useBusinessStore((state) => state.addMarketplacePost);
  const likeMarketplacePost = useBusinessStore((state) => state.likeMarketplacePost);
  const bookmarkMarketplacePost = useBusinessStore((state) => state.bookmarkMarketplacePost);
  
  // Store de conversation pour contacter les utilisateurs
  const findOrCreateConversation = useConversationStore((state) => state.findOrCreateConversation);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<MarketplacePost['category']>('annonce');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);

  // État pour la modal de contact
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string } | null>(null);

  // 🆕 ÉTAT DES FILTRES AVANCÉS (NOUVEAU - COMPLÈTE LES FILTRES EXISTANTS)
  const [filters, setFilters] = useState<FilterState>({
    searchText: searchQuery,
    category: activeFilter,
    role: 'all',
    verified: false,
    visibility: 'all',
    dateRange: 'all',
    sortBy: sortBy,
    minLikes: 0,
    minViews: 0
  });

  // Charger les posts au montage du composant
  useEffect(() => {
    fetchMarketplacePosts();
  }, [fetchMarketplacePosts]);

  // 🎨 Fonctions utilitaires avec styles améliorés
  const getRoleColor = (role: UserRole): string => {
    const colors = {
      restaurant: 'from-orange-500 to-red-500',
      artisan: 'from-blue-500 to-cyan-500', 
      fournisseur: 'from-green-500 to-emerald-500',
      candidat: 'from-purple-500 to-pink-500',
      community_manager: 'from-pink-500 to-rose-500',
      admin: 'from-red-500 to-orange-500',
      super_admin: 'from-gray-700 to-gray-900',
      banquier: 'from-yellow-500 to-orange-500',
      comptable: 'from-indigo-500 to-purple-500',
      investisseur: 'from-teal-500 to-cyan-500'
    };
    return colors[role] || 'from-gray-500 to-gray-700';
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels = {
      restaurant: '🍽️ Restaurant',
      artisan: '🔧 Artisan',
      fournisseur: '📦 Fournisseur', 
      candidat: '👤 Candidat',
      community_manager: '📱 CM',
      admin: '⚙️ Admin',
      super_admin: '👑 Super Admin',
      banquier: '💰 Banquier',
      comptable: '📊 Comptable',
      investisseur: '💼 Investisseur'
    };
    return labels[role] || role;
  };

  const getCategoryInfo = (category: MarketplacePost['category']) => {
    const infos = {
      annonce: { icon: Megaphone, color: 'from-blue-500 to-blue-600', label: 'Annonce' },
      conseil: { icon: Lightbulb, color: 'from-yellow-500 to-yellow-600', label: 'Conseil' },
      partenariat: { icon: Users, color: 'from-purple-500 to-purple-600', label: 'Partenariat' },
      offre: { icon: Tag, color: 'from-green-500 to-green-600', label: 'Offre' },
      demande: { icon: MessageCircle, color: 'from-orange-500 to-orange-600', label: 'Demande' },
      actualite: { icon: Globe, color: 'from-gray-500 to-gray-600', label: 'Actualité' }
    };
    return infos[category];
  };

  // 🆕 FILTRAGE ET TRI AMÉLIORÉS (REMPLACE L'ANCIEN SYSTÈME)
  const filteredAndSortedPosts = useMemo(() => {
    // S'assurer que marketplacePosts est un tableau
    const posts = Array.isArray(marketplacePosts) ? marketplacePosts : [];
    let filtered = [...posts];

    // Filtre recherche texte (CONSERVÉ + AMÉLIORÉ avec author.name)
    const searchText = filters.searchText || searchQuery;
    if (searchText && searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((post) => 
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        post.author.name.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par catégorie (CONSERVÉ)
    const category = filters.category || activeFilter;
    if (category && category !== 'all') {
      filtered = filtered.filter((post) => post.category === category);
    }

    // 🆕 NOUVEAUX FILTRES AVANCÉS
    // Filtre par rôle auteur
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter((post) => post.author.role === filters.role);
    }

    // Filtre vérifiés uniquement
    if (filters.verified === true) {
      filtered = filtered.filter((post) => post.author.verified === true);
    }

    // Filtre par visibilité
    if (filters.visibility && filters.visibility !== 'all') {
      filtered = filtered.filter((post) => post.visibility === filters.visibility);
    }

    // Filtre par période
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter((post) => {
        const postDate = new Date(post.timestamp);
        const diffDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

        if (filters.dateRange === 'today') return diffDays === 0;
        if (filters.dateRange === 'week') return diffDays <= 7;
        if (filters.dateRange === 'month') return diffDays <= 30;
        return true;
      });
    }

    // Filtre par popularité minimale
    if (filters.minLikes && filters.minLikes > 0) {
      filtered = filtered.filter((post) => post.likes >= (filters.minLikes || 0));
    }
    if (filters.minViews && filters.minViews > 0) {
      filtered = filtered.filter((post) => post.views >= (filters.minViews || 0));
    }

    // Tri (CONSERVÉ + AMÉLIORÉ)
    const currentSortBy = filters.sortBy || sortBy;
    filtered.sort((a, b) => {
      switch (currentSortBy) {
        case 'popular':
          return (b.likes + b.comments) - (a.likes + a.comments);
        case 'trending':
          return (b.likes + b.comments + b.views) - (a.likes + a.comments + a.views);
        case 'views':
          return b.views - a.views;
        case 'recent':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    return filtered;
  }, [marketplacePosts, filters, searchQuery, activeFilter, sortBy]);

  // COMPATIBILITÉ : Alias pour garder le code existant fonctionnel
  const sortedPosts = filteredAndSortedPosts;

  const handleLike = async (postId: string) => {
    const userId = 'current-user-id'; // TODO: Récupérer l'ID utilisateur du contexte d'auth
    await likeMarketplacePost(postId, userId);
  };

  const handleBookmark = async (postId: string) => {
    const userId = 'current-user-id'; // TODO: Récupérer l'ID utilisateur du contexte d'auth
    await bookmarkMarketplacePost(postId, userId);
  };

  // Handler pour contacter un utilisateur depuis marketplace
  const handleContactUser = (userId: string, userName: string, userRole: string) => {
    console.log('🔧 handleContactUser appelé avec:', { userId, userName, userRole });
    setSelectedUser({ id: userId, name: userName, role: userRole });
    setContactModalOpen(true);
    console.log('✅ Modal contact ouvert pour:', userName);
  };

  // Confirmer et créer/ouvrir conversation
  const handleConfirmContact = async () => {
    if (selectedUser) {
      await findOrCreateConversation(selectedUser.id, selectedUser.name);
      setContactModalOpen(false);
      setSelectedUser(null);
    }
  };

  const formatTimestamp = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Vérifier que dateObj est une date valide
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'maintenant'; // Valeur par défaut si la date est invalide
    }
    
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return 'À l\'instant';
  };

  return (
    <div className={`${className}`}>
      {/* 🎨 Header ultra-moderne avec design premium */}
      <div 
        className="cursor-pointer overflow-hidden relative rounded-2xl shadow-2xl border-2 border-blue-200 hover:scale-[1.01] transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Image de fond décorative */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-10"></div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>
        
        <div className="relative p-6 bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icône avec effet glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 inline" />
                  Marketplace Communautaire
                </h2>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  💬 Partagez, échangez et collaborez avec la communauté
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Badge compteur */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-40"></div>
                <span className="relative text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full border-2 border-white shadow-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {sortedPosts.length} post{sortedPosts.length > 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Chevron animé */}
              <div className={`p-2 rounded-full transition-all duration-300 ${
                isExpanded 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg rotate-180' 
                  : 'bg-white text-blue-600 shadow-md'
              }`}>
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Contenu principal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl shadow-xl border-2 border-gray-200 mt-4 overflow-hidden">
              {/* Barre d'actions */}
              <div className="p-6 bg-white/80 backdrop-blur-sm border-b-2 border-gray-100">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* Bouton publier avec style premium */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowCreatePost(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold shadow-lg border-2 border-white"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Créer une publication</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* 🆕 COMPOSANT FILTRES AVANCÉS */}
                {isExpanded && (
                  <SearchFilters
                    type="marketplace"
                    onFilterChange={setFilters}
                    currentFilters={filters}
                    stats={{
                      totalResults: marketplacePosts.length,
                      filteredResults: filteredAndSortedPosts.length
                    }}
                  />
                )}

                {/* ANCIENS FILTRES (CONSERVÉS POUR COMPATIBILITÉ) */}
                <div className="mt-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Catégorie */}
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      <option value="all">📂 Toutes les catégories</option>
                      <option value="annonce">📢 Annonces</option>
                      <option value="conseil">💡 Conseils</option>
                      <option value="partenariat">🤝 Partenariats</option>
                      <option value="offre">🎁 Offres</option>
                      <option value="demande">🙋 Demandes</option>
                      <option value="actualite">🌍 Actualités</option>
                    </select>

                    {/* Tri */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      <option value="recent">🕐 Plus récent</option>
                      <option value="popular">🔥 Plus populaire</option>
                      <option value="trending">📈 Tendance</option>
                    </select>

                    {/* Recherche */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="🔍 Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-64 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm hover:shadow-md transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 🎨 MODAL CRÉATION DE POST - Design moderne et intuitif */}
              <AnimatePresence>
                {showCreatePost && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowCreatePost(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                      {/* Header du modal */}
                      <div className="sticky top-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">Créer une publication</h2>
                              <p className="text-white/80 text-sm">Partagez avec la communauté</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowCreatePost(false)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                          >
                            <Plus className="w-6 h-6 text-white rotate-45" />
                          </button>
                        </div>
                      </div>

                      {/* Corps du formulaire */}
                      <div className="p-6 space-y-5">
                        {/* Catégorie - Sélection visuelle */}
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-500" />
                            Catégorie de publication
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { value: 'annonce', label: 'Annonce', icon: '📢', color: 'from-blue-500 to-blue-600' },
                              { value: 'conseil', label: 'Conseil', icon: '💡', color: 'from-yellow-500 to-yellow-600' },
                              { value: 'partenariat', label: 'Partenariat', icon: '🤝', color: 'from-purple-500 to-purple-600' },
                              { value: 'offre', label: 'Offre', icon: '🎁', color: 'from-green-500 to-green-600' },
                              { value: 'demande', label: 'Demande', icon: '🙋', color: 'from-orange-500 to-orange-600' },
                              { value: 'actualite', label: 'Actualité', icon: '🌍', color: 'from-gray-500 to-gray-600' },
                            ].map((cat) => (
                              <button
                                key={cat.value}
                                type="button"
                                onClick={() => setNewPostCategory(cat.value as MarketplacePost['category'])}
                                className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                                  newPostCategory === cat.value
                                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-lg scale-105`
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                                }`}
                              >
                                <div className="text-2xl mb-1">{cat.icon}</div>
                                <div className="text-sm">{cat.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Contenu - Zone de texte moderne */}
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-purple-500" />
                            Votre message
                          </label>
                          <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="✍️ Partagez votre message avec la communauté... 

Quelques idées :
• Partagez une offre spéciale
• Demandez un service ou un conseil
• Proposez un partenariat
• Partagez une actualité importante"
                            rows={8}
                            maxLength={5000}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none font-medium transition-all"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-sm font-medium ${
                              newPostContent.length > 4500 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {newPostContent.length} / 5000 caractères
                            </span>
                            {newPostContent.length > 100 && (
                              <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Longueur idéale
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tags - Autocomplétion intelligente */}
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-pink-500" />
                            Tags (optionnel)
                          </label>
                          <div className="space-y-3">
                            {/* Suggestions de tags populaires */}
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs text-gray-500 font-medium">Suggestions :</span>
                              {['urgent', 'promo', 'nouveau', 'bio', 'local', 'partenariat', 'aide', 'conseil'].map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    if (!newPostTags.includes(tag)) {
                                      setNewPostTags([...newPostTags, tag]);
                                    }
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                    newPostTags.includes(tag)
                                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>

                            {/* Tags sélectionnés */}
                            {newPostTags.length > 0 && (
                              <div className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                <span className="text-xs text-gray-600 font-medium">Vos tags :</span>
                                {newPostTags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                                    style={{
                                      background: `linear-gradient(135deg, ${
                                        idx % 4 === 0 ? '#3b82f6, #8b5cf6' :
                                        idx % 4 === 1 ? '#8b5cf6, #ec4899' :
                                        idx % 4 === 2 ? '#ec4899, #f59e0b' :
                                        '#10b981, #3b82f6'
                                      })`
                                    }}
                                  >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => setNewPostTags(newPostTags.filter((_, i) => i !== idx))}
                                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                                    >
                                      <Plus className="w-3 h-3 rotate-45" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Input pour ajouter un tag personnalisé */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Ajouter un tag personnalisé..."
                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm font-medium"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    const newTag = e.currentTarget.value.trim().toLowerCase();
                                    if (!newPostTags.includes(newTag)) {
                                      setNewPostTags([...newPostTags, newTag]);
                                    }
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  if (input.value.trim()) {
                                    const newTag = input.value.trim().toLowerCase();
                                    if (!newPostTags.includes(newTag)) {
                                      setNewPostTags([...newPostTags, newTag]);
                                    }
                                    input.value = '';
                                  }
                                }}
                              >
                                Ajouter
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Visibilité */}
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-500" />
                            Visibilité
                          </label>
                          <select
                            value="public"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                          >
                            <option value="public">🌍 Public - Visible par tous</option>
                            <option value="professionals">👥 Professionnels uniquement</option>
                            <option value="role-specific">🔒 Mon rôle uniquement</option>
                          </select>
                        </div>
                      </div>

                      {/* Footer avec boutons d'action */}
                      <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t-2 border-gray-100">
                        <div className="flex items-center justify-between gap-4">
                          <button
                            onClick={() => {
                              setShowCreatePost(false);
                              setNewPostContent('');
                              setNewPostCategory('annonce');
                              setNewPostTags([]);
                            }}
                            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                          >
                            Annuler
                          </button>
                          
                          <button
                            onClick={async () => {
                              if (newPostContent.trim().length < 10) {
                                alert('⚠️ Votre message doit contenir au moins 10 caractères');
                                return;
                              }
                              
                              await addMarketplacePost({
                                author: {
                                  id: 'current-user-id', // TODO: Récupérer du contexte auth
                                  name: userRole === 'restaurant' ? 'Mon Restaurant' : 'Utilisateur',
                                  role: userRole,
                                  avatar: userRole === 'restaurant' ? '👨‍🍳' : '👤',
                                  verified: true
                                },
                                content: newPostContent,
                                category: newPostCategory,
                                tags: newPostTags,
                                visibility: 'public',
                                isLiked: false,
                                isBookmarked: false
                              });
                              
                              setShowCreatePost(false);
                              setNewPostContent('');
                              setNewPostCategory('annonce');
                              setNewPostTags([]);
                            }}
                            disabled={newPostContent.trim().length < 10}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                              newPostContent.trim().length >= 10
                                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Sparkles className="w-5 h-5" />
                            Publier
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 📱 Liste des publications avec design réseau social */}
              <div className="p-6 space-y-4 max-h-[800px] overflow-y-auto">
                {sortedPosts.map((post, index) => {
                  const categoryInfo = getCategoryInfo(post.category);
                  const CategoryIcon = categoryInfo.icon;
                  
                  // 🔍 Debug: Log des posts affichés
                  console.log(`📋 Post ${index + 1}/${sortedPosts.length}:`, {
                    id: post.id,
                    authorName: post.author.name,
                    authorRole: post.author.role,
                    content: post.content.substring(0, 50) + '...'
                  });
                  
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden hover:scale-[1.01] group"
                    >
                      {/* Header de la publication */}
                      <div className="p-5 border-b-2 border-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Avatar avec effet */}
                            <div className="relative">
                              <div className={`absolute inset-0 bg-gradient-to-br ${getRoleColor(post.author.role)} rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                              <div className={`relative w-12 h-12 bg-gradient-to-br ${getRoleColor(post.author.role)} rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white`}>
                                {post.author.avatar}
                              </div>
                              {post.author.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Info auteur */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-gray-900 text-lg">{post.author.name}</h3>
                                {post.author.verified && (
                                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Vérifié
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor(post.author.role)} shadow-sm`}>
                                  {getRoleLabel(post.author.role)}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(post.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Badge catégorie */}
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${categoryInfo.color} text-white font-bold text-sm shadow-md`}>
                            <CategoryIcon className="w-4 h-4" />
                            {categoryInfo.label}
                          </div>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-5">
                        <p className="text-gray-800 leading-relaxed text-base font-medium mb-4">{post.content}</p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mb-4">
                            {post.tags.map((tag, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                                style={{
                                  background: `linear-gradient(135deg, ${
                                    idx % 4 === 0 ? '#3b82f6, #8b5cf6' :
                                    idx % 4 === 1 ? '#8b5cf6, #ec4899' :
                                    idx % 4 === 2 ? '#ec4899, #f59e0b' :
                                    '#10b981, #3b82f6'
                                  })`,
                                  color: 'white'
                                }}
                              >
                                <Tag className="w-3 h-3" />
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Statistiques et actions */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-50">
                          {/* Stats */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
                              <Eye className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold">{post.views}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              <span className="font-semibold">{post.comments}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:scale-110 ${
                                post.isLiked 
                                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                              <span>{post.likes}</span>
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleBookmark(post.id); }}
                              className={`p-2 rounded-full transition-all hover:scale-110 ${
                                post.isBookmarked 
                                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                            </button>

                            <button className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all hover:scale-110">
                              <Share2 className="w-4 h-4" />
                            </button>

                            {/* NOUVEAU : Bouton Voir détails complets */}
                            <a
                              href={`/marketplace#${post.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-xl hover:scale-110 transition-all"
                              title="Voir tous les détails"
                            >
                              🔗 Détails
                            </a>

                            {/* NOUVEAU : Bouton Contacter */}
                            <button
                              onClick={(e) => { 
                                console.log('🔥 BOUTON CONTACTER CLIQUÉ !', { 
                                  postId: post.id, 
                                  authorId: post.author.id, 
                                  authorName: post.author.name, 
                                  authorRole: post.author.role 
                                });
                                e.stopPropagation(); 
                                handleContactUser(post.author.id, post.author.name, post.author.role); 
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-110 transition-all"
                              title="Contacter cet utilisateur"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Contacter</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Message si aucun résultat */}
                {sortedPosts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Aucune publication trouvée</h3>
                    <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default MarketplaceCommunity;
