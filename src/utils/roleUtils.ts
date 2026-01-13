/**
 * ROLE UTILS - Utilitaires pour la gestion des rôles
 * Architecture MVC - Contrôleur
 */

import { UserRole } from '@/types';
import { 
  USER_ROLES, 
  ROLE_LABELS, 
  ROLE_COLORS, 
  ROLE_GROUPS, 
  ROLE_PERMISSIONS,
  ROLE_DASHBOARDS
} from '@/constants/roles';

// ==================== VÉRIFICATIONS DE PERMISSIONS ====================

export const roleUtils = {
  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  hasPermission: (userRole: UserRole, permission: string): boolean => {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes('all') || permissions.includes(permission);
  },

  /**
   * Vérifie si l'utilisateur appartient à un groupe de rôles
   */
  isInGroup: (userRole: UserRole, groupName: keyof typeof ROLE_GROUPS): boolean => {
    return ROLE_GROUPS[groupName].includes(userRole);
  },

  /**
   * Vérifie si l'utilisateur a l'un des rôles requis
   */
  hasAnyRole: (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(userRole);
  },

  // ==================== RÔLES ADMINISTRATIFS ====================

  isAdmin: (userRole: UserRole): boolean => {
    return roleUtils.isInGroup(userRole, 'ADMIN');
  },

  isSuperAdmin: (userRole: UserRole): boolean => {
    return userRole === USER_ROLES.SUPER_ADMIN;
  },

  canManageUsers: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'manage_users');
  },

  // ==================== PERMISSIONS MÉTIER ====================

  canCreateOffers: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'create_offers');
  },

  canApplyToOffers: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'apply_to_offers');
  },

  canManageInventory: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'manage_inventory');
  },

  canAccessUrgentRequests: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'access_urgent_requests');
  },

  canManageDeliveries: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'manage_deliveries');
  },

  canViewAnalytics: (userRole: UserRole): boolean => {
    return roleUtils.hasPermission(userRole, 'view_analytics');
  },

  // ==================== PERMISSIONS WMS ====================

  isTestAccount: (userEmail?: string): boolean => {
    return userEmail ? userEmail.endsWith('@test.com') || userEmail.endsWith('@test.fr') : false;
  },

  canAccessWMS: (userRole: UserRole, userEmail?: string): boolean => {
    if (roleUtils.isTestAccount(userEmail)) return true;
    return roleUtils.hasPermission(userRole, 'access_wms') || roleUtils.isAdmin(userRole);
  },

  getWMSAccessLevel: (userRole: UserRole, userEmail?: string): 'full' | 'personal' | 'none' => {
    if (roleUtils.isTestAccount(userEmail)) return 'full';
    if (roleUtils.isAdmin(userRole)) return 'full';
    if (userRole === USER_ROLES.FOURNISSEUR) return 'personal';
    return 'none';
  },

  getWMSTitle: (accessLevel: 'full' | 'personal' | 'none'): string => {
    switch (accessLevel) {
      case 'full': return 'WMS - Warehouse Management System Global';
      case 'personal': return 'Mon WMS - Gestion de mes entrepôts';
      case 'none': return 'WMS - Accès non autorisé';
    }
  },

  getWMSDescription: (accessLevel: 'full' | 'personal' | 'none'): string => {
    switch (accessLevel) {
      case 'full': return 'Gestion professionnelle de tous les stocks et entrepôts';
      case 'personal': return 'Gestion de vos stocks et entrepôts personnels';
      case 'none': return 'Accès WMS réservé aux fournisseurs et administrateurs';
    }
  },

  // ==================== FONCTIONS D'AFFICHAGE ====================

  getRoleDisplayName: (userRole: UserRole): string => {
    return ROLE_LABELS[userRole] || 'Utilisateur';
  },

  getRoleColor: (userRole: UserRole): string => {
    return ROLE_COLORS[userRole] || 'bg-gray-500';
  },

  getRoleDashboard: (userRole: UserRole): string => {
    return ROLE_DASHBOARDS[userRole] || 'dashboard';
  },

  // ==================== NAVIGATION ====================

  getNavigationItems: (userRole: UserRole) => {
    const baseItems = [
      { id: 'home', label: 'Accueil', icon: 'Home' },
      { id: 'profile', label: 'Profil', icon: 'User' },
      { id: 'messages', label: 'Messages', icon: 'MessageCircle' }
    ];

    const roleSpecificItems: Record<string, Array<{id: string, label: string, icon: string}>> = {
      [USER_ROLES.RESTAURANT]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'offers', label: 'Mes Offres', icon: 'Briefcase' },
        { id: 'search', label: 'Trouver des Services', icon: 'Search' },
        { id: 'inventory', label: 'Approvisionnement', icon: 'Package' },
        { id: 'staff', label: 'Équipe', icon: 'Users' },
        { id: 'calendar', label: 'Planning', icon: 'Calendar' }
      ],
      [USER_ROLES.ARTISAN]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'missions', label: 'Missions', icon: 'Wrench' },
        { id: 'calendar', label: 'Planning', icon: 'Calendar' },
        { id: 'search', label: 'Rechercher Missions', icon: 'Search' },
        { id: 'portfolio', label: 'Portfolio', icon: 'Image' }
      ],
      [USER_ROLES.FOURNISSEUR]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'catalogue', label: 'Catalogue', icon: 'Package' },
        { id: 'orders', label: 'Commandes', icon: 'ShoppingCart' },
        { id: 'deliveries', label: 'Livraisons', icon: 'Truck' },
        { id: 'clients', label: 'Clients', icon: 'Users' },
        { id: 'wms', label: 'WMS', icon: 'Warehouse' }
      ],
      [USER_ROLES.CANDIDAT]: [
        { id: 'search', label: 'Rechercher', icon: 'Search' },
        { id: 'candidatures', label: 'Mes Candidatures', icon: 'FileText' },
        { id: 'calendar', label: 'Planning', icon: 'Calendar' },
        { id: 'training', label: 'Formations', icon: 'BookOpen' }
      ],
      [USER_ROLES.BANQUIER]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'clients', label: 'Clients', icon: 'Users' },
        { id: 'analytics', label: 'Analyses', icon: 'TrendingUp' },
        { id: 'opportunities', label: 'Opportunités', icon: 'Briefcase' }
      ],
      [USER_ROLES.COMPTABLE]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'clients', label: 'Clients', icon: 'Users' },
        { id: 'reports', label: 'Rapports', icon: 'FileText' },
        { id: 'audit', label: 'Audit', icon: 'CheckCircle' }
      ],
      [USER_ROLES.INVESTISSEUR]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'opportunities', label: 'Opportunités', icon: 'Briefcase' },
        { id: 'portfolio', label: 'Portfolio', icon: 'PieChart' },
        { id: 'analytics', label: 'Analyses', icon: 'TrendingUp' }
      ],
      [USER_ROLES.TRANSPORTEUR]: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3' },
        { id: 'deliveries', label: 'Livraisons', icon: 'Truck' },
        { id: 'routes', label: 'Itinéraires', icon: 'Map' },
        { id: 'fleet', label: 'Flotte', icon: 'Truck' }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[userRole] || [])];
  }
};

export default roleUtils;
