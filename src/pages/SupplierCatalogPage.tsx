import React, { useState, useEffect } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuth } from '@/hooks/useAuthContext';
import { apiService } from '@/services/api';
import { MessageCircle, User } from 'lucide-react';
import { logger } from '@/utils/logger';
import Header from '@/components/Header';
import { useNavigation } from '@/hooks/useNavigation';
import type { PageName } from '@/services/NavigationManager';
import SuccessNotification from '@/components/modals/SuccessNotification';
import ErrorNotification from '@/components/modals/ErrorNotification';
import {
  CompleteWelcomeSection,
  CompleteMarketplaceAccordion,
  CompleteInfoGlobaleAccordion,
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

const CompleteDashboard: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { messages, professionals } = useBusinessStore();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ title: string; date: string; time?: string }>>([]);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [infoGlobaleOpen, setInfoGlobaleOpen] = useState(false);

  // États pour le modal de commande TMS intégré
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{id: string, name: string} | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderForm, setOrderForm] = useState({
    items: [{ id: '1', productName: '', quantity: 1, unit: 'kg', unitPrice: 0 }],
    deliveryDate: '',
    deliveryTime: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'express',
    deliveryAddress: '123 Rue du Restaurant, 75001 Paris',
    specialInstructions: '',
    notes: ''
  });

  // Handlers pour Marketplace et InfoGlobale
  const handleLike = (postId: string) => logger.debug(`Like post: ${postId}`);
  const handleComment = () => navigateTo('messages');
  const handleContact = () => navigateTo('messages');
  const handleRespond = () => navigateTo('messages');
  const handleViewDetails = () => navigateTo('search');

  // Wrappers pour la compatibilité des types navigateTo
  const handleNavigateString = (page: string) => {
    navigateTo(page as PageName);
  };

  // Fonction pour ouvrir le modal de commande avec TMS intégré
  const handleOrderFromSupplier = (supplierId: string, supplierName: string) => {
    setSelectedSupplier({ id: supplierId, name: supplierName });
    setShowOrderModal(true);
    const today = new Date();
    setOrderForm(prev => ({
      ...prev,
      deliveryDate: today.toISOString().split('T')[0],
      deliveryTime: '10:00'
    }));
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/restaurant/order-with-tms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccessMessage(`Commande passée chez ${selectedSupplier.name} ! 🚚 TMS automatiquement activé - Demande de livraison créée. 📱 Le livreur sera notifié automatiquement. 📍 Tracking: ${result.trackingId || 'TMS-' + Date.now()}`);
        
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
        setErrorMessage(result.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur de connexion au serveur');
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
      {/* Header de navigation */}
      <Header currentPage="dashboard" onNavigate={handleNavigateString} />
      
      {/* Header principal */}
      <div className="bg-white shadow-lg border-b-2 border-orange-200" style={{ minHeight: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🍽️ Tableau de bord Restaurant
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Bienvenue {currentUser?.name || 'Utilisateur'} - <span className="text-orange-600 font-semibold">Restaurateur</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateTo('messages')}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Mon profil</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                onNavigate={handleNavigateString}
              />

              {/* Modules Marketplace et InfoGlobale */}
              <div className="space-y-4">
                <CompleteMarketplaceAccordion
                  isOpen={marketplaceOpen}
                  onToggle={() => setMarketplaceOpen(!marketplaceOpen)}
                  onLike={handleLike}
                  onComment={handleComment}
                  onRespond={handleRespond}
                  onContact={handleContact}
                  onViewDetails={handleViewDetails}
                />

                <CompleteInfoGlobaleAccordion
                  isOpen={infoGlobaleOpen}
                  onToggle={() => setInfoGlobaleOpen(!infoGlobaleOpen)}
                  onContact={handleContact}
                  onViewDetails={handleViewDetails}
                />
              </div>

              {/* Statistiques principales */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <CompleteStatsCards statsCards={mainStatsCards as any} />

              {/* Modules Professionnels Restaurateur */}
              <CompleteModulesRestaurateur />

              {/* Section Commander chez fournisseurs avec TMS */}
              <CompleteSupplierOrders
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                currentUser={currentUser as any}
                onOrderFromSupplier={(supplierId: string) => handleOrderFromSupplier(supplierId, 'Fournisseur')}
              />

              {/* Section principale avec activités et sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CompleteActivities
                  realActivities={realActivities}
                  onNavigate={handleNavigateString}
                />

                <CompleteSidebar
                  upcomingEvents={upcomingEvents}
                  messagesCount={messages.length}
                  professionalsCount={professionals.length}
                  avgRating={professionals.reduce((acc, p) => acc + p.rating, 0) / professionals.length || 0}
                  activeOffers={realStats.activeOffers}
                  currentUserRole={currentUser?.role}
                  onNavigate={handleNavigateString}
                />
              </div>
            </>
          )}
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

      {/* Notifications */}
      <SuccessNotification 
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        duration={5000}
      />

      <ErrorNotification 
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
      />
    </div>
  );
};

export default CompleteDashboard;
