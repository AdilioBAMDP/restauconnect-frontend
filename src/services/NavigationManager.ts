/**
 * NAVIGATION MANAGER - Système unifié de navigation
 * 
 * Ce service centralise TOUTE la navigation de l'application pour éviter :
 * - Boucles infinies (window.location vs navigateTo)
 * - Incohérences (différentes méthodes selon les composants)
 * - Perte d'état (rechargements intempestifs)
 * 
 * UTILISATION:
 * ```typescript
 * import { NavigationManager } from '@/services/NavigationManager';
 * 
 * // Naviger vers une page
 * NavigationManager.navigateTo('messages', { conversation: '123' });
 * 
 * // Ouvrir conversation directement
 * NavigationManager.openConversation('conversation-id-123');
 * ```
 */

// ATTENTION: Ne PAS importer socket.io-client ici
// Le NavigationManager ne doit PAS gérer Socket.io (risque de conflits)
// Socket.io est déjà géré dans messageStore et autres stores

// Type des pages de l'application
export type PageName = 
  | 'login' | 'register' | 'home' | 'dashboard' | 'dashboard-transporteur'
  | 'restaurant-dashboard' | 'supplier-dashboard' | 'artisan-dashboard' 
  | 'driver-dashboard' | 'banker-dashboard' | 'investor-dashboard'
  | 'candidat-dashboard' | 'transporteur-dashboard' | 'auditeur-dashboard'
  | 'community-manager-dashboard' | 'admin-dashboard' | 'accountant-dashboard'
  | 'messages' | 'notifications' | 'profile' | 'settings' | 'calendar'
  | 'marketplace' | 'search' | 'restaurant-orders' | 'checkout' | 'offers'
  | 'information-globale' | 'offer-details' | 'conversation'
  | 'finances' | 'artisan-revenus' | 'supplier-revenus' | 'catalogue' | 'missions'
  | 'candidat-emploi' | 'community-manager-services' | 'comptable' | 'banques'
  | 'welcome' | 'admin-create-user' | 'stats' | 'api-test' | 'test-connection'
  | 'data-validation' | 'tms-delivery' | 'restaurant-tms-history'
  | 'portfolio' | 'opportunities' | 'transactions' | 'loans' | 'clients' | 'risk'
  | 'routes' | 'deliveries' | 'earnings' | 'schedule' | 'inventory' | 'products'
  | 'orders' | 'restaurant-orders' | 'customers' | 'analytics' | 'restaurant-analytics'
  | 'test-accounts' | 'supplier-orders' | 'supplier-order-detail' | 'supplier-catalog'
  | 'supplier-selection' | 'comptable-dashboard'
  | 'partenaires-restaurant' | 'partenaires-fournisseur' | 'partenaires-artisan'
  | 'partenaires-transporteur' | 'partenaires-community-manager' | 'partenaires-banquier'
  | 'partenaires-comptable' | 'partenaires-investisseur' | 'partenaires-auditeur'
  | 'partenaires-demandeur-emploi' | 'artisan-pro'
  | 'transporteur-fleet' | 'transporteur-drivers' | 'transporteur-deliveries'
  | 'transporteur-documents' | 'transporteur-analytics' | 'transporteur-maintenance';

// Options de navigation
export interface NavigationOptions {
  // Query params à ajouter
  queryParams?: Record<string, string>;
  // État à passer (remplace query params si possible)
  state?: Record<string, unknown>;
  // Forcer rechargement complet (mode fallback)
  forceReload?: boolean;
  // Préserver l'historique (pushState vs replaceState)
  preserveHistory?: boolean;
}

// Interface pour AppStore
interface AppStore {
  navigateTo: (page: PageName) => void;
  currentPage: PageName | null;
}

class NavigationManagerClass {
  private navigationHistory: PageName[] = [];
  private currentPage: PageName | null = null;
  private appStoreGetter: (() => AppStore) | null = null;
  
