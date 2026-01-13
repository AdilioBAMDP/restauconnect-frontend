import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuthContext';
import type { AuthContextType } from './contexts/AuthContext';
import NotificationCenter from './components/features/NotificationCenter';
import { NavigationManager, type PageName } from './services/NavigationManager';
import { useCompatibleNavigation } from './hooks/useCompatibleNavigation';
import { useAppStore } from './stores/appStore';
import { useMessageNotifications } from './hooks/useMessageNotifications';

// Composant de chargement optimisé
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Lazy loading des pages pour optimiser les performances
const HomePageNew = lazy(() => import('./pages/home/Home'));
const SearchPage = lazy(() => import('./pages/misc/Search'));
const ProfilePage = lazy(() => import('./pages/profile/Profile'));
const MessagesPage = lazy(() => import('./pages/messaging/Messages'));
const CalendarPage = lazy(() => import('./pages/misc/Calendar'));
const OffersPage = lazy(() => import('./pages/offers/List'));
const FinancesPage = lazy(() => import('./pages/finance/Dashboard'));
const ArtisanRevenusPage = lazy(() => import('./pages/artisan/Revenus'));
const SupplierRevenusPage = lazy(() => import('./pages/supplier/Revenus'));
const CompleteDashboard = lazy(() => import('./pages/dashboards/RestaurantDashboard'));
// DataValidationPage non trouvé, à commenter ou créer si besoin
// const DataValidationPage = lazy(() => import('./pages/DataValidationPage'));
const WelcomePage = lazy(() => import('./pages/home/WelcomePage'));
// AdminCreateUserPage non trouvé, à commenter ou créer si besoin
// const AdminCreateUserPage = lazy(() => import('./pages/AdminCreateUserPage'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'));
const CataloguePage = lazy(() => import('./pages/marketplace/Catalogue'));
const MissionsPage = lazy(() => import('./pages/offers/Missions'));
const SettingsPage = lazy(() => import('./pages/profile/Settings'));
const StatsPage = lazy(() => import('./pages/analytics/Stats'));
const SupplierDashboard = lazy(() => import('./pages/dashboards/SupplierDashboard'));
const SupplierOrdersPage = lazy(() => import('./pages/supplier/Orders'));
const SupplierOrderDetailPage = lazy(() => import('./pages/supplier/OrderDetail'));
const SupplierCatalogView = lazy(() => import('./pages/SupplierCatalogView'));
const SupplierSelectionPage = lazy(() => import('./pages/SupplierSelectionPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CandidatEmploiPage = lazy(() => import('./pages/candidat/Emploi'));
// ArtisanDashboardUnified non trouvé, à commenter ou créer si besoin
// const ArtisanDashboardUnified = lazy(() => import('./components/artisan/ArtisanDashboardUnified'));
const BankerDashboard = lazy(() => import('./pages/dashboards/BankerDashboard'));
const AccountantDashboard = lazy(() => import('./pages/dashboards/AccountantDashboard'));
const CommunityManagerDashboard = lazy(() => import('./pages/dashboards/CommunityManagerDashboard'));
const CommunityManagerServices = lazy(() => import('./pages/community-manager/Services'));
// ComptablePage non trouvé, à commenter ou créer si besoin
// const ComptablePage = lazy(() => import('./pages/ComptablePage'));
// BanquesPage non trouvé, à commenter ou créer si besoin
// const BanquesPage = lazy(() => import('./pages/BanquesPage'));
const InvestorDashboard = lazy(() => import('./pages/dashboards/InvestorDashboard'));
const ApiConnectionTest = lazy(() => import('./components/testing/ApiConnectionTest'));
const TestConnection = lazy(() => import('./components/testing/TestConnection'));
const LoginModal = lazy(() => import('./components/auth/LoginModal'));
const DriverDashboard = lazy(() => import('./pages/dashboards/DriverDashboard'));
const CandidatDashboard = lazy(() => import('./pages/dashboards/CandidatDashboard'));
const TransporteurDashboard = lazy(() => import('./pages/dashboards/TransporteurDashboard'));
const AuditeurDashboard = lazy(() => import('./pages/dashboards/AuditeurDashboard'));
const InformationGlobale = lazy(() => import('./pages/InformationGlobale'));
const Marketplace = lazy(() => import('./pages/marketplace/Marketplace'));
const OfferDetails = lazy(() => import('./pages/marketplace/OfferDetails'));
const ConversationPage = lazy(() => import('./pages/ConversationPage'));
const PortfolioPage = lazy(() => import('./pages/finance/Portfolio'));
const OpportunitiesPage = lazy(() => import('./pages/offers/Opportunities'));
const TransactionsPage = lazy(() => import('./pages/finance/Transactions'));
const RestaurantInventoryPage = lazy(() => import('./pages/restaurant/Inventory'));
const BankerLoansPage = lazy(() => import('./pages/banker/Loans'));
const BankerClientsPage = lazy(() => import('./pages/banker/Clients'));
const BankerRiskPage = lazy(() => import('./pages/banker/Risk'));
const DriverRoutesPage = lazy(() => import('./pages/driver/Routes'));
const DriverDeliveriesPage = lazy(() => import('./pages/driver/Deliveries'));
const DriverEarningsPage = lazy(() => import('./pages/driver/Earnings'));
const DriverSchedulePage = lazy(() => import('./pages/driver/Schedule'));
const ArtisanProductsPage = lazy(() => import('./pages/artisan/Products'));
const ArtisanOrdersPage = lazy(() => import('./pages/artisan/Orders'));
const ArtisanCustomersPage = lazy(() => import('./pages/artisan/Customers'));
const RestaurantAnalyticsPage = lazy(() => import('./pages/restaurant/Analytics'));
// GeneralAnalyticsPage non trouvé, à commenter ou créer si besoin
// const GeneralAnalyticsPage = lazy(() => import('./pages/GeneralAnalyticsPage'));
const OrdersPage = lazy(() => import('./pages/orders/List'));
const PartnersListPage = lazy(() => import('./pages/PartnersListPage'));

// Composants non lazy (toujours nécessaires)
const CartSummaryWidget = lazy(() => import('./components/cart/CartSummaryWidget'));
const FloatingPublishButton = lazy(() => import('./components/offers/FloatingPublishButton'));
const PWAInstallPrompt = lazy(() => import('./components/common/PWAInstallPrompt'));

// Composant interne qui utilise le contexte d'authentification

function AppContent() {
  const { navigateTo, currentPage } = useCompatibleNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const auth = useAuth() as AuthContextType;
  const user = auth.user;
  const isAuthenticated = auth.isAuthenticated;
  const isLoading = auth.isLoading;
  const hasRedirected = useRef(false);

  // Ajout du hook notifications/messages temps réel
  useMessageNotifications(isAuthenticated, user?.id);

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

    // Cleanup à la destruction
    return () => {
      NavigationManager.destroy();
    };
  }, []);

  // Mapping des rôles vers leurs dashboards (COHÉRENCE BACKEND-FRONTEND)
  const getRoleDefaultPage = (role: string): string => {
    const rolePageMap: { [key: string]: string } = {
      'restaurant': 'restaurant-dashboard',        // ✅ CORRIGÉ: était 'dashboard'
      'artisan': 'artisan-dashboard',
      'fournisseur': 'supplier-dashboard',
      'candidat': 'candidat-dashboard',            // ✅ NOUVEAU: dashboard spécifique candidat
      'community_manager': 'community-manager-dashboard',
      'super_admin': 'admin-dashboard',
      'superadmin': 'admin-dashboard',             // ✅ AJOUTÉ: variation du rôle
      'admin': 'admin-dashboard',
      'banquier': 'banker-dashboard',
      'investisseur': 'investor-dashboard',
      'comptable': 'comptable-dashboard',          // ✅ CORRIGÉ: était 'accountant-dashboard'
      'livreur': 'driver-dashboard',
      'transporteur': 'transporteur-dashboard',    // ✅ NOUVEAU: dashboard transporteur
      'auditeur': 'auditeur-dashboard'            // ✅ NOUVEAU: dashboard auditeur
    };
    return rolePageMap[role] || 'dashboard';
  };

  // Effet pour rediriger l'utilisateur authentifié vers son dashboard
  useEffect(() => {
    console.log('📍 Navigation check:', {
      isAuthenticated,
      role: user && 'role' in user ? user.role : undefined,
      hasRedirected: hasRedirected.current,
      currentPage
    });

    // Redirection automatique après connexion
    if (isAuthenticated && user && 'role' in user && user.role) {
      const defaultPage = getRoleDefaultPage(user.role);

      // Si on est sur 'home' ou pas encore redirigé, faire la redirection
      if (currentPage === 'home' || !hasRedirected.current) {
        hasRedirected.current = true;
        console.log(`🔄 Redirection automatique après connexion: ${user && 'role' in user ? user.role : ''} → ${defaultPage}`);
        navigateTo(defaultPage as PageName);
      }
    }
  }, [isAuthenticated, user, currentPage, navigateTo]);

  // Reset du flag de redirection à la déconnexion
  useEffect(() => {
    if (!isAuthenticated) {
      hasRedirected.current = false;
      console.log('🔓 Déconnexion - Reset du flag de redirection');
    }
  }, [isAuthenticated]);

  // Afficher modal d'authentification si utilisateur non connecté et pas sur home
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !showAuthModal && currentPage !== 'home') {
      setShowAuthModal(true);
    }
  }, [isLoading, isAuthenticated, showAuthModal, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePageNew onNavigate={navigateTo} onShowAuth={() => setShowAuthModal(true)} />;
      case 'search':
        return <SearchPage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} />;
      case 'messages':
        return <MessagesPage navigateTo={navigateTo} />;
      case 'calendar':
        return <CalendarPage onNavigate={navigateTo} />;
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
        return <CataloguePage onNavigate={navigateTo} />;
      case 'missions':
        return <MissionsPage onNavigate={navigateTo} />;
      case 'candidat-emploi':
        return <CandidatEmploiPage />;
      case 'artisan-dashboard':
          return null;
      case 'banker-dashboard':
        return <BankerDashboard onNavigate={navigateTo} />;
      case 'community-manager-dashboard':
        return <CommunityManagerDashboard navigateTo={navigateTo} />;
      case 'community-manager-services':
        return <CommunityManagerServices navigateTo={navigateTo} />;
      case 'comptable':
          return null;
      case 'accountant-dashboard':
        return <AccountantDashboard />;
      case 'banques':
          return null;
      case 'investor-dashboard':
        return <InvestorDashboard onNavigate={navigateTo} />;
      case 'driver-dashboard':
        return <DriverDashboard />;
      case 'candidat-dashboard':
        return <CandidatDashboard />;
      case 'transporteur-dashboard':
        return <TransporteurDashboard />;
      case 'auditeur-dashboard':
        return <AuditeurDashboard />;

      // ✅ ROUTE UNIFIÉE DASHBOARD - Détection automatique du rôle CORRIGÉE
      case 'dashboard': {
        // Redirection intelligente selon le rôle utilisateur
        if (user && 'role' in user && user.role === 'restaurant') {
          return <CompleteDashboard />;
        } else if (user && 'role' in user && user.role === 'fournisseur') {
          return <SupplierDashboard navigateTo={navigateTo} />;
        } else if (user && 'role' in user && user.role === 'artisan') {
          return null;
        } else if (user && 'role' in user && user.role === 'banquier') {
          return <BankerDashboard onNavigate={navigateTo} />;
        } else if (user && 'role' in user && user.role === 'investisseur') {
          return <InvestorDashboard onNavigate={navigateTo} />;
        } else if (user && 'role' in user && user.role === 'livreur') {
          return <DriverDashboard />;
        } else if (user && 'role' in user && user.role === 'candidat') {
          return <CandidatDashboard />;
        } else if (user && 'role' in user && user.role === 'transporteur') {
          return <TransporteurDashboard />;
        } else if (user && 'role' in user && user.role === 'auditeur') {
          return <AuditeurDashboard />;
        } else if (user && 'role' in user && (user.role === 'admin' || user.role === 'super_admin')) {
          return <AdminDashboard navigateTo={navigateTo} />;
        } else {
          // Fallback : dashboard restaurant par défaut
          return <CompleteDashboard />;
        }
      }

      // 🔒 Routes spécifiques (rétrocompatibilité)
      case 'restaurant-dashboard':
        return <CompleteDashboard />;
      case 'supplier-dashboard':
        return <SupplierDashboard navigateTo={navigateTo} />;
      case 'supplier-orders':
        // ✅ PAGE COMMANDES FOURNISSEUR (sans dashboard)
        return <SupplierOrdersPage navigateTo={navigateTo} />;
      case 'supplier-order-detail':
        // ✅ PAGE DÉTAIL COMMANDE FOURNISSEUR
        return <SupplierOrderDetailPage navigateTo={navigateTo} />;
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
        return <CheckoutPage onBack={() => navigateTo('supplier-catalog')} onSuccess={(orderId) => {
          console.log('✅ Commande créée avec succès:', orderId);
          // Rediriger vers la page des commandes pour voir le suivi
          navigateTo('orders');
        }} />;
      }
      case 'welcome':
        return <WelcomePage onSelectRole={() => navigateTo('dashboard')} />;
      case 'admin-dashboard':
        return <AdminDashboard navigateTo={navigateTo} />;
      case 'admin-create-user':
          return null;
      case 'settings':
        return <SettingsPage onNavigate={navigateTo} />;
      case 'stats':
        return <StatsPage onNavigate={navigateTo} />;
      case 'api-test':
        return <ApiConnectionTest onNavigate={navigateTo} />;
      case 'test-connection':
        return <TestConnection onNavigate={navigateTo} />;
      case 'data-validation':
          return null;
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
        if (user && 'role' in user && user.role === 'restaurant') {
          return <RestaurantInventoryPage />;
        }
        // Artisans : page en développement
        console.warn(`⚠️ Page "inventory" en développement pour artisan, affichage artisan-dashboard`);
        // return <ArtisanDashboardUnified />;
        return null;
      }

      // ✅ Pages Artisan - FONCTIONNELLES
      case 'products':
        return <ArtisanProductsPage />;

      // 🔧 FIX ROUTE UNIFIÉE - Détection automatique du rôle
      case 'orders': {
        // Restaurants → OrdersPage
        if (user && 'role' in user && user.role === 'restaurant') {
          return <OrdersPage onNavigate={navigateTo} />;
        }
        // Artisans et autres → ArtisanOrdersPage
        return <ArtisanOrdersPage />;
      }

      // 🔒 Alias pour compatibilité (à supprimer en v2.1)
      case 'restaurant-orders':
        console.warn('⚠️ Route obsolète "restaurant-orders" → utilisez "orders"');
        navigateTo('orders');
        return null;

      case 'customers':
        return <ArtisanCustomersPage />;

      // ✅ Pages Analytics - FONCTIONNELLES
      case 'analytics': {
        // Page analytics générale accessible à tous
        // return <GeneralAnalyticsPage />;
        return null;
      }
      case 'restaurant-analytics': {
        // Page analytics spécifique restaurant
        return <RestaurantAnalyticsPage />;
      }

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

      // ✅ NOUVEAU SYSTÈME ARTISAN DEVIS/FACTURES
      case 'artisan-pro':
        // return <ArtisanDashboardUnified />;
        return null;

      default:
        // Log pour debug - identifier les tentatives de navigation vers des pages inconnues
        if (currentPage && currentPage !== ('home' as PageName)) {
          console.warn(`⚠️ Navigation vers page inconnue: "${currentPage}" - Redirection vers home`);
        }
        return <HomePageNew onNavigate={navigateTo} onShowAuth={() => setShowAuthModal(true)} />;
    }
  };

  return (
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
          <Suspense fallback={<LoadingSpinner />}>
            {renderPage()}
          </Suspense>
        </div>
      </AnimatePresence>

      {/* Modals */}
      {showAuthModal && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><LoadingSpinner /></div>}>
          <LoginModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </Suspense>
      )}

      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onNavigate={navigateTo}
        />
      )}

      {/* Cart Summary Widget (visible partout pour les restaurants) */}
      {isAuthenticated && user && 'role' in user && user.role === 'restaurant' && (
        <Suspense fallback={null}>
          <CartSummaryWidget onCheckout={() => navigateTo('checkout')} />
        </Suspense>
      )}

      {/* Floating Publish Button (visible pour tous les utilisateurs connectés) */}
      {isAuthenticated && (
        <Suspense fallback={null}>
          <FloatingPublishButton />
        </Suspense>
      )}

      {/* PWA Install Prompt (visible pour tous les utilisateurs) */}
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
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