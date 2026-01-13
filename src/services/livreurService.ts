import { apiClient } from './api';

// Types pour les statistiques de livreur
export interface DriverStats {
  today: {
    deliveries: number;
    earnings: number;
    distance: number;
    activeTime: number;
  };
  week: {
    deliveries: number;
    earnings: number;
    avgRating: number;
  };
  month: {
    deliveries: number;
    earnings: number;
  };
}

// Types pour les livraisons
export interface TMSDelivery {
  _id: string;
  trackingId: string;
  orderId: {
    _id: string;
    totalAmount: number;
    products: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  restaurantId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  supplierId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  driverId?: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  urgency: 'normal' | 'urgent' | 'express';
  status: 'pending' | 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  specialInstructions?: string;
  deliveryFee: number;
  priority: number;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes: string;
  }>;
  createdAt: string;
  pickupLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  deliveryLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
}

// Service pour les fonctionnalités livreur
export const livreurService = {
  // Récupérer les statistiques du livreur
  async getDriverStats(): Promise<DriverStats> {
    try {
      const response = await apiClient.get('/livreur/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Impossible de charger les statistiques du livreur');
    }
  },

  // Récupérer les livraisons disponibles
  async getAvailableDeliveries(): Promise<TMSDelivery[]> {
    try {
      const response = await apiClient.get('/tms/deliveries/available');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des livraisons disponibles:', error);
      return [];
    }
  },

  // Récupérer mes livraisons assignées
  async getMyDeliveries(): Promise<TMSDelivery[]> {
    try {
      const response = await apiClient.get('/tms/deliveries/my-deliveries');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de mes livraisons:', error);
      return [];
    }
  },

  // Prendre en charge une livraison
  async assignDelivery(deliveryId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put(`/tms/deliveries/${deliveryId}/assign`);
      return {
        success: true,
        message: response.data.message || 'Livraison assignée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'assignation'
      };
    }
  },

  // Mettre à jour le statut d'une livraison
  async updateDeliveryStatus(
    deliveryId: string, 
    status: string, 
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put(`/tms/deliveries/${deliveryId}/status`, {
        status,
        notes
      });
      return {
        success: true,
        message: response.data.message || 'Statut mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour'
      };
    }
  },

  // Récupérer l'historique des gains
  async getEarningsHistory(): Promise<{
    daily: Array<{ date: string; amount: number }>;
    weekly: number;
    monthly: number;
    total: number;
    pending: number;
  }> {
    try {
      const response = await apiClient.get('/livreur/earnings');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des gains:', error);
      throw new Error('Impossible de charger l\'historique des gains');
    }
  },

  // Mettre à jour le statut en ligne du livreur
  async updateOnlineStatus(isOnline: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put('/livreur/status', { isOnline });
      return {
        success: true,
        message: response.data.message || 'Statut mis à jour'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du statut'
      };
    }
  },

  // Récupérer le profil du livreur
  async getDriverProfile(): Promise<{
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicle: string;
    license: string;
    rating: number;
    totalDeliveries: number;
    joinDate: string;
    documents: Array<{
      type: string;
      status: 'verified' | 'pending' | 'rejected';
      expiryDate?: string;
    }>;
  }> {
    try {
      const response = await apiClient.get('/livreur/profile');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw new Error('Impossible de charger le profil du livreur');
    }
  }
};
