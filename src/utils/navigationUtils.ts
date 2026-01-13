import { useAuth } from '@/hooks/useAuthContext';

// Type pour les pages valides de l'application
export type PageName = 
  | 'home' | 'dashboard' 
  | 'restaurant-dashboard' | 'supplier-dashboard' | 'artisan-dashboard' 
  | 'investor-dashboard' | 'banker-dashboard' | 'community-manager-dashboard'
  | 'comptable-dashboard' | 'transporteur-dashboard' | 'livreur-dashboard' | 'admin-dashboard'
  | 'messages' | 'profile' | 'search' | 'calendar' | 'offers' | 'settings' | 'stats';

/**
 * 🎯 FONCTION PRINCIPALE - Obtenir le dashboard par défaut selon le rôle
 * Remplace toutes les redirections génériques vers 'dashboard'
 * CORRIGE: Problème détecté dans audit navigation octobre 2025
 */
export const getRoleDefaultDashboard = (userRole?: string): string => {
  if (!userRole) return 'home';

  const rolePageMap: { [key: string]: string } = {
    'restaurant': 'restaurant-dashboard',        // ✅ Restaurant
    'artisan': 'artisan-dashboard',              // ✅ Artisan  
    'fournisseur': 'supplier-dashboard',         // ✅ Fournisseur
    'supplier': 'supplier-dashboard',            // ✅ Alias anglais
    'candidat': 'candidat-dashboard',            // ✅ CORRIGÉ: était 'candidat-emploi' 
    'community_manager': 'community-manager-dashboard', // ✅ Community Manager
    'super_admin': 'admin-dashboard',            // ✅ Super Admin
    'superadmin': 'admin-dashboard',             // ✅ Variation du nom
    'admin': 'admin-dashboard',                  // ✅ Admin
    'banquier': 'banker-dashboard',              // ✅ Banquier
    'banker': 'banker-dashboard',                // ✅ Alias anglais
    'investisseur': 'investor-dashboard',        // ✅ Investisseur
    'investor': 'investor-dashboard',            // ✅ Alias anglais
    'comptable': 'comptable-dashboard',          // ✅ Comptable
    'transporteur': 'transporteur-dashboard',    // ✅ Transporteur
    'livreur': 'driver-dashboard',               // ✅ CORRIGÉ: était 'livreur-dashboard'
    'auditeur': 'auditeur-dashboard'            // ✅ AJOUTÉ: manquant
  };
  
  return rolePageMap[userRole.toLowerCase()] || 'dashboard';
};

// ✅ RÉTROCOMPATIBILITÉ: Garder l'ancienne fonction pour éviter breaking changes
export const getUserDashboard = getRoleDefaultDashboard;

/**
 * 🔧 Hook pour navigation intelligente - VERSION AMÉLIORÉE
 * Utilise automatiquement le bon dashboard selon le rôle de l'utilisateur connecté
 */
export const useUserDashboardNavigation = () => {
  const { user } = useAuth();
  
  const navigateToUserDashboard = (onNavigate: (page: string) => void) => {
    const dashboardPage = getRoleDefaultDashboard(user?.role);
    console.log(`🧭 Navigation intelligente: ${user?.role} → ${dashboardPage}`);
    onNavigate(dashboardPage);
  };
  
  return { 
    navigateToUserDashboard, 
    userDashboard: getRoleDefaultDashboard(user?.role),
    // ✅ NOUVELLES FONCTIONS UTILES
    getRoleDashboard: () => getRoleDefaultDashboard(user?.role),
    currentUserRole: user?.role
  };
};

/**
 * 🔍 VALIDATION - Vérifier si une page est accessible pour un rôle
 */
export const validatePageAccess = (targetPage: string, userRole: string): boolean => {
  const rolePermissions: Record<string, string[]> = {
    'restaurant': [
      'restaurant-dashboard', 'supplier-catalog', 'supplier-catalog-view', 
      'checkout', 'orders', 'messages', 'profile', 'search', 'calendar',
      'restaurant-inventory', 'finances'
    ],
    'supplier': [
      'supplier-dashboard', 'supplier-catalog', 'supplier-orders', 
      'supplier-revenus', 'messages', 'profile', 'offers', 'search'
    ],
    'fournisseur': [
      'supplier-dashboard', 'supplier-catalog', 'supplier-orders', 
      'supplier-revenus', 'messages', 'profile', 'offers', 'search'
    ],
    'artisan': [
      'artisan-dashboard', 'missions', 'artisan-revenus', 'messages', 
      'profile', 'search', 'calendar', 'offers'
    ],
    'investor': [
      'investor-dashboard', 'portfolio', 'transactions', 'opportunities',
      'analytics', 'messages', 'profile', 'search'
    ],
    'investisseur': [
      'investor-dashboard', 'portfolio', 'transactions', 'opportunities',
      'analytics', 'messages', 'profile', 'search'
    ],
    'banker': [
      'banker-dashboard', 'transactions', 'analytics', 'messages', 
      'profile', 'search'
    ],
    'banquier': [
      'banker-dashboard', 'transactions', 'analytics', 'messages', 
      'profile', 'search'
    ],
    'community_manager': [
      'community-manager-dashboard', 'community-manager-services',
      'messages', 'profile', 'stats', 'offers'
    ],
    'comptable': [
      'comptable-dashboard', 'finances', 'transactions', 'analytics',
      'messages', 'profile'
    ],
    'transporteur': [
      'transporteur-dashboard', 'orders', 'messages', 'profile', 'calendar'
    ],
    'livreur': [
      'livreur-dashboard', 'orders', 'messages', 'profile', 'calendar'
    ],
    'admin': [
      'admin-dashboard', 'messages', 'profile', 'stats', 'settings',
      'search', 'offers', 'analytics', 'transactions'
    ]
  };

  // Pages accessibles à tous les rôles authentifiés
  const publicPages = ['messages', 'profile', 'search', 'settings', 'home'];
  
  if (publicPages.includes(targetPage)) return true;

  const userPermissions = rolePermissions[userRole?.toLowerCase()] || [];
  return userPermissions.includes(targetPage);
};

/**
 * 🔄 NAVIGATION INTELLIGENTE AVEC RETOUR
 */
export const useSmartNavigation = () => {
  const { user } = useAuth();

  const getSmartBackNavigation = (currentPage: string): string => {
    // Si on est sur une page de détail, retourner à la page liste
    const detailToListMap: Record<string, string> = {
      'supplier-order-detail': 'supplier-orders',
      'offer-details': 'offers',
      'conversation': 'messages',
      'checkout': 'supplier-catalog',
      'artisan-revenus': 'artisan-dashboard',
      'supplier-revenus': 'supplier-dashboard',
      'transactions': 'investor-dashboard',
      'portfolio': 'investor-dashboard',
      'analytics': 'investor-dashboard'
    };

    // Si une mapping existe, l'utiliser
    if (detailToListMap[currentPage]) {
      return detailToListMap[currentPage];
    }

    // Sinon, retourner au dashboard de l'utilisateur
    return getRoleDefaultDashboard(user?.role);
  };

  return { 
    getSmartBackNavigation,
    userDashboard: getRoleDefaultDashboard(user?.role)
  };
};
