import React from 'react';
import Header from '@/components/layout/Header';
import { OrdersManagement } from '@/components/dashboard/supplier/OrdersManagement';

interface SupplierOrdersPageProps {
  navigateTo: (page: string) => void;
}

/**
 * Page dédiée UNIQUEMENT aux commandes fournisseur
 * Avec Informations en temps réel et Marketplace en haut
 */
export default function SupplierOrdersPage({ navigateTo }: SupplierOrdersPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">

      
      
      <Header currentPage="supplier-orders" onNavigate={navigateTo} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📦 Mes Commandes</h1>
          <p className="text-gray-600 mt-2">
            Gérez toutes les commandes de vos clients restaurants
          </p>
        </div>

        {/* Gestion des commandes */}
        <OrdersManagement supplierOrders={[]} />
      </div>
    </div>
  );
}
