/**
 * 📦 INDEX CENTRAL - Export de tous les stores
 * 
 * Import unique pour tous les stores :
 * import { useMarketplaceStore, useOffersStore, MarketplacePost } from '@/stores'
 */

// ========== STORES ==========
export { useMarketplaceStore } from './marketplace/marketplaceStore';
export { useOffersStore } from './offers/offersStore';
export { useCandidatStore } from './candidat/candidatStore';
export { useSupplierStore } from './supplier/supplierStore';
export { useCMStore } from './community-manager/cmStore';
export { useBankStore } from './bank/bankStore';
export { useAccountantStore } from './accountant/accountantStore';

// ========== TYPES ==========
export * from './types';
