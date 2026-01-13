/**
 * Types pour le module Fournisseur
 */

export interface SupplierProduct {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  priceType: 'unit' | 'kg' | 'lot' | 'service';
  stock: number;
  minOrder: number;
  image?: string;
  description: string;
  specifications: Record<string, string>;
  certifications: string[];
  availability: 'available' | 'limited' | 'out_of_stock';
  featured: boolean;
  views: number;
  orders: number;
  rating: number;
  createdAt: string;
  lastUpdated: string;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  restaurantId: string;
  restaurantName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface SupplierClient {
  id: string;
  restaurantName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'blocked';
  rating: number;
}

export interface SupplierStats {
  totalProducts: number;
  totalOrders: number;
  totalClients: number;
  monthlyRevenue: number;
  averageRating: number;
  totalViews: number;
  pendingOrders: number;
}
