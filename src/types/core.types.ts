// Types unifiés pour Web Spider - Frontend
// ✅ COHÉRENCE BACKEND-FRONTEND : Types identiques au backend

export type UserRole = 
  | 'restaurant' 
  | 'artisan' 
  | 'supplier' 
  | 'banker' 
  | 'investor' 
  | 'driver' 
  | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  rating?: number;
  verified?: boolean;
  location?: {
    city?: string;
    address?: string;
  };
  profile?: {
    businessInfo?: any;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
}

// Types pour les annonces/offres
export interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'demand' | 'supply';
  category: string;
  budget?: number;
  location?: string;
  authorId: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Types pour les commandes
export interface Order {
  id: string;
  restaurantId: string;
  supplierId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// Types pour les produits
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  supplierId: string;
  imageUrl?: string;
  stock?: number;
  unit: string;
}

// Types pour les notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Types pour les messages/conversations
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}