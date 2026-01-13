/**
 * ROLE MANAGEMENT - Point d'entrée centralisé
 * Architecture MVC pour la gestion des rôles
 * 
 * @module roles
 * 
 * Structure:
 * - Constants: Définitions et configurations (roles.ts)
 * - Utils: Fonctions utilitaires et permissions (roleUtils.ts)
 * - Types: Définitions TypeScript (types/index.ts)
 * 
 * Usage:
 * import { USER_ROLES, roleUtils, ROLE_LABELS } from '@/constants/roles';
 */

// ==================== EXPORTS ====================

// Constants (Model)
export {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_GROUPS,
  ROLE_PERMISSIONS,
  ROLE_DASHBOARDS
} from './roles';

// Utils (Controller)
export { roleUtils } from '@/utils/roleUtils';

// Types are exported from types/index.ts
export type { UserRole } from '@/types';
