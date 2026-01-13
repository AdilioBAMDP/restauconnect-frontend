import React from 'react';
import { Truck, Package, ShoppingCart, Plus } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  products?: number;
  [key: string]: unknown;
}

interface CurrentUser {
  id?: string;
  [key: string]: unknown;
}

interface CompleteSupplierOrdersProps {
  currentUser?: CurrentUser;
  onOrderFromSupplier?: (supplierId: string) => void;
  [key: string]: unknown;
}

export const CompleteSupplierOrders: React.FC<CompleteSupplierOrdersProps> = ({
  onOrderFromSupplier
}) => {
  // ✅ TOUS les fournisseurs utilisent le même ID de test pour accéder au catalogue de démonstration
  const testSupplierId = '68e06140d1688d365611b827';
  
  const suppliers: Supplier[] = [
    {
      id: testSupplierId, // ID du fournisseur de test dans la DB
      name: 'Maraîcher Bio Local',
      category: 'Fruits & Légumes',
      products: 45
    },
    {
      id: testSupplierId, // Même ID pour tous (catalogue de démo)
      name: 'Boucherie Premium',
      category: 'Viandes & Volailles',
      products: 28
    },
    {
      id: testSupplierId, // Même ID pour tous (catalogue de démo)
      name: 'Poissonnerie du Port',
      category: 'Poissons & Fruits de Mer',
      products: 32
    }
  ];

  const getCategoryIcon = (category: string) => {
    if (category.includes('Fruits')) return '🥬';
    if (category.includes('Viandes')) return '🥩';
    if (category.includes('Poissons')) return '🐟';
    return '📦';
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Fruits')) return 'bg-green-100 text-green-700';
    if (category.includes('Viandes')) return 'bg-red-100 text-red-700';
    if (category.includes('Poissons')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Truck className="text-emerald-600 w-5 h-5" />
          Fournisseurs & Commandes
        </h3>
        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Nouveau fournisseur
        </button>
      </div>

      <div className="space-y-3">
        {suppliers.map((supplier, index) => (
          <div
            key={`${supplier.id}-${index}`}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-400 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-3xl">{getCategoryIcon(supplier.category)}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(supplier.category)}`}>
                      {supplier.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {supplier.products} produits
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOrderFromSupplier?.(supplier.id)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100"
              >
                <ShoppingCart className="w-4 h-4" />
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Astuce:</strong> Passez vos commandes directement depuis votre dashboard pour gagner du temps !
        </p>
      </div>
    </div>
  );
};
