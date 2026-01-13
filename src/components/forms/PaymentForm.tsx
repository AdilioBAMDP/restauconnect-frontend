import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentIntent {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Composant de formulaire de paiement Stripe optimisé
 * Phase 6 - Intégration Stripe avancée
 */
const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'eur',
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Configuration des options Stripe
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  // Gestionnaire de changement de la carte
  const handleCardChange = (event: { complete: boolean; error?: { message: string } }) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  // Soumission du paiement
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe n\'est pas initialisé');
      return;
    }

    if (!cardComplete) {
      setCardError('Veuillez compléter les informations de carte');
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Créer le payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Élément carte non trouvé');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      // Confirmer le paiement (vous devrez implémenter la logique côté serveur)
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        process.env.REACT_APP_STRIPE_CLIENT_SECRET || '', // À remplacer par votre client secret
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw confirmError;
      }

      onSuccess(paymentIntent);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du paiement';
      setCardError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Montant à payer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Montant à payer</span>
          </div>
          <span className="text-xl font-bold text-blue-900">
            {(amount / 100).toFixed(2)} {currency.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Champ carte de crédit */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Informations de carte
        </label>
        <div className="relative">
          <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
            cardError
              ? 'border-red-300 bg-red-50'
              : cardComplete
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
          }`}>
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
              className="w-full"
            />
          </div>

          {/* Indicateur de sécurité */}
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Sécurisé</span>
          </div>
        </div>

        {/* Message d'erreur */}
        {cardError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{cardError}</span>
          </motion.div>
        )}

        {/* Message de succès */}
        {cardComplete && !cardError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Carte valide</span>
          </motion.div>
        )}
      </div>

      {/* Informations de sécurité */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Paiement 100% sécurisé</p>
            <p className="text-xs">
              Vos informations bancaires sont chiffrées et ne sont jamais stockées sur nos serveurs.
              Le paiement est traité par Stripe, leader mondial des paiements en ligne.
            </p>
          </div>
        </div>
      </div>

      {/* Bouton de paiement */}
      <motion.button
        type="submit"
        disabled={!stripe || !cardComplete || isProcessing || disabled}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-3 ${
          !stripe || !cardComplete || isProcessing || disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
        whileHover={!disabled && cardComplete ? { scale: 1.02 } : {}}
        whileTap={!disabled && cardComplete ? { scale: 0.98 } : {}}
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Traitement du paiement...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Payer {(amount / 100).toFixed(2)} {currency.toUpperCase()}</span>
          </>
        )}
      </motion.button>

      {/* Footer avec badges de sécurité */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            SSL
          </div>
          <span>Chiffré</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-6 h-4 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
            PCI
          </div>
          <span>Conforme</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-6 h-4 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
            3D
          </div>
          <span>Sécurisé</span>
        </div>
      </div>
    </motion.form>
  );
};

export default PaymentForm;