import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, MapPin, Calendar, Clock, AlertCircle, CreditCard, CheckCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { authService } from '@/services/authService';
import { apiClient } from '@/services/api';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_votre_cle_publique');

interface CheckoutPageProps {
  onBack?: () => void;
  onSuccess?: (orderId: string) => void;
}

const CheckoutForm: React.FC<{ onSuccess?: (orderId: string) => void }> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();
  const {
    items,
    supplier,
    getSubtotal,
    getDeliveryFee,
    getTotalAmount,
    canCheckout,
    deliveryAddress,
    deliveryDate,
    deliveryTime,
    specialInstructions,
    urgency,
    setDeliveryDetails,
    clearCart,
  } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // États du formulaire
  const [formData, setFormData] = useState({
    deliveryAddress: deliveryAddress || '',
    deliveryDate: deliveryDate || '',
    deliveryTime: deliveryTime || '08:00',
    specialInstructions: specialInstructions || '',
    urgency: urgency || 'normal' as 'normal' | 'urgent',
    contactPhone: '',
    contactEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-remplissage des données utilisateur au chargement
  useEffect(() => {
    if (user) {
      const userAny = user as any;
      console.log('🔍 Auto-fill checkout - User data:', { 
        address: userAny.address, 
        phone: userAny.phone || userAny.phoneNumber, 
        email: user.email 
      });
      
      // Construire l'adresse depuis les données utilisateur
      let userAddress = '';
      
      if (userAny.address) {
        // Si l'adresse est un objet
        if (typeof userAny.address === 'object' && userAny.address !== null) {
          const addr = userAny.address as any;
          const parts = [
            addr.street,
            addr.postalCode,
            addr.city,
            addr.country
          ].filter(Boolean);
          userAddress = parts.join(', ');
        } else if (typeof userAny.address === 'string') {
          userAddress = userAny.address;
        }
      }

      setFormData(prev => ({
        ...prev,
        deliveryAddress: prev.deliveryAddress || userAddress || '',
        contactPhone: prev.contactPhone || userAny.phone || userAny.phoneNumber || '',
        contactEmail: prev.contactEmail || user.email || '',
      }));
    }
  }, [user]);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotalAmount();

  // Date minimum: aujourd'hui (jour même)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Adresse de livraison requise';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Date de livraison requise';
    }
    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Heure de livraison requise';
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Téléphone requis';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email invalide';
    }

    // Vérifier commande minimum
    if (supplier?.minimumOrder && subtotal < supplier.minimumOrder) {
      newErrors.cart = `Commande minimum: ${supplier.minimumOrder}€`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 🔥 NOUVEAU: Synchroniser formData avec cartStore en temps réel
  useEffect(() => {
    setDeliveryDetails({
      address: formData.deliveryAddress,
      date: formData.deliveryDate,
      time: formData.deliveryTime,
      instructions: formData.specialInstructions,
      urgency: formData.urgency,
    });
  }, [formData.deliveryAddress, formData.deliveryDate, formData.deliveryTime, formData.specialInstructions, formData.urgency, setDeliveryDetails]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!stripe || !elements) {
      setPaymentError('Stripe n\'est pas encore chargé');
      return;
    }

    if (!canCheckout()) {
      setPaymentError('Impossible de passer commande');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Sauvegarder les détails de livraison dans le store
      setDeliveryDetails({
        address: formData.deliveryAddress,
        date: formData.deliveryDate,
        time: formData.deliveryTime,
        instructions: formData.specialInstructions,
        urgency: formData.urgency,
      });

      // 2. Créer PaymentIntent côté backend avec apiClient
      const response = await apiClient.post('/payments/create-payment-intent', {
        amount: Math.round(total * 100), // Stripe utilise les centimes
        currency: 'eur',
        orderData: {
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            unit: item.unit,
          })),
          supplierId: supplier?.id,
          deliveryAddress: formData.deliveryAddress,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          specialInstructions: formData.specialInstructions,
          urgency: formData.urgency,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          subtotal,
          deliveryFee,
          total,
        },
      });

      const { clientSecret, orderId } = response.data;

      // 3. Confirmer le paiement avec Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent?.status === 'succeeded') {
        setPaymentSuccess(true);
        // Enregistrer la commande réelle dans MongoDB
        const orderResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId: user?.id ?? '',
            supplierId: supplier?.id,
            items: items.map(item => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              unit: item.unit,
            })),
            deliveryAddress: formData.deliveryAddress,
            deliveryDate: formData.deliveryDate,
            deliveryTime: formData.deliveryTime,
            specialInstructions: formData.specialInstructions,
            urgency: formData.urgency,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
            subtotal,
            deliveryFee,
            total,
            payment: {
              status: 'succeeded',
              method: 'card',
            },
          }),
        });
        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          console.log('✅ Commande enregistrée dans MongoDB:', orderData.order?._id);
        } else {
          console.warn('⚠️ Erreur lors de l\'enregistrement de la commande réelle');
        }
        // Vider le panier après succès
        setTimeout(() => {
          clearCart();
          if (onSuccess) {
            onSuccess(orderId);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      setPaymentError((error as Error).message || 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🧪 MODE TEST: Passer commande sans paiement Stripe
  const handleTestOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Sauvegarder les détails de livraison dans le store
      setDeliveryDetails({
        address: formData.deliveryAddress,
        date: formData.deliveryDate,
        time: formData.deliveryTime,
        instructions: formData.specialInstructions,
        urgency: formData.urgency,
      });

      // Générer un userId de test si pas connecté
      const currentUser = authService.getCurrentUser();
      const testUserId = currentUser?.id || localStorage.getItem('userId') || 'test-user-' + Date.now();
      
      console.log('🧪 Création commande test avec userId:', testUserId);

      // Appeler l'API de test (pas besoin d'authentification en mode test)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/test-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          orderData: {
            items: items.map(item => ({
              listingId: item.productId, // ✅ Nom correct du champ
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.quantity * item.price, // ✅ Calculé
              category: 'food',
            })),
            supplierId: supplier?.id,
            // ✅ Convertir l'adresse string en objet structuré
            pickupAddress: {
              street: (supplier as any)?.address || '456 Avenue des Halles',
              city: 'Paris',
              postalCode: '75002',
              country: 'France'
            },
            deliveryAddress: {
              street: formData.deliveryAddress || '123 Rue de Test',
              city: 'Paris', // TODO: Extraire de l'adresse
              postalCode: '75001', // TODO: Extraire de l'adresse
              country: 'France'
            },
            // ✅ Pricing complet requis par le schéma
            pricing: {
              subtotal: subtotal,
              deliveryFee: deliveryFee,
              tax: 0,
              platformFee: 0,
              discount: 0,
              total: total,
              currency: 'EUR'
            },
            deliveryDate: formData.deliveryDate,
            deliveryTime: formData.deliveryTime,
            specialInstructions: formData.specialInstructions,
            urgency: formData.urgency,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
          },
        }),
      });

      // Vérifier si la réponse est du JSON valide
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // Si ce n'est pas du JSON, lire le texte brut
        const textResponse = await response.text();
        console.error('❌ Réponse non-JSON du serveur:', textResponse);
        throw new Error(`Erreur serveur (code ${response.status}): ${textResponse.substring(0, 200)}`);
      }
      
      if (!response.ok) {
        console.error('❌ Erreur API:', responseData);
        throw new Error(responseData.error || responseData.details || 'Erreur lors de la création de la commande test');
      }

      const result = responseData;
      console.log('🧪 Commande test créée:', result);

      // Vider le panier immédiatement
      clearCart();
      
      // Afficher succès pendant 1.5s puis rediriger
      setPaymentSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.orderId);
        }
      }, 1500);

    } catch (error) {
      console.error('❌ Erreur commande test:', error);
      setPaymentError((error as Error).message || 'Erreur lors de la commande test');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h2>
        <p className="text-gray-600 text-center max-w-md">
          Votre paiement a été accepté. Le fournisseur a été notifié et préparera votre commande.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Livraison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-600" />
          Informations de livraison
        </h3>

        <div className="space-y-4">
          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Adresse de livraison *
            </label>
            <textarea
              value={formData.deliveryAddress}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Rue de la République, 75001 Paris"
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
            )}
          </div>

          {/* Date et Heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de livraison *
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                min={minDate}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deliveryDate && (
                <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure souhaitée *
              </label>
              <select
                value={formData.deliveryTime}
                onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.deliveryTime ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="08:00">08:00 - 10:00</option>
                <option value="10:00">10:00 - 12:00</option>
                <option value="12:00">12:00 - 14:00</option>
                <option value="14:00">14:00 - 16:00</option>
                <option value="16:00">16:00 - 18:00</option>
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="06 12 34 56 78"
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@restaurant.fr"
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
              )}
            </div>
          </div>

          {/* Urgence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de livraison
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={formData.urgency === 'normal'}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-4 h-4 text-orange-600"
                />
                <div>
                  <p className="font-semibold text-gray-800">Normale</p>
                  <p className="text-xs text-gray-600">24-48h</p>
                </div>
              </label>

              <label className="flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="urgency"
                  value="urgent"
                  checked={formData.urgency === 'urgent'}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-4 h-4 text-orange-600"
                />
                <div>
                  <p className="font-semibold text-gray-800">Urgente</p>
                  <p className="text-xs text-gray-600">+10€ - 30 min à 1h</p>
                </div>
              </label>
            </div>
          </div>

          {/* Instructions spéciales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions spéciales (optionnel)
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Livraison à l'arrière du bâtiment"
            />
          </div>
        </div>
      </div>

      {/* Section Paiement */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange-600" />
          Paiement sécurisé
        </h3>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {paymentError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{paymentError}</p>
          </div>
        )}

        {errors.cart && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errors.cart}</p>
          </div>
        )}
      </div>

      {/* Bouton Payer */}
      <motion.button
        type="submit"
        disabled={isProcessing || !stripe}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all ${
          isProcessing || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Paiement en cours...
          </span>
        ) : (
          `Payer ${total.toFixed(2)}€`
        )}
      </motion.button>

      {/* 🧪 MODE TEST - Visible en mode simulation ou développement */}
      {(import.meta.env.DEV || import.meta.env.VITE_PAYMENT_MODE === 'simulation') && (
        <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm font-semibold text-yellow-800">🧪 Mode Développement</p>
          </div>
          <p className="text-xs text-yellow-700 mb-3">
            Testez le workflow complet sans passer par le paiement Stripe. La commande sera créée directement et le fournisseur sera notifié.
          </p>
          <motion.button
            type="button"
            onClick={handleTestOrder}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transition-all ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-xl'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création commande test...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🧪 Mode Test - Passer commande sans payer
              </span>
            )}
          </motion.button>
        </div>
      )}
    </form>
  );
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSuccess }) => {
  const { navigateTo } = useNavigation();
  const { items, supplier, getSubtotal, getDeliveryFee, getTotalAmount } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotalAmount();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="checkout" onNavigate={navigateTo} />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Panier vide</h2>
            <p className="text-gray-600">Ajoutez des produits pour passer commande</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="checkout" onNavigate={navigateTo} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au catalogue
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Validation de commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche: Formulaire */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm onSuccess={onSuccess} />
            </Elements>
          </div>

          {/* Colonne droite: Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h3>

              {/* Fournisseur */}
              {supplier && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Fournisseur</p>
                  <p className="font-semibold text-gray-800">{supplier.name}</p>
                </div>
              )}

              {/* Articles */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || '/images/default.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E') {
                            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} × {item.price.toFixed(2)}€
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {(item.quantity * item.price).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium text-gray-800">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-gray-800">{deliveryFee.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                  <span className="text-gray-800">Total</span>
                  <span className="text-orange-600">{total.toFixed(2)}€</span>
                </div>
              </div>

              {/* Sécurité */}
              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Paiement sécurisé par Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
