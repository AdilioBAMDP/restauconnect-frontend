import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';
import SuccessNotification from '@/components/modals/SuccessNotification';
import ErrorNotification from '@/components/modals/ErrorNotification';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

interface SupplierOrderDetailPageProps {
  navigateTo: (page: string) => void;
}

interface OrderItem {
  listingId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface RealOrder {
  _id: string;
  orderNumber: string;
  restaurantId: string;
  supplierId: string;
  status: string;
  priority: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    currency: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  requestedDeliveryTime: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
  payment: {
    status: string;
    method: string;
  };
  wantsDelivery: boolean;
  estimatedPreparationTime?: number;
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { label: 'En préparation', color: 'bg-purple-100 text-purple-800', icon: Package },
    ready: { label: 'Prête', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    out_for_delivery: { label: 'En livraison', color: 'bg-orange-100 text-orange-800', icon: Truck },
    delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: AlertCircle }
  };
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
};

export default function SupplierOrderDetailPage({ navigateTo }: SupplierOrderDetailPageProps) {
  // Récupérer l'orderId depuis sessionStorage
  const orderId = sessionStorage.getItem('selectedOrderId');
  
  const [order, setOrder] = useState<RealOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMarkingReady, setIsMarkingReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmReady, setShowConfirmReady] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
  const { navigateTo } = useNavigation();
    if (!orderId) {
      setError('Aucune commande sélectionnée');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Commande non trouvée');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
        setError(null);
      } else {
        setError('Erreur lors du chargement de la commande');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('❌ Impossible de charger la commande');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleMarkReady = async () => {
    setShowConfirmReady(true);
  };

  const confirmMarkReady = async () => {
    if (!order) return;

    setIsMarkingReady(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${order._id}/mark-ready`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Commande prête ! 🚚 Recherche de livreur en cours... Le livreur sera notifié automatiquement.');
        setShowConfirmReady(false);
        
        // Recharger les détails
        await fetchOrderDetail();
      } else {
        setErrorMessage(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Error marking ready:', err);
      setErrorMessage('Erreur lors de la préparation de la commande');
    } finally {
      setIsMarkingReady(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50"><div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Chargement de la commande...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50"><div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">❌ {error || 'Commande non trouvée'}</p>
            <button 
              onClick={() => navigateTo('supplier-orders')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retour aux commandes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50"><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigateTo('supplier-orders')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux commandes
        </button>

        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Commande #{order.orderNumber}
              </h1>
              <p className="text-gray-500 mt-1">
                Créée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${statusInfo.color}`}>
                <StatusIcon className="w-5 h-5 mr-2" />
                {statusInfo.label}
              </span>
              <div className="mt-2 text-sm text-gray-500">
                {order.payment.status === 'completed' ? '✅ Payée' : '⏳ Paiement en attente'}
              </div>
            </div>
          </div>

          {/* Bouton Commande Prête */}
          {(order.status === 'preparing' || order.status === 'confirmed') && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleMarkReady}
                disabled={isMarkingReady}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isMarkingReady ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    🚀 Commande Prête - Lancer la livraison
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">
                Cliquez pour marquer la commande prête et notifier automatiquement un livreur
              </p>
            </div>
          )}

          {order.status === 'ready' && (
            <div className="mt-6 pt-6 border-t border-gray-200 bg-green-50 rounded-lg p-4">
              <p className="text-green-700 font-medium flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                ✅ Commande prête ! Recherche de livreur en cours...
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Informations client */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Client
            </h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {order.customerEmail}
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {order.customerPhone}
              </div>
              {order.estimatedPreparationTime && (
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  Temps de préparation: {order.estimatedPreparationTime} min
                </div>
              )}
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Livraison
            </h2>
            {order.wantsDelivery ? (
              <div className="space-y-2">
                <p className="text-gray-700">{order.deliveryAddress.street}</p>
                <p className="text-gray-700">
                  {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Livraison demandée
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Frais: {order.pricing.deliveryFee.toFixed(2)}€
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                <p className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Retrait sur place
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Articles commandés */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📦 Articles ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.quantity} × {item.unitPrice.toFixed(2)}€
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {item.totalPrice.toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totaux */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Récapitulatif</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Sous-total</span>
              <span>{order.pricing.subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Frais de livraison</span>
              <span>{order.pricing.deliveryFee.toFixed(2)}€</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{order.pricing.total.toFixed(2)}€</span>
            </div>
            <div className="pt-2 text-sm text-gray-600">
              <p>Méthode de paiement: {order.payment.method === 'card' ? '💳 Carte bancaire' : order.payment.method}</p>
              <p>Statut: {order.payment.status === 'completed' ? '✅ Payé' : '⏳ En attente'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals et Notifications */}
      <ConfirmationModal
        isOpen={showConfirmReady}
        onClose={() => setShowConfirmReady(false)}
        onConfirm={confirmMarkReady}
        title="Marquer comme prête"
        message="🚀 Marquer cette commande comme prête ? Ceci lancera automatiquement la recherche d'un livreur disponible."
        confirmText="Marquer prête"
        variant="info"
      />

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
  );
}
