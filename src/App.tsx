import React, { useState, useEffect, useRef, lazy } from 'react';
const AdminPlatformSettings = lazy(() => import('./pages/admin/AdminPlatformSettings'));
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuthContext';
import { useMessageNotifications } from './hooks/useMessageNotifications';
import NotificationCenter from './components/features/NotificationCenter';
import { NavigationManager, type PageName } from './services/NavigationManager';
import HomePageNew from './pages/home/Home';
import SearchPage from './pages/misc/Search';
import ProfilePage from './pages/profile/Profile';
import MessagesPage from './pages/messaging/Messages';
import CalendarPage from './pages/misc/Calendar';
import OffersPage from './pages/offers/List';
import FinancesPage from './pages/finance/Dashboard';
import ArtisanRevenusPage from './pages/artisan/Revenus';
import SupplierRevenusPage from './pages/supplier/Revenus';
import CompleteDashboard from './pages/dashboards/RestaurantDashboard';
import DataValidationPage from './pages/admin/DataValidation';
import WelcomePage from './pages/home/WelcomePage';
import AdminCreateUserPage from './pages/admin/CreateUser';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import CataloguePage from './pages/marketplace/Catalogue';
import MissionsPage from './pages/offers/Missions';
import SettingsPage from './pages/profile/Settings';
import StatsPage from './pages/analytics/Stats';
import SupplierDashboard from './pages/dashboards/SupplierDashboard';
import SupplierOrdersPage from './pages/supplier/Orders';
import SupplierOrderDetailPage from './pages/supplier/OrderDetail';
import CandidatEmploiPage from './pages/candidat/EmploiSimple';
import ArtisanDashboardUnified from './components/artisan/ArtisanDashboardUnified';
import BankerDashboard from './pages/dashboards/BankerDashboard';
import AccountantDashboard from './pages/dashboards/AccountantDashboard';
import CommunityManagerDashboard from './pages/dashboards/CommunityManagerDashboard';
import CommunityManagerServices from './pages/community-manager/Services';
import ComptablePage from './pages/comptable/Dashboard';
import BanquesPage from './pages/banker/Banks';
import InvestorDashboard from './pages/dashboards/InvestorDashboard';
import ApiConnectionTest from './components/testing/ApiConnectionTest';
import TestConnection from './components/testing/TestConnection';
import LoginModal from './components/auth/LoginModal';
import DriverDashboard from './pages/dashboards/DriverDashboard';
import CandidatDashboard from './pages/dashboards/CandidatDashboard';
import TransporteurDashboard from './pages/dashboards/TransporteurDashboard';
import AuditeurDashboard from './pages/dashboards/AuditeurDashboard';
import SupplierCatalogView from './pages/SupplierCatalogView';
import SupplierSelectionPage from './pages/SupplierSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import CartSummaryWidget from './components/cart/CartSummaryWidget';
import InformationGlobale from './pages/misc/GlobalInfo';
import Marketplace from './pages/marketplace/Marketplace';
import OfferDetails from './pages/marketplace/OfferDetails';
import ConversationPage from './pages/messaging/Conversation';
import PortfolioPage from './pages/finance/Portfolio';
import OpportunitiesPage from './pages/offers/Opportunities';
import TransactionsPage from './pages/finance/Transactions';
import RestaurantInventoryPage from './pages/restaurant/Inventory';
import BankerLoansPage from './pages/banker/Loans';
import BankerClientsPage from './pages/banker/Clients';
import BankerRiskPage from './pages/banker/Risk';
import DriverRoutesPage from './pages/driver/Routes';
import DriverDeliveriesPage from './pages/driver/Deliveries';
import DriverEarningsPage from './pages/driver/Earnings';
import DriverSchedulePage from './pages/driver/Schedule';
import ArtisanProductsPage from './pages/artisan/Products';
import ArtisanOrdersPage from './pages/artisan/Orders';
import ArtisanCustomersPage from './pages/artisan/Customers';
import RestaurantAnalyticsPage from './pages/restaurant/Analytics';
import GeneralAnalyticsPage from './pages/analytics/General';
import FloatingPublishButton from './components/offers/FloatingPublishButton';
import OrdersPage from './pages/orders/List';
import PartnersListPage from './pages/misc/Partners';
import PartenairesCandidatPage from './pages/PartenairesCandidatPage';
import { useAppStore } from './stores/appStore';

