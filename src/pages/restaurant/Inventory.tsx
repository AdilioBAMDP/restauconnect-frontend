import React, { useState, useCallback } from 'react';
import { ArrowLeft, Package, AlertTriangle, TrendingDown, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import AddItemModal from '@/components/modals/AddItemModal';
import EditItemModal from '@/components/modals/EditItemModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import SuccessNotification from '@/components/modals/SuccessNotification';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
  supplier: string;
  lastUpdate: string;
}

const RestaurantInventoryPage: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as any);
  }, [navigateTo]);
  const { userDashboard } = useUserDashboardNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Tomates Bio',
      category: 'Légumes',
      quantity: 25,
      unit: 'kg',
      minStock: 15,
      price: 3.50,
      supplier: 'Ferme Durand',
      lastUpdate: '2024-10-07'
    },
    {
      id: '2',
      name: 'Poulet Fermier',
      category: 'Viandes',
      quantity: 8,
      unit: 'kg',
      minStock: 10,
      price: 12.00,
      supplier: 'Volailles de France',
      lastUpdate: '2024-10-06'
    },
    {
      id: '3',
      name: 'Farine T65',
      category: 'Épicerie',
      quantity: 45,
      unit: 'kg',
      minStock: 20,
      price: 1.20,
      supplier: 'Moulins Tradition',
      lastUpdate: '2024-10-08'
    },
    {
      id: '4',
      name: 'Huile d\'Olive Extra Vierge',
      category: 'Épicerie',
      quantity: 12,
      unit: 'L',
      minStock: 15,
      price: 15.00,
      supplier: 'Provence Huiles',
      lastUpdate: '2024-10-05'
    },
    {
      id: '5',
      name: 'Fromage Comté 18 mois',
      category: 'Produits Laitiers',
      quantity: 6,
      unit: 'kg',
      minStock: 8,
      price: 22.00,
      supplier: 'Fromagerie Alpes',
      lastUpdate: '2024-10-07'
    },
    {
      id: '6',
      name: 'Saumon Frais',
      category: 'Poissons',
      quantity: 3,
      unit: 'kg',
      minStock: 5,
      price: 28.00,
      supplier: 'Marée Atlantique',
      lastUpdate: '2024-10-08'
    }
  ]);

  const categories = ['all', 'Légumes', 'Viandes', 'Poissons', 'Produits Laitiers', 'Épicerie'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.quantity < item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.quantity / item.minStock) * 100;
    if (percentage < 50) return { label: 'Critique', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage < 100) return { label: 'Faible', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleAddItemSubmit = (newItem: Omit<InventoryItem, 'id' | 'lastUpdate'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    setInventory(prev => [...prev, item]);
    setSuccessMessage(`Article "${item.name}" ajouté avec succès`);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleEditItemSubmit = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === updatedItem.id ? { ...updatedItem, lastUpdate: new Date().toISOString().split('T')[0] } : i));
    setSuccessMessage(`Article "${updatedItem.name}" modifié avec succès`);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = () => {
    if (selectedItem) {
      setInventory(prev => prev.filter(i => i.id !== selectedItem.id));
      setSuccessMessage(`Article "${selectedItem.name}" supprimé avec succès`);
      setShowDeleteConfirm(false);
      setSelectedItem(null);
    }
  };

  // ✅ NAVIGATION INTELLIGENTE - Correction audit octobre 2025

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      
      <Header currentPage="inventory" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateToString(userDashboard)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au Dashboard</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Articles</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{inventory.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Stock Faible</span>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{lowStockItems.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Valeur Totale</span>
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{totalValue.toLocaleString()}€</div>
          </motion.div>
        </div>

        {/* Filtres */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-400 self-center flex-shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Inventaire */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Article</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix/Unité</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fournisseur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item, index) => {
                  const status = getStockStatus(item);
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">MAJ: {new Date(item.lastUpdate).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.quantity} {item.unit}</div>
                        <div className="text-sm text-gray-500">Min: {item.minStock} {item.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bg}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.price.toFixed(2)}€</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.supplier}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bouton Commander */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigateToString('supplier-catalog')}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all font-bold text-lg"
          >
            <Package className="w-6 h-6" />
              Commander des Produits
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItemSubmit}
      />

      <EditItemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onEdit={handleEditItemSubmit}
        item={selectedItem}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" de l'inventaire ?`}
        confirmText="Supprimer"
        variant="danger"
      />

      <SuccessNotification
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </div>
  );
};

export default RestaurantInventoryPage;
