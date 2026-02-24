import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, Clock, Building, TrendingUp, Users, MapPin, Briefcase, MessageCircle, Search, FileText, Calendar, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/appStore';
import type { PageName } from '@/services/NavigationManager';
import Header from '@/components/layout/Header';
import GlobalInfoSpace from '@/components/common/GlobalInfoSpace';
import MarketplaceCommunity from '@/components/common/MarketplaceCommunity';
import { PartnersDirectory } from '@/components/dashboard/PartnersDirectory';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';
import axios from 'axios';

interface Application {
  id: number;
  position: string;
  company: string;
  location: string;
  status: string;
  appliedAt: string;
  salary: string;
}

interface SavedOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  savedAt: string;
}

interface CandidatStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

const CandidatDashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigateTo } = useAppStore();
  
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [savedOffers, setSavedOffers] = useState<SavedOffer[]>([]);
  const [stats, setStats] = useState<CandidatStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || localStorage.getItem('authToken');
        
        if (!token) {
          console.warn('Pas de token trouvé');
          if (isMounted) setLoading(false);
          return;
        }

        // Charger les candidatures du candidat
        const applicationsResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/candidat/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (applicationsResponse.data.success && isMounted) {
          const apiApplications = applicationsResponse.data.applications || [];
          const apiStats = applicationsResponse.data.stats || {};
          
          // Transformer les données API pour le format du dashboard
          const transformedApplications = apiApplications.map((app: any) => ({
            id: app._id,
            position: app.jobOfferId?.title || 'Position inconnue',
            company: app.jobOfferId?.companyId?.name || 'Entreprise inconnue',
            location: app.jobOfferId?.location?.city || 'Localisation inconnue',
            status: app.status,
            appliedAt: new Date(app.createdAt).toISOString().split('T')[0],
            salary: app.expectedSalary?.amount ? `${app.expectedSalary.amount}€` : 'Non spécifié'
          }));

          setApplications(transformedApplications);
          
          setStats({
            totalApplications: apiStats.total || 0,
            pendingApplications: apiStats.pending || 0,
            acceptedApplications: apiStats.accepted || 0,
            rejectedApplications: apiStats.rejected || 0
          });
        }
      } catch (error: any) {
        console.error('Erreur chargement données:', error);
        // Si erreur, afficher message mais ne pas bloquer l'interface
        if (isMounted) {
          setStats({
            totalApplications: 0,
            pendingApplications: 0,
            acceptedApplications: 0,
            rejectedApplications: 0
          });
          setApplications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Refusée';
      default: return 'Inconnu';
    }
  };

  // Actions rapides pour candidat
  const quickActions = [
    {
      icon: Search,
      label: 'Rechercher Offres',
      description: 'Trouver des opportunités',
      color: 'blue',
      onClick: () => navigateToString('offers')
    },
    {
      icon: FileText,
      label: 'Mes Candidatures',
      description: 'Suivre mes postulations',
      color: 'green',
      onClick: () => navigateToString('offers')
    },
    {
      icon: Calendar,
      label: 'Entretiens',
      description: 'Gérer mon calendrier',
      color: 'purple',
      onClick: () => navigateToString('calendar')
    },
    {
      icon: Bell,
      label: 'Alertes Emploi',
      description: 'Nouvelles offres',
      color: 'orange',
      onClick: () => navigateToString('messages')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="dashboard" onNavigate={navigateToString} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={0}
              avgRating={4.5}
              activeOffers={applications.length}
              currentUserRole="candidat"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateToString(path)}
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-6 md:mb-0">
                    <h1 className="text-3xl font-bold mb-2">
                      Bienvenue {user?.name} 👋
                    </h1>
                    <p className="text-blue-100">
                      Gérez vos candidatures et trouvez votre prochain emploi
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                      >
                        <action.icon className="h-5 w-5" />
                        <span className="font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modules Marketplace et InfoGlobale */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlobalInfoSpace userRole="candidat" />
                <MarketplaceCommunity userRole="candidat" />
              </div>

              {/* Statistiques principales - Cliquables */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div 
                  onClick={() => navigateToString('offers')}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCheck className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Candidatures</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">En Attente</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.pendingApplications}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Acceptées</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.acceptedApplications}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Taux de Succès</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats.totalApplications > 0 ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100) : 0}%
                      </p>
                    </div>
                  </div>
              </div>
            </div>

              {/* Section principale avec candidatures et sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mes Candidatures - Prend 2 colonnes */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Mes Candidatures
                    </h3>
                  </div>
                  <div className="p-6">
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((application: Application) => (
                          <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900">{application.position}</h4>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <Building className="h-4 w-4 mr-1" />
                                  {application.company}
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {application.location}
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                  Candidature envoyée le {new Date(application.appliedAt).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="mt-1 text-sm font-medium text-green-600">
                                  Salaire: {application.salary}
                                </div>
                              </div>
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                                {getStatusLabel(application.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Aucune candidature pour le moment</p>
                        <button 
                          onClick={() => navigateToString('offers')}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Rechercher des offres
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar - Style identique au dashboard restaurant */}
                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Bell className="text-orange-500 w-5 h-5" />
                        Notifications
                      </h3>
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                        {stats.pendingApplications}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {stats.pendingApplications > 0 ? (
                        <button
                          onClick={() => navigateToString('offers')}
                          className="w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="text-orange-600 w-4 h-4" />
                              <span className="text-sm font-medium">{stats.pendingApplications} candidature(s) en attente</span>
                            </div>
                            <Users className="text-orange-600 w-4 h-4" />
                          </div>
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Aucune notification</p>
                      )}
                    </div>
                  </div>

                  {/* Événements à Venir */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                      <Calendar className="text-blue-500 w-5 h-5" />
                      Événements à Venir
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 text-center py-4">Aucun événement</p>
                    </div>
                  </div>

                  {/* Statistiques Rapides */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold mb-4">Statistiques Rapides</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Candidatures Envoyées</span>
                        <span className="font-semibold text-gray-900">{stats.totalApplications}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Taux de Réussite</span>
                        <span className="font-semibold text-green-600">
                          {stats.totalApplications > 0 ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">En Attente</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingApplications}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatDashboard;