// Composant interne qui utilise le contexte d'authentification
function AppContent() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentPage, navigateTo } = useAppStore();
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  // Hook pour les notifications de messages en temps réel
  useMessageNotifications(isAuthenticated, user?._id || user?.id);

  // Wrapper pour compatibilité avec les composants qui attendent (page: string) => void
  const navigateToString = (page: string) => {
    navigateTo(page as PageName);
  };

  // ✅ PHASE 5 - Initialiser NavigationManager au montage
  useEffect(() => {
    // Adaptateur pour aligner appStore avec NavigationManager
    NavigationManager.initialize(() => {
      const state = useAppStore.getState();
      return {
        navigateTo: state.navigateTo,
        currentPage: state.currentPage as PageName | null // Cast nécessaire: string -> PageName | null
      };
    });
    
    // Synchroniser avec l'URL actuelle au démarrage
    NavigationManager.syncWithCurrentUrl();
    console.log('✅ App: NavigationManager initialized and synced with URL');
    
    // Écouter les changements d'URL (boutons retour/avant du navigateur)
    const handlePopState = () => {
      console.log('🔙 Popstate event - URL changed:', window.location.pathname);
      NavigationManager.syncWithCurrentUrl();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup à la destruction
    return () => {
      window.removeEventListener('popstate', handlePopState);
      NavigationManager.destroy();
    };
  }, []);

  // Mapping des rôles vers leurs dashboards (COHÉRENCE BACKEND-FRONTEND)
  const getRoleDefaultPage = (role: string): string => {
    if (!role) return 'dashboard';
    // Normalisation : minuscule, sans espace, remplace tirets/underscores
    const norm = (r: string) => r.toLowerCase().replace(/[-_\s]/g, '');
    const rolePageMap: { [key: string]: string } = {
      'restaurant': 'restaurant-dashboard',
      'artisan': 'artisan-dashboard',
      'fournisseur': 'supplier-dashboard',
      'candidat': 'candidat-dashboard',
      'communitymanager': 'community-manager-dashboard',
      'superadmin': 'admin-dashboard',
      'admin': 'admin-dashboard',
      'banquier': 'banker-dashboard',
      'investisseur': 'investor-dashboard',
      'comptable': 'accountant-dashboard',
      'livreur': 'driver-dashboard',
      'transporteur': 'transporteur-dashboard',
      'auditeur': 'auditeur-dashboard'
    };
    const normalized = norm(role);
    if (rolePageMap[normalized]) {
      return rolePageMap[normalized];
    } else {
      console.warn(`⚠️ Rôle utilisateur non reconnu pour la redirection dashboard : "${role}" (normalisé : "${normalized}")`);
      return 'dashboard';
    }
  };

  // Effet pour rediriger l'utilisateur authentifié vers son dashboard
  const prevUserRef = useRef(user);
  
  useEffect(() => {
    console.log('📍 Navigation check:', {
      isAuthenticated,
      role: user?.role,
      hasRedirected: hasRedirected.current,
      currentPage,
      isLoading
    });

    // Si l'utilisateur a changé (reconnexion avec un compte différent), réinitialiser hasRedirected
    if (user && prevUserRef.current?.role !== user.role) {
      console.log('🔄 Changement d\'utilisateur détecté, reset hasRedirected');
      hasRedirected.current = false;
      prevUserRef.current = user;
    }

    // Attendre que le loading soit terminé
    if (isLoading) return;

    // Redirection automatique après connexion
    const hasQueryParams = window.location.search.length > 0;
    
    if (isAuthenticated && user?.role && !hasRedirected.current && !hasQueryParams) {
      const defaultPage = getRoleDefaultPage(user.role);
      const isOnHomePage = currentPage === 'home' || !currentPage;
      
      // Rediriger si on est sur home
      const shouldRedirect = isOnHomePage;
      
      if (shouldRedirect) {
        hasRedirected.current = true;
        console.log(`🔄 Redirection automatique après connexion: ${user.role} → ${defaultPage}`);
        setTimeout(() => {
          console.log(`🚀 EXECUTION DE LA REDIRECTION VERS: ${defaultPage}`);
          navigateTo(defaultPage as PageName);
        }, 100);
      }
    }
  }, [isAuthenticated, user, currentPage, navigateTo, isLoading]);
  
  // Reset du flag de redirection à la déconnexion
  useEffect(() => {
    if (!isAuthenticated) {
      hasRedirected.current = false;
      console.log('🔓 Déconnexion - Reset du flag de redirection');
      // Forcer la navigation vers home à la déconnexion
      if (currentPage !== 'home') {
        console.log('🏠 Redirection vers home après déconnexion');
        navigateTo('home' as PageName);
      }
    }
  }, [isAuthenticated, currentPage, navigateTo]);

  // Afficher modal d'authentification si utilisateur non connecté et pas sur home
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !showAuthModal && currentPage !== 'home') {
      setShowAuthModal(true);
    }
  }, [isLoading, isAuthenticated, showAuthModal, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'admin-platform-settings':
        return <React.Suspense fallback={<div>Chargement…</div>}>
          <AdminPlatformSettings />
        </React.Suspense>;
      case 'home':
        return <HomePageNew onNavigate={navigateToString} onShowAuth={() => setShowAuthModal(true)} />;
      case 'search':
        return <SearchPage onNavigate={navigateToString} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateToString} />;
      case 'messages':
        return <MessagesPage navigateTo={navigateToString} />;
      case 'calendar':
        return <CalendarPage onNavigate={navigateToString} />;
      case 'offers':
        return <OffersPage />;
      case 'information-globale':
        return <InformationGlobale />;
      case 'marketplace':
        return <Marketplace />;
      case 'offer-details':
        return <OfferDetails />;
      case 'conversation':
        return <ConversationPage />;
      case 'finances':
        return <FinancesPage />;
      case 'artisan-revenus':
        return <ArtisanRevenusPage />;
      case 'supplier-revenus':
        return <SupplierRevenusPage />;
      case 'catalogue':
        return <CataloguePage onNavigate={navigateToString} />;
      case 'missions':
        return <MissionsPage onNavigate={navigateToString} />;
      case 'candidat-emploi':
        return <CandidatEmploiPage />;
      case 'artisan-dashboard':
        return <ArtisanDashboardUnified />;
      case 'banker-dashboard':
        return <BankerDashboard onNavigate={navigateToString} />;
      case 'community-manager-dashboard':
        return <CommunityManagerDashboard navigateTo={navigateToString} />;
      case 'community-manager-services':
        return <CommunityManagerServices navigateTo={navigateToString} />;
      case 'comptable':
        return <ComptablePage onNavigate={navigateToString} />;
      case 'accountant-dashboard':
        return <AccountantDashboard />;
      case 'banques':
        return <BanquesPage onNavigate={navigateToString} />;
      case 'investor-dashboard':
        return <InvestorDashboard onNavigate={navigateToString} />;
      case 'driver-dashboard':
        return <DriverDashboard />;
      case 'candidat-dashboard':
        return <CandidatDashboard />;
      case 'transporteur-dashboard':
        return <TransporteurDashboard />;
      case 'transporteur-fleet':
        return <TransporteurDashboard />;
      case 'transporteur-drivers':
        return <TransporteurDashboard />;
      case 'transporteur-deliveries':
        return <TransporteurDashboard />;
      case 'transporteur-documents':
        return <TransporteurDashboard />;
      case 'transporteur-analytics':
        return <TransporteurDashboard />;
      case 'transporteur-maintenance':
        return <TransporteurDashboard />;
      case 'auditeur-dashboard':
        return <AuditeurDashboard />;
      
      // ✅ ROUTE DÉDIÉE TRANSPORTEUR TMS PRO
      case 'dashboard-transporteur':
        return <TransporteurDashboard />;
      
      // ✅ ROUTE UNIFIÉE DASHBOARD - Détection automatique du rôle CORRIGÉE
      case 'dashboard': {
          // Redirection intelligente selon le rôle utilisateur
          if (user?.role === 'restaurant') {
            return <CompleteDashboard />;
          } else if (user?.role === 'supplier' || user?.role === 'fournisseur') {
            return <SupplierDashboard navigateTo={navigateToString} />;
          } else if (user?.role === 'artisan') {
            return <ArtisanDashboardUnified />;
          } else if (user?.role === 'banker' || user?.role === 'banquier') {
            return <BankerDashboard onNavigate={navigateToString} />;
          } else if (user?.role === 'investor' || user?.role === 'investisseur') {
            return <InvestorDashboard onNavigate={navigateToString} />;
          } else if (user?.role === 'driver' || user?.role === 'livreur') {
            return <DriverDashboard />;
          } else if (user?.role === 'candidat') {
            return <CandidatDashboard />;
          } else if (user?.role === 'carrier' || user?.role === 'transporteur') {
            return <TransporteurDashboard />;
          } else if (user?.role === 'auditor' || user?.role === 'auditeur') {
            return <AuditeurDashboard />;
          } else if (user?.role === 'accountant' || user?.role === 'comptable') {
            return <AccountantDashboard />;
          } else if (user?.role === 'admin' || user?.role === 'super_admin') {
            return <AdminDashboard navigateTo={navigateToString} />;
          } else {
            // Fallback : dashboard restaurant par défaut
          return <CompleteDashboard />;
        }
      }
      
      // 🔒 Routes spécifiques (rétrocompatibilité)
      case 'restaurant-dashboard':
          return <CompleteDashboard />;
        case 'supplier-dashboard':
          return <SupplierDashboard navigateTo={navigateToString} />;
        case 'supplier-orders':
          // ✅ PAGE COMMANDES FOURNISSEUR (sans dashboard)
          return <SupplierOrdersPage navigateTo={navigateToString} />;
        case 'supplier-order-detail':
          // ✅ PAGE DÉTAIL COMMANDE FOURNISSEUR
          return <SupplierOrderDetailPage navigateTo={navigateToString} />;
        case 'supplier-catalog': {
          // ✅ CATALOGUE UNIFIÉ : Utilise la version moderne (anciennement supplier-catalog-view)
          return <SupplierCatalogView />;
        }
        case 'supplier-selection': {
          // Page de sélection des fournisseurs
          return <SupplierSelectionPage />;
        }
        case 'checkout': {
          // ✅ NOUVEAU SYSTÈME : Page checkout avec panier + paiement Stripe
          return <CheckoutPage onBack={() => navigateToString('supplier-catalog')} onSuccess={(orderId) => {
            console.log('✅ Commande créée avec succès:', orderId);
            // Rediriger vers la page des commandes pour voir le suivi
            navigateToString('orders');
          }} />;
        }
        case 'welcome':
          return <WelcomePage onSelectRole={() => navigateToString('dashboard')} />;
        case 'admin-dashboard':
          return <AdminDashboard navigateTo={navigateToString} />;
        case 'admin-create-user':
          return <AdminCreateUserPage onNavigate={navigateToString} />;
        case 'settings':
          return <SettingsPage onNavigate={navigateToString} />;
        case 'stats':
          return <StatsPage onNavigate={navigateToString} />;
        case 'api-test':
          return <ApiConnectionTest onNavigate={navigateToString} />;
        case 'test-connection':
          return <TestConnection onNavigate={navigateToString} />;
        case 'data-validation':
          return <DataValidationPage />;
        case 'tms-delivery':
          // Redirection vers le dashboard livreur pour les livraisons TMS
          return <DriverDashboard />;
        case 'restaurant-tms-history':
          // Nouveau: Historique TMS intégré (à développer)
          return <CompleteDashboard />;
        
        // ✅ Pages Investisseur - FONCTIONNELLES
        case 'portfolio':
          return <PortfolioPage />;
        case 'opportunities':
          return <OpportunitiesPage />;
        case 'transactions':
          return <TransactionsPage />;
        
        // ✅ Pages Banquier - FONCTIONNELLES
        case 'loans':
          return <BankerLoansPage />;
        case 'clients':
          return <BankerClientsPage />;
        case 'risk':
          return <BankerRiskPage />;
        
        // ✅ Pages Livreur - FONCTIONNELLES
        case 'routes':
          return <DriverRoutesPage />;
        case 'deliveries':
          return <DriverDeliveriesPage />;
        case 'earnings':
          return <DriverEarningsPage />;
        case 'schedule':
          return <DriverSchedulePage />;
        
        // ✅ Page Inventory - Route vers page spécifique restaurant ou redirect artisan
        case 'inventory': {
          if (user?.role === 'restaurant') {
            return <RestaurantInventoryPage />;
          }
          // Artisans : page en développement
          console.warn(`⚠️ Page "inventory" en développement pour artisan, affichage artisan-dashboard`);
          return <ArtisanDashboardUnified />;
        }
        
        // ✅ Pages Artisan - FONCTIONNELLES
        case 'products':
          return <ArtisanProductsPage />;
        
        // 🔧 FIX ROUTE UNIFIÉE - Détection automatique du rôle
        case 'orders': {
          // Restaurants → OrdersPage
          if (user?.role === 'restaurant') {
            return <OrdersPage onNavigate={navigateToString} />;
          }
          // Artisans et autres → ArtisanOrdersPage
          return <ArtisanOrdersPage />;
        }
        
        // 🔒 Alias pour compatibilité (à supprimer en v2.1)
        case 'restaurant-orders':
          console.warn('⚠️ Route obsolète "restaurant-orders" → utilisez "orders"');
          navigateToString('orders');
          return null;
        
        case 'customers':
          return <ArtisanCustomersPage />;
        
        // ✅ Pages Analytics - FONCTIONNELLES
        case 'analytics': {
          // Page analytics générale accessible à tous
          return <GeneralAnalyticsPage />;
        }
        case 'restaurant-analytics': {
          // Page analytics spécifique restaurant
          return <RestaurantAnalyticsPage />;
        }
        
        // Page Test Accounts
        case 'test-accounts':
          return <WelcomePage onSelectRole={() => navigateToString('dashboard')} />;
        
        // ✅ NOUVEAU - Annuaire partenaires par catégorie
        case 'partenaires-restaurant':
        case 'partenaires-fournisseur':
        case 'partenaires-artisan':
        case 'partenaires-transporteur':
        case 'partenaires-community-manager':
        case 'partenaires-banquier':
        case 'partenaires-comptable':
        case 'partenaires-investisseur':
        case 'partenaires-auditeur':
        case 'partenaires-demandeur-emploi':
          return <PartnersListPage />;
        case 'partenaires-candidat':
          return <PartenairesCandidatPage />;
        
        // ✅ NOUVEAU SYSTÈME ARTISAN DEVIS/FACTURES
        case 'artisan-pro':
          return <ArtisanDashboardUnified />;
        
      default:
        // Log pour debug - identifier les tentatives de navigation vers des pages inconnues
        if (currentPage && currentPage !== ('home' as PageName)) {
          console.warn(`⚠️ Navigation vers page inconnue: "${currentPage}" - Redirection vers home`);
        }
        return <HomePageNew onNavigate={navigateToString} onShowAuth={() => setShowAuthModal(true)} />;
    }
  };  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        <div
          key={currentPage}
          className="min-h-screen"
        >
          {renderPage()}
        </div>
      </AnimatePresence>

      {/* Modals */}
      {showAuthModal && (
        <LoginModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showNotifications && (
        <NotificationCenter 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onNavigate={navigateToString}
        />
      )}

      {/* Cart Summary Widget (visible partout pour les restaurants) */}
      {isAuthenticated && user?.role === 'restaurant' && (
        <CartSummaryWidget onCheckout={() => navigateTo('checkout')} />
      )}

      {/* Floating Publish Button (visible pour tous les utilisateurs connectés) */}
      {isAuthenticated && <FloatingPublishButton />}
    </div>
  );
}

// Composant App principal avec AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
