/**
 * Types pour le module Offres Restaurant
 */

export interface RestaurantOffer {
  id: string;
  type: 'personnel' | 'service' | 'fourniture';
  title: string;
  description: string;
  category: string;
  urgent: boolean;
  budget?: string;
  location: string;
  requirements: string[];
  images?: string[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  expiresAt?: string;
  applicationsCount: number;
  restaurantId: string;
}

export interface Application {
  id: string;
  offerId: string;
  professionalId: string;
  message: string;
  proposedPrice?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  relatedOfferId?: string;
}

export interface RestaurantStats {
  dailyOrders: number;
  activeStaff: number;
  todayReservations: number;
  averageRating: number;
  monthlyRevenue: number;
  pendingApplications: number;
  unreadMessages: number;
}
