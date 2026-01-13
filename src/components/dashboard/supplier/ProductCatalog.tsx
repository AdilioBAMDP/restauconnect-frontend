import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Eye, Edit3 } from 'lucide-react';
import { AddProductModal } from './AddProductModal';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  stock: number;
  image?: string;
  certifications: string[];
}

interface ProductCatalogProps {
  supplierProducts: Product[];
  navigateTo: (page: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  supplierProducts,
  navigateTo
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Mon Catalogue Produits</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigateTo('supplier-catalog')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Package className="w-4 h-4 mr-2" />
            Catalogue Complet
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Produit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supplierProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{product.image}</div>
                <div className="flex space-x-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prix:</span>
                  <span className="font-bold text-green-600">{product.price}€/{product.priceType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock} {product.stock < 10 ? '⚠️' : '✅'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {product.certifications.map((cert) => (
                  <span key={cert} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            // Optionally refresh product list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};
