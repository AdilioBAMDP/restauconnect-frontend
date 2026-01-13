import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Package, Award, MapPin } from 'lucide-react';
import useCartStore from '@/stores/cartStore';

interface Product {
  _id: string;
  id?: string | number; // Backend peut envoyer id au lieu de _id
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl?: string;
  image?: string; // Backend envoie 'image' pas 'imageUrl'
  stockQuantity?: number;
  inStock?: boolean; // Backend envoie inStock au lieu de stockQuantity
  minimumQuantity?: number;
  minQuantity?: number; // Backend envoie minQuantity au lieu de minimumQuantity
  category: string;
  origin?: string;
  certifications?: string[];
  isFeatured?: boolean;
  supplierId: {
    _id: string;
    name?: string;
    companyName?: string;
  } | string | number; // Backend peut envoyer juste l'ID
}

interface ProductCardProps {
  product: Product;
  onAddedToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddedToCart }) => {
  // Normaliser les propriétés du backend
  const productId = product._id || product.id?.toString() || '';
  const imageUrl = product.imageUrl || product.image || '/placeholder-product.jpg';
  const stockQuantity = product.stockQuantity || (product.inStock ? 100 : 0); // Si inStock=true, on met 100 par défaut
  const minimumQuantity = product.minimumQuantity || product.minQuantity || 1;
  const supplierId = typeof product.supplierId === 'object' ? product.supplierId._id : product.supplierId?.toString() || '';
  const supplierName = typeof product.supplierId === 'object' ? (product.supplierId.companyName || product.supplierId.name || 'Fournisseur') : 'Fournisseur';

  const [quantity, setQuantity] = useState(minimumQuantity);
  const [showSuccess, setShowSuccess] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const isLowStock = stockQuantity > 0 && stockQuantity <= 10;
  const isOutOfStock = stockQuantity === 0;

  const handleAddToCart = () => {
    addToCart({
      productId: productId,
      name: product.name,
      imageUrl: imageUrl,
      price: product.price,
      unit: product.unit,
      minimumQuantity: minimumQuantity,
      stockQuantity: stockQuantity,
      supplierId: supplierId,
      supplierName
    }, quantity);

    // Animation de succès
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    
    // Réinitialiser la quantité
    setQuantity(minimumQuantity);

    if (onAddedToCart) onAddedToCart();
  };

  const incrementQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > minimumQuantity) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Badge Featured */}
      {product.isFeatured && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <Award className="w-3 h-3 mr-1" />
          Populaire
        </div>
      )}

      {/* Badge Stock */}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
          Rupture
        </div>
      )}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          Stock limité
        </div>
      )}

      {/* Animation succès ajout panier */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Ajouté au panier!
        </motion.div>
      )}

      {/* Image produit */}
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.dataset.errored) {
              img.dataset.errored = 'true';
              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
            }
          }}
        />
        
        {/* Overlay hover avec info rapide */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end p-3">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
            {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Catégorie */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase font-semibold">{product.category}</span>
          {product.origin && (
            <span className="text-xs text-gray-600 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {product.origin}
            </span>
          )}
        </div>

        {/* Nom produit */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={product.name}>
          {product.name}
        </h3>

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.certifications.slice(0, 2).map((cert, index) => (
              <span
                key={index}
                className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium"
              >
                {cert}
              </span>
            ))}
            {product.certifications.length > 2 && (
              <span className="text-xs text-gray-500">+{product.certifications.length - 2}</span>
            )}
          </div>
        )}

        {/* Prix */}
        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)}€</span>
          <span className="text-sm text-gray-600 ml-1">/ {product.unit}</span>
        </div>

        {/* Stock */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Package className="w-4 h-4 mr-1" />
          <span>
            {isOutOfStock ? (
              <span className="text-red-600 font-semibold">Rupture de stock</span>
            ) : (
              <>
                Stock: <span className={isLowStock ? 'text-orange-600 font-semibold' : 'text-green-600'}>{product.stockQuantity} {product.unit}</span>
              </>
            )}
          </span>
        </div>

        {/* Quantité minimale */}
        {typeof product.minimumQuantity === 'number' && product.minimumQuantity > 1 && (
          <div className="text-xs text-gray-500 mb-3">
            Quantité minimale: {product.minimumQuantity} {product.unit}
          </div>
        )}

        {/* Sélecteur quantité */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-700 font-medium">Quantité:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= minimumQuantity}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || minimumQuantity;
                  if (val >= minimumQuantity && val <= stockQuantity) {
                    setQuantity(val);
                  }
                }}
                className="w-16 text-center py-2 border-0 focus:outline-none text-gray-900 font-semibold"
                min={minimumQuantity}
                max={stockQuantity}
              />
              <button
                onClick={incrementQuantity}
                disabled={quantity >= stockQuantity}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        )}

        {/* Bouton Ajouter au panier */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center ${
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
        </button>

        {/* Total pour cette quantité */}
        {!isOutOfStock && (
          <div className="mt-3 text-center text-sm text-gray-600">
            Total: <span className="font-bold text-gray-900">{(product.price * quantity).toFixed(2)}€</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
