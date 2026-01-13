// Fonction utilitaire pour afficher le temps écoulé
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'maintenant';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}j`;
  };
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Gauge,
  ClipboardList,
  Package,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  MessageSquare,
  UserCheck
} from 'lucide-react';

// Import des nouveaux composants refactorisés
import ArtisanHeader from '@/components/artisan/ArtisanHeader';
import ArtisanTabNavigation from '@/components/artisan/ArtisanTabNavigation';
import ArtisanMainDashboard from '@/components/artisan/dashboard/ArtisanMainDashboard';
import CommandManagement from '@/components/artisan/CommandManagement';
import CommandDetailsModal from '@/components/artisan/CommandDetailsModal';
import { CompleteSidebar } from '@/components/dashboard/RestModule';

// Import des composants existants (temporaire)
import Header from '@/components/layout/Header';
import BanquesTab from '@/components/features/BanquesTab';
import CreateBoostCampaign from '@/pages/marketing/CreateBoostCampaign';
import { 
  ArtisanInterventionRequests,
  ArtisanMyInterventions,
  ArtisanMessages,
  ArtisanQuotes,
  ArtisanProfile,
  MessageModal
} from '@/components/dashboard/artisan';

// Import des services
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { useAuth } from '@/hooks/useAuthContext';
import { RealBusinessDataService } from '@/services/RealBusinessDataService';
import { Command } from '@/types/artisan';

type ArtisanTabId = 'dashboard' | 'commandes' | 'intervention-requests' | 'my-interventions' | 'quotes' | 'banques' | 'profile' | 'boost-campaigns' | 'revenus';

interface ArtisanDashboardRefactoredProps {
  onNavigate?: (view: string) => void;
}

const ArtisanDashboardRefactored: React.FC<ArtisanDashboardRefactoredProps> = () => {
  // ✅ TOUS LES HOOKS SONT DÉCLARÉS AU DÉBUT - RÈGLE REACT HOOKS RESPECTÉE
  const { user } = useAuth();
  const { navigateTo } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<ArtisanTabId>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [showNewCommandModal, setShowNewCommandModal] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [showCommandDetailsModal, setShowCommandDetailsModal] = useState(false);
  
  // Stores avec données réelles
  const { 
    offers, 
    applications, 
    messages,
    applyToOffer,
    sendMessage,
    markMessageAsRead
  } = useBusinessStore();

  // Données temps réel avec état initial
  const [realTimeData, setRealTimeData] = useState({
    commands: RealBusinessDataService.getRealCommands(),
    inventory: RealBusinessDataService.getRealInventory(),
    analytics: RealBusinessDataService.getRealAnalytics()
  });

  // Stats en temps réel avec calculs sécurisés
  const [liveStats, setLiveStats] = useState({
    totalApplications: applications.length,
    acceptedMissions: applications.filter(app => app.status === 'accepted').length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    unreadMessages: messages.filter(msg => !msg.read && msg.toId === (user?.id || 'artisan-001')).length,
    monthlyRevenue: RealBusinessDataService.calculateMonthlyRevenue(RealBusinessDataService.getRealCommands()),
    dailyRevenue: RealBusinessDataService.calculateDailyRevenue(RealBusinessDataService.getRealCommands()),
    urgentCommands: RealBusinessDataService.getUrgentCommands(RealBusinessDataService.getRealCommands()).length,
    stockAlerts: RealBusinessDataService.getRealInventory().filter(item => item.alertes.length > 0).length,
    rating: 4.8,
    reviewCount: 127
  });

  // ✅ useEffect APRÈS tous les autres hooks mais AVANT les conditions
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCommands = RealBusinessDataService.getRealCommands();
      setLiveStats({
        totalApplications: applications.length,
        acceptedMissions: applications.filter(app => app.status === 'accepted').length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        unreadMessages: messages.filter(msg => !msg.read && msg.toId === (user?.id || 'artisan-001')).length,
        monthlyRevenue: RealBusinessDataService.calculateMonthlyRevenue(currentCommands),
        dailyRevenue: RealBusinessDataService.calculateDailyRevenue(currentCommands),
        urgentCommands: RealBusinessDataService.getUrgentCommands(currentCommands).length,
        stockAlerts: RealBusinessDataService.getRealInventory().filter(item => item.alertes.length > 0).length,
        rating: 4.8,
        reviewCount: 127
      });
      
      setRealTimeData({
        commands: currentCommands,
        inventory: RealBusinessDataService.getRealInventory(),
        analytics: RealBusinessDataService.getRealAnalytics()
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [applications, messages, user]);

  // ✅ MAINTENANT on peut faire la vérification d'accès (APRÈS tous les hooks)
  if (!user || user.role !== 'artisan') {
    console.log('🔍 DEBUG ArtisanDashboard - Access check:', {
      hasUser: !!user,
      userRole: user?.role,
      userEmail: user?.email,
      userName: user?.name,
      isUndefined: user === undefined,
      isNull: user === null
    });
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Accès restreint
            </h3>
            <p className="text-gray-500">
              Cette section est réservée aux artisans.
            </p>
            <div className="mt-4 text-xs text-gray-400 text-left">
              <p>DEBUG INFO:</p>
              <p>User: {user ? 'EXISTS' : 'NULL/UNDEFINED'}</p>
              <p>Role: '{user?.role || 'NO_ROLE'}'</p>
              <p>Email: '{user?.email || 'NO_EMAIL'}'</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Artisan actuel avec données par défaut sécurisées
  const currentArtisan = {
    id: user?.id || 'artisan-001',
    name: user?.name || 'Marc Dubois',
    specialty: 'Plombier spécialisé restaurants',
    location: 'Paris 11e',
    price: '250€',
    rating: 4.8,
    reviewCount: 127,
    availability: 'Disponible',
    badges: ['Urgence 2h', 'Pro vérifié', 'Spécialiste resto']
  };

  // Configuration des onglets avec compteurs dynamiques
  const tabs = [
      { id: 'dashboard' as ArtisanTabId, label: 'Tableau de bord', icon: Gauge, count: 0, color: 'blue' },
      { id: 'commandes' as ArtisanTabId, label: 'Gestion Commandes', icon: ClipboardList, count: liveStats.urgentCommands, color: 'green' },
      { id: 'inventory' as ArtisanTabId, label: 'Stock', icon: Package, count: 0, color: 'amber' },
      { id: 'intervention-requests' as ArtisanTabId, label: 'Demandes reçues', icon: Package, count: 0, color: 'orange' },
      { id: 'my-interventions' as ArtisanTabId, label: 'Mes interventions', icon: Calendar, count: 0, color: 'purple' },
      { id: 'quotes' as ArtisanTabId, label: 'Devis & Missions', icon: FileText, count: 0, color: 'red' },
      { id: 'banques' as ArtisanTabId, label: 'Banques', icon: DollarSign, count: 0, color: 'emerald' },
      { id: 'profile' as ArtisanTabId, label: 'Mon Profil', icon: UserCheck, count: 0, color: 'gray' },
      { id: 'boost-campaigns' as ArtisanTabId, label: '💰 Mes Campagnes', icon: BarChart3, count: 0, color: 'indigo' }
    ];

  // Fonctions métier pour les interactions
  const handleApplyToOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      const message = `Bonjour, je peux intervenir rapidement pour votre intervention. Plombier spécialisé restaurants avec 15 ans d'expérience.`;
      applyToOffer(offerId, currentArtisan.id, message, '250€');
      toast.success('Candidature envoyée !');
    }
  };

  const handleSendMessage = (restaurantId: string, subject: string, content: string) => {
    sendMessage({
      fromId: currentArtisan.id,
      toId: restaurantId,
      fromName: currentArtisan.name,
      toName: 'Restaurant Le Comptoir',
      subject,
      content
    });
    toast.success('Message envoyé');
    setShowMessageModal(false);
  };

  // Handlers pour les commandes
  const handleSelectCommand = (command: Command) => {
    setSelectedCommand(command);
    setShowCommandDetailsModal(true);
  };

  const handleModifyCommand = (command: Command) => {
    toast(`Modification de la commande ${command.numero}`);
    // TODO: Ouvrir modal de modification
    setShowCommandDetailsModal(false);
  };

  const handleValidateCommand = (command: Command) => {
    toast.success(`Commande ${command.numero} validée !`);
    // TODO: Mettre à jour le statut dans le backend
    setShowCommandDetailsModal(false);
  };

  const handlePrintCommand = (command: Command) => {
    toast.success(`Impression de la commande ${command.numero}`);
    // TODO: Générer PDF et imprimer
    window.print();
  };

  // Filtrage des demandes d'intervention
  const getInterventionRequests = () => {
    if (!offers || !Array.isArray(offers)) return [];
    
    return offers.filter(offer => {
      if (offer.type !== 'service') return false;
      
      let matchesSearch = true;
      if (searchTerm) {
        matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      let matchesLocation = true;
      if (locationFilter) {
        matchesLocation = offer.restaurantId.toLowerCase().includes(locationFilter.toLowerCase());
      }
      
      let matchesUrgent = true;
      if (urgentOnly) {
        matchesUrgent = offer.urgent || false;
      }
      
      return matchesSearch && matchesLocation && matchesUrgent;
    });
  };

  // Interventions programmées pour l'artisan
  // Utilise les applications acceptées pour simuler des interventions
  const getScheduledInterventions = () => {
    return applications
      .filter(app => app.status === 'accepted')
      .map(app => ({
        id: app.id,
        offer: offers.find(o => o.id === app.offerId),
  status: 'scheduled' as const,
        scheduledDate: new Date(),
        proposedPrice: app.proposedPrice || '250€'
      }));
  };

  // Messages de l'artisan
  const getMyMessages = () => {
    if (!messages || !Array.isArray(messages)) return [];
    
    return messages.filter(msg => 
      msg.toId === currentArtisan.id || msg.fromId === currentArtisan.id
    );
  };

  // Rendu du contenu selon l'onglet actif
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ArtisanMainDashboard
            liveStats={liveStats}
            notifications={[]}
            mockBusinessAnalytics={realTimeData.analytics}
            onSetActiveTab={(tab) => setActiveTab(tab as ArtisanTabId)}
            onShowNewCommandModal={() => setShowNewCommandModal(true)}
          />
        );
      case 'inventory':
          // Affiche le composant dynamique qui charge l'inventaire depuis l'API
          return <ArtisanInventory />;

      case 'commandes':
        return (
          <CommandManagement
            commands={realTimeData.commands}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onShowNewCommandModal={() => setShowNewCommandModal(true)}
            onSelectCommand={handleSelectCommand}
            onModifyCommand={handleModifyCommand}
            onValidateCommand={handleValidateCommand}
            onPrintCommand={handlePrintCommand}
          />
        );

      case 'intervention-requests':
        return (
          <ArtisanInterventionRequests
            offers={getInterventionRequests()}
            searchTerm={searchTerm}
            locationFilter={locationFilter}
            urgentOnly={urgentOnly}
            onSearchChange={setSearchTerm}
            onLocationChange={setLocationFilter}
            onUrgentChange={setUrgentOnly}
            onApplyToOffer={handleApplyToOffer}
            onShowMessageModal={() => setShowMessageModal(true)}
            onSetSelectedRestaurant={setSelectedRestaurant}
            getTimeAgo={getTimeAgo}
          />
        );

      case 'my-interventions':
        return (
          <ArtisanMyInterventions
            interventions={getScheduledInterventions()}
            onShowMessageModal={() => setShowMessageModal(true)}
            onSetSelectedRestaurant={setSelectedRestaurant}
            onNavigateToRequests={() => setActiveTab('intervention-requests')}
          />
        );

      case 'quotes':
        return (
          <ArtisanQuotes />
        );

      case 'banques':
        return <BanquesTab />;

      case 'profile':
        return (
          <ArtisanProfile
            currentArtisan={currentArtisan}
            stats={liveStats}
          />
        );

      case 'boost-campaigns':
  return <CreateBoostCampaign />;

      case 'revenus':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenus mensuels</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {liveStats.monthlyRevenue.toLocaleString()}€
            </div>
            <p className="text-gray-500">Basé sur les commandes acceptées</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">CA Aujourd'hui</h4>
                <p className="text-xl font-bold text-gray-900">{liveStats.dailyRevenue.toLocaleString()}€</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Interventions</h4>
                <p className="text-xl font-bold text-gray-900">{realTimeData.commands.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Urgences</h4>
                <p className="text-xl font-bold text-red-600">{liveStats.urgentCommands}</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contenu en développement</h3>
            <p className="text-gray-600">Cette section sera bientôt disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="dashboard" onNavigate={(page) => navigateTo(page as any)} />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={liveStats.unreadMessages}
              professionalsCount={0}
              avgRating={liveStats.rating}
              activeOffers={offers.length}
              currentUserRole="artisan"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateTo(path as any)}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
        {/* Header artisan avec informations dynamiques */}
        <ArtisanHeader artisan={currentArtisan} />

        {/* Navigation des onglets */}
        <ArtisanTabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as ArtisanTabId)} 
        />

        {/* Contenu principal selon l'onglet actif */}
        <div className="bg-white rounded-b-lg p-6">
          {renderActiveTab()}
        </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détails de commande */}
      <AnimatePresence>
          {showCommandDetailsModal && selectedCommand && (
            <CommandDetailsModal
              command={selectedCommand}
              onClose={() => setShowCommandDetailsModal(false)}
              onModify={handleModifyCommand}
              onValidate={handleValidateCommand}
              onPrint={handlePrintCommand}
            />
          )}
      </AnimatePresence>

      {/* Modal pour nouvelle commande */}
      <AnimatePresence>
          {showNewCommandModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Commande Professionnelle</h3>
                <p className="text-gray-600 mb-4">Formulaire de création de commande avec conformité française</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNewCommandModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => {
                      setShowNewCommandModal(false);
                      toast.success('Commande créée avec succès !');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer la commande
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Modal pour messages */}
      {showMessageModal && (
          <MessageModal
            show={showMessageModal}
            messageContent={searchTerm}
            onMessageChange={setSearchTerm}
            onSend={(subject, content) => {
              if (selectedRestaurant) {
                handleSendMessage(selectedRestaurant, subject, content);
              }
            }}
            onClose={() => {
              setShowMessageModal(false);
              setSearchTerm('');
              setSelectedRestaurant(null);
            }}
          />
      )}
    </div>
  );
};

export default ArtisanDashboardRefactored;