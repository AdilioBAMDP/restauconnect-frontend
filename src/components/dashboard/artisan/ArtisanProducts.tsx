import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
  isActive: boolean;
  sales: number;
}

interface ArtisanProductsProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

export function ArtisanProducts({ products, onAddProduct, onEditProduct, onDeleteProduct }: ArtisanProductsProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'low_stock'>('all');

  const filteredProducts = products.filter(p => {
    if (filter === 'active') return p.isActive;
    if (filter === 'low_stock') return p.stock < 10;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Produits</h2>
        <button
          onClick={onAddProduct}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'active', 'low_stock'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Stock faible'}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-20 h-20 text-amber-600 opacity-50" />
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                {product.isActive ? (
                  <Eye className="w-5 h-5 text-green-600 bg-white rounded-full p-1" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400 bg-white rounded-full p-1" />
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2">
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                  {product.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {product.price.toFixed(2)} €
                  </div>
                  <p className="text-sm text-gray-600">par {product.unit}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    product.stock < 10 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.stock}
                  </div>
                  <p className="text-sm text-gray-600">en stock</p>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <span className="font-medium">{product.sales}</span> ventes ce mois
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEditProduct(product.id)}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