  // Anti-loop protection: bloquer navigation si déjà en cours
  private isNavigating: boolean = false;
  private lastNavigationTime: number = 0;
  private MIN_NAVIGATION_INTERVAL = 50; // ms entre 2 navigations (réduit pour permettre les redirections)

  /**
   * Initialiser NavigationManager
   * DOIT être appelé au démarrage de l'app
   */
  initialize(appStoreGetter: () => AppStore) {
    this.appStoreGetter = appStoreGetter;
    
    // Écouter le bouton retour du navigateur
    window.addEventListener('popstate', this.handleBrowserBack.bind(this));
    
    console.log('✅ NavigationManager initialized');
  }

  /**
   * Gérer le bouton retour du navigateur
   */
  private handleBrowserBack(event: PopStateEvent) {
    console.log('🔙 Bouton retour navigateur détecté', event);
    
    // Extraire la page depuis l'URL
    const path = window.location.pathname.replace(/^\//, '') || 'home';
    const page = path as PageName;
    
    // Mettre à jour l'état de l'application
    const appStore = this.getAppStore();
    if (appStore) {
      appStore.navigateTo(page);
      this.currentPage = page;
    }
  }

  /**
   * Naviguer vers une page
   * MÉTHODE PRINCIPALE - Utiliser celle-ci partout
   */
  navigateTo(page: PageName, options?: NavigationOptions) {
    // Anti-loop: vérifier interval
    const now = Date.now();
    if (this.isNavigating || (now - this.lastNavigationTime) < this.MIN_NAVIGATION_INTERVAL) {
      console.warn('⚠️ NavigationManager: Navigation trop rapide, ignorée', { page, lastNav: this.lastNavigationTime });
      return;
    }

    this.isNavigating = true;
    this.lastNavigationTime = now;

    try {
      console.log('🧭 NavigationManager: Navigating to', page, options);

      // Vérifier si on est déjà sur cette page
      if (this.currentPage === page && !options?.queryParams && !options?.forceReload) {
        console.log('ℹ️ NavigationManager: Already on page', page);
        this.isNavigating = false;
        return;
      }

      // Mode fallback: window.location (rechargement complet)
      if (options?.forceReload) {
        const url = this.buildUrl(page, options.queryParams);
        window.location.href = url;
        return; // isNavigating reste true (page va recharger)
      }

      // Mode normal: React state (pas de rechargement)
      const appStore = this.getAppStore();
      if (!appStore) {
        console.error('❌ NavigationManager: appStore not available, fallback to window.location');
        window.location.href = `/${page}`;
        return;
      }

      // Mettre à jour URL TOUJOURS (pas seulement avec query params)
      const url = this.buildUrl(page, options?.queryParams);
      if (options?.preserveHistory === false) {
        window.history.replaceState(options?.state || {}, '', url);
      } else {
        window.history.pushState(options?.state || {}, '', url);
      }

      // Naviguer via React state
      appStore.navigateTo(page);
      this.currentPage = page;
      this.navigationHistory.push(page);

    } finally {
      // Débloquer navigation après 100ms
      setTimeout(() => {
        this.isNavigating = false;
      }, this.MIN_NAVIGATION_INTERVAL);
    }
  }

  /**
   * Ouvrir une conversation (raccourci)
   * @param conversationId - ID de la conversation ou 'start' pour nouvelle conversation
   * @param partnerId - ID du partenaire (pour nouvelle conversation)
   * @param partnerName - Nom du partenaire (pour nouvelle conversation)
   */
  openConversation(conversationId: string, partnerId?: string, partnerName?: string) {
    const queryParams: Record<string, string> = { conversation: conversationId };
    
    if (partnerId) {
      queryParams.partnerId = partnerId;
    }
    if (partnerName) {
      queryParams.partnerName = partnerName;
    }
    
    console.log('🚀 NavigationManager.openConversation appelé:', { conversationId, partnerId, partnerName, queryParams });
    
    this.navigateTo('messages', {
      queryParams,
      preserveHistory: true
    });
  }

  /**
   * Retour arrière (historique)
   */
  goBack() {
    if (this.navigationHistory.length > 1) {
      // Retirer page actuelle
      this.navigationHistory.pop();
      // Retourner à la précédente
      const previousPage = this.navigationHistory[this.navigationHistory.length - 1];
      this.navigateTo(previousPage, { preserveHistory: false });
    } else {
      // Pas d'historique, retour au dashboard
      this.navigateTo('dashboard');
    }
  }

  /**
   * Construire URL avec query params
   */
  private buildUrl(page: PageName, queryParams?: Record<string, string>): string {
    // Mapping spécial pour toutes les pages avec des URLs propres
    const urlMap: Partial<Record<PageName, string>> = {
      // Dashboards principaux
      'home': '/',
      'dashboard': '/dashboard',
      'restaurant-dashboard': '/restaurant/dashboard',
      'supplier-dashboard': '/supplier/dashboard',
      'artisan-dashboard': '/artisan/dashboard',
      'driver-dashboard': '/driver/dashboard',
      'banker-dashboard': '/banker/dashboard',
      'investor-dashboard': '/investor/dashboard',
      'candidat-dashboard': '/candidat/dashboard',
      'transporteur-dashboard': '/transporteur/dashboard',
      'auditeur-dashboard': '/auditeur/dashboard',
      'community-manager-dashboard': '/community-manager/dashboard',
      'admin-dashboard': '/admin/dashboard',
      'accountant-dashboard': '/accountant/dashboard',
      'comptable-dashboard': '/comptable/dashboard',
      'dashboard-transporteur': '/transporteur/dashboard',
      
      // Pages Transporteur TMS
      'transporteur-fleet': '/transporteur/fleet',
      'transporteur-drivers': '/transporteur/drivers',
      'transporteur-deliveries': '/transporteur/deliveries',
      'transporteur-documents': '/transporteur/documents',
      'transporteur-analytics': '/transporteur/analytics',
      'transporteur-maintenance': '/transporteur/maintenance',
      
      // Pages Restaurant
      'restaurant-orders': '/restaurant/orders',
      'restaurant-analytics': '/restaurant/analytics',
      'restaurant-tms-history': '/restaurant/tms-history',
      
      // Pages Supplier
      'supplier-orders': '/supplier/orders',
      'supplier-order-detail': '/supplier/order-detail',
      'supplier-catalog': '/supplier/catalog',
      'supplier-selection': '/supplier/selection',
      'supplier-revenus': '/supplier/revenus',
      
      // Pages Artisan
      'artisan-revenus': '/artisan/revenus',
      'artisan-pro': '/artisan/pro',
      
      // Pages Candidat
      'candidat-emploi': '/candidat/emploi',
      
      // Pages Community Manager
      'community-manager-services': '/community-manager/services',
      
      // Pages Admin
      'admin-create-user': '/admin/create-user',
      'admin-platform-settings': '/admin/platform-settings',
      'data-validation': '/admin/data-validation',
      
      // Pages Banker
      'banques': '/banker/banks',
      
      // Pages générales
      'information-globale': '/#information-globale',
      'marketplace': '/#marketplace',
      'offer-details': '/marketplace/offer',
      'test-accounts': '/test/accounts',
      'api-test': '/test/api',
      'test-connection': '/test/connection',
      'tms-delivery': '/tms/delivery',
      
      // Partenaires
      'partenaires-restaurant': '/partners/restaurant',
      'partenaires-fournisseur': '/partners/supplier',
      'partenaires-artisan': '/partners/artisan',
      'partenaires-transporteur': '/partners/transporteur',
      'partenaires-community-manager': '/partners/community-manager',
      'partenaires-banquier': '/partners/banker',
      'partenaires-comptable': '/partners/accountant',
      'partenaires-investisseur': '/partners/investor',
      'partenaires-auditeur': '/partners/auditor',
      'partenaires-demandeur-emploi': '/partners/job-seeker',
      'partenaires-candidat': '/partners/candidat',
    };
    
    let url = urlMap[page] || `/${page}`;
    
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }
    
    console.log('🔗 NavigationManager.buildUrl:', { page, queryParams, finalUrl: url });
    return url;
  }

