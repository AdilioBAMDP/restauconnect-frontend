/**
 * FEATURE FLAGS - Configuration des fonctionnalités expérimentales
 * 
 * Permet d'activer/désactiver instantanément des fonctionnalités
 * sans redéploiement ni modification de code.
 * 
 * ROLLBACK RAPIDE: Passer un flag à false désactive la fonctionnalité en < 10s
 * 
 * Usage:
 * ```typescript
 * import { FEATURES } from './config/features';
 * 
 * if (FEATURES.SMART_RANKING) {
 *   // Utiliser scoring intelligent
 * } else {
 *   // Comportement par défaut
 * }
 * ```
 */

export const FEATURES = {
  /**
   * SMART_RANKING - Système de scoring intelligent pour Marketplace
   * 
   * Quand activé:
   * - Utilise /api/marketplace/posts/ranked au lieu de /api/marketplace/posts
   * - Trie les posts par score pondéré (sponsor 35%, nouveauté 20%, etc.)
   * - Permet boost payant (Basic, Premium, Platinum)
   * 
   * Quand désactivé:
   * - Utilise route /api/marketplace/posts classique
   * - Tri chronologique simple par timestamp
   * - Comportement identique à version pré-scoring
   * 
   * VALEUR PAR DÉFAUT: false (SÉCURITÉ)
   * ROLLBACK: Passer à false = rollback instantané < 10s
   * 
   * Activer seulement après tests complets et validation équipe
   */
  SMART_RANKING: false,

  /**
   * BOOST_PAYMENTS - Activation des paiements boost Stripe
   * 
   * Quand activé:
   * - Endpoint POST /api/marketplace/boost/purchase actif
   * - Traitement réel des paiements Stripe
   * - Webhooks Stripe pour confirmation
   * 
   * Quand désactivé:
   * - Endpoint retourne erreur 503 (Service temporairement indisponible)
   * - Mode simulation pour tests
   * 
   * VALEUR PAR DÉFAUT: false
   * Nécessite configuration Stripe valide avant activation
   */
  BOOST_PAYMENTS: false,

  /**
   * BOOST_ANALYTICS - Statistiques avancées boost
   * 
   * Quand activé:
   * - Endpoint GET /api/marketplace/boost/stats actif
   * - Tracking détaillé performance boost
   * - Graphiques ROI dans dashboard auteur
   * 
   * Quand désactivé:
   * - Endpoint retourne données basiques seulement
   * 
   * VALEUR PAR DÉFAUT: false
   */
  BOOST_ANALYTICS: false,

  /**
   * DEBUG_SCORING - Logs verbeux pour debugging scoring
   * 
   * Quand activé:
   * - Logs détaillés de chaque calcul de score
   * - Breakdown des composants dans réponse API
   * - Performance metrics dans console
   * 
   * Quand désactivé:
   * - Logs minimaux (erreurs seulement)
   * 
   * VALEUR PAR DÉFAUT: false (production)
   * Activer uniquement en développement/staging
   */
  DEBUG_SCORING: false
};

/**
 * Type-safe access aux feature flags
 */
export type FeatureFlag = keyof typeof FEATURES;

/**
 * Vérifier si une feature est activée
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature] === true;
}

/**
 * Obtenir toutes les features activées
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return (Object.keys(FEATURES) as FeatureFlag[]).filter(
    key => FEATURES[key] === true
  );
}

/**
 * Obtenir l'état de toutes les features
 */
export function getAllFeatures(): Record<FeatureFlag, boolean> {
  return { ...FEATURES };
}

/**
 * PROCÉDURE DE ROLLBACK EN CAS DE PROBLÈME
 * 
 * Niveau 1 - ROLLBACK INSTANTANÉ (moins de 10 secondes):
 * --------------------------------------------------------
 * 1. Ouvrir src/config/features.ts
 * 2. Modifier SMART_RANKING: true vers false
 * 3. Sauvegarder (Ctrl+S)
 * 4. Le hot-reload relancera l'app automatiquement
 * 5. Vérifier que l'app utilise à nouveau /marketplace/posts classique
 * 
 * Niveau 2 - ROLLBACK API (moins de 30 secondes):
 * ------------------------------------------------
 * 1. Commenter tout le bloc "NOUVELLES ROUTES" dans marketplace.ts
 * 2. Redémarrer backend: npm run dev
 * 3. Routes /ranked, /boost/* deviennent inaccessibles
 * 4. Seule route /posts classique disponible
 * 
 * Niveau 3 - ROLLBACK COMPLET (moins de 2 minutes):
 * --------------------------------------------------
 * 1. cd ProjetRestauConnect
 * 2. Stop serveurs: npm run stop-all (ou Ctrl+C)
 * 3. Restaurer backup depuis BACKUP_SCORING_SYSTEM_*
 * 4. Redémarrer: npm run dev
 * 5. Application revenue exactement à l'état pré-scoring
 * 
 * CONTACT EN CAS D'URGENCE:
 * - Vérifier logs: backend/logs/error.log
 * - Consulter GUIDE-SCORING-INTELLIGENT.md section troubleshooting
 */
