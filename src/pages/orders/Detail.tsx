import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Package, Clock, MapPin, CheckCircle, XCircle, Phone, Mail, Truck, DollarSign, AlertCircle, FileText, Send, Loader } from 'lucide-react';
import { apiClient } from '@/services/api';
import SuccessNotification from '@/components/modals/SuccessNotification';
import ErrorNotification from '@/components/modals/ErrorNotification';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
  supplierMode?: boolean;
}

interface OrderItem {
  listingId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface Order {
  _id: string;
  orderNumber: string;
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
  updatedAt: string;
  payment: {
    status: string;
    method: string;
  };
  invoice?: {
    invoiceNumber: string;
    pdfUrl: string;
    generatedAt: string;
    emailSent: boolean;
  };
  restaurantId?: unknown;
  supplierId?: unknown;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onBack, supplierMode = false }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingReady, setIsMarkingReady] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  // 🚀 Fonction pour marquer la commande comme prête
  const handleMarkReady = async () => {
    if (!order) return;
    
    if (!window.confirm("🚀 Marquer cette commande comme prête ?\n\nCeci lancera automatiquement la recherche d'un livreur disponible.")) {
      return;
    }
    
    setIsMarkingReady(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${order._id}/mark-ready`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Commande prête ! 🚚 Recherche de livreur en cours... Le livreur sera notifié automatiquement.');
        // Recharger les détails
        fetchOrderDetail();
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

  const fetchOrderDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Récupération commande:', orderId);
      
      const response = await apiClient.get(`/orders/${orderId}`);
      
      console.log('✅ Réponse reçue:', response.data);
      
      if (response.data.success) {
        setOrder(response.data.order);
        setError(null);
      } else {
        setError(response.data.error || 'Commande introuvable');
      }
    } catch (err: unknown) {
      console.error('❌ Error fetching order:', err);
      const error = err as { response?: { status?: number; data?: { message?: string; error?: string } } };
      
      if (error.response?.status === 404) {
        setError('Cette commande n\'existe pas ou a été supprimée.');
      } else {
        setError(error.response?.data?.message || error.response?.data?.error || 'Erreur lors du chargement de la commande');
      }
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const downloadInvoice = () => {
    if (!order?.invoice) return;
    window.open(`/api/invoices/${order._id}/download`, '_blank');
  };

  const sendInvoiceEmail = async () => {
    if (!order?.invoice) return;
    
    try {
      setIsSendingEmail(true);
      const response = await apiClient.post(`/invoices/${order._id}/send-email`);
      
      if (response.data.success) {
        setSuccessMessage('Facture envoyée par email avec succès');
        setOrder({ 
          ...order, 
          invoice: { 
            ...order.invoice, 
            emailSent: true 
          } 
        });
      }
    } catch (err: unknown) {
      console.error('Error sending invoice:', err);
      setErrorMessage('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleAcceptOrder = async () => {
    setShowAcceptConfirm(true);
  };

  const confirmAcceptOrder = async () => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, {
        status: 'confirmed'
      });

      if (response.data.success) {
        setSuccessMessage('Commande acceptée !');
        setShowAcceptConfirm(false);
        fetchOrderDetail(); // Recharger
      }
    } catch (err) {
      console.error('Error accepting order:', err);
      setErrorMessage('Erreur lors de l\'acceptation');
    }
  };

  const handleRejectOrder = async () => {
    setShowRejectConfirm(true);
  };

  const confirmRejectOrder = async () => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, {
        status: 'cancelled'
      });

      if (response.data.success) {
        setSuccessMessage('Commande refusée');
        setShowRejectConfirm(false);
        fetchOrderDetail(); // Recharger
      }
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert('❌ Erreur lors du refus');
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready_for_pickup: 'Prête',
      in_transit: 'En livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      preparing: 'bg-blue-100 text-blue-800 border-blue-300',
      ready_for_pickup: 'bg-purple-100 text-purple-800 border-purple-300',
      in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Date invalide';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-red-700 mb-2">{error || 'Commande introuvable'}</p>
            <p className="text-sm text-gray-600 mb-4">
              Cette commande n'existe pas dans la base de données MongoDB.
            </p>
            <p className="text-xs text-gray-500">
              ID recherché : <code className="bg-gray-100 px-2 py-1 rounded">{orderId}</code>
            </p>
            <button
              onClick={onBack}
              className="mt-6 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vérifie si l'utilisateur connecté est le fournisseur de la commande
  const isSupplier = supplierMode && user && user.role === 'fournisseur' && order && user._id && order.supplierId && (user._id === order.supplierId || user.id === order.supplierId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux commandes
        </button>

        {/* Status Banner */}
        <div className={`rounded-lg border-2 p-6 mb-6 ${getStatusColor(order.status)}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Commande #{order.orderNumber}</h1>
              <p className="text-sm mt-1 opacity-80">
                <Clock className="w-4 h-4 inline mr-1" />
                Créée le {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-80">Statut actuel</div>
              <div className="text-2xl font-bold">{getStatusLabel(order.status)}</div>
            </div>
          </div>
        </div>

        {/* Boutons d'action pour fournisseur uniquement */}
        {isSupplier && (order.status === 'pending' || order.status === 'confirmed') && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Actions de validation</h3>
            <div className="flex gap-4">
              <button
                onClick={handleAcceptOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <CheckCircle className="w-5 h-5" />
                Accepter la commande
              </button>
              <button
                onClick={handleRejectOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <XCircle className="w-5 h-5" />
                Refuser la commande
              </button>
            </div>
          </div>
        )}

        {/* Bouton Commande Prête : affiché pour tout utilisateur dès que la commande est confirmée ou en préparation */}
        {(order.status === 'confirmed' || order.status === 'preparing') && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

        {/* 📄 Section Facture */}
        {order.invoice && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Facture générée
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-semibold">Numéro:</span> {order.invoice.invoiceNumber}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(order.invoice.generatedAt).toLocaleDateString('fr-FR')}</p>
                  <p>
                    <span className="font-semibold">Email:</span> 
                    {order.invoice.emailSent ? (
                      <span className="ml-2 text-green-600 font-semibold">✓ Envoyé</span>
                    ) : (
                      <span className="ml-2 text-orange-600 font-semibold">En attente</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={downloadInvoice}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Télécharger PDF
                </button>
                
                {!order.invoice.emailSent && (
                  <button
                    onClick={sendInvoiceEmail}
                    disabled={isSendingEmail}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingEmail ? 'Envoi...' : 'Envoyer au client'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Articles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-500" />
              Articles ({order.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Quantité: {item.quantity} × {item.unitPrice?.toFixed(2) || '0.00'}€
                    </div>
                  </div>
                  <div className="text-right font-bold text-gray-800">
                    {item.totalPrice?.toFixed(2) || '0.00'}€
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totaux */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total:</span>
                <span>{order.pricing?.subtotal?.toFixed(2) || '0.00'}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison:</span>
                <span>{order.pricing?.deliveryFee?.toFixed(2) || '0.00'}€</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                <span>Total:</span>
                <span>{order.pricing?.total?.toFixed(2) || '0.00'} {order.pricing?.currency || 'EUR'}</span>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                Adresse de livraison
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>{order.deliveryAddress?.street || 'Non renseignée'}</p>
                <p>
                  {order.deliveryAddress?.postalCode || ''} {order.deliveryAddress?.city || ''}
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Demandée le: {formatDate(order.requestedDeliveryTime)}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact client</h2>
              <div className="space-y-3">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{order.customerPhone || 'Non renseigné'}</span>
                </a>
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{order.customerEmail || 'Non renseigné'}</span>
                </a>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-orange-500" />
                Paiement
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className={`font-semibold ${order.payment?.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.payment?.status === 'completed' ? '✅ Payé' : '⏳ En attente'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode:</span>
                  <span className="font-semibold text-gray-800">
                    {order.payment?.method || 'Non renseignée'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Historique</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <Clock className="w-4 h-4 inline mr-2" />
              Créée le: {formatDate(order.createdAt)}
            </p>
            <p>
              <Clock className="w-4 h-4 inline mr-2" />
              Dernière mise à jour: {formatDate(order.updatedAt)}
            </p>
            {order.priority && (
              <p className="font-semibold text-orange-600">
                Priorité: {order.priority}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals et Notifications */}
      <ConfirmationModal
        isOpen={showAcceptConfirm}
        onClose={() => setShowAcceptConfirm(false)}
        onConfirm={confirmAcceptOrder}
        title="Accepter la commande"
        message="Êtes-vous sûr de vouloir accepter cette commande ?"
        confirmText="Accepter"
        variant="info"
      />

      <ConfirmationModal
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={confirmRejectOrder}
        title="Refuser la commande"
        message="Êtes-vous sûr de vouloir refuser cette commande ?"
        confirmText="Refuser"
        variant="danger"
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
};

export default OrderDetail;
