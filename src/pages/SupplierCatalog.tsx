import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  Trash2,
  Star,
  Box,
  TrendingUp
} from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import SupplierExport from '@/components/supplier/SupplierExport';
import SupplierImport from '@/components/supplier/SupplierImport';
import Header from '@/components/Header';
import { useNavigation } from '@/hooks/useNavigation';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import SuccessNotification from '@/components/modals/SuccessNotification';
import ErrorNotification from '@/components/modals/ErrorNotification';

interface SupplierCatalogProps {
  navigateTo: (page: string) => void;
}

// On utilise directement SupplierProduct du businessStore

export default function SupplierCatalog({ navigateTo }: SupplierCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Utiliser les vraies données du businessStore
  const { 
    supplierProducts, 
    supplierStats,
    deleteProduct
  } = useBusinessStore();

  // Actions pour les produits
  const handleEditProduct = (productId: string) => {
    const product = supplierProducts.find(p => p.id === productId);
    if (product) {
      // Pour l'instant, on affiche les détails du produit
      setErrorMessage(`Édition du produit "${product.name}" - Fonctionnalité en développement`);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setSuccessMessage('Produit supprimé avec succès');
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const categories = [
    'all',
    ...Array.from(new Set(supplierProducts.map(p => p.category)))
  ];

  const filteredProducts = supplierProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityColor = (availability: 'available' | 'limited' | 'out_of_stock') => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
    }
  };

  const getAvailabilityText = (availability: 'available' | 'limited' | 'out_of_stock') => {
    switch (availability) {
      case 'available': return '✅ Disponible';
      case 'limited': return '⚠️ Stock Limité';
      case 'out_of_stock': return '❌ Rupture';
    }
  };

  const renderProductCard = (product: { id: string; name: string; category: string; subcategory: string; price: number; priceType: string; stock: number; minOrder: number; image?: string; description: string; specifications: Record<string, string>; certifications: string[]; availability: 'available' | 'limited' | 'out_of_stock'; featured: boolean; views: number; orders: number; rating: number; lastUpdated: string; }) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      {/* Header avec image et statut */}
      <div className="relative p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-4xl">{product.image}</div>
          <div className="flex space-x-1">
            {product.featured && (
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                ⭐ Featured
              </span>
            )}
            <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(product.availability)}`}>
              {getAvailabilityText(product.availability)}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Prix et stock */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-green-600">
              {product.price}€/{product.priceType}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Min. commande: {product.minOrder}</span>
            <span>⭐ {product.rating}</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.certifications.slice(0, 2).map((cert) => (
            <span key={cert} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {cert}
            </span>
          ))}
          {product.certifications.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{product.certifications.length - 2}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>👁️ {product.views} vues</span>
          <span>📦 {product.orders} commandes</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center">
            <Eye className="w-4 h-4 mr-1" />
            Voir
          </button>
          <button 
            onClick={() => handleEditProduct(product.id)}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteProduct(product.id)}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="supplier-catalog" onNavigate={navigateTo} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Catalogue Fournisseur 📦</h1>
              <p className="text-gray-600 mt-2">
                Gérez votre catalogue de produits, services et équipements
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateTo('supplier-dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                ← Retour Dashboard
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter Produit
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                📥 Importer
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                📤 Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{supplierStats.totalProducts}</p>
                <p className="text-sm text-gray-600">Produits Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {supplierStats.totalViews}
                </p>
                <p className="text-sm text-gray-600">Vues Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {supplierStats.totalOrders}
                </p>
                <p className="text-sm text-gray-600">Commandes</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {supplierStats.averageRating}
                </p>
                <p className="text-sm text-gray-600">Note Moyenne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans mon catalogue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes Catégories' : category}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Box className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} 
            {searchTerm && ` correspondant à "${searchTerm}"`}
            {selectedCategory !== 'all' && ` dans "${selectedCategory}"`}
          </p>
        </div>

        {/* Grille de produits */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(renderProductCard)}
        </div>

        {/* Message si aucun résultat */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter des produits à votre catalogue'
              }
            </p>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Premier Produit
            </button>
          </div>
        )}
      </div>

      {/* Modal d'ajout de produit (placeholder) */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Ajouter un Nouveau Produit</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Formulaire d'ajout de produit en cours de développement...
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import */}
      {showImport && (
        <SupplierImport 
          isOpen={showImport}
          onClose={() => setShowImport(false)} 
        />
      )}

      {/* Modal Export */}
      {showExport && (
        <SupplierExport 
          isOpen={showExport}
          onClose={() => setShowExport(false)} 
        />
      )}
    </div>
  );
}
