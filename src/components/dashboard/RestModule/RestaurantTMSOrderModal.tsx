import React from 'react';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  price?: number;
  [key: string]: unknown;
}

interface OrderForm {
  items?: OrderItem[];
  deliveryDate?: string;
  notes?: string;
  [key: string]: unknown;
}

interface Supplier {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface CompleteTMSOrderModalProps {
  isOpen?: boolean;
  selectedSupplier?: Supplier | null;
  orderForm?: OrderForm;
  onClose?: () => void;
  onSubmit?: () => void;
  onUpdateForm?: (field: string, value: unknown) => void;
  onAddItem?: () => void;
  onUpdateItem?: (index: number, field: string, value: unknown) => void;
  onRemoveItem?: (index: number) => void;
  [key: string]: unknown;
}

export const CompleteTMSOrderModal: React.FC<CompleteTMSOrderModalProps> = ({
  isOpen = false,
  selectedSupplier,
  orderForm = {},
  onClose,
  onSubmit,
  onUpdateForm,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}) => {
  if (!isOpen) return null;

  const items = orderForm.items || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <ShoppingCart className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Nouvelle Commande</h2>
              {selectedSupplier && (
                <p className="text-sm text-gray-600">Fournisseur: {selectedSupplier.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de Livraison Souhaitée
            </label>
            <input
              type="date"
              value={orderForm.deliveryDate || ''}
              onChange={(e) => onUpdateForm?.('deliveryDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Articles</label>
              <button
                onClick={onAddItem}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Ajouter un article
              </button>
            </div>

            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div key={item.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Nom du produit"
                      value={item.productName || ''}
                      onChange={(e) => onUpdateItem?.(index, 'productName', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Qté"
                      value={item.quantity || ''}
                      onChange={(e) => onUpdateItem?.(index, 'quantity', parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <select
                      value={item.unit || 'kg'}
                      onChange={(e) => onUpdateItem?.(index, 'unit', e.target.value)}
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="kg">kg</option>
                      <option value="L">L</option>
                      <option value="unité">unité</option>
                      <option value="carton">carton</option>
                    </select>
                    <button
                      onClick={() => onRemoveItem?.(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucun article. Cliquez sur "Ajouter un article" pour commencer.</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes Additionnelles
            </label>
            <textarea
              value={orderForm.notes || ''}
              onChange={(e) => onUpdateForm?.('notes', e.target.value)}
              placeholder="Instructions spéciales, préférences de livraison..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={items.length === 0}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Envoyer la Commande
          </button>
        </div>
      </div>
    </div>
  );
};
