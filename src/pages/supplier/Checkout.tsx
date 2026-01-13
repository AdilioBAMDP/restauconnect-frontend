import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';
import { logger } from '@/utils/logger';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import type { PageName } from '@/services/NavigationManager';
import SuccessNotification from '@/components/modals/SuccessNotification';
import ErrorNotification from '@/components/modals/ErrorNotification';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    unit: string;
    minimumQuantity: number;
    stockQuantity: number;
    deliveryConditions?: {
      minimumOrder?: number;
      freeDeliveryThreshold?: number;
      leadTime?: number;
      deliveryDays?: string[];
    };
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Cart {
  items: CartItem[];
  supplierId?: {
    companyName: string;
  };
  subtotal: number;
  deliveryFee: number;
}

const SupplierCheckoutPage = () => {
  const { supplierId } = useParams();
  const { navigateTo } = useNavigation();
  
  const [cart, setCart] = useState<Cart | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // ✅ NAVIGATION INTELLIGENTE - Correction audit octobre 2025
  const { userDashboard } = useUserDashboardNavigation();
  
  // Wrapper pour la compatibilité des types navigateTo
  const handleNavigateString = (page: string) => {
    navigateTo(page as PageName);
  };
  
  // Formulaire de livraison
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryDate: '',
    deliveryTime: '09:00',
    urgency: 'normal',
    specialInstructions: ''
  });

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cart/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
      } else {
        setError('Erreur lors du chargement du panier');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [supplierId]);

  useEffect(() => {
    if (supplierId) {
      fetchCart();
    }
  }, [supplierId, fetchCart]);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0 || !cart) return;
    
    try {
      const token = localStorage.getItem('token');
      const currentItem = cart.items.find(item => item.productId._id === productId);
      if (!currentItem) return;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId, 
          quantity: newQuantity - currentItem.quantity 
        })
      });

      if (response.ok) {
        await fetchCart(); // Recharger le panier
      }
    } catch {
      logger.error('Erreur lors de la mise à jour du panier');
      setError('Erreur lors de la mise à jour');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!cart) return;
    const item = cart.items.find(item => item.productId._id === productId);
    if (item) {
      await updateQuantity(productId, 0);
      await fetchCart();
    }
  };

  const finalizeOrder = async () => {
    if (!cart) return;
    
    if (!deliveryForm.deliveryDate || !deliveryForm.deliveryTime) {
      setErrorMessage('Veuillez sélectionner une date et heure de livraison');
      return;
    }

    // Vérifier minimum de commande
    const minimumOrder = cart.items[0]?.productId?.deliveryConditions?.minimumOrder || 0;
    if (cart.subtotal < minimumOrder) {
      setErrorMessage(`Commande minimum: ${minimumOrder}€`);
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cart/${supplierId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(deliveryForm)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Commande créée avec succès! 🚚 Tracking TMS: ${data.data.tmsDelivery.trackingId}`);
        setTimeout(() => {
          handleNavigateString(userDashboard); // ✅ CORRIGÉ: Dashboard intelligent par rôle
        }, 2000);
      } else {
        const data = await response.json();
        const errorMsg = data.error || 'Erreur lors de la finalisation';
        setError(errorMsg);
        setErrorMessage(errorMsg);
      }
    } catch {
      const errorMsg = 'Erreur de connexion';
      setError(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <div className="text-lg">Chargement du panier...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => handleNavigateString(userDashboard)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h2>
          <p className="text-gray-600 mb-6">Votre panier est vide. Ajoutez des produits pour continuer.</p>
          <button
            onClick={() => navigateTo('supplier-catalog')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const minimumOrder = cart.items[0]?.productId?.deliveryConditions?.minimumOrder || 0;
  const isMinimumReached = cart.subtotal >= minimumOrder;
  const freeDeliveryThreshold = cart.items[0]?.productId?.deliveryConditions?.freeDeliveryThreshold;
  const isFreeDelivery = freeDeliveryThreshold && cart.subtotal >= freeDeliveryThreshold;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🛒 Finaliser la commande</h1>
              <p className="text-gray-600 mt-1">
                Commande chez {cart.supplierId?.companyName}
              </p>
            </div>
            <button
              onClick={() => navigateTo('supplier-catalog')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Continuer les achats
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contenu du panier */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">📦 Produits commandés</h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId._id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productId.name}</h3>
                      <p className="text-sm text-gray-600">Unité: {item.productId.unit}</p>
                      <p className="text-sm text-green-600 font-medium">
                        {item.unitPrice.toFixed(2)}€ / {item.productId.unit}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={item.quantity <= item.productId.minimumQuantity}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ➖
                      </button>
                      <span className="font-medium px-3">
                        {item.quantity} {item.productId.unit}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        disabled={item.quantity >= item.productId.stockQuantity}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ➕
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {item.totalPrice.toFixed(2)}€
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-red-500 text-sm hover:text-red-700 mt-1"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🚚 Conditions de livraison</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commande minimum:</span>
                  <span className={`font-medium ${isMinimumReached ? 'text-green-600' : 'text-red-600'}`}>
                    {minimumOrder}€ {isMinimumReached ? '✅' : '❌'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison:</span>
                  <span className={`font-medium ${isFreeDelivery ? 'text-green-600 line-through' : ''}`}>
                    {cart.deliveryFee}€ {isFreeDelivery ? '(Gratuit!)' : ''}
                  </span>
                </div>
                
                {freeDeliveryThreshold && !isFreeDelivery && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-blue-800 text-sm">
                      💡 Ajoutez {(freeDeliveryThreshold - cart.subtotal).toFixed(2)}€ pour la livraison gratuite!
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Délai de préparation:</span>
                  <span className="font-medium">
                    {cart.items[0]?.productId?.deliveryConditions?.leadTime || 1} jour(s)
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600">Jours de livraison disponibles:</span>
                  <div className="mt-1">
                    {cart.items[0]?.productId?.deliveryConditions?.deliveryDays?.map((day, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 capitalize">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire et récapitulatif */}
          <div className="space-y-6">
            {/* Formulaire de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">📅 Livraison</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de livraison souhaitée
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={deliveryForm.deliveryDate}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]} // Demain minimum
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de livraison
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={deliveryForm.deliveryTime}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  >
                    <option value="08:00">08:00 - 09:00</option>
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="11:00">11:00 - 12:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:00">15:00 - 16:00</option>
                    <option value="16:00">16:00 - 17:00</option>
                    <option value="17:00">17:00 - 18:00</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgence
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={deliveryForm.urgency}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, urgency: e.target.value }))}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent (+5€)</option>
                    <option value="express">Express (+15€)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions spéciales (optionnel)
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                    placeholder="Instructions pour la livraison..."
                    value={deliveryForm.specialInstructions}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">💰 Récapitulatif</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total produits:</span>
                  <span>{cart.subtotal.toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison:</span>
                  <span className={isFreeDelivery ? 'line-through text-green-600' : ''}>
                    {cart.deliveryFee.toFixed(2)}€
                    {isFreeDelivery && <span className="ml-2 text-green-600">Gratuit!</span>}
                  </span>
                </div>
                
                {deliveryForm.urgency === 'urgent' && (
                  <div className="flex justify-between text-orange-600">
                    <span>Supplément urgence:</span>
                    <span>+5.00€</span>
                  </div>
                )}
                
                {deliveryForm.urgency === 'express' && (
                  <div className="flex justify-between text-red-600">
                    <span>Supplément express:</span>
                    <span>+15.00€</span>
                  </div>
                )}
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>
                    {(
                      cart.subtotal + 
                      (isFreeDelivery ? 0 : cart.deliveryFee) + 
                      (deliveryForm.urgency === 'urgent' ? 5 : 0) +
                      (deliveryForm.urgency === 'express' ? 15 : 0)
                    ).toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Bouton de commande */}
              <div className="mt-6 space-y-3">
                {!isMinimumReached && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm">
                      ⚠️ Commande minimum non atteinte: {minimumOrder}€
                    </p>
                    <p className="text-red-600 text-sm">
                      Ajoutez {(minimumOrder - cart.subtotal).toFixed(2)}€ de produits
                    </p>
                  </div>
                )}
                
                <button
                  onClick={finalizeOrder}
                  disabled={!isMinimumReached || processing || !deliveryForm.deliveryDate}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? '⏳ Traitement en cours...' : '✅ Finaliser la commande & créer TMS'}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  En finalisant, une demande TMS sera automatiquement créée pour la livraison
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <SuccessNotification 
            isOpen={!!successMessage}
            onClose={() => setSuccessMessage('')}
            message={successMessage}
          />
          <ErrorNotification 
            isOpen={!!errorMessage}
            onClose={() => setErrorMessage('')}
            message={errorMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierCheckoutPage;
