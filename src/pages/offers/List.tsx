import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  Euro, 
  User, 
  Briefcase, 
  Eye,
  Trash2,
  AlertTriangle,
  Check,
  X,
  MessageSquare,
  FileText,
  Star,
  Send,
  Phone,
  Mail
} from 'lucide-react';
import { useBusinessStore, RestaurantOffer } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { PageName } from '@/services/NavigationManager';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import Header from '@/components/layout/Header';
import { PhotoUploader } from '@/components/forms/PhotoUploader';

type TabId = 'my-offers' | 'create' | 'applications' | 'messages' | 'quotes';

const OffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('my-offers');
  const [searchTerm, setSearchTerm] = useState('');
  
  // ✅ NAVIGATION INTELLIGENTE - Correction audit octobre 2025
  const { userDashboard } = useUserDashboardNavigation();
  
  const [messageContent, setMessageContent] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  
  // Stores - Utilisation complète du businessStore
  const { 
    offers, 
    applications, 
    professionals, 
    messages,
    createOffer, 
    deleteOffer, 
    updateApplicationStatus,
    sendMessage,
    markMessageAsRead
  } = useBusinessStore();
  const { user } = useAuthStore();
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);

  // Form data pour créer une nouvelle offre
  const [newOffer, setNewOffer] = useState({
    type: 'personnel' as RestaurantOffer['type'],
    title: '',
    description: '',
    category: '',
    urgent: false,
    budget: '',
    location: '',
    requirements: [''],
    images: [] as string[] // Ajout champ photos
  });

  // Fonctions de gestion des offres
  const handleCreateOffer = () => {
    if (!newOffer.title || !newOffer.description || !newOffer.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    createOffer({
      type: newOffer.type,
      title: newOffer.title,
      description: newOffer.description,
      category: newOffer.category,
      urgent: newOffer.urgent,
      budget: newOffer.budget,
      location: newOffer.location,
      requirements: newOffer.requirements.filter(req => req.trim() !== ''),
      status: 'active',
      restaurantId: 'rest_001', // ID du restaurant courant
      images: newOffer.images, // Ajout des photos
      // Correction pour visibilité dans InformationGlobale/Marketplace
      zone: 'information-globale',
      targetRoles: ['all'],
      authorRole: user?.role || 'candidat',
      authorId: user?.id || '',
      authorName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Utilisateur inconnu'
    });

    toast.success('Offre créée avec succès !');
    setNewOffer({
      type: 'personnel',
      title: '',
      description: '',
      category: '',
      urgent: false,
      budget: '',
      location: '',
      requirements: [''],
      images: [] // Reset photos
    });
    setActiveTab('my-offers');
  };

  const handleDeleteOffer = (offerId: string) => {
    deleteOffer(offerId);
    toast.success('Offre supprimée');
  };

  const handleUpdateApplicationStatus = (applicationId: string, status: 'accepted' | 'rejected') => {
    updateApplicationStatus(applicationId, status);
    toast.success(`Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'}`);
    
    // Auto-envoyer un message de confirmation
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const professional = professionals.find(p => p.id === application.professionalId);
      const offer = offers.find(o => o.id === application.offerId);
      if (professional && offer) {
        sendMessage({
          fromId: 'restaurant-1',
          toId: professional.id,
          fromName: 'Restaurant Le Comptoir',
          toName: professional.name,
          subject: `Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'} - ${offer.title}`,
          content: status === 'accepted' 
            ? `Félicitations ! Votre candidature pour "${offer.title}" a été acceptée. Nous vous contacterons prochainement pour organiser la suite.`
            : `Merci pour votre candidature pour "${offer.title}". Malheureusement, nous avons choisi un autre profil cette fois-ci.`
        });
      }
    }
  };

  // Fonction pour envoyer un message direct
  const handleSendMessage = (professionalId: string, subject: string, content: string) => {
    const professional = professionals.find(p => p.id === professionalId);
    if (professional) {
      sendMessage({
        fromId: 'restaurant-1',
        toId: professionalId,
        fromName: 'Restaurant Le Comptoir',
        toName: professional.name,
        subject,
        content
      });
      toast.success('Message envoyé');
      setShowMessageModal(false);
      setMessageContent('');
    }
  };

  // Get applications with professional details
  const getApplicationsWithDetails = () => {
    return applications.map(app => {
      const professional = professionals.find(p => p.id === app.professionalId);
      const offer = offers.find(o => o.id === app.offerId);
      return { ...app, professional, offer };
    });
  };

  // Get messages related to offers
  const getOfferMessages = () => {
    return messages.filter(msg => msg.relatedOfferId && offers.some(offer => offer.id === msg.relatedOfferId));
  };

  // Get quote requests (service and fourniture applications with proposed prices)
  const getQuoteRequests = () => {
    return applications.filter(app => {
      const offer = offers.find(o => o.id === app.offerId);
      return offer && (offer.type === 'service' || offer.type === 'fourniture') && app.proposedPrice;
    }).map(app => {
      const professional = professionals.find(p => p.id === app.professionalId);
      const offer = offers.find(o => o.id === app.offerId);
      return { ...app, professional, offer };
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'maintenant';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}j`;
  };

  const tabs = [
    { id: 'my-offers' as TabId, label: 'Mes offres', count: offers.length },
    { id: 'create' as TabId, label: 'Créer une offre', count: 0 },
    { id: 'applications' as TabId, label: 'Candidatures', count: applications.filter(a => a.status === 'pending').length },
    { id: 'messages' as TabId, label: 'Messages', count: getOfferMessages().filter(m => !m.read).length },
    { id: 'quotes' as TabId, label: 'Devis', count: getQuoteRequests().filter(q => q.status === 'pending').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      <Header currentPage="offers" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des offres</h1>
            <p className="text-gray-600">Créez et gérez vos offres d'emploi, services et fournitures</p>
          </div>
          <button
            onClick={() => navigateToString('offer-details')}
            className="mt-4 sm:mt-0 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Retour au dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Onglet Mes offres */}
        {activeTab === 'my-offers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mes offres actives</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher dans mes offres..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {offers.filter(offer => 
                offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                        {offer.urgent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          offer.type === 'personnel' ? 'bg-blue-100 text-blue-800' :
                          offer.type === 'service' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {offer.type === 'personnel' ? 'Personnel' : 
                           offer.type === 'service' ? 'Service' : 'Fourniture'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{offer.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {offer.location}
                        </div>
                        {offer.budget && (
                          <div className="flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {offer.budget}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {getTimeAgo(offer.createdAt)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          <User className="w-4 h-4 inline mr-1" />
                          {offer.applicationsCount} candidature{offer.applicationsCount > 1 ? 's' : ''}
                        </span>
                        <span className={`text-sm font-medium ${
                          offer.status === 'active' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {offer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les candidatures"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer l'offre"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {offers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre créée</h3>
                  <p className="text-gray-600 mb-4">Commencez par créer votre première offre</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une offre
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Créer une offre */}
        {activeTab === 'create' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Créer une nouvelle offre</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Type d'offre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'offre *</label>
                  <select
                    value={newOffer.type}
                    onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value as RestaurantOffer['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="personnel">Personnel (emploi)</option>
                    <option value="service">Service (artisan, maintenance)</option>
                    <option value="fourniture">Fourniture (fournisseur)</option>
                  </select>
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'offre *</label>
                  <input
                    type="text"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    placeholder="Ex: Serveur expérimenté recherché"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                  <input
                    type="text"
                    value={newOffer.category}
                    onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                    placeholder="Ex: Service en salle, Plomberie, Alimentation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    rows={4}
                    placeholder="Décrivez en détail ce que vous recherchez..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Localisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={newOffer.location}
                    onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                    placeholder="Ex: Paris 11e"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="text"
                    value={newOffer.budget}
                    onChange={(e) => setNewOffer({ ...newOffer, budget: e.target.value })}
                    placeholder="Ex: 1800-2200€/mois, 300€, Sur devis"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Exigences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exigences</label>
                  {newOffer.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const newRequirements = [...newOffer.requirements];
                          newRequirements[index] = e.target.value;
                          setNewOffer({ ...newOffer, requirements: newRequirements });
                        }}
                        placeholder="Ex: Expérience 2+ ans"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {newOffer.requirements.length > 1 && (
                        <button
                          onClick={() => {
                            const newRequirements = newOffer.requirements.filter((_, i) => i !== index);
                            setNewOffer({ ...newOffer, requirements: newRequirements });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setNewOffer({ ...newOffer, requirements: [...newOffer.requirements, ''] })}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    + Ajouter une exigence
                  </button>
                </div>

                {/* Photos du problème */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📸 Photos du problème (optionnel)
                    <span className="ml-2 text-xs font-normal text-gray-500">- Max 5 photos</span>
                  </label>
                  <PhotoUploader
                    photos={newOffer.images}
                    onChange={(urls) => setNewOffer({ ...newOffer, images: urls })}
                    maxPhotos={5}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ✅ Optionnel : Les photos aident les artisans à faire un meilleur prédiagnostic
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    💡 Astuce : Vous pouvez prendre une photo directement ou choisir depuis votre galerie
                  </p>
                </div>

                {/* Urgent */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newOffer.urgent}
                      onChange={(e) => setNewOffer({ ...newOffer, urgent: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Offre urgente</span>
                  </label>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setActiveTab('my-offers')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateOffer}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Créer l'offre
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Candidatures */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Candidatures reçues</h2>
            
            <div className="space-y-6">
              {getApplicationsWithDetails().map((application) => (
                <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.professional?.name || 'Professionnel'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status === 'pending' ? 'En attente' :
                           application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Offre :</strong> {application.offer?.title}
                      </p>
                      
                      <p className="text-gray-700 mb-3">{application.message}</p>
                      
                      {application.proposedPrice && (
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Prix proposé :</strong> {application.proposedPrice}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{application.professional?.specialty}</span>
                        <span>⭐ {application.professional?.rating}/5</span>
                        <span>{getTimeAgo(application.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Accepter"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Refuser"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProfessional(application.professionalId);
                          setShowMessageModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Envoyer un message"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      {application.professional && (
                        <button
                          onClick={() => setActiveTab('messages')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Voir tous les messages"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature reçue</h3>
                  <p className="text-gray-600 mb-4">Les candidatures pour vos offres apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Messages */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Messages liés aux offres</h2>
              <button
                onClick={() => setShowMessageModal(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Nouveau message
              </button>
            </div>
            
            <div className="space-y-4">
              {getOfferMessages().map((message) => {
                const professional = professionals.find(p => p.id === message.fromId);
                const offer = offers.find(o => o.id === message.relatedOfferId);
                
                return (
                  <div key={message.id} className={`bg-white rounded-lg shadow-sm border p-6 ${!message.read ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}><div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{message.fromName}</h3>
                          <p className="text-sm text-gray-600">{professional?.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{getTimeAgo(message.createdAt)}</p>
                        {!message.read && (
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-1"></span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">{message.subject}</h4>
                      {offer && (
                        <p className="text-sm text-orange-600 mb-2">Concernant: {offer.title}</p>
                      )}
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          setSelectedProfessional(message.fromId);
                          setShowMessageModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Répondre
                      </button>
                      {professional && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Star className="w-4 h-4" />
                          <span>{professional.rating}/5</span>
                          <span>•</span>
                          <span>{professional.location}</span>
                        </div>
                      )}
                      {!message.read && (
                        <button
                          onClick={() => markMessageAsRead(message.id)}
                          className="text-sm text-orange-600 hover:text-orange-700"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {getOfferMessages().length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                  <p className="text-gray-600">Les messages liés à vos offres apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Devis */}
        {activeTab === 'quotes' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Demandes de devis</h2>
            
            <div className="space-y-6">
              {getQuoteRequests().map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.professional?.name || 'Professionnel'}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.professional?.role === 'fournisseur' ? 'Fournisseur' : 'Artisan'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'pending' ? 'En attente' :
                           request.status === 'accepted' ? 'Accepté' : 'Refusé'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Pour:</strong> {request.offer?.title}
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Prix proposé:</span>
                          <span className="text-lg font-bold text-green-600">{request.proposedPrice}</span>
                        </div>
                        <p className="text-gray-700">{request.message}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{request.professional?.specialty}</span>
                        <span>⭐ {request.professional?.rating}/5 ({request.professional?.reviewCount} avis)</span>
                        <span>{getTimeAgo(request.createdAt)}</span>
                      </div>

                      {request.professional?.ecoFriendly && (
                        <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-3">
                          🌱 Éco-responsable
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateApplicationStatus(request.id, 'accepted')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            <Check className="w-4 h-4 inline mr-1" />
                            Accepter devis
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(request.id, 'rejected')}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Refuser
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProfessional(request.professionalId);
                          setShowMessageModal(true);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Discuter
                      </button>
                      {request.professional && (
                        <div className="text-xs text-gray-500 text-center">
                          <Phone className="w-3 h-3 inline mr-1" />
                          Contact: {request.professional.price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {getQuoteRequests().length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande de devis</h3>
                  <p className="text-gray-600">Les demandes de devis pour vos offres de service et fourniture apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal pour envoyer un message */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Envoyer un message</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <input
                    type="text"
                    placeholder="Sujet du message"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    id="messageSubject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                    placeholder="Tapez votre message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageContent('');
                    setSelectedProfessional(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const subject = (document.getElementById('messageSubject') as HTMLInputElement)?.value;
                    if (selectedProfessional && subject && messageContent) {
                      handleSendMessage(selectedProfessional, subject, messageContent);
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
