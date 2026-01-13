import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, ShoppingCart, Star, 
  MapPin, Clock, Package, X, Plus 
} from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import useCartStore from '@/stores/cartStore';
import { useNavigation } from '@/hooks/useNavigation';
import { apiClient } from '@/services/api';
// ...existing code...
import PublishOfferModal from '@/components/offers/PublishOfferModal';
import CartSummaryWidget from '@/components/cart/CartSummaryWidget';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  stockQuantity: number;
  minimumQuantity: number;
  category: string;
  origin?: string;
  certifications?: string[];
  isFeatured?: boolean;
  supplierId: {
    _id: string;
    name?: string;
    companyName?: string;
  };
}

interface SupplierInfo {
  _id: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  location?: {
    address?: string;
    city?: string;
  };
  rating?: number;
}

interface CatalogData {
  supplier: SupplierInfo;
  products: Product[];
  totalProducts: number;
  categories: string[];
}

// ...existing code...

const SupplierCatalogView: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { getTotalItems, getSubtotal } = useCartStore();
  
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // ✅ Récupérer l'ID du fournisseur depuis localStorage (sauvegardé au clic sur "Commander")
  const supplierId = localStorage.getItem('selectedSupplierId') || '68e06140d1688d365611b827'; // Fallback sur l'ID de test

  // Correction : wrap fetchCatalog dans useCallback pour stabiliser la dépendance
  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/supplier/${supplierId}/catalog`);
      setCatalogData(response.data.data);
    } catch {
      setCatalogData(null);
    } finally {
      setLoading(false);
    }
  }, [supplierId]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Filtrage des produits
  const filteredProducts = catalogData?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Compter produits par catégorie
  const categoryCounts = catalogData?.products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du catalogue...</p>
        </div>
      </div>
    );
  }

  const supplier = catalogData?.supplier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Navigation Supérieur */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Bouton Retour */}
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-semibold">Retour</span>
            </button>

            {/* Titre de la page */}
            <div className="flex items-center">
              <Package className="w-6 h-6 mr-2" />
              <h1 className="text-xl font-bold">Catalogue Fournisseur</h1>
            </div>

            {/* Actions - Publier Offre + Panier */}
            <div className="flex items-center gap-3">
              {/* Bouton Publier une offre */}
              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Publier une offre</span>
              </button>

              {/* Badge panier */}
              <button
                onClick={() => setShowCartPreview(!showCartPreview)}
                className="relative bg-white text-blue-700 px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span>Panier ({getTotalItems()})</span>
                {getTotalItems() > 0 && (
                  <span className="ml-3 bg-blue-700 text-white px-3 py-1 rounded-full font-bold">
                    {getSubtotal().toFixed(2)}€
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header Fournisseur */}
      <div className="bg-white shadow-lg border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Infos fournisseur */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {supplier?.companyName || supplier?.name || 'Catalogue Fournisseur'}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                {supplier?.rating && (
                  <div className="flex items-center mr-6">
                    <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                    <span className="font-semibold">{supplier.rating.toFixed(1)}/5</span>
                  </div>
                )}
                {supplier?.location?.city && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{supplier.location.city}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Package className="w-4 h-4 mr-2" />
                <span>{catalogData?.totalProducts} produits disponibles</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <div className="bg-blue-50 px-6 py-4 rounded-lg text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Livraison</p>
                <p className="font-bold text-gray-900">24-48h</p>
              </div>
              <div className="bg-green-50 px-6 py-4 rounded-lg text-center">
                <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Minimum</p>
                <p className="font-bold text-gray-900">50€</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtres
              {selectedCategory !== 'all' && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">1</span>
              )}
            </button>
          </div>

          {/* Panneau de filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Toutes ({catalogData?.totalProducts})
                  </button>
                  {catalogData?.categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category} ({categoryCounts[category]})
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </h2>
          {searchTerm && (
            <p className="text-gray-600 mt-1">
              Résultats pour "{searchTerm}"
            </p>
          )}
        </div>

        {/* Grille de produits */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product}
                onAddedToCart={() => setShowCartPreview(true)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Bouton panier flottant mobile */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <button
            onClick={() => navigateTo('checkout')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            <span className="font-bold">{getTotalItems()}</span>
            <span className="ml-3 bg-white text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
              {getSubtotal().toFixed(2)}€
            </span>
          </button>
        </div>
      )}

      {/* Modal Publier une offre */}
      <PublishOfferModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />

      {/* Widget Panier Flottant */}
      <CartSummaryWidget
        onCheckout={() => navigateTo('checkout')}
      />
    </div>
  );
};

export default SupplierCatalogView;
