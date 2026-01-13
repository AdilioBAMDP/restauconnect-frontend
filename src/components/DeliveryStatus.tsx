import React, { useState } from 'react';
import { Truck, Clock, MapPin, CheckCircle, Package } from 'lucide-react';
import { tmsService } from '@/services/tmsService';

interface DeliveryStatusProps {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
}

interface Delivery {
  _id: string;
  deliveryNumber: string;
  status: string;
  pickupAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
  estimatedDeliveryTime?: string;
  createdAt: string;
}

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ orderId, orderStatus }) => {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      pending: { 
        label: 'En attente d\'assignation', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="w-4 h-4" />
      },
      assigned: { 
        label: 'Assignée à un livreur', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Package className="w-4 h-4" />
      },
      picked_up: { 
        label: 'Récupérée', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <Truck className="w-4 h-4" />
      },
      in_transit: { 
        label: 'En cours de livraison', 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <MapPin className="w-4 h-4" />
      },
      delivered: { 
        label: 'Livrée', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const loadDelivery = async () => {
    setIsLoading(true);
    try {
      const result = await tmsService.getDeliveryByOrderId(orderId);
      if (result.success && result.delivery) {
        setDelivery(result.delivery);
      }
    } catch (error) {
      console.error('Erreur chargement livraison:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDetails = () => {
    if (!delivery && !isLoading) {
      loadDelivery();
    }
    setShowDetails(!showDetails);
  };

  // Afficher le bouton seulement pour les commandes qui devraient avoir une livraison
  if (!['ready', 'in_transit', 'delivered'].includes(orderStatus)) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleToggleDetails}
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        disabled={isLoading}
      >
        <Truck className="w-4 h-4" />
        <span>{isLoading ? 'Chargement...' : 'Voir la livraison'}</span>
      </button>

      {showDetails && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
          {delivery ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">#{delivery.deliveryNumber}</span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusInfo(delivery.status).color}`}>
                  {getStatusInfo(delivery.status).icon}
                  <span>{getStatusInfo(delivery.status).label}</span>
                </div>
              </div>
              
              {delivery.driver && (
                <div className="text-sm text-gray-600">
                  <strong>Livreur:</strong> {delivery.driver.name}
                  {delivery.driver.phone && (
                    <span className="ml-2">📞 {delivery.driver.phone}</span>
                  )}
                </div>
              )}
              
              {delivery.estimatedDeliveryTime && (
                <div className="text-sm text-gray-600">
                  <strong>Livraison prévue:</strong> {new Date(delivery.estimatedDeliveryTime).toLocaleString('fr-FR')}
                </div>
              )}
              
              {delivery.deliveryAddress && (
                <div className="text-sm text-gray-600">
                  <strong>Adresse de livraison:</strong> {delivery.deliveryAddress.street}, {delivery.deliveryAddress.postalCode} {delivery.deliveryAddress.city}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-2">
              Aucune livraison trouvée pour cette commande
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryStatus;