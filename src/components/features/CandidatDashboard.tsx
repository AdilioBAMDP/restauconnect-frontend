import React, { useState } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { MapPin, Clock, DollarSign, Briefcase, Search, Bell, Eye, TrendingUp, Calendar, FileText, Star } from 'lucide-react';
import GlobalInfoSpace from '@/components/common/GlobalInfoSpace';
import MarketplaceCommunity from '@/components/common/MarketplaceCommunity';
import { PartnersDirectory } from '@/components/dashboard/PartnersDirectory';

interface CandidatDashboardProps {
  className?: string;
}

export const CandidatDashboard: React.FC<CandidatDashboardProps> = ({ className = '' }) => {
  const {
    candidatProfile,
    candidatApplications,
    jobOffers,
    savedSearches,
    candidatStats,
    updateJobApplication,
    addSavedSearch
  } = useBusinessStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'recherche' | 'profil'>('overview');
  const [searchFilters, setSearchFilters] = useState({
    position: '',
    location: '',
    contractType: '',
    salaryMin: '',
    salaryMax: ''
  });

  // Données calculées
  const recentOffers = jobOffers.slice(0, 5);

  const handleApplicationStatusUpdate = (appId: string, status: 'pending' | 'viewed' | 'interview' | 'accepted' | 'rejected') => {
    updateJobApplication(appId, { status });
  };

  const handleAddSearch = () => {
    if (searchFilters.position || searchFilters.location) {
      addSavedSearch({
        candidatId: candidatProfile.id,
        name: `${searchFilters.position || 'Recherche'} - ${searchFilters.location || 'Toutes localisations'}`,
        filters: {
          keywords: searchFilters.position,
          location: searchFilters.location ? [searchFilters.location] : [],
          contractType: searchFilters.contractType ? [searchFilters.contractType] : [],
          salaryMin: searchFilters.salaryMin ? parseInt(searchFilters.salaryMin) : undefined,
          salaryMax: searchFilters.salaryMax ? parseInt(searchFilters.salaryMax) : undefined
        },
        alertsEnabled: true,
        lastChecked: new Date().toISOString(),
        newOffersCount: 0,
        createdAt: new Date().toISOString()
      });
      
      // Reset filters
      setSearchFilters({
        position: '',
        location: '',
        contractType: '',
        salaryMin: '',
        salaryMax: ''
      });
      
      alert('✅ Alerte emploi créée ! Vous recevrez une notification pour les nouvelles offres correspondantes.');
    }
  };

  const handleApplyToJob = (offerId: string, position: string, restaurantName: string) => {
    // Créer une nouvelle candidature
    // TODO: Implémenter l'ajout réel dans le store
    
    // Simuler l'ajout de la candidature (en attendant la fonction du store)
    alert(`✅ Candidature envoyée avec succès pour le poste "${position}" chez ${restaurantName} !`);
    
    // Optionnellement, passer à l'onglet candidatures
    setActiveTab('applications');
  };

  const handleSearch = () => {
    // Fonction de recherche réelle avec les filtres
    let filteredOffers = jobOffers;
    
    if (searchFilters.position) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.title.toLowerCase().includes(searchFilters.position.toLowerCase()) ||
        offer.position.toLowerCase().includes(searchFilters.position.toLowerCase())
      );
    }
    
    if (searchFilters.location) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }
    
    if (searchFilters.contractType) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.contractType === searchFilters.contractType
      );
    }
    
    if (searchFilters.salaryMin) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.salary?.min && offer.salary.min >= parseInt(searchFilters.salaryMin)
      );
    }
    
    if (searchFilters.salaryMax) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.salary?.max && offer.salary.max <= parseInt(searchFilters.salaryMax)
      );
    }
    
    alert(`🔍 Recherche effectuée ! ${filteredOffers.length} offres trouvées sur ${jobOffers.length} au total.`);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      viewed: 'bg-blue-100 text-blue-800',
      interview: 'bg-green-100 text-green-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'En attente',
      viewed: 'Vue',
      interview: 'Entretien',
      accepted: 'Acceptée',
      rejected: 'Refusée'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getContractTypeBadge = (contractType: string) => {
    const colors = {
      'CDI': 'bg-green-100 text-green-800',
      'CDD': 'bg-blue-100 text-blue-800',
      'Stage': 'bg-purple-100 text-purple-800',
      'Apprentissage': 'bg-orange-100 text-orange-800',
      'Interim': 'bg-gray-100 text-gray-800',
      'Temps partiel': 'bg-pink-100 text-pink-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[contractType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {contractType}
      </span>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Header avec infos candidat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-blue-600">
                {candidatProfile.personalInfo.firstName[0]}{candidatProfile.personalInfo.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {candidatProfile.personalInfo.firstName} {candidatProfile.personalInfo.lastName}
              </h1>
              <p className="text-gray-600">{candidatProfile.professionalInfo.targetPosition.join(', ')}</p>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {candidatProfile.personalInfo.city}
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {candidatProfile.professionalInfo.yearsExperience} ans d'expérience
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {candidatProfile.professionalInfo.targetSalary.min}€ - {candidatProfile.professionalInfo.targetSalary.max}€
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Profil complété à</div>
            <div className="text-2xl font-bold text-green-600">{candidatProfile.statistics.profileViews}%</div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
          { key: 'applications', label: 'Mes candidatures', icon: FileText },
          { key: 'recherche', label: 'Recherche d\'emploi', icon: Search },
          { key: 'profil', label: 'Mon profil', icon: Eye }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'overview' | 'applications' | 'recherche' | 'profil')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Candidatures totales</p>
                  <p className="text-2xl font-bold text-gray-900">{candidatStats.totalApplications}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{candidatStats.pendingApplications}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entretiens</p>
                  <p className="text-2xl font-bold text-green-600">{candidatStats.interviewsScheduled}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues profil</p>
                  <p className="text-2xl font-bold text-purple-600">{candidatStats.profileViews}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Candidatures récentes et offres recommandées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidatures récentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidatures récentes</h3>
              <div className="space-y-3">
                {candidatApplications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{application.position}</h4>
                      <p className="text-sm text-gray-600">{application.restaurantName}</p>
                      <p className="text-xs text-gray-500">{new Date(application.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Voir toutes les candidatures →
              </button>
            </div>

            {/* Offres recommandées */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Offres recommandées</h3>
              <div className="space-y-3">
                {recentOffers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{offer.title}</h4>
                      <p className="text-sm text-gray-600">{offer.restaurantName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{offer.location}</span>
                        {getContractTypeBadge(offer.contractType)}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {offer.salary.min}€ - {offer.salary.max}€
                      </p>
                      <p className="text-xs text-gray-500">{offer.salary.period === 'monthly' ? '/mois' : '/an'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('recherche')}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Voir toutes les offres →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mes candidatures */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mes candidatures ({candidatApplications.length})</h3>
          
          <div className="space-y-4">
            {candidatApplications.map((application) => (
              <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{application.position}</h4>
                      {getStatusBadge(application.status)}
                      {getContractTypeBadge(application.contractType)}
                    </div>
                    
                    <p className="text-gray-600 font-medium">{application.restaurantName}</p>
                    <p className="text-gray-500 text-sm mb-2">{application.location}</p>
                    
                    {application.salary && (
                      <p className="text-sm text-gray-600 mb-2">💰 {application.salary}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 Candidature: {new Date(application.appliedDate).toLocaleDateString()}</span>
                      {application.interviewDate && (
                        <span>🗓️ Entretien: {new Date(application.interviewDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    {application.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Feedback:</strong> {application.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    <select
                      value={application.status}
                      onChange={(e) => handleApplicationStatusUpdate(application.id, e.target.value as 'pending' | 'viewed' | 'interview' | 'accepted' | 'rejected')}
                      className="text-sm border border-gray-300 rounded px-3 py-1"
                    >
                      <option value="pending">En attente</option>
                      <option value="viewed">Vue</option>
                      <option value="interview">Entretien</option>
                      <option value="accepted">Acceptée</option>
                      <option value="rejected">Refusée</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {candidatApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
              <p className="text-gray-600">Commencez par rechercher des offres d'emploi qui vous intéressent.</p>
              <button
                onClick={() => setActiveTab('recherche')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Rechercher des offres
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recherche d'emploi */}
      {activeTab === 'recherche' && (
        <div className="space-y-6">
          {/* Filtres de recherche */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rechercher des offres</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                placeholder="Poste recherché"
                value={searchFilters.position}
                onChange={(e) => setSearchFilters({ ...searchFilters, position: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Localisation"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={searchFilters.contractType}
                onChange={(e) => setSearchFilters({ ...searchFilters, contractType: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Type de contrat</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Apprentissage">Apprentissage</option>
                <option value="Interim">Intérim</option>
              </select>
              <input
                type="number"
                placeholder="Salaire min"
                value={searchFilters.salaryMin}
                onChange={(e) => setSearchFilters({ ...searchFilters, salaryMin: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Salaire max"
                value={searchFilters.salaryMax}
                onChange={(e) => setSearchFilters({ ...searchFilters, salaryMax: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleSearch}
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </button>
              <button
                onClick={handleAddSearch}
                className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Bell className="w-4 h-4 mr-2" />
                Créer une alerte
              </button>
            </div>
          </div>

          {/* Mes recherches sauvegardées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes recherches sauvegardées ({savedSearches.length})</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSearches.map((search) => (
                <div key={search.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{search.name}</h4>
                    <div className="flex items-center space-x-2">
                      {search.alertsEnabled && <Bell className="w-4 h-4 text-green-600" />}
                      {search.newOffersCount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {search.newOffersCount} nouvelles
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {search.filters.position && (
                      <p>🎯 Poste: {search.filters.position}</p>
                    )}
                    {search.filters.location && search.filters.location.length > 0 && (
                      <p>📍 Localisation: {search.filters.location.join(', ')}</p>
                    )}
                    {search.filters.contractType && search.filters.contractType.length > 0 && (
                      <p>📄 Contrat: {search.filters.contractType.join(', ')}</p>
                    )}
                    {(search.filters.salaryMin || search.filters.salaryMax) && (
                      <p>💰 Salaire: {search.filters.salaryMin || 0}€ - {search.filters.salaryMax || '∞'}€</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
                    <span>Dernière vérification: {new Date(search.lastChecked).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {savedSearches.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune recherche sauvegardée</p>
                <p className="text-sm text-gray-500">Utilisez les filtres ci-dessus pour créer votre première alerte emploi</p>
              </div>
            )}
          </div>

          {/* Offres disponibles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Offres disponibles ({jobOffers.length})</h3>
            
            <div className="space-y-4">
              {jobOffers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{offer.title}</h4>
                        {getContractTypeBadge(offer.contractType)}
                        {offer.urgent && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                            URGENT
                          </span>
                        )}
                        {offer.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 font-medium">{offer.restaurantName}</p>
                      <p className="text-gray-500 text-sm mb-2">{offer.location}</p>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{offer.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>💰 {offer.salary.min}€ - {offer.salary.max}€/{offer.salary.period === 'monthly' ? 'mois' : 'an'}</span>
                        <span>👥 {offer.applicationsCount} candidatures</span>
                        <span>👁️ {offer.viewsCount} vues</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {offer.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-500 mb-2">
                        Publié le {new Date(offer.postedDate).toLocaleDateString()}
                      </p>
                      <button 
                        onClick={() => handleApplyToJob(offer.id, offer.title, offer.restaurantName)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Postuler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mon profil */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mon profil candidat</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Informations personnelles</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <p className="text-gray-900">{candidatProfile.personalInfo.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <p className="text-gray-900">{candidatProfile.personalInfo.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{candidatProfile.personalInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <p className="text-gray-900">{candidatProfile.personalInfo.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <p className="text-gray-900">{candidatProfile.personalInfo.city} ({candidatProfile.personalInfo.postalCode})</p>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Informations professionnelles</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut actuel</label>
                  <p className="text-gray-900 capitalize">{candidatProfile.professionalInfo.currentStatus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expérience</label>
                  <p className="text-gray-900">{candidatProfile.professionalInfo.yearsExperience} ans - Niveau {candidatProfile.professionalInfo.experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postes recherchés</label>
                  <p className="text-gray-900">{candidatProfile.professionalInfo.targetPosition.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire souhaité</label>
                  <p className="text-gray-900">
                    {candidatProfile.professionalInfo.targetSalary.min}€ - {candidatProfile.professionalInfo.targetSalary.max}€
                    {candidatProfile.professionalInfo.targetSalary.negotiable && ' (négociable)'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                  <p className="text-gray-900">
                    {candidatProfile.professionalInfo.availability.immediateStart 
                      ? 'Immédiatement' 
                      : `À partir du ${candidatProfile.professionalInfo.availability.startDate}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Compétences */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Compétences</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compétences techniques</label>
                  <div className="flex flex-wrap gap-2">
                    {candidatProfile.skills.technical.map((skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langues</label>
                  <div className="flex flex-wrap gap-2">
                    {candidatProfile.skills.languages.map((lang) => (
                      <span key={lang.name} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {lang.name} ({lang.level})
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {candidatProfile.skills.certifications.map((cert) => (
                      <span key={cert} className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Préférences */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Préférences</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Types de contrats</label>
                  <p className="text-gray-900">{candidatProfile.preferences.contractTypes.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisations préférées</label>
                  <p className="text-gray-900">{candidatProfile.preferences.locations.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance max</label>
                  <p className="text-gray-900">{candidatProfile.preferences.maxDistance} km</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Types de restaurants</label>
                  <p className="text-gray-900">{candidatProfile.preferences.restaurantTypes.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques du profil */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Statistiques du profil</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{candidatProfile.statistics.profileViews}</p>
                <p className="text-sm text-gray-600">Vues du profil</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{candidatProfile.statistics.applicationsCount}</p>
                <p className="text-sm text-gray-600">Candidatures</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{candidatProfile.statistics.interviewsCount}</p>
                <p className="text-sm text-gray-600">Entretiens</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{candidatProfile.statistics.successRate}%</p>
                <p className="text-sm text-gray-600">Taux de succès</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{candidatProfile.statistics.responseRate}%</p>
                <p className="text-sm text-gray-600">Taux de réponse</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composants communautaires et AI */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-1">
          <GlobalInfoSpace userRole="candidat" />
        </div>
        <div className="lg:col-span-1">
          <MarketplaceCommunity userRole="candidat" />
        </div>
        <div className="lg:col-span-1">
          {/* AI Assistant désactivé */}
        </div>
      </div>

      {/* Répertoire des Partenaires */}
      <div className="mt-8">
        <PartnersDirectory currentUserRole="candidat" showPublishButton={true} />
      </div>
    </div>
  );
};
