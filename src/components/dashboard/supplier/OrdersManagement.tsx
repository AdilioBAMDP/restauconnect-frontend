import React, { useState, useEffect, useCallback } from 'react';
import { Filter, FileText, Truck, Package, Loader, Download } from 'lucide-react';
import { getOrderStatusColor, getOrderStatusLabel, getOrderStatusEmoji } from '@/utils/dashboard/supplierHelpers';
import { useNavigation } from '@/hooks/useNavigation';
import OrderDetail from '@/pages/orders/Detail';
import toast from 'react-hot-toast';

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
  invoice?: {
    invoiceNumber: string;
    pdfUrl: string;
    generatedAt: string;
    emailSent: boolean;
  };
}

interface OrdersManagementProps {
  supplierOrders?: unknown[]; // Keep for backward compatibility but we'll use API
}

export const OrdersManagement: React.FC<OrdersManagementProps> = () => {
  const { navigateTo } = useNavigation();
  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        toast.error('Session expirée');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ status: 'confirmed' })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'acceptation');

      toast.success('Commande acceptée !');
      fetchSupplierOrders(); // Recharger les commandes
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible d\'accepter la commande');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette commande ?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        toast.error('Session expirée');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Erreur lors du refus');

      toast.success('Commande refusée');
      fetchSupplierOrders(); // Recharger les commandes
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de refuser la commande');
    }
  };

  const handleDownloadInvoice = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!orderId) {
      toast.error('ID de commande invalide');
      return;
    }
    
    setGeneratingInvoice(orderId);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        setGeneratingInvoice(null);
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Vérifier si la facture existe déjà
      const statusResponse = await fetch(`${apiUrl}/invoices/${orderId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Erreur ${statusResponse.status}`);
      }
      
      const statusData = await statusResponse.json();
      
      // Si la facture n'existe pas, la générer d'abord
      if (!statusData || !statusData.exists) {
        const loadingToast = toast.loading('Génération de la facture...');
        
        try {
          const generateResponse = await fetch(`${apiUrl}/invoices/${orderId}/generate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true'
            }
          });
          
          if (!generateResponse.ok) {
            const errorData = await generateResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erreur lors de la génération de la facture');
          }
          
          toast.dismiss(loadingToast);
          toast.success('Facture générée !');
        } catch (genError) {
          toast.dismiss(loadingToast);
          throw genError;
        }
      }
      
      // Télécharger la facture
      const downloadUrl = `${apiUrl}/invoices/${orderId}/download`;
      window.open(downloadUrl, '_blank');
      toast.success('Téléchargement démarré !');
      
    } catch (error) {
      console.error('Erreur téléchargement facture:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors du téléchargement de la facture';
      toast.error(message);
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const fetchSupplierOrders = useCallback(async () => {
    try {
      // Récupérer l'ID du fournisseur depuis le localStorage
      const userStr = localStorage.getItem('auth_user') || localStorage.getItem('user');
      let supplierId = null;
      
      if (userStr) {
        const user = JSON.parse(userStr);
        // ✅ Utiliser le vrai MongoDB _id, PAS le champ 'id' séquentiel
        supplierId = user._id;
        console.log('🔍 Supplier ID pour filtrage:', supplierId);
      }

      // ✅ Filtrer par supplierId pour voir les commandes reçues par ce fournisseur
      const url = supplierId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders?supplierId=${supplierId}&limit=100`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders?limit=100`;
      
      console.log('📡 Fetching supplier orders from:', url);
      const response = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      // Vérifier si c'est une erreur de rate limiting
      if (response.status === 429) {
        setError('⏱️ Trop de requêtes. Réessai dans 5 secondes...');
        setLoading(false);
        setTimeout(fetchSupplierOrders, 5000);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error('Réponse vide du serveur');
      }
      
      if (data.success) {
        const ordersData = Array.isArray(data.orders) ? data.orders : [];
        setOrders(ordersData);
        setError(null);
      } else {
        setError(data.message || 'Erreur lors du chargement des commandes');
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching supplier orders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`❌ Impossible de charger les commandes: ${errorMessage}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback sans dépendances

  useEffect(() => {
    fetchSupplierOrders();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchSupplierOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchSupplierOrders]);

  // Si une commande est sélectionnée, afficher la page de détail
  if (selectedOrderId) {
    return <OrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Gestion des Commandes</h3>
        <div className="bg-white rounded-lg shadow-md border p-12 flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Gestion des Commandes</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Gestion des Commandes</h3>
        <div className="bg-white rounded-lg shadow-md border p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Aucune commande</p>
          <p className="text-gray-500 mt-2">Les commandes de vos clients apparaîtront ici</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestion des Commandes</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            Filtrer
          </button>
          <button className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraison</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  onClick={() => setSelectedOrderId(order._id)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-sm">#{order.orderNumber}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-blue-600 text-sm">{order.customerEmail}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-900">
                      {order.items.map((item, idx) => (
                        <div key={idx}>{item.name} x{item.quantity} = {item.totalPrice.toFixed(2)}€</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-bold text-gray-900 text-sm">{order.pricing.total.toFixed(2)}€</div>
                    <div className="text-xs text-gray-500">Livraison: {order.pricing.deliveryFee}€</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusEmoji(order.status)} {getOrderStatusLabel(order.status)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.payment.status === 'completed' ? '✅ Payée' : '⏳ En attente'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center">
                      <Truck className="w-3 h-3 mr-1" />
                      {new Date(order.requestedDeliveryTime).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs mt-1">
                      {order.deliveryAddress.city}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.invoice ? (
                      <button
                        onClick={(e) => handleDownloadInvoice(order._id, e)}
                        disabled={generatingInvoice === order._id}
                        className="flex items-center gap-1 px-2 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 text-xs"
                      >
                        {generatingInvoice === order._id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                        PDF
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleDownloadInvoice(order._id, e)}
                        disabled={generatingInvoice === order._id}
                        className="flex items-center gap-1 px-2 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 text-xs"
                      >
                        {generatingInvoice === order._id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        Générer
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium space-y-1">
                    {/* Boutons de validation pour commandes en attente */}
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptOrder(order._id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full text-xs font-medium mb-1"
                        >
                          ✅ Accepter
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectOrder(order._id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors w-full text-xs font-medium mb-2"
                        >
                          ❌ Refuser
                        </button>
                      </>
                    )}
                    
                    {/* Boutons standards */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher le clic sur la ligne
                        setSelectedOrderId(order._id);
                      }}
                      className="text-blue-600 hover:text-blue-900 hover:underline block w-full text-left"
                    >
                      📄 Voir détails
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher le clic sur la ligne
                        setSelectedOrderId(order._id);
                      }}
                      className="text-green-600 hover:text-green-900 hover:underline block w-full text-left"
                    >
                      ✅ Gérer
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher le clic sur la ligne
                        navigateTo('messages', { 
                          queryParams: { 
                            recipient: order.customerEmail,
                            orderId: order._id 
                          }
                        });
                      }}
                      className="text-purple-600 hover:text-purple-900 hover:underline block w-full text-left"
                    >
                      💬 Contacter client
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher le clic sur la ligne
                        window.open(`tel:${order.customerPhone}`, '_self');
                      }}
                      className="text-orange-600 hover:text-orange-900 hover:underline block w-full text-left"
                    >
                      📞 Appeler
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
