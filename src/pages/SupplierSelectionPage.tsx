import React, { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';
import { apiClient } from '@/services/api';
import { useNavigation } from '@/hooks/useNavigation';

interface Supplier {
  _id: string;
  name: string;
  email: string;
  category?: string;
  rating?: number | string;
  description?: string;
  location?: string;
  deliveryTime?: string;
  minimumOrder?: number;
  specialties?: string[];
  role: string;
  status: string;
}

const SupplierSelectionPage = () => {
  const { navigateTo } = useNavigation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Utiliser apiClient pour récupérer TOUS les fournisseurs actifs
        const response = await apiClient.get('/partners/by-role/fournisseur');

        if (response.data.success) {
          const suppliersList = response.data.data || [];
          console.log('📦 Fournisseurs chargés:', suppliersList.length);
          setSuppliers(suppliersList);
        } else {
          throw new Error(response.data.error || 'Erreur lors du chargement des fournisseurs');
        }
      } catch (err: any) {
        logger.error('Erreur lors du chargement des fournisseurs', err);
        setError(err.response?.data?.error || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSupplierSelect = (supplierId: string) => {
    // Sauvegarder l'ID du fournisseur sélectionné
    localStorage.setItem('selectedSupplierId', supplierId);
    // Naviguer vers la page catalogue (sans recharger la page)
    navigateTo('supplier-catalog', { supplierId });
  };

  const handleBackToDashboard = () => {
    navigateTo('restaurant-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Chargement des fournisseurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={handleBackToDashboard}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retour au Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🏢</span>
                Sélection du Fournisseur
              </h1>
              <p className="text-gray-600 mt-2">
                Choisissez un fournisseur pour accéder à son catalogue professionnel
              </p>
            </div>
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Retour Dashboard
            </button>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div
              key={supplier._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Supplier Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{supplier.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-2">
                      {supplier.category || 'Général'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="ml-1 text-sm font-medium">{supplier.rating || '4.5'}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {supplier.description || 'Fournisseur professionnel de qualité'}
                </p>

                {/* Infos */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    {supplier.location || 'Non spécifié'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">⏰</span>
                    Livraison: {supplier.deliveryTime || '24-48h'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📦</span>
                    Commande min: {supplier.minimumOrder || 50}€
                  </div>
                </div>

                {/* Specialties */}
                {supplier.specialties && supplier.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Spécialités:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                      {supplier.specialties.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          +{supplier.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleSupplierSelect(supplier._id)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <span className="mr-2">📦</span>
                  Accéder au Catalogue
                </button>
              </div>
            </div>
          ))}
        </div>

        {suppliers.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun fournisseur disponible</h3>
            <p className="text-gray-600">
              Il n'y a actuellement aucun fournisseur enregistré dans le système.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierSelectionPage;
