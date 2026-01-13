import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  MapPin,
  Phone,
  User,
  DollarSign,
  Star,
  MessageCircle,
  Camera,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useBusinessStore } from '@/stores/businessStore';

interface MissionsPageProps {
  onNavigate: (page: string) => void;
}

const MissionsPage: React.FC<MissionsPageProps> = () => {
  const { navigateTo } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'urgent'>('all');

  // Utilisation des vraies données du businessStore
  const { applications, offers } = useBusinessStore();
  
  // Transformation des vraies missions basées sur les offres et candidatures
  const missions = useMemo(() => {
    return offers.slice(0, 6).map((offer, index) => ({
      id: offer.id,
      title: offer.title,
      restaurant: `Restaurant ${index + 1}`,
      type: offer.category,
      status: offer.status === 'active' ? 'pending' : offer.status,
      priority: offer.urgent ? 'Urgent' : 'Normal',
      location: offer.location,
      date: new Date().toLocaleDateString('fr-FR'),
      time: '14:00',
      budget: offer.budget || '300€',
      description: offer.description,
      contact: 'Contact Restaurant',
      phone: '01 42 00 00 00',
      rating: null,
      images: ['🔧', '⚡'],
      estimatedDuration: '2-3h'
    }));
  }, [offers]);
  


  const getStatusInfo = (status: string, priority?: string) => {
    if (status === 'urgent' || priority === 'Urgent') {
      return {
        text: 'Urgent',
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle
      };
    }
    
    switch (status) {
      case 'pending':
        return {
          text: 'En attente',
          color: 'text-orange-600 bg-orange-100 border-orange-200',
          icon: Clock
        };
      case 'active':
        return {
          text: 'En cours',
          color: 'text-blue-600 bg-blue-100 border-blue-200',
          icon: Wrench
        };
      case 'completed':
        return {
          text: 'Terminée',
          color: 'text-green-600 bg-green-100 border-green-200',
          icon: CheckCircle
        };
      default:
        return {
          text: 'Inconnu',
          color: 'text-gray-600 bg-gray-100 border-gray-200',
          icon: FileText
        };
    }
  };

  const filteredMissions = missions.filter(mission => {
    if (activeTab === 'all') return true;
    if (activeTab === 'urgent') return mission.status === 'urgent' || mission.priority === 'Urgent';
    return mission.status === activeTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return missions.length;
    if (status === 'urgent') return missions.filter(m => m.status === 'urgent' || m.priority === 'Urgent').length;
    return missions.filter(m => m.status === status).length;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navigation */}
      {/* Header removed - using standalone page */}
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Missions</h1>
              <p className="text-gray-600">Gérez vos interventions et missions</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => navigateTo('artisan-dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                ← Retour Dashboard Artisan
              </button>
              <button
                onClick={() => navigateTo('search')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Nouvelles missions
              </button>
            </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total missions</p>
                <p className="text-2xl font-bold text-gray-900">{missions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-gray-900">{getTabCount('urgent')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{getTabCount('pending')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">{getTabCount('active')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">{getTabCount('completed')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de filtrage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'Toutes', count: getTabCount('all') },
                { key: 'urgent', label: 'Urgentes', count: getTabCount('urgent') },
                { key: 'pending', label: 'En attente', count: getTabCount('pending') },
                { key: 'active', label: 'En cours', count: getTabCount('active') },
                { key: 'completed', label: 'Terminées', count: getTabCount('completed') }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'all' | 'pending' | 'active' | 'completed' | 'urgent')}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Liste des missions */}
        <div className="space-y-6">
          {filteredMissions.map((mission, index) => {
            const statusInfo = getStatusInfo(mission.status, mission.priority);
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-shadow ${
                  mission.priority === 'Urgent' ? 'border-red-200 bg-red-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex space-x-1 text-2xl">
                      {mission.images.map((emoji, idx) => (
                        <span key={idx}>{emoji}</span>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {mission.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {mission.type}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">{mission.restaurant}</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{mission.location}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                      
                      {mission.status === 'completed' && mission.rating && (
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600 mr-2">Évaluation :</span>
                          <div className="flex items-center">
                            {renderStars(mission.rating)}
                            <span className="ml-2 text-sm text-gray-600">({mission.rating}/5)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {statusInfo.text}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(mission.date).toLocaleDateString('fr-FR')} à {mission.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Durée : {mission.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{mission.budget}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{mission.contact}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Mission créée le {new Date(mission.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex space-x-2">
                    {mission.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => toast.success('Appel en cours...')}
                          className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </button>
                        <button
                          onClick={() => navigateTo('messages')}
                          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </button>
                      </>
                    )}
                    {mission.status === 'active' && (
                      <button
                        onClick={() => toast.success('Rapport de mission ouvert')}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Rapport
                      </button>
                    )}
                    <button
                      onClick={() => toast.success('Détails de la mission')}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredMissions.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune mission</h3>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore de missions dans cette catégorie.</p>
            <button
              onClick={() => navigateTo('search')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rechercher des missions
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
