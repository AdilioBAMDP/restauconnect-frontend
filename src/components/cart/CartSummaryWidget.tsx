import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';

interface CartSummaryWidgetProps {
  onCheckout?: () => void;
}

const CartSummaryWidget: React.FC<CartSummaryWidgetProps> = ({ onCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    getTotalItems,
    getSubtotal,
    getDeliveryFee,
    getTotalAmount,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    supplier,
  } = useCartStore();

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotalAmount();

  const handleCheckout = () => {
    setIsOpen(false);
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <>
      {/* Badge Panier Flottant */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-36 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative p-3">
          <ShoppingCart className="w-6 h-6" />
          
          {/* Badge nombre d'articles */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {totalItems}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prix total (toujours visible) */}
        <div className="px-3 pb-2 pt-0 text-sm font-semibold border-t border-white/20">
          {total.toFixed(2)}€
        </div>
      </motion.button>

      {/* Panel Panier Déroulant */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Mon Panier
                  </h2>
                  <p className="text-sm opacity-90">
                    {totalItems} article{totalItems > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenu */}
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Votre panier est vide</p>
                  <p className="text-sm text-center mt-2">
                    Ajoutez des produits pour commencer votre commande
                  </p>
                </div>
              ) : (
                <>
                  {/* Infos Fournisseur */}
                  {supplier && (
                    <div className="p-4 bg-orange-50 border-b border-orange-100">
                      <p className="text-sm text-gray-600">Fournisseur</p>
                      <p className="font-semibold text-gray-800">{supplier.name}</p>
                      {supplier.minimumOrder && (
                        <p className="text-xs text-gray-500 mt-1">
                          Commande minimum: {supplier.minimumOrder}€
                        </p>
                      )}
                    </div>
                  )}

                  {/* Liste des articles */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-gray-50 rounded-lg p-3 flex gap-3"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl || '/images/default.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (img.src !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E') {
                                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                              }
                            }}
                          />
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.price.toFixed(2)}€ / {item.unit}
                          </p>

                          {/* Contrôles quantité */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => decrementQuantity(item.productId)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= (item.minimumQuantity || 1)}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>

                            <span className="w-12 text-center font-semibold text-gray-800">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => incrementQuantity(item.productId)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              disabled={item.quantity >= item.stockQuantity}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>

                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Sous-total article */}
                          <p className="text-sm font-bold text-orange-600 mt-2">
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Résumé et Actions */}
                  <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
                    {/* Vider le panier */}
                    {items.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
                            clearCart();
                          }
                        }}
                        className="w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Vider le panier
                      </button>
                    )}

                    {/* Sous-total */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-semibold text-gray-800">
                        {subtotal.toFixed(2)}€
                      </span>
                    </div>

                    {/* Frais de livraison */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-semibold text-gray-800">
                        {deliveryFee.toFixed(2)}€
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                      <span className="text-gray-800">Total</span>
                      <span className="text-orange-600">{total.toFixed(2)}€</span>
                    </div>

                    {/* Bouton Commander */}
                    <motion.button
                      onClick={handleCheckout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                    >
                      Passer commande
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    {/* Message minimum commande */}
                    {supplier?.minimumOrder && subtotal < supplier.minimumOrder && (
                      <p className="text-xs text-center text-red-600">
                        Commande minimum: {supplier.minimumOrder}€
                        (encore {(supplier.minimumOrder - subtotal).toFixed(2)}€)
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSummaryWidget;
