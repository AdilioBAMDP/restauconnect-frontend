import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { getStripe, formatAmountFromStripe, isStripeTestMode, TEST_CARDS } from '@/config/stripe';

interface StripeCheckoutProps {
  amount: number; // Montant en centimes
  campaignTitle: string;
  planName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  amount,
  campaignTitle,
  planName,
  onSuccess,
  onCancel
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showTestCards, setShowTestCards] = useState(false);

  // Formater le numéro de carte (espacer tous les 4 chiffres)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formater la date d'expiration (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  // Valider la carte
  const validateCard = (): boolean => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Numéro de carte invalide (16 chiffres requis)');
      return false;
    }

    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      setError('Date d\'expiration invalide (MM/YY)');
      return false;
    }

    if (cardCvc.length !== 3) {
      setError('CVC invalide (3 chiffres requis)');
      return false;
    }

    if (cardName.trim().length < 3) {
      setError('Nom du titulaire requis');
      return false;
    }

    return true;
  };

  // Traiter le paiement
  const handlePayment = async () => {
    setError('');

    if (!validateCard()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Charger Stripe
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe non initialisé');
      }

      // Simuler le délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En mode test, vérifier le numéro de carte
      const testCardNumber = cardNumber.replace(/\s/g, '');

      if (testCardNumber === '4242424242424242') {
        // Carte de test SUCCESS
        onSuccess();
      } else if (testCardNumber === '4000002500003155') {
        // Carte nécessitant 3D Secure
        setError('Authentification 3D Secure requise (non implémentée dans cette démo)');
        setIsProcessing(false);
      } else if (testCardNumber === '4000000000000002') {
        // Carte déclinée
        setError('Paiement refusé - Carte déclinée');
        setIsProcessing(false);
      } else if (testCardNumber === '4000000000009995') {
        // Fonds insuffisants
        setError('Paiement refusé - Fonds insuffisants');
        setIsProcessing(false);
      } else {
        // Autre carte test (succès par défaut)
        onSuccess();
      }
    } catch (err) {
      setError('Erreur lors du paiement : ' + (err as Error).message);
      setIsProcessing(false);
    }
  };

  // Utiliser une carte de test
  const fillTestCard = (cardType: keyof typeof TEST_CARDS) => {
    const card = TEST_CARDS[cardType];
    setCardNumber(card.number);
    setCardExpiry('12/25');
    setCardCvc('123');
    setCardName('Test User');
    setShowTestCards(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Paiement sécurisé</h2>
                <p className="text-blue-100 text-sm">Stripe Checkout</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Résumé commande */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Récapitulatif</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Campagne :</span>
                <span className="font-medium text-gray-900">{campaignTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan :</span>
                <span className="font-medium text-gray-900">{planName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-semibold text-gray-900">Total :</span>
                <span className="font-bold text-xl text-purple-600">{formatAmountFromStripe(amount)}</span>
              </div>
            </div>
          </div>

          {/* Mode test indicator */}
          {isStripeTestMode() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">Mode Test Stripe</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Utilisez les cartes de test Stripe. Aucun vrai paiement ne sera effectué.
                </p>
                <button
                  onClick={() => setShowTestCards(!showTestCards)}
                  className="text-xs text-yellow-700 underline hover:text-yellow-900 mt-2"
                >
                  {showTestCards ? 'Masquer' : 'Voir'} les cartes de test
                </button>
              </div>
            </div>
          )}

          {/* Cartes de test */}
          {showTestCards && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-900 mb-3">Cartes de test Stripe :</p>
              {Object.entries(TEST_CARDS).map(([key, card]) => (
                <button
                  key={key}
                  onClick={() => fillTestCard(key as keyof typeof TEST_CARDS)}
                  className="w-full text-left p-2 hover:bg-blue-100 rounded transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-blue-900">{card.number}</p>
                      <p className="text-xs text-blue-700">{card.description}</p>
                    </div>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Formulaire carte */}
          <div className="space-y-4">
            {/* Numéro de carte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                />
                <CreditCard className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Expiration et CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, '').substring(0, 3))}
                  placeholder="123"
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Nom du titulaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du titulaire
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
              />
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Sécurité */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Paiement sécurisé par Stripe</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Payer {formatAmountFromStripe(amount)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
