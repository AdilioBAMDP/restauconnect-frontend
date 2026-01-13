/**
 * 🎯 SUPPLIER STORE - Store pour les fournisseurs
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupplierProduct, SupplierOrder, SupplierClient, SupplierStats } from '../types/supplier.types';

interface SupplierState {
  products: SupplierProduct[];
  orders: SupplierOrder[];
  clients: SupplierClient[];
  stats: SupplierStats;
  
  createProduct: (product: Omit<SupplierProduct, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updates: Partial<SupplierProduct>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, stock: number) => void;
  createOrder: (order: Omit<SupplierOrder, 'id' | 'orderDate'>) => void;
  updateOrderStatus: (id: string, status: SupplierOrder['status']) => void;
  addClient: (client: Omit<SupplierClient, 'id'>) => void;
  updateClient: (id: string, updates: Partial<SupplierClient>) => void;
  updateStats: (stats: Partial<SupplierStats>) => void;
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      products: [],
      orders: [],
      clients: [],
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalClients: 0,
        monthlyRevenue: 0,
        averageRating: 0,
        totalViews: 0,
        pendingOrders: 0
      },

      createProduct: (productData) => {
        const newProduct: SupplierProduct = {
          ...productData,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          views: 0,
          orders: 0,
          rating: 0
        };

        set((state) => ({
          products: [newProduct, ...state.products],
          stats: {
            ...state.stats,
            totalProducts: state.stats.totalProducts + 1
          }
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { 
              ...product, 
              ...updates, 
              lastUpdated: new Date().toISOString() 
            } : product
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== id),
          stats: {
            ...state.stats,
            totalProducts: Math.max(0, state.stats.totalProducts - 1)
          }
        }));
      },

      updateProductStock: (id, stock) => {
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { 
              ...product, 
              stock,
              availability: stock > 0 ? (stock > 10 ? 'available' : 'limited') : 'out_of_stock',
              lastUpdated: new Date().toISOString() 
            } : product
          )
        }));
      },

      createOrder: (orderData) => {
        const newOrder: SupplierOrder = {
          ...orderData,
          id: `order-${Date.now()}`,
          orderDate: new Date().toISOString()
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          stats: {
            ...state.stats,
            totalOrders: state.stats.totalOrders + 1,
            pendingOrders: state.stats.pendingOrders + 1,
            monthlyRevenue: state.stats.monthlyRevenue + newOrder.totalAmount
          }
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => {
          const order = state.orders.find(o => o.id === id);
          const wasPending = order?.status === 'pending' || order?.status === 'confirmed';
          const isNowCompleted = status === 'delivered';

          return {
            orders: state.orders.map(order =>
              order.id === id ? { ...order, status } : order
            ),
            stats: {
              ...state.stats,
              pendingOrders: wasPending && isNowCompleted 
                ? Math.max(0, state.stats.pendingOrders - 1)
                : state.stats.pendingOrders
            }
          };
        });
      },

      addClient: (clientData) => {
        const newClient: SupplierClient = {
          ...clientData,
          id: `client-${Date.now()}`
        };

        set((state) => ({
          clients: [newClient, ...state.clients],
          stats: {
            ...state.stats,
            totalClients: state.stats.totalClients + 1
          }
        }));
      },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map(client =>
            client.id === id ? { ...client, ...updates } : client
          )
        }));
      },

      updateStats: (statsData) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...statsData
          }
        }));
      }
    }),
    {
      name: 'supplier-storage'
    }
  )
);
