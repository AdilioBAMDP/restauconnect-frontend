import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, MapPin, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { useAppStore } from '@/stores/appStore';
import OrderDetail from './Detail';
import DeliveryStatus from '@/components/DeliveryStatus';
import toast from 'react-hot-toast';

interface OrdersPageProps {
  onNavigate?: (page: string) => void;
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
}

const OrdersPage: React.FC<OrdersPageProps> = ({ supplierMode = false }) => {
  const { navigateTo } = useAppStore();
  const authContext = useAuth();
  const user = authContext?.user;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  const handleDownloadInvoice = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratingInvoice(orderId);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // Vérifier si la facture existe déjà
      const statusResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/invoices/${orderId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      const statusData = await statusResponse.json();
      
      // Si la facture n'existe pas, la générer d'abord
      if (!statusData.exists) {
        toast.loading('Génération de la facture...');
        const generateResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/invoices/${orderId}/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (!generateResponse.ok) {
          throw new Error('Erreur lors de la génération de la facture');
        }
        
        toast.dismiss();
        toast.success('Facture générée !');
      }
      
      // Télécharger la facture
      window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/invoices/${orderId}/download`, '_blank');
      toast.success('Téléchargement démarré !');
      
    } catch (error) {
      console.error('Erreur téléchargement facture:', error);
      toast.error('Erreur lors du téléchargement de la facture');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Récupérer l'utilisateur depuis localStorage si useAuth ne fonctionne pas
        const storedUser = localStorage.getItem('user');
        const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
        
        if (!currentUser) {
          setError('Utilisateur non connecté');
          setIsLoading(false);
          return;
        }

        // Pour les restaurants, on récupère TOUTES les commandes (les commandes test n'ont pas de restaurantId)
        // TODO: À terme, filtrer par restaurantId quand les commandes auront ce champ
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const endpoint = currentUser.role === 'restaurant' 
          ? `${apiUrl}/orders?limit=100` // Toutes les commandes pour restaurant
          : `${apiUrl}/orders?restaurantId=${currentUser._id || currentUser.id}&limit=50`;
        
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        // Vérifier si c'est une erreur de rate limiting
        if (response.status === 429) {
          setError('⚠️ Trop de requêtes. Veuillez patienter quelques instants...');
          setIsLoading(false);
          // Réessayer après 5 secondes
          setTimeout(fetchOrders, 5000);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('📦 Commandes reçues de l\'API:', data);
        
        if (data.success) {
          setOrders(data.orders || []);
          setError(null); // Clear any previous errors
        } else {
          setError('Erreur lors du chargement des commandes');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('❌ Impossible de charger les commandes. Vérifiez que le backend est démarré.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]); // Garde la dépendance mais gère le cas où user est undefined

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      confirmed: { label: 'Confirm�e', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
      preparing: { label: 'En pr�paration', color: 'bg-blue-100 text-blue-800', icon: <Package className="w-4 h-4" /> },
      in_transit: { label: 'En livraison', color: 'bg-purple-100 text-purple-800', icon: <MapPin className="w-4 h-4" /> },
      delivered: { label: 'Livr�e', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { label: 'Annul�e', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Erreur formatage date:', error, dateString);
      return 'Date invalide';
    }
  };

  // Si une commande est sélectionnée, afficher la page de détail
  if (selectedOrderId) {
    return <OrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} supplierMode={supplierMode} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigateTo('dashboard' as any)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Mes Commandes</h1>
          <p className="text-gray-600 mt-2">
            {orders.length > 0 ? `${orders.length} commande${orders.length > 1 ? 's' : ''}` : 'Aucune commande'}
          </p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des commandes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">? {error}</p>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">Aucune commande</p>
            <p className="text-gray-500 mt-2">Vos commandes appara�tront ici</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            // Validation des données de la commande
            if (!order || !order._id) return null;
            
            return (
            <div 
              key={order._id} 
              onClick={() => setSelectedOrderId(order._id)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 cursor-pointer hover:border-2 hover:border-orange-500"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Commande #{order.orderNumber || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status || 'pending')}
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {order.pricing?.total?.toFixed(2) || '0.00'} {order.pricing?.currency || 'EUR'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Articles ({order.items?.length || 0})
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {(order.items || []).map((item, idx) => (
                      <li key={idx}>
                        • {item.name || 'Article'} - Qté: {item.quantity || 0} - {item.totalPrice?.toFixed(2) || '0.00'}€
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Livraison
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress?.street || 'Adresse non renseignée'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress?.postalCode || ''} {order.deliveryAddress?.city || ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Demandée le: {formatDate(order.requestedDeliveryTime)}
                  </p>
                  
                  {/* Composant de suivi de livraison */}
                  <DeliveryStatus 
                    orderId={order._id} 
                    orderNumber={order.orderNumber} 
                    orderStatus={order.status} 
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">Paiement:</span> {order.payment?.status === 'completed' ? '✅ Payé' : '⏳ En attente'}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Contact:</span> {order.customerPhone || 'N/A'}
                </div>
                <div className="flex items-center gap-3">
                  {order.invoice ? (
                    <button
                      onClick={(e) => handleDownloadInvoice(order._id, e)}
                      disabled={generatingInvoice === order._id}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {generatingInvoice === order._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      Facture PDF
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleDownloadInvoice(order._id, e)}
                      disabled={generatingInvoice === order._id}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {generatingInvoice === order._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Générer facture
                    </button>
                  )}
                  <div className="text-orange-600 font-medium">
                    👉 Cliquer pour détails
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
