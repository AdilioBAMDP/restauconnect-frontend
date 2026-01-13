/**
 * CONSTANTS - Définitions centralisées des rôles
 * Architecture MVC - Modèle
 */

import { UserRole } from '@/types';

// ==================== DÉFINITIONS DES RÔLES ====================

export const USER_ROLES = {
  RESTAURANT: 'restaurant',
  ARTISAN: 'artisan',
  FOURNISSEUR: 'fournisseur',
  CANDIDAT: 'candidat',
  COMMUNITY_MANAGER: 'community_manager',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  BANQUIER: 'banquier',
  COMPTABLE: 'comptable',
  INVESTISSEUR: 'investisseur',
  LIVREUR: 'livreur',
  TRANSPORTEUR: 'transporteur',
  AUDITEUR: 'auditeur',
  SUPPLIER: 'fournisseur',
  DRIVER: 'livreur',
  CARRIER: 'transporteur'
} as const;

// ==================== LABELS D'AFFICHAGE ====================

export const ROLE_LABELS: Record<UserRole, string> = {
  restaurant: 'Restaurant',
  artisan: 'Artisan & Services',
  fournisseur: 'Fournisseur',
  candidat: 'Candidat',
  community_manager: 'Community Manager',
  admin: 'Administrateur',
  super_admin: 'Super Administrateur',
  banquier: 'Banquier',
  comptable: 'Comptable',
  investisseur: 'Investisseur',
  livreur: 'Livreur',
  transporteur: 'Transporteur',
  auditeur: 'Auditeur',
  supplier: 'Fournisseur',
  driver: 'Livreur',
  carrier: 'Transporteur'
};

// ==================== COULEURS PAR RÔLE ====================

export const ROLE_COLORS: Record<UserRole, string> = {
  restaurant: 'bg-blue-500',
  artisan: 'bg-green-500',
  fournisseur: 'bg-purple-500',
  candidat: 'bg-orange-500',
  community_manager: 'bg-pink-500',
  admin: 'bg-indigo-500',
  super_admin: 'bg-red-500',
  banquier: 'bg-yellow-500',
  comptable: 'bg-teal-500',
  investisseur: 'bg-emerald-500',
  livreur: 'bg-cyan-500',
  transporteur: 'bg-blue-600',
  auditeur: 'bg-gray-500'
};

// ==================== GROUPES DE RÔLES ====================

export const ROLE_GROUPS = {
  ADMIN: ['super_admin', 'admin', 'community_manager'] as UserRole[],
  BUSINESS: ['restaurant', 'fournisseur', 'artisan'] as UserRole[],
  FINANCE: ['banquier', 'comptable', 'investisseur', 'auditeur'] as UserRole[],
  WORKFORCE: ['candidat', 'livreur'] as UserRole[],
  LOGISTICS: ['transporteur', 'livreur', 'fournisseur'] as UserRole[]
};

// ==================== PERMISSIONS PAR RÔLE ====================

export const ROLE_PERMISSIONS = {
  // Administrateurs
  super_admin: ['all'],
  admin: ['manage_users', 'view_analytics', 'moderate_content'],
  community_manager: ['moderate_content', 'view_analytics', 'manage_posts'],
  
  // Business
  restaurant: ['create_offers', 'manage_inventory', 'view_analytics', 'manage_staff'],
  fournisseur: ['create_offers', 'manage_inventory', 'manage_deliveries', 'access_wms'],
  artisan: ['create_offers', 'apply_to_offers', 'access_urgent_requests'],
  
  // Finance
  banquier: ['view_analytics', 'manage_finances'],
  comptable: ['view_analytics', 'manage_finances', 'audit_reports'],
  investisseur: ['view_analytics', 'view_opportunities'],
  auditeur: ['view_analytics', 'audit_reports', 'view_all_data'],
  
  // Workforce
  candidat: ['apply_to_offers', 'view_training'],
  livreur: ['manage_deliveries', 'view_routes'],
  
  // Logistics
  transporteur: ['manage_deliveries', 'view_routes', 'manage_fleet']
} as Record<UserRole, string[]>;

// ==================== DASHBOARDS PAR RÔLE ====================

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  restaurant: 'restaurant-dashboard',
  artisan: 'artisan-dashboard',
  fournisseur: 'supplier-dashboard',
  candidat: 'candidat-dashboard',              // ✅ CORRIGÉ: était 'candidate-dashboard'
  community_manager: 'community-manager-dashboard',
  admin: 'admin-dashboard',
  super_admin: 'admin-dashboard',
  banquier: 'banker-dashboard',
  comptable: 'comptable-dashboard',            // ✅ CORRIGÉ: était 'accountant-dashboard'
  investisseur: 'investor-dashboard',
  livreur: 'driver-dashboard',
  transporteur: 'transporteur-dashboard',      // ✅ CORRIGÉ: était 'carrier-dashboard'
  auditeur: 'auditeur-dashboard'              // ✅ CORRIGÉ: était 'auditor-dashboard'
};
