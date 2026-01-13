import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Briefcase,
  Star,
  Send,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Heart,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';

interface JobOffer {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  category: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Interim';
  workingTime: 'full-time' | 'part-time' | 'flexible';
  experienceLevel: 'junior' | 'middle' | 'senior' | 'expert';
  location: {
    city: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'month' | 'year' | 'hour';
  };
  benefits: string[];
  skills: string[];
  urgent: boolean;
  postedAt: string;
  deadline?: string;
  applicationsCount: number;
  companyLogo?: string;
}

interface JobApplication {
  _id: string;
  jobOfferId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
  appliedAt: string;
  coverLetter: string;
  expectedSalary?: number;
}

interface CandidatEmploiPageProps {
  onNavigate?: (page: string) => void;
}

const CandidatEmploiPage: React.FC<CandidatEmploiPageProps> = () => {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();

  // États pour les données
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [recommendations, setRecommendations] = useState<JobOffer[]>([]);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [urgentOnly, setUrgentOnly] = useState(false);
  
  // États pour la candidature
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState<number>(0);
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState<'search' | 'applications' | 'recommendations'>('search');

  // Chargement des données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Données d'exemple pour les offres d'emploi
      const sampleJobs: JobOffer[] = [
        {
          _id: '1',
          title: 'Chef de Cuisine',
          company: 'Restaurant Le Gourmet',
          description: 'Nous recherchons un chef de cuisine expérimenté pour rejoindre notre équipe dans un restaurant gastronomique.',
          requirements: ['5 ans d\'expérience minimum', 'CAP Cuisine', 'Management d\'équipe'],
          category: 'cuisine',
          contractType: 'CDI',
          workingTime: 'full-time',
          experienceLevel: 'senior',
          location: {
            city: 'Paris',
            address: '15 rue de la Paix, 75001 Paris'
          },
          salary: {
            min: 3500,
            max: 4500,
            currency: 'EUR',
            period: 'month'
          },
          benefits: ['Primes', 'Congés payés', 'Mutuelle'],
          skills: ['Cuisine française', 'Management', 'Créativité'],
          urgent: true,
          postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          applicationsCount: 12
        },
        {
          _id: '2',
          title: 'Serveur/Serveuse',
          company: 'Brasserie Central',
          description: 'Rejoignez notre équipe dynamique en tant que serveur/serveuse dans une brasserie parisienne.',
          requirements: ['Expérience en service', 'Sens du contact', 'Disponibilité'],
          category: 'service',
          contractType: 'CDD',
          workingTime: 'full-time',
          experienceLevel: 'junior',
          location: {
            city: 'Paris',
            address: '25 boulevard Saint-Germain, 75005 Paris'
          },
          salary: {
            min: 1800,
            max: 2200,
            currency: 'EUR',
            period: 'month'
          },
          benefits: ['Tips', 'Repas fournis'],
          skills: ['Service client', 'Rapidité', 'Polyvalence'],
          urgent: false,
          postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          applicationsCount: 8
        },
        {
          _id: '3',
          title: 'Livreur à Vélo',
          company: 'FastFood Express',
          description: 'Livraisons de repas à vélo dans Paris. Horaires flexibles, rémunération attractive.',
          requirements: ['Vélo personnel', 'Permis de conduire non requis'],
          category: 'livraison',
          contractType: 'Freelance',
          workingTime: 'flexible',
          experienceLevel: 'junior',
          location: {
            city: 'Paris',
            address: 'Plusieurs zones de Paris'
          },
          salary: {
            min: 12,
            max: 18,
            currency: 'EUR',
            period: 'hour'
          },
          benefits: ['Horaires flexibles', 'Tips'],
          skills: ['Conduite vélo', 'Orientation', 'Ponctualité'],
          urgent: true,
          postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          applicationsCount: 25
        }
      ];

      setJobOffers(sampleJobs);

      // Données d'exemple pour les candidatures
      const sampleApplications: JobApplication[] = [
        {
          _id: '1',
          jobOfferId: '1',
          jobTitle: 'Commis de Cuisine',
          company: 'Restaurant L\'Étoile',
          status: 'pending',
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          coverLetter: 'Motivé pour rejoindre votre équipe...'
        },
        {
          _id: '2',
          jobOfferId: '2',
          jobTitle: 'Barista',
          company: 'Café Central',
          status: 'reviewed',
          appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          coverLetter: 'Passionné de café...'
        }
      ];

      setMyApplications(sampleApplications);

      // Données d'exemple pour les recommandations
      setRecommendations([sampleJobs[0]]);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrer les offres
  const filteredJobs = jobOffers.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    const matchesContract = contractFilter === 'all' || job.contractType === contractFilter;
    const matchesLocation = !locationFilter || job.location.city.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSalary = minSalaryFilter === 0 || job.salary.min >= minSalaryFilter;
    const matchesUrgent = !urgentOnly || job.urgent;

    return matchesSearch && matchesCategory && matchesContract && matchesLocation && matchesSalary && matchesUrgent;
  });

  // Postuler à une offre
  const handleApply = async () => {
    if (!selectedJob) return;

    try {
      setLoading(true);
      
      // Simuler l'envoi de candidature
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ajouter la candidature à la liste
      const newApplication: JobApplication = {
        _id: Date.now().toString(),
        jobOfferId: selectedJob._id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        coverLetter,
        expectedSalary: expectedSalary > 0 ? expectedSalary : undefined
      };

      setMyApplications(prev => [newApplication, ...prev]);
      
      setShowApplyModal(false);
      setSelectedJob(null);
      setCoverLetter('');
      setExpectedSalary(0);
      
      // Message de succès
      setError('');
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la candidature');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      case 'interviewed': return 'text-purple-600 bg-purple-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && jobOffers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="candidat-emploi" onNavigate={navigateTo} />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des offres d'emploi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="candidat-emploi" onNavigate={navigateTo} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offres disponibles</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobOffers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Candidatures</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myApplications.length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {recommendations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de réponse</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myApplications.length > 0 ? Math.round((myApplications.filter(a => a.status !== 'pending').length / myApplications.length) * 100) : 0}%
                </p>
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
                {filteredJobs.length}
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
            
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recommandations
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-purple-100 text-purple-600">
                {recommendations.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Recherche d'emploi */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Filtres */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="cuisine">Cuisine</option>
                  <option value="service">Service</option>
                  <option value="management">Management</option>
                  <option value="livraison">Livraison</option>
                </select>

                <select
                  value={contractFilter}
                  onChange={(e) => setContractFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous contrats</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>

                <input
                  type="text"
                  placeholder="Ville..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />

                <input
                  type="number"
                  placeholder="Salaire min €"
                  value={minSalaryFilter || ''}
                  onChange={(e) => setMinSalaryFilter(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={urgentOnly}
                    onChange={(e) => setUrgentOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700">
                    Urgent uniquement
                  </label>
                </div>
              </div>
            </div>

            {/* Liste des offres */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">Aucune offre d'emploi trouvée</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
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
                            {job.location.city}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}€
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applicationsCount} candidatures
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowApplyModal(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Postuler
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          Publié il y a {Math.floor((Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24))} jours
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Mes candidatures */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {myApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucune candidature envoyée</p>
              </div>
            ) : (
              myApplications.map((application) => (
                <div key={application._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.jobTitle}
                      </h3>
                      <p className="text-gray-600">{application.company}</p>
                      <p className="text-sm text-gray-500">
                        Candidature envoyée le {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
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

        {/* Recommandations */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucune recommandation disponible</p>
              </div>
            ) : (
              recommendations.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Recommandé pour vous</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location.city}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}€
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {job.description}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowApplyModal(true);
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Postuler maintenant
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal de candidature */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Postuler pour {selectedJob.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lettre de motivation *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire souhaité (€)
                </label>
                <input
                  type="number"
                  value={expectedSalary || ''}
                  onChange={(e) => setExpectedSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Salaire mensuel souhaité"
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setSelectedJob(null);
                  setCoverLetter('');
                  setExpectedSalary(0);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                disabled={!coverLetter.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
              >
                <Send className="h-4 w-4 mr-2 inline" />
                Envoyer ma candidature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatEmploiPage;
