import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Award, 
  MessageSquare,
  Camera,
  Target,
  Activity,
  Settings,
  Star,
  TrendingUp,
  Search
} from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import { CommunityManagerService } from '@/types/index';
import { useNavigation } from '@/hooks/useNavigation';

interface CommunityManagerServicesProps {
  navigateTo: (page: string) => void;
}

export default function CommunityManagerServices({ navigateTo }: CommunityManagerServicesProps) {
  const { 
    cmServices, 
    createCMService, 
    updateCMService, 
    deleteCMService 
  } = useBusinessStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<CommunityManagerService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtrage des services
  const filteredServices = cmServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social-media': return <MessageSquare className="w-5 h-5" />;
      case 'advertising': return <Target className="w-5 h-5" />;
      case 'photography': return <Camera className="w-5 h-5" />;
      case 'content-creation': return <Activity className="w-5 h-5" />;
      case 'seo': return <TrendingUp className="w-5 h-5" />;
      case 'video': return <Eye className="w-5 h-5" />;
      case 'branding': return <Award className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social-media': return 'bg-blue-100 text-blue-800';
      case 'advertising': return 'bg-green-100 text-green-800';
      case 'photography': return 'bg-purple-100 text-purple-800';
      case 'content-creation': return 'bg-orange-100 text-orange-800';
      case 'seo': return 'bg-indigo-100 text-indigo-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'branding': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateService = (serviceData: Omit<CommunityManagerService, 'id' | 'createdAt' | 'updatedAt'>) => {
    createCMService(serviceData);
    setShowCreateModal(false);
  };

  const handleUpdateService = ({ id, updates }: { id: string; updates: Partial<CommunityManagerService> }) => {
    updateCMService(id, updates);
    setEditingService(null);
  };

  const handleModalSave = (data: Partial<CommunityManagerService> & { id?: string }) => {
    if (data.id) {
      handleUpdateService({ id: data.id, updates: data });
    } else {
      handleCreateService(data as Omit<CommunityManagerService, 'id'>);
    }
  };

  const handleDeleteService = (service: CommunityManagerService) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.name}" ?`)) {
      deleteCMService(service.id);
    }
  };

  const ServiceModal = ({ 
    isOpen, 
    onClose, 
    service, 
    onSave 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    service?: CommunityManagerService | null; 
    onSave: (data: Partial<CommunityManagerService> & { id?: string }) => void; 
  }) => {
    const [formData, setFormData] = useState({
      name: service?.name || '',
      category: service?.category || 'social-media',
      description: service?.description || '',
      price: service?.price || 0,
      priceType: service?.priceType || 'per-month',
      duration: service?.duration || '',
      deliverables: service?.deliverables?.join('\\n') || '',
      features: service?.features?.join('\\n') || '',
      status: service?.status || 'draft'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const serviceData = {
        ...formData,
        deliverables: formData.deliverables.split('\\n').filter(d => d.trim()),
        features: formData.features.split('\\n').filter(f => f.trim()),
        clientsCount: service?.clientsCount || 0,
        successRate: service?.successRate || 100
      };
      
      if (service) {
        onSave({ id: service.id, ...serviceData });
      } else {
        onSave(serviceData);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        
      <Header currentPage="community-manager-services" onNavigate={navigateTo} />

<motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {service ? 'Modifier le Service' : 'Créer un Nouveau Service'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Service *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Gestion Réseaux Sociaux Premium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as CommunityManagerService['category']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="social-media">Réseaux Sociaux</option>
                  <option value="advertising">Publicité</option>
                  <option value="photography">Photographie</option>
                  <option value="content-creation">Création de Contenu</option>
                  <option value="seo">SEO</option>
                  <option value="video">Vidéo</option>
                  <option value="branding">Branding</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez votre service en détail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Prix *
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({...formData, priceType: e.target.value as CommunityManagerService['priceType']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="per-month">Par mois</option>
                  <option value="per-campaign">Par campagne</option>
                  <option value="per-post">Par post</option>
                  <option value="per-hour">Par heure</option>
                  <option value="fixed">Prix fixe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 3 mois minimum"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Livrables (un par ligne)
              </label>
              <textarea
                rows={4}
                value={formData.deliverables}
                onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="20 posts Instagram/Facebook par mois\n8 stories par semaine\n1 campagne publicitaire mensuelle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonctionnalités (une par ligne)
              </label>
              <textarea
                rows={4}
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Stratégie de contenu personnalisée\nCréation graphique professionnelle\nHashtags optimisés"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as CommunityManagerService['status']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {service ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50"><div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => navigateTo('community-manager-dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mb-4"
              >
                ← Retour Dashboard CM
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Mes Services Marketing</h1>
              <p className="text-gray-600">Gérez votre catalogue de services pour les restaurants</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cmServices.length}</p>
                  <p className="text-sm text-gray-600">Services Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cmServices.filter(s => s.status === 'active').length}</p>
                  <p className="text-sm text-gray-600">Services Actifs</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cmServices.reduce((sum, s) => sum + s.clientsCount, 0)}</p>
                  <p className="text-sm text-gray-600">Clients Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {cmServices.length > 0 ? Math.round(cmServices.reduce((sum, s) => sum + s.successRate, 0) / cmServices.length) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Taux de Succès Moyen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="social-media">Réseaux Sociaux</option>
                  <option value="advertising">Publicité</option>
                  <option value="photography">Photographie</option>
                  <option value="content-creation">Création de Contenu</option>
                  <option value="seo">SEO</option>
                  <option value="video">Vidéo</option>
                  <option value="branding">Branding</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Actif</option>
                  <option value="paused">En pause</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
                >
                  {/* Header du service */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(service.category)}`}>
                        {getCategoryIcon(service.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{service.price}€</div>
                    <div className="text-sm text-gray-600">{service.priceType.replace('-', ' ')}</div>
                    {service.duration && (
                      <div className="text-xs text-gray-500 mt-1">{service.duration}</div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                  {/* Statistiques */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {service.clientsCount} clients
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1 text-yellow-500" />
                      {service.successRate}% succès
                    </div>
                  </div>

                  {/* Livrables (aperçu) */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Livrables:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {service.deliverables.slice(0, 3).map((deliverable, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {deliverable}
                        </li>
                      ))}
                      {service.deliverables.length > 3 && (
                        <li className="text-blue-600">+{service.deliverables.length - 3} autres...</li>
                      )}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingService(service)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center text-sm"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Modifier
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Aucun service ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore créé de services.'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer mon premier service
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalSave}
      />
      
      <ServiceModal
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        service={editingService}
        onSave={handleModalSave}
      />
    </div>
  );
}