  /**
   * Récupérer appStore (avec fallback)
   */
  private getAppStore(): AppStore | null {
    if (this.appStoreGetter) {
      return this.appStoreGetter();
    }
    
    // Fallback: accès global (ancien système)
    return (window as Window & { useAppStore?: { getState?: () => AppStore } }).useAppStore?.getState?.() || null;
  }

  /**
   * Synchroniser avec l'URL actuelle (au démarrage de l'app)
   */
  syncWithCurrentUrl() {
    const path = window.location.pathname;
    
    // Mapping inverse complet: URL → PageName
    const reverseUrlMap: Record<string, PageName> = {
      '/': 'home',
      '/dashboard': 'dashboard',
      
      // Dashboards
      '/restaurant/dashboard': 'restaurant-dashboard',
      '/supplier/dashboard': 'supplier-dashboard',
      '/artisan/dashboard': 'artisan-dashboard',
      '/driver/dashboard': 'driver-dashboard',
      '/banker/dashboard': 'banker-dashboard',
      '/investor/dashboard': 'investor-dashboard',
      '/candidat/dashboard': 'candidat-dashboard',
      '/transporteur/dashboard': 'transporteur-dashboard',
      '/auditeur/dashboard': 'auditeur-dashboard',
      '/community-manager/dashboard': 'community-manager-dashboard',
      '/admin/dashboard': 'admin-dashboard',
      '/accountant/dashboard': 'accountant-dashboard',
      '/comptable/dashboard': 'comptable-dashboard',
      
      // Transporteur TMS
      '/transporteur/fleet': 'transporteur-fleet',
      '/transporteur/drivers': 'transporteur-drivers',
      '/transporteur/deliveries': 'transporteur-deliveries',
      '/transporteur/documents': 'transporteur-documents',
      '/transporteur/analytics': 'transporteur-analytics',
      '/transporteur/maintenance': 'transporteur-maintenance',
      
      // Restaurant
      '/restaurant/orders': 'restaurant-orders',
      '/restaurant/analytics': 'restaurant-analytics',
      '/restaurant/tms-history': 'restaurant-tms-history',
      
      // Supplier
      '/supplier/orders': 'supplier-orders',
      '/supplier/order-detail': 'supplier-order-detail',
      '/supplier/catalog': 'supplier-catalog',
      '/supplier/selection': 'supplier-selection',
      '/supplier/revenus': 'supplier-revenus',
      
      // Artisan
      '/artisan/revenus': 'artisan-revenus',
      '/artisan/pro': 'artisan-pro',
      
      // Candidat
      '/candidat/emploi': 'candidat-emploi',
      
      // Community Manager
      '/community-manager/services': 'community-manager-services',
      
      // Admin
      '/admin/create-user': 'admin-create-user',
      '/admin/platform-settings': 'admin-platform-settings',
      '/admin/data-validation': 'data-validation',
      
      // Banker
      '/banker/banks': 'banques',
      
      // Général
      '/info': 'information-globale',
      '/marketplace/offer': 'offer-details',
      '/test/accounts': 'test-accounts',
      '/test/api': 'api-test',
      '/test/connection': 'test-connection',
      '/tms/delivery': 'tms-delivery',
      
      // Partenaires
      '/partners/restaurant': 'partenaires-restaurant',
      '/partners/supplier': 'partenaires-fournisseur',
      '/partners/artisan': 'partenaires-artisan',
      '/partners/transporteur': 'partenaires-transporteur',
      '/partners/community-manager': 'partenaires-community-manager',
      '/partners/banker': 'partenaires-banquier',
      '/partners/accountant': 'partenaires-comptable',
      '/partners/investor': 'partenaires-investisseur',
      '/partners/auditor': 'partenaires-auditeur',
      '/partners/job-seeker': 'partenaires-demandeur-emploi',
      '/partners/candidat': 'partenaires-candidat',
    };
    
    // Chercher dans le mapping inverse d'abord
    let pageString = reverseUrlMap[path];
    
    // Si pas trouvé, essayer de parser l'URL
    if (!pageString) {
      pageString = path.substring(1); // Enlever le '/' du début

      // NOUVEAU: Gérer les routes admin spécifiques /admin/users, /admin/overview, etc.
      const adminSubPageMatch = pageString.match(/^admin\/(overview|users|registrations|applications|transactions|moderation|analytics|revenues|system|security|audit-log|create-user|settings)$/i);
      if (adminSubPageMatch) {
        const subPage = adminSubPageMatch[1].toLowerCase();
        // Mapper les sous-pages admin vers des onglets
        const adminTabMap: Record<string, string> = {
          'overview': 'overview',
          'users': 'users',
          'registrations': 'registrations',
          'applications': 'applications',
          'transactions': 'transactions',
          'moderation': 'moderation',
          'analytics': 'analytics',
          'revenues': 'revenues',
          'system': 'system',
          'security': 'security',
          'audit-log': 'auditlog',
          'create-user': 'create-user',
          'settings': 'settings'
        };
        const tab = adminTabMap[subPage];
        if (tab) {
          // Stocker l'onglet dans sessionStorage pour AdminDashboard
          sessionStorage.setItem('adminActiveTab', tab);
          pageString = 'admin-dashboard';
        }
      }

      // Mapping automatique d'URL classiques vers les clés internes PageName
      // Ex: /admin/dashboard => admin-dashboard, /restaurant/dashboard => restaurant-dashboard
      const dashboardMatch = pageString.match(/^(admin|restaurant|fournisseur|artisan|banquier|investisseur|comptable|livreur|candidat|community[-_]?manager|transporteur|auditeur)[\/_-]?dashboard$/i);
      if (dashboardMatch) {
        // Normalise le rôle
        let role = dashboardMatch[1].toLowerCase().replace(/[-_]/g, '');
        if (role === 'communitymanager' || role === 'community-manager') role = 'community-manager';
        const pageMap: Record<string, PageName> = {
          'admin': 'admin-dashboard',
          'superadmin': 'admin-dashboard',
          'restaurant': 'restaurant-dashboard',
          'fournisseur': 'supplier-dashboard',
          'artisan': 'artisan-dashboard',
          'banquier': 'banker-dashboard',
          'investisseur': 'investor-dashboard',
          'comptable': 'accountant-dashboard',
          'livreur': 'driver-dashboard',
          'candidat': 'candidat-dashboard',
          'community-manager': 'community-manager-dashboard',
          'transporteur': 'transporteur-dashboard',
          'auditeur': 'auditeur-dashboard',
        };
        const mappedPage = pageMap[role];
        if (mappedPage) {
          pageString = mappedPage;
        }
      }
    }

    if (pageString && pageString !== 'home') {
      const page = pageString as PageName;
      console.log('🔄 NavigationManager: Syncing with URL', page);
      this.currentPage = page;
      // Informer l'app store de la page actuelle
      const appStore = this.getAppStore();
      if (appStore) {
        appStore.navigateTo(page);
      }
    }
  }

  /**
   * Nettoyer ressources
   */
  destroy() {
    this.navigationHistory = [];
    this.currentPage = null;
    console.log('✅ NavigationManager destroyed');
  }
}

// Singleton: une seule instance dans toute l'app
export const NavigationManager = new NavigationManagerClass();
