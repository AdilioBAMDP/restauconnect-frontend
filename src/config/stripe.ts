import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * 🔐 CONFIGURATION STRIPE
 * 
 * CLÉS TEST (pour développement) :
 * - Clé publique test : pk_test_...
 * - Utilisez les cartes de test Stripe : https://stripe.com/docs/testing
 * 
 * CLÉS PRODUCTION (pour production) :
 * - Clé publique prod : pk_live_...
 * - Activez uniquement quand vous êtes prêt pour les vrais paiements
 */

// Clé publique Stripe (TEST par défaut)
// ⚠️ IMPORTANT: Remplacez par votre vraie clé Stripe test
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51QJb7tRwlKa...'; // Placeholder - à remplacer

// Instance Stripe (chargée une seule fois)
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Obtenir l'instance Stripe
 * @returns Promise<Stripe | null>
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Cartes de test Stripe
 * Source: https://stripe.com/docs/testing#cards
 */
export const TEST_CARDS = {
  SUCCESS: {
    number: '4242 4242 4242 4242',
    description: 'Paiement réussi',
    cvc: 'Tout CVC à 3 chiffres',
    date: 'Toute date future'
  },
  REQUIRE_AUTHENTICATION: {
    number: '4000 0025 0000 3155',
    description: 'Requiert authentification 3D Secure',
    cvc: 'Tout CVC à 3 chiffres',
    date: 'Toute date future'
  },
  DECLINED: {
    number: '4000 0000 0000 0002',
    description: 'Carte déclinée',
    cvc: 'Tout CVC à 3 chiffres',
    date: 'Toute date future'
  },
  INSUFFICIENT_FUNDS: {
    number: '4000 0000 0000 9995',
    description: 'Fonds insuffisants',
    cvc: 'Tout CVC à 3 chiffres',
    date: 'Toute date future'
  }
};

/**
 * Configuration des prix (en centimes)
 */
export const STRIPE_PRICES = {
  BASIC: 500,      // 5€
  PREMIUM: 2000,   // 20€
  PLATINUM: 5000   // 50€
};

/**
 * Vérifier si Stripe est en mode test
 */
export const isStripeTestMode = (): boolean => {
  return STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_');
};

/**
 * Formater un montant pour Stripe (convertir euros en centimes)
 */
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Formater un montant Stripe pour affichage (convertir centimes en euros)
 */
export const formatAmountFromStripe = (amount: number): string => {
  return (amount / 100).toFixed(2) + '€';
};

export default getStripe;
