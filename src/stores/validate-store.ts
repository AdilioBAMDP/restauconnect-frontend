/**
 * SCRIPT DE VALIDATION DU STORE REFACTORISÉ
 * Vérifie que toutes les fonctions et propriétés existent
 */

import { useBusinessStore } from './businessStore.ts';

console.log('🧪 TEST DE VALIDATION DU STORE REFACTORISÉ\n');

let errors = 0;
let successes = 0;

// Liste des propriétés d'état attendues
const expectedStateProperties = [
  'offers', 'professionals', 'applications', 'messages', 'partners', 'stats',
  'supplierProducts', 'supplierOrders', 'supplierClients', 'supplierStats',
  'cmServices', 'cmCampaigns', 'cmClients', 'cmStats',
  'candidatProfile', 'candidatApplications', 'jobOffers', 'savedSearches', 'candidatStats',
  'globalAnnouncements', 'announcementConfirmations', 'announcementInteractions', 'marketplacePosts',
  'bankPartners', 'loanOffers', 'bankConversations',
  'accountantProfile', 'accountingDocuments', 'accountantConversations', 'accountingAlerts'
];

// Liste des actions attendues
const expectedActions = [
  // Restaurant
  'createOffer', 'updateOffer', 'deleteOffer', 'searchProfessionals',
  'applyToOffer', 'updateApplicationStatus', 'sendMessage', 'markMessageAsRead', 'updateStats',
  // Admin
  'createProfessional', 'updateProfessional', 'deleteProfessional', 'toggleProfessionalVerification',
  'suspendProfessional', 'approveMessage', 'rejectMessage', 'validateOffer', 'rejectOffer', 'flagContent',
  // Supplier
  'createProduct', 'updateProduct', 'deleteProduct', 'updateProductStock',
  'createOrder', 'updateOrderStatus', 'addClient', 'updateClient', 'updateSupplierStats',
  // Community Manager
  'createCMService', 'updateCMService', 'deleteCMService',
  'createCMCampaign', 'updateCMCampaign', 'deleteCMCampaign', 'updateCampaignMetrics',
  'addCMClient', 'updateCMClient', 'updateCMStats',
  // Candidat
  'updateCandidatProfile', 'addJobApplication', 'updateJobApplication', 'deleteJobApplication',
  'addSavedSearch', 'updateSavedSearch', 'deleteSavedSearch', 'updateCandidatStats',
  // Marketplace
  'fetchGlobalAnnouncements', 'createAnnouncement', 'updateAnnouncement', 'deleteAnnouncement',
  'confirmAnnouncementActive', 'recordAnnouncementInteraction', 'getAnnouncementsForRole',
  'addMarketplacePost', 'updateMarketplacePost', 'deleteMarketplacePost',
  'likeMarketplacePost', 'bookmarkMarketplacePost', 'getMarketplacePostsByRole', 'fetchMarketplacePosts',
  // Banques
  'getBanksByLocation', 'getLoanOffersByType', 'createBankConversation', 'sendBankMessage', 'markBankMessageRead',
  // Comptable
  'assignAccountant', 'createAccountingConversation', 'sendAccountingMessage',
  'uploadAccountingDocument', 'markAccountingAlertRead'
];

console.log('📋 Vérification des propriétés d\'état...\n');

const store = useBusinessStore.getState();

expectedStateProperties.forEach(prop => {
  if (prop in store) {
    console.log(`✅ ${prop}`);
    successes++;
  } else {
    console.log(`❌ ${prop} - MANQUANT`);
    errors++;
  }
});

console.log('\n📋 Vérification des actions...\n');

expectedActions.forEach(action => {
  if (action in store && typeof store[action as keyof typeof store] === 'function') {
    console.log(`✅ ${action}()`);
    successes++;
  } else {
    console.log(`❌ ${action}() - MANQUANT ou PAS UNE FONCTION`);
    errors++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`RÉSULTAT: ${successes} succès, ${errors} erreurs`);
console.log('='.repeat(60));

if (errors === 0) {
  console.log('\n🎉 TOUS LES TESTS PASSENT ! Le store refactorisé est complet.');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${errors} éléments manquants. Vérifier la refactorisation.`);
  process.exit(1);
}
