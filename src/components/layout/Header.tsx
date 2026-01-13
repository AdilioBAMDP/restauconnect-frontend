import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useAppStore } from '@/stores/appStore';
import { useConversationStore } from '@/stores/conversationStore';
import { motion } from 'framer-motion';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import { 
  Home, Search, Briefcase, MessageCircle, Calendar, BarChart3, Bell, ArrowLeft,
  Settings, Users, Package,
  User, Wrench, TrendingUp, Globe, Leaf, Menu, Building2, Calculator, Truck, ShoppingCart
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onShowNotifications?: () => void;
  onShowAuth?: () => void;
  notificationCount?: number;
  // Nouvelles props pour header unifié
  pageTitle?: string;
  pageIcon?: string;
  showUserInfo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  onNavigate, 
  onShowNotifications, 
  onShowAuth, 
  notificationCount = 0,
  pageTitle,
  pageIcon,
  showUserInfo = false
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleSidebar, ecoMode, language, setLanguage, theme, setTheme } = useAppStore();
  const { unreadConversationsCount, fetchUnreadCount } = useConversationStore();
  
  // ✅ NAVIGATION INTELLIGENTE - Correction audit octobre 2025
  const { userDashboard } = useUserDashboardNavigation();

  // Charger le compteur au montage et le rafraîchir toutes les 30s
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchUnreadCount]);

  // TOUTES LES PAGES DISPONIBLES - Navigation complète visible
  const allNavigationItems = [
    { id: 'home', label: 'Accueil', icon: Home, category: 'main' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, category: 'main' },
    { id: 'artisan-dashboard', label: 'Dashboard Artisan', icon: Wrench, category: 'main' },
    { id: 'supplier-dashboard', label: 'Dashboard Fournisseur', icon: Package, category: 'main' },
    { id: 'supplier-orders', label: 'Mes Commandes', icon: ShoppingCart, category: 'main' },
    { id: 'driver-dashboard', label: 'Dashboard Livreur', icon: Truck, category: 'main' },
    { id: 'search', label: 'Recherche', icon: Search, category: 'main' },
    { id: 'profile', label: 'Profil', icon: User, category: 'main' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, category: 'main' },
    { id: 'calendar', label: 'Planning', icon: Calendar, category: 'main' },
    { id: 'offers', label: 'Offres', icon: Briefcase, category: 'main' },
    { id: 'information-globale', label: 'Informations en temps réel', icon: Bell, category: 'main' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart, category: 'main' },
    { id: 'catalogue', label: 'Catalogue', icon: Package, category: 'business' },
    { id: 'missions', label: 'Missions', icon: Wrench, category: 'business' },
    { id: 'candidat-emploi', label: 'Emploi', icon: Briefcase, category: 'business' },
    { id: 'banques', label: 'Banques & Crédits', icon: Building2, category: 'business' },
    { id: 'comptable', label: 'Comptabilité', icon: Calculator, category: 'business' },
    { id: 'settings', label: 'Paramètres', icon: Settings, category: 'system' },
    { id: 'stats', label: 'Statistiques', icon: TrendingUp, category: 'system' },
    { id: 'admin-create-user', label: 'Gestion Users', icon: Users, category: 'admin' },
    { id: 'api-test', label: 'Test API', icon: Settings, category: 'admin' },
    { id: 'test-connection', label: 'Test Connexion', icon: Settings, category: 'admin' },
    { id: 'welcome', label: 'Bienvenue', icon: Home, category: 'system' }
  ];

  // Filtrer selon le rôle mais montrer TOUTES les pages pertinentes
  const getVisibleNavigation = () => {
    if (!isAuthenticated || !user) {
      // Non connecté : Pages de base
      return allNavigationItems.filter(item => 
        ['home', 'search', 'welcome'].includes(item.id)
      );
    }

    // Connecté : Montrer TOUTES les pages selon le rôle (10 rôles complets)
    const rolePermissions = {
      'restaurant': ['home', 'dashboard', 'search', 'offers', 'information-globale', 'marketplace', 'calendar', 'messages', 'profile', 'settings', 'banques', 'restaurant-analytics', 'inventory'],
      'artisan': ['home', 'artisan-dashboard', 'missions', 'information-globale', 'marketplace', 'search', 'calendar', 'messages', 'profile', 'settings', 'banques', 'products', 'orders', 'customers'],
      'fournisseur': ['home', 'supplier-dashboard', 'supplier-orders', 'supplier-catalog', 'offers', 'information-globale', 'marketplace', 'calendar', 'messages', 'profile', 'settings', 'stats'],
      'candidat': ['home', 'candidat-emploi', 'search', 'information-globale', 'marketplace', 'calendar', 'messages', 'profile', 'settings'],
      'livreur': ['home', 'driver-dashboard', 'routes', 'deliveries', 'earnings', 'schedule', 'information-globale', 'marketplace', 'messages', 'calendar', 'profile', 'settings'],
      'community_manager': ['home', 'community-manager-dashboard', 'community-manager-services', 'information-globale', 'marketplace', 'stats', 'messages', 'calendar', 'profile', 'settings'],
      'banquier': ['home', 'banker-dashboard', 'loans', 'clients', 'risk', 'banques', 'information-globale', 'marketplace', 'stats', 'search', 'messages', 'profile', 'settings'],
      'investisseur': ['home', 'investor-dashboard', 'portfolio', 'opportunities', 'transactions', 'analytics', 'information-globale', 'marketplace', 'search', 'messages', 'profile', 'settings'],
      'comptable': ['home', 'comptable', 'information-globale', 'marketplace', 'stats', 'messages', 'profile', 'settings'],
      'super_admin': ['home', 'admin-dashboard', 'admin-create-user', 'stats', 'analytics', 'messages', 'settings', 'api-test', 'test-connection', 'catalogue', 'offers', 'information-globale', 'marketplace', 'missions', 'search', 'calendar', 'profile', 'banques', 'comptable'],
      'admin': ['home', 'admin-dashboard', 'admin-create-user', 'stats', 'analytics', 'messages', 'settings', 'api-test', 'test-connection', 'catalogue', 'offers', 'information-globale', 'marketplace', 'missions', 'search', 'calendar', 'profile']
    };

    const userRole = user.role as keyof typeof rolePermissions;
    const allowedPages = rolePermissions[userRole] || ['home', 'profile', 'messages', 'settings'];
    
    return allNavigationItems.filter(item => allowedPages.includes(item.id));
  };

  const navigationItems = getVisibleNavigation();

  const handleLogout = () => {
    logout();
    // La navigation vers 'home' est déjà gérée par logout() via window.location.hash
  };

  const handleNavigateToProfile = () => {
    if (user) {
      onNavigate('profile');
    }
  };

  const getPageTitle = (page: string) => {
    const pageTitles: { [key: string]: string } = {
      'test-connection': 'Test de Connexion',
      'api-test': 'Test API',
      'dashboard': 'Tableau de Bord',
      'artisan-dashboard': 'Dashboard Artisan',
      'admin-create-user': 'Gestion Utilisateurs',
      'settings': 'Paramètres',
      'stats': 'Statistiques',
      'catalogue': 'Catalogue',
      'missions': 'Missions',
      'offers': 'Offres',
      'messages': 'Messages',
      'calendar': 'Planning',
      'search': 'Recherche',
      'profile': 'Profil'
    };
    return pageTitles[page] || '';
  };

  // Fonctions pour les actions utilisateur
  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  const handleLanguageChange = (newLanguage: 'fr' | 'en' | 'es') => {
    setLanguage(newLanguage);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!isAuthenticated || !user) {
    // Header pour utilisateur non connecté - Navigation de base
    return (
      <motion.header 
        className="bg-white shadow-lg border-b border-gray-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Décalé complètement à gauche */}
            <div className="flex items-center flex-shrink-0 mr-8">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <span className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">R</span>
                <motion.h1 
                  className="text-2xl font-bold text-green-600 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  Web Spider
                </motion.h1>
              </button>
            </div>

            {/* Page title - Séparé du logo */}
            {getPageTitle(currentPage) && (
              <span className="hidden lg:block text-lg font-medium text-gray-900 mr-auto ml-4">
                {getPageTitle(currentPage)}
              </span>
            )}

            {/* Navigation de base pour non connectés */}
            <nav className="hidden md:flex space-x-4">
              {navigationItems.slice(0, 2).map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    currentPage === item.id 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
            
            {/* Actions à droite */}
            <div className="flex items-center space-x-4">
              {/* Menu mobile */}
              <button
                onClick={handleToggleSidebar}
                className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>

              {currentPage !== 'home' && currentPage !== userDashboard && (
                <button
                  onClick={() => onNavigate(userDashboard)}
                  className="flex items-center text-white hover:text-orange-100 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-white/10 hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Retour Dashboard
                </button>
              )}
              
              {onShowAuth && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShowAuth}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Se connecter
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header 
      className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 shadow-lg border-b border-orange-600"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full mx-auto px-8 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center h-28">
          {/* Logo et boutons spéciaux */}
          <div className="flex items-center space-x-3">
            {/* Menu mobile */}
            <button
              onClick={handleToggleSidebar}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Boutons d'administration pour admin et community_manager */}
            {(user?.role === 'admin' || user?.role === 'community_manager') && (
              <div className="flex space-x-2">
                {user?.role === 'admin' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm flex items-center"
                    onClick={() => onNavigate('admin-dashboard')}
                  >
                    🛡️ ADMIN
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold hover:bg-blue-200 transition-colors text-xs"
                  onClick={() => onNavigate('admin-create-user')}
                >
                  👤 Utilisateurs
                </motion.button>
                {user?.role === 'admin' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold hover:bg-purple-200 transition-colors text-xs"
                      onClick={() => onNavigate('api-test')}
                    >
                      🔌 API
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold hover:bg-indigo-200 transition-colors text-xs"
                      onClick={() => onNavigate('stats')}
                    >
                      📊 Stats
                    </motion.button>
                  </>
                )}
              </div>
            )}
            
            {/* Logo */}
            <div className="flex items-center text-white">
              <span className="h-7 w-7 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-sm mr-1.5">W</span>
              <h1 className="text-base md:text-lg font-bold text-white">
                Web Spider
              </h1>
            </div>
          </div>

          {/* Navigation centrale COMPLÈTE - TOUTES LES PAGES VISIBLES */}
          <nav className="hidden lg:flex flex-1 justify-center">
            {/* Navigation principale - Pages principales */}
            <div className="flex items-center space-x-1">
              {navigationItems.filter(item => item.category === 'main' && item.id !== 'home').map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center space-x-1.5 px-3 py-2.5 rounded-md transition-colors text-sm ${
                    currentPage === item.id 
                      ? 'bg-white text-orange-600 shadow-sm font-semibold' 
                      : 'text-white hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                  {/* Badge de notification pour Messages */}
                  {item.id === 'messages' && unreadConversationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadConversationsCount > 9 ? '9+' : unreadConversationsCount}
                    </span>
                  )}
                </motion.button>
              ))}

              {/* Séparateur */}
              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              {/* Navigation business */}
              {navigationItems.filter(item => item.category === 'business').length > 0 && (
                <div className="relative group">
                  <button className="flex items-center space-x-1.5 px-3 py-2.5 rounded-md transition-colors text-white hover:bg-white/20">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm font-medium">Business</span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {navigationItems.filter(item => item.category === 'business').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center space-x-2 px-4 py-3 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          currentPage === item.id 
                            ? 'bg-orange-50 text-orange-600 font-semibold' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation système et admin */}
              {navigationItems.filter(item => ['system', 'admin'].includes(item.category)).length > 0 && (
                <div className="relative group">
                  <button className="flex items-center px-3 py-2.5 rounded-md transition-colors text-white hover:bg-white/20">
                    <Settings className="h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {navigationItems.filter(item => ['system', 'admin'].includes(item.category)).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center space-x-2 px-4 py-3 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          currentPage === item.id 
                            ? 'bg-orange-50 text-orange-600 font-semibold' 
                            : item.category === 'admin' 
                              ? 'text-red-700 hover:bg-red-50' 
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.category === 'admin' && <span className="text-xs bg-red-100 text-red-600 px-1 rounded">Admin</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Navigation mobile complète */}
          <nav className="lg:hidden flex flex-1 justify-center overflow-x-auto">
            <div className="flex space-x-1 px-2">
              {navigationItems.slice(0, 4).map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-md transition-colors text-xs min-w-16 ${
                    currentPage === item.id 
                      ? 'bg-orange-100 text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium text-xs truncate">{item.label}</span>
                </motion.button>
              ))}
              {navigationItems.length > 4 && (
                <button
                  onClick={handleToggleSidebar}
                  className="flex flex-col items-center space-y-1 px-2 py-2 rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-orange-500 min-w-16"
                >
                  <Package className="h-4 w-4" />
                  <span className="text-xs font-medium">Plus</span>
                </button>
              )}
            </div>
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Bouton "Toutes les pages" - SUPPRIMÉ */}
            <div className="relative group hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Package className="h-5 w-5" />
                <span className="hidden md:inline">Toutes les pages</span>
                <span className="md:hidden">Pages</span>
              </motion.button>
              
              {/* Menu déroulant complet */}
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Navigation complète - {navigationItems.length} pages</h3>
                  
                  {/* Pages principales */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pages principales</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {navigationItems.filter(item => item.category === 'main').map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                            currentPage === item.id 
                              ? 'bg-orange-100 text-orange-600 font-semibold' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pages business */}
                  {navigationItems.filter(item => item.category === 'business').length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Business</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {navigationItems.filter(item => item.category === 'business').map((item) => (
                          <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                              currentPage === item.id 
                                ? 'bg-blue-100 text-blue-600 font-semibold' 
                                : 'text-gray-700 hover:bg-blue-50'
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pages système et admin */}
                  {navigationItems.filter(item => ['system', 'admin'].includes(item.category)).length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-red-600 uppercase tracking-wide mb-2">
                        {user?.role === 'admin' ? 'Administration' : 'Système'}
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {navigationItems.filter(item => ['system', 'admin'].includes(item.category)).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                              currentPage === item.id 
                                ? 'bg-red-100 text-red-600 font-semibold' 
                                : 'text-gray-700 hover:bg-red-50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.category === 'admin' && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Admin</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Indicateur mode éco */}
            {ecoMode && (
              <div className="flex items-center text-green-600">
                <Leaf className="h-4 w-4" />
                <span className="hidden md:inline text-xs ml-1">Éco</span>
              </div>
            )}

            {/* Sélecteur de langue */}
            <div className="relative group">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <Globe className="h-4 w-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(['fr', 'en', 'es'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      language === lang ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            {onShowNotifications && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowNotifications}
                className="relative p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                aria-label="Voir les notifications"
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* Toggle thème */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Changer le thème"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.02 }}
                onClick={handleNavigateToProfile}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-base ${
                  user.role === 'restaurant' ? 'bg-blue-500' :
                  user.role === 'artisan' ? 'bg-green-500' :
                  user.role === 'fournisseur' ? 'bg-purple-500' :
                  user.role === 'candidat' ? 'bg-orange-500' :
                  user.role === 'community_manager' ? 'bg-pink-500' :
                  user.role === 'admin' ? 'bg-gray-800' : 'bg-gray-500'
                }`}>
                  <span>
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white max-w-32 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-white/80 capitalize">
                    {user.role?.replace('_', ' ')}
                  </p>
                </div>
              </motion.div>

              {/* Bouton de déconnexion */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-white text-orange-600 hover:bg-white/90 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md"
              >
                <span className="hidden md:inline">Déconnexion</span>
                <span className="md:hidden">🚪</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
