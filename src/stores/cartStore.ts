import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface pour un article dans le panier
export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  unit: string;
  quantity: number;
  minimumQuantity: number;
  stockQuantity: number;
  supplierId: string;
  supplierName: string;
}

// Interface pour le fournisseur
export interface CartSupplier {
  id: string;
  name: string;
  deliveryFee: number;
  minimumOrder: number;
  deliveryInfo?: {
    leadTime?: number;
    deliveryDays?: string[];
  };
}

// Interface du store
interface CartStore {
  // État
  items: CartItem[];
  supplier: CartSupplier | null;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
  urgency: 'normal' | 'urgent';
  
  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalAmount: () => number;
  canCheckout: () => boolean;
  
  // Actions
  setSupplier: (supplier: CartSupplier) => void;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  setDeliveryDetails: (details: {
    address?: string;
    date?: string;
    time?: string;
    instructions?: string;
    urgency?: 'normal' | 'urgent';
  }) => void;
}

// Store avec persistance dans localStorage
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // État initial
      items: [],
      supplier: null,
      deliveryAddress: '',
      deliveryDate: '',
      deliveryTime: '09:00',
      specialInstructions: '',
      urgency: 'normal',

      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getDeliveryFee: () => {
        const { supplier, urgency } = get();
        const baseFee = supplier?.deliveryFee || 0;
        const urgentSurcharge = urgency === 'urgent' ? 10 : 0;
        return baseFee + urgentSurcharge;
      },

      getTotalAmount: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },

      canCheckout: () => {
        const { items, supplier, deliveryAddress, deliveryDate } = get();
        const subtotal = get().getSubtotal();
        const minimumOrder = supplier?.minimumOrder || 0;
        
        return (
          items.length > 0 &&
          subtotal >= minimumOrder &&
          deliveryAddress.length > 0 &&
          deliveryDate.length > 0
        );
      },

      // Actions
      setSupplier: (supplier) => set({ supplier }),

      addToCart: (product, quantity = 1) => {
        const { items, supplier } = get();

        // Vérifier que le fournisseur est le même
        if (supplier && supplier.id !== product.supplierId) {
          // Panier ne peut contenir que des produits d'un seul fournisseur
          const confirmChange = window.confirm(
            `Votre panier contient des produits de ${supplier.name}. Voulez-vous vider le panier pour commander chez ${product.supplierName} ?`
          );
          
          if (!confirmChange) return;
          
          // Vider le panier et changer de fournisseur
          set({
            items: [],
            supplier: {
              id: product.supplierId,
              name: product.supplierName,
              deliveryFee: 5, // Valeur par défaut, sera mise à jour
              minimumOrder: 50
            }
          });
        }

        // Si pas de fournisseur défini, le définir
        if (!supplier) {
          set({
            supplier: {
              id: product.supplierId,
              name: product.supplierName,
              deliveryFee: 5,
              minimumOrder: 50
            }
          });
        }

        // Vérifier si le produit est déjà dans le panier
        const existingItemIndex = items.findIndex(item => item.productId === product.productId);

        if (existingItemIndex >= 0) {
          // Mettre à jour la quantité
          const newItems = [...items];
          const currentQty = newItems[existingItemIndex].quantity;
          const newQty = currentQty + quantity;

          // Vérifier le stock
          if (newQty > product.stockQuantity) {
            alert(`Stock insuffisant. Disponible: ${product.stockQuantity} ${product.unit}`);
            return;
          }

          newItems[existingItemIndex].quantity = newQty;
          set({ items: newItems });
        } else {
          // Ajouter nouveau produit
          if (quantity > product.stockQuantity) {
            alert(`Stock insuffisant. Disponible: ${product.stockQuantity} ${product.unit}`);
            return;
          }

          set({
            items: [
              ...items,
              {
                ...product,
                quantity: Math.max(quantity, product.minimumQuantity)
              }
            ]
          });
        }

        // 🔥 NOUVEAU: Synchroniser avec le backend après ajout local
        const syncWithBackend = async () => {
          try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            if (!token) {
              console.warn('⚠️ Pas de token d\'authentification - ajout local seulement');
              return;
            }

            // Import dynamique de apiClient pour éviter les dépendances circulaires
            const { apiClient } = await import('@/services/api');
            
            const response = await apiClient.post('/cart/add', {
              productId: product.productId,
              quantity: quantity,
              supplierId: product.supplierId,
              name: product.name,
              unitPrice: product.price
            });

            if (response.data.success) {
              console.log('✅ Produit synchronisé avec le backend');
            } else {
              console.warn('⚠️ Erreur sync backend, produit gardé en local');
            }
          } catch (error) {
            console.warn('⚠️ Erreur réseau, produit gardé en local', error);
          }
        };

        // Appel async sans bloquer l'interface
        syncWithBackend();
      },

      removeFromCart: (productId) => {
        const newItems = get().items.filter(item => item.productId !== productId);
        
        // Si le panier est vide, réinitialiser le fournisseur
        if (newItems.length === 0) {
          set({ items: [], supplier: null });
        } else {
          set({ items: newItems });
        }
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        const itemIndex = items.findIndex(item => item.productId === productId);
        
        if (itemIndex < 0) return;

        const item = items[itemIndex];
        
        // Vérifier le minimum
        if (quantity < item.minimumQuantity) {
          alert(`Quantité minimale: ${item.minimumQuantity} ${item.unit}`);
          return;
        }

        // Vérifier le stock
        if (quantity > item.stockQuantity) {
          alert(`Stock insuffisant. Disponible: ${item.stockQuantity} ${item.unit}`);
          return;
        }

        // Mettre à jour
        const newItems = [...items];
        newItems[itemIndex].quantity = quantity;
        set({ items: newItems });
      },

      incrementQuantity: (productId) => {
        const { items } = get();
        const item = items.find(i => i.productId === productId);
        if (item) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      decrementQuantity: (productId) => {
        const { items } = get();
        const item = items.find(i => i.productId === productId);
        if (item) {
          const newQty = item.quantity - 1;
          if (newQty < item.minimumQuantity) {
            get().removeFromCart(productId);
          } else {
            get().updateQuantity(productId, newQty);
          }
        }
      },

      clearCart: () => set({
        items: [],
        supplier: null,
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '09:00',
        specialInstructions: '',
        urgency: 'normal'
      }),

      setDeliveryDetails: (details) => set((state) => ({
        deliveryAddress: details.address ?? state.deliveryAddress,
        deliveryDate: details.date ?? state.deliveryDate,
        deliveryTime: details.time ?? state.deliveryTime,
        specialInstructions: details.instructions ?? state.specialInstructions,
        urgency: details.urgency ?? state.urgency
      }))
    }),
    {
      name: 'restauconnect-cart', // Nom dans localStorage
      version: 1
    }
  )
);

// Hook pour utiliser le panier
export default useCartStore;
