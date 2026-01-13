import React, { useState, useEffect, useCallback } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuth } from '@/hooks/useAuthContext';
import { useAppStore } from '@/stores/appStore';
import type { PageName } from '@/services/NavigationManager';
import { apiService } from '@/services/api';
import Header from '@/components/layout/Header';
import { logger } from '@/utils/logger';
import {
  CompleteWelcomeSection,
  CompleteStatsCards,
  CompleteModulesRestaurateur,
  CompleteSupplierOrders,
  CompleteActivities,
  CompleteSidebar,
  CompleteTMSOrderModal,
  useRealStats,
  useMainStatsCards,
  useRealActivities,
  useQuickActions
} from '@/components/dashboard/RestModule';
import { RestaurantOrderTrackingMap } from '@/components/dashboard/restaurant/RestaurantOrderTrackingMap';

const CompleteDashboard: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);
  const { messages, professionals } = useBusinessStore();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ title: string; date: string; time?: string }>>([]);

  // États pour le modal de commande TMS intégré
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{id: string, name: string} | null>(null);
  const [orderForm, setOrderForm] = useState({
    items: [{ id: '1', productName: '', quantity: 1, unit: 'kg', unitPrice: 0 }],
    deliveryDate: '',
    deliveryTime: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'express',
    deliveryAddress: '123 Rue du Restaurant, 75001 Paris',
    specialInstructions: '',
    notes: ''
  });

  // ✅ CORRECTION : Redirection vers le CATALOGUE du fournisseur sélectionné
  const handleOrderFromSupplier = (supplierId: string, supplierName: string) => {
    console.log(`📦 Redirection vers catalogue fournisseur: ${supplierName} (${supplierId})`);
    // Sauvegarder l'ID du fournisseur pour que SupplierCatalogView puisse l'utiliser
    localStorage.setItem('selectedSupplierId', supplierId);
    // Rediriger vers le catalogue avec photos, produits, panier, etc.
    navigateToString('supplier-catalog');
  };

  // Fonction pour soumettre la commande avec TMS automatique
  const handleSubmitOrder = async () => {
    if (!selectedSupplier) return;
    
    const orderData = {
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      items: orderForm.items.filter(item => item.productName && item.quantity > 0),
      deliveryAddress: orderForm.deliveryAddress,
      deliveryDate: orderForm.deliveryDate,
      deliveryTime: orderForm.deliveryTime,
      urgency: orderForm.urgency,
      specialInstructions: orderForm.specialInstructions,
      notes: orderForm.notes,
      totalAmount: orderForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      autoTMS: true,
      restaurantId: currentUser?.id || 'rest-001'
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/restaurant/order-with-tms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Commande passée chez ${selectedSupplier.name} ! 
🚚 TMS automatiquement activé - Demande de livraison créée
📱 Le livreur sera notifié automatiquement
📍 Tracking: ${result.trackingId || 'TMS-' + Date.now()}`);
        
        setShowOrderModal(false);
        setSelectedSupplier(null);
        setOrderForm({
          items: [{ id: '1', productName: '', quantity: 1, unit: 'kg', unitPrice: 0 }],
          deliveryDate: '',
          deliveryTime: '',
          urgency: 'normal',
          deliveryAddress: '123 Rue du Restaurant, 75001 Paris',
          specialInstructions: '',
          notes: ''
        });
      } else {
        alert(`❌ Erreur lors de la commande: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de connexion au serveur');
    }
  };

  const addOrderItem = () => {
    setOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), productName: '', quantity: 1, unit: 'kg', unitPrice: 0 }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  type OrderItemField = 'productName' | 'quantity' | 'unitPrice';
  type OrderItemFieldValue = string | number;

  const updateOrderItem = (index: number, field: OrderItemField, value: OrderItemFieldValue) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  useEffect(() => {
    let isMounted = true;
    let isLoading = false;

    const loadDashboardData = async () => {
      if (isLoading) return;
      isLoading = true;

      setLoading(true);
      try {
        const results = await Promise.allSettled([
          apiService.dashboard.getStats(),
          apiService.dashboard.getActivity(),
          apiService.calendar.getEvents()
        ]);

        if (!isMounted) return;

        if (results[2].status === 'fulfilled') {
          setUpcomingEvents(results[2].value as Array<{ title: string; date: string; time?: string }>);
        }
        
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const apiNames = ['getStats', 'getActivity', 'getEvents'];
            logger.warn(`API ${apiNames[index]} non disponible:`, result.reason?.message);
          }
        });
        
      } catch (error) {
        if (isMounted) {
          logger.error('Erreur lors du chargement des données', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        isLoading = false;
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Utiliser les helpers pour les statistiques et données
  const realStats = useRealStats();

  const mainStatsCards = useMainStatsCards();

  const realActivities = useRealActivities();

  const quickActions = useQuickActions();

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Header currentPage="dashboard" onNavigate={navigateToString} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={upcomingEvents}
              messagesCount={messages.length}
              professionalsCount={professionals.length}
              avgRating={professionals.reduce((acc, p) => acc + p.rating, 0) / professionals.length || 0}
              activeOffers={realStats.activeOffers}
              currentUserRole={currentUser?.role}
              partners={useBusinessStore.getState().partners}
              onNavigate={navigateToString}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement des données...</span>
            </div>
          ) : (
            <>
              {/* Section d'accueil avec actions rapides */}
              <CompleteWelcomeSection
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                currentUser={currentUser as any}
                quickActions={quickActions}
                onNavigate={navigateToString}
              />

              {/* Statistiques principales - Cliquables pour navigation */}
              <CompleteStatsCards 
                statsCards={mainStatsCards} 
                onNavigate={navigateToString}
              />

              {/* Modules Professionnels Restaurateur */}
              <CompleteModulesRestaurateur />

              {/* 🗺️ NOUVEAU : Suivi des Livraisons en Temps Réel */}
              <RestaurantOrderTrackingMap />

              {/* Section Commander chez fournisseurs avec TMS */}
              <CompleteSupplierOrders
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                currentUser={currentUser as any}
                onOrderFromSupplier={(supplierId: string) => handleOrderFromSupplier(supplierId, 'Fournisseur')}
              />

              {/* Section principale avec activités */}
              <div className="w-full">
                <CompleteActivities
                  realActivities={realActivities}
                  onNavigate={navigateToString}
                />
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>

      {/* Modal de commande avec TMS intégré */}
      <CompleteTMSOrderModal
        isOpen={showOrderModal}
        selectedSupplier={selectedSupplier}
        orderForm={orderForm}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handleSubmitOrder}
        onUpdateForm={(field: string, value: unknown) => {
          setOrderForm(prev => ({ ...prev, [field]: value }));
        }}
        onAddItem={addOrderItem}
        onRemoveItem={removeOrderItem}
        onUpdateItem={(index: number, field: string, value: unknown) => {
          updateOrderItem(index, field as OrderItemField, value as OrderItemFieldValue);
        }}
      />
    </div>
  );
};

export default CompleteDashboard;
