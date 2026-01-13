/**
 * Business store - État global pour les données métier
 */

import { create } from 'zustand';

export interface SupplierProduct {
  _id: string;
  id?: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  priceType?: string;
  unit: string;
  stock?: number;
  minOrder?: number;
  description?: string;
  certifications?: string[];
  availability?: boolean;
  featured?: boolean;
  views?: number;
  orders?: number;
  rating?: number;
  specifications?: Record<string, any>;
  createdAt?: string;
  lastUpdated?: string;
}

interface SupplierStats {
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
}

interface BusinessState {
  selectedBusiness: any | null;
  businesses: any[];
  supplierProducts: SupplierProduct[];
  supplierStats: SupplierStats;
  setSelectedBusiness: (business: any) => void;
  setBusinesses: (businesses: any[]) => void;
  createProduct: (product: SupplierProduct) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  selectedBusiness: null,
  businesses: [],
  supplierProducts: [],
  supplierStats: {
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
  },
  setSelectedBusiness: (business) => set({ selectedBusiness: business }),
  setBusinesses: (businesses) => set({ businesses }),
  createProduct: (product) => 
    set((state) => ({ 
      supplierProducts: [...state.supplierProducts, product] 
    })),
}));

export default useBusinessStore;
