import { API_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

// Types TypeScript pour le TMS
export interface DeliveryRequest {
  pickupAddress: {
    street: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    instructions?: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    instructions?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    weight?: number;
    category: string;
    specialHandling?: string;
  }>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  specialInstructions?: string;
  deliverySchedule?: {
    preferredDate: string;
    preferredTimeSlot: string;
    flexibleTiming: boolean;
  };
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

interface DeliveryItem {
  name: string;
  quantity: number;
  unitPrice: number;
  weight?: number;
  category: string;
  specialHandling?: string;
}

interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface Delivery {
  _id: string;
  deliveryNumber: string;
  requesterInfo: {
    userId: string;
    name: string;
    phone: string;
    email: string;
  };
  supplierInfo: {
    userId: string;
    name: string;
    phone: string;
    address: Address;
  };
  pickupAddress: Address;
  deliveryAddress: Address;
  items: DeliveryItem[];
  pricing: {
    totalAmount: number;
    deliveryFee: number;
    finalTotal: number;
  };
  status: string;
  priority: string;
  driverId?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  trackingHistory: TrackingEvent[];
  rating?: {
    score: number;
    comment: string;
    ratedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryTracking {
  deliveryId: string;
  currentStatus: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  estimatedArrival?: string;
  distanceToDestination?: number;
  progressPercentage: number;
  nextMilestone: string;
}

export interface Driver {
  _id: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
    licenseNumber: string;
    licenseExpiry: string;
  };
  vehicleInfo: {
    type: string;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    capacity: number;
    features: string[];
  };
  status: 'offline' | 'available' | 'busy' | 'paused';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  stats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    totalEarnings: number;
    totalRatings: number;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  createdAt: string;
}

class TMSService {
  private baseURL = `${API_BASE_URL}/api/tms`;

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // ===== DELIVERIES API =====

  /**
   * Créer une nouvelle demande de livraison
   */
  async createDeliveryRequest(deliveryData: DeliveryRequest): Promise<{ success: boolean; delivery: Delivery; message: string }> {
    const response = await fetch(`${this.baseURL}/deliveries`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(deliveryData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création de la demande');
    }

    return await response.json();
  }

  /**
   * Récupérer les livraisons de l'utilisateur
   */
  async getUserDeliveries(status?: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    deliveries: Delivery[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${this.baseURL}/deliveries/user?${params}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des livraisons');
    }

    return await response.json();
  }

  /**
   * Récupérer les détails d'une livraison
   */
  async getDeliveryDetails(deliveryId: string): Promise<{
    success: boolean;
    delivery: Delivery;
    tracking: DeliveryTracking;
  }> {
    const response = await fetch(`${this.baseURL}/deliveries/${deliveryId}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails');
    }

    return await response.json();
  }

  /**
   * Récupérer le tracking d'une livraison
   */
  async getDeliveryTracking(deliveryId: string): Promise<{
    success: boolean;
    tracking: TrackingEvent[];
  }> {
    const response = await fetch(`${this.baseURL}/deliveries/${deliveryId}/tracking`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du tracking');
    }

    return await response.json();
  }

  /**
   * Annuler une livraison
   */
  async cancelDelivery(deliveryId: string, reason: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/deliveries/${deliveryId}/cancel`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'annulation');
    }

    return await response.json();
  }

  /**
   * Évaluer une livraison
   */
  async rateDelivery(deliveryId: string, rating: number, comment?: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/deliveries/${deliveryId}/rate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rating, comment })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'évaluation');
    }

    return await response.json();
  }

  // ===== DRIVERS API =====

  /**
   * Inscription comme livreur
   */
  async registerDriver(driverData: Partial<Driver>): Promise<{ success: boolean; driver: Driver; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(driverData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'inscription');
    }

    return await response.json();
  }

  /**
   * Récupérer le profil livreur
   */
  async getDriverProfile(): Promise<{ success: boolean; driver: Driver }> {
    const response = await fetch(`${this.baseURL}/drivers/profile`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    return await response.json();
  }

  /**
   * Mettre à jour le profil livreur
   */
  async updateDriverProfile(updates: Partial<Driver>): Promise<{ success: boolean; driver: Driver; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour');
    }

    return await response.json();
  }

  /**
   * Changer le statut du livreur
   */
  async updateDriverStatus(status: 'offline' | 'available' | 'busy' | 'paused'): Promise<{ success: boolean; status: string; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du changement de statut');
    }

    return await response.json();
  }

  /**
   * Mettre à jour la position du livreur
   */
  async updateDriverLocation(latitude: number, longitude: number, accuracy?: number, speed?: number, heading?: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/location`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ latitude, longitude, accuracy, speed, heading })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour de position');
    }

    return await response.json();
  }

  /**
   * Récupérer les livraisons disponibles pour un livreur
   */
  async getAvailableDeliveries(): Promise<{ success: boolean; deliveries: Delivery[] }> {
    const response = await fetch(`${this.baseURL}/drivers/deliveries/available`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des livraisons');
    }

    return await response.json();
  }

  /**
   * Accepter une livraison
   */
  async acceptDelivery(deliveryId: string): Promise<{ success: boolean; delivery: Delivery; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/deliveries/${deliveryId}/accept`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'acceptation');
    }

    return await response.json();
  }

  /**
   * Marquer comme récupéré
   */
  async markAsPickedUp(deliveryId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/deliveries/${deliveryId}/pickup`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du marquage');
    }

    return await response.json();
  }

  /**
   * Marquer comme livré
   */
  async markAsDelivered(deliveryId: string, proofData: { signature?: string; photo?: string; recipientName?: string }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/deliveries/${deliveryId}/deliver`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(proofData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du marquage');
    }

    return await response.json();
  }

  /**
   * Signaler un problème
   */
  async reportIssue(deliveryId: string, issueType: string, description: string, photo?: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/drivers/deliveries/${deliveryId}/report-issue`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ issueType, description, photo })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du signalement');
    }

    return await response.json();
  }

  /**
   * Récupérer les livraisons du livreur
   */
  async getDriverDeliveries(status?: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    deliveries: Delivery[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${this.baseURL}/drivers/deliveries?${params}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des livraisons');
    }

    return await response.json();
  }

  /**
   * Récupérer les statistiques du livreur
   */
  async getDriverStats(): Promise<{ success: boolean; stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    totalEarnings: number;
    averageRating: number;
    todayDeliveries: number;
    weekDeliveries: number;
    monthDeliveries: number;
  } }> {
    const response = await fetch(`${this.baseURL}/drivers/stats`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }

    return await response.json();
  }

  // ===== GEOLOCALISATION =====

  /**
   * Géolocaliser une adresse
   */
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Utiliser l'API Nominatim d'OpenStreetMap (gratuite)
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Erreur lors du géocodage', error);
      return null;
    }
  }

  /**
   * Calculer la distance entre deux points
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  /**
   * Récupérer les livraisons d'un fournisseur
   */
  async getSupplierDeliveries(): Promise<{ success: boolean; deliveries: Delivery[] }> {
    const response = await fetch(`${this.baseURL}/deliveries/supplier-deliveries`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des livraisons');
    }

    return await response.json();
  }

  /**
   * Récupérer la livraison associée à une commande
   */
  async getDeliveryByOrderId(orderId: string): Promise<{ success: boolean; delivery: Delivery | null }> {
    try {
      // Utiliser l'endpoint de test pour éviter les problèmes d'authentification
      const response = await fetch(`${this.baseURL}/deliveries/test-by-order/${orderId}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la livraison');
      }

      const data = await response.json();
      
      return {
        success: data.success,
        delivery: data.delivery || null
      };
    } catch (error) {
      logger.error('Erreur getDeliveryByOrderId:', error);
      return {
        success: false,
        delivery: null
      };
    }
  }
}

export const tmsService = new TMSService();
export default tmsService;
