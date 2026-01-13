import React, { useState } from 'react';
import { Briefcase, Send, Star, MapPin, DollarSign, Building, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';

interface CandidatEmploiPageProps {
  onNavigate?: (page: string) => void;
}

interface JobOffer {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  contractType: string;
  urgent: boolean;
  applicationsCount: number;
  postedDaysAgo: number;
}

const CandidatEmploiPage: React.FC<CandidatEmploiPageProps> = () => {
  const { navigateTo } = useAppStore();
  const [activeTab, setActiveTab] = useState<'search' | 'applications'>('search');

  // Données d'exemple pour les offres d'emploi
  const jobOffers: JobOffer[] = [
    {
      id: '1',
      title: 'Chef de Cuisine',
      company: 'Restaurant Le Gourmet',
      description: 'Nous recherchons un chef de cuisine expérimenté pour rejoindre notre équipe dans un restaurant gastronomique situé au cœur de Paris.',
      location: 'Paris 1er',
      salary: '3500 - 4500€',
      contractType: 'CDI',
      urgent: true,
      applicationsCount: 12,
      postedDaysAgo: 2
    },
    {
      id: '2',
      title: 'Serveur/Serveuse',
      company: 'Brasserie Central',
      description: 'Rejoignez notre équipe dynamique en tant que serveur/serveuse dans une brasserie parisienne avec une ambiance conviviale.',
      location: 'Paris 5ème',
      salary: '1800 - 2200€',
      contractType: 'CDD',
      urgent: false,
      applicationsCount: 8,
      postedDaysAgo: 5
    },
    {
      id: '3',
      title: 'Livreur à Vélo',
      company: 'FastFood Express',
      description: 'Livraisons de repas à vélo dans Paris. Horaires flexibles, rémunération attractive avec pourboires.',
      location: 'Paris (toutes zones)',
      salary: '12 - 18€/h',
      contractType: 'Freelance',
      urgent: true,
      applicationsCount: 25,
      postedDaysAgo: 1
    },
    {
      id: '4',
      title: 'Commis de Cuisine',
      company: 'Bistrot du Coin',
      description: 'Poste de commis de cuisine dans un bistrot traditionnel. Formation assurée, parfait pour débuter.',
      location: 'Paris 11ème',
      salary: '1600 - 1900€',
      contractType: 'CDI',
      urgent: false,
      applicationsCount: 6,
      postedDaysAgo: 3
    }
  ];

  // Données d'exemple pour les candidatures
  const myApplications = [
    {
      id: '1',
      jobTitle: 'Barista',
      company: 'Café Central',
      status: 'En attente',
      appliedDate: '15 Oct 2025'
    },
    {
      id: '2',
      jobTitle: 'Aide Cuisinier',
      company: 'Restaurant L\'Étoile',
      status: 'Examinée',
      appliedDate: '12 Oct 2025'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Examinée': return 'bg-blue-100 text-blue-800';
      case 'Acceptée': return 'bg-green-100 text-green-800';
      case 'Refusée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
            <Header currentPage="emploi" onNavigate={(page) => navigateTo(page as any)} />

{/* Header unifié avec toutes les fonctionnalités */}
      <Header 
        currentPage="candidat-emploi"
        onNavigate={navigateTo}
        pageTitle="Recherche d'Emploi"
        pageIcon="briefcase"
        showUserInfo={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offres disponibles</p>
                <p className="text-2xl font-semibold text-gray-900">{jobOffers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mes candidatures</p>
                <p className="text-2xl font-semibold text-gray-900">{myApplications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recommandations</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de réponse</p>
                <p className="text-2xl font-semibold text-gray-900">65%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recherche d'emploi
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-600">
                {jobOffers.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes candidatures
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-green-100 text-green-600">
                {myApplications.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Barre de recherche */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Rechercher un emploi, une entreprise..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>Tous les contrats</option>
                  <option>CDI</option>
                  <option>CDD</option>
                  <option>Stage</option>
                  <option>Freelance</option>
                </select>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Rechercher
                </button>
              </div>
            </div>

            {/* Liste des offres */}
            <div className="space-y-4">
              {jobOffers.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        {job.urgent && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                            Urgent
                          </span>
                        )}
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                          {job.contractType}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applicationsCount} candidatures
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{job.description}</p>
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Postuler
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        Il y a {job.postedDaysAgo} jour{job.postedDaysAgo > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mes candidatures */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {myApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucune candidature envoyée pour le moment</p>
                <p className="text-sm text-gray-400 mt-2">Explorez les offres d'emploi pour commencer</p>
              </div>
            ) : (
              myApplications.map((application) => (
                <div key={application.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                      <p className="text-gray-600">{application.company}</p>
                      <p className="text-sm text-gray-500">Candidature envoyée le {application.appliedDate}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatEmploiPage;
