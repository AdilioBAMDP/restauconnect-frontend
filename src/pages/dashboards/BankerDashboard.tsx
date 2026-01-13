import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { 
  DollarSign,
  FileText,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';

import { bankerService, LoanOffer, LoanRequest } from '@/services/financialServices';
import Header from '@/components/layout/Header';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';
import BankerMarketplaceSection from './banker/BankerMarketplaceSection';
import BankerInfoSection from './banker/BankerInfoSection';

interface BankerDashboardProps {
  onNavigate?: (view: string) => void;
}

const BankerDashboard: React.FC<BankerDashboardProps> = () => {

  const { navigateTo } = useAppStore();
  const { messages, professionals, marketplacePosts, fetchMarketplacePosts } = useBusinessStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour les données
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedAmount: 0,
    rejectionRate: 0
  });
  
  // États pour les filtres
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modals
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);
  const [evaluationData, setEvaluationData] = useState({
    riskScore: 0,
    status: 'in-review' as 'approved' | 'rejected' | 'in-review',
    evaluationNotes: ''
  });
  
  // États pour nouvelle offre
  const [newOffer, setNewOffer] = useState({
    loanType: 'short-term' as 'short-term' | 'long-term' | 'equipment' | 'real-estate' | 'working-capital',
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    minDuration: 0,
    maxDuration: 0,
    requirements: [] as string[],
    description: '',
    isActive: true
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'offers' | 'requests' | 'analytics' | 'marketplace' | 'info'>('dashboard');

  // Chargement des données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les offres de prêt avec délai
      const offersResponse = await bankerService.getOffers();
      if (offersResponse.success) {
        setOffers(offersResponse.offers);
      }

      // Attendre 200ms avant la prochaine requête
      await new Promise(resolve => setTimeout(resolve, 200));

      // Charger les demandes de prêt
      const requestsResponse = await bankerService.getRequests(
        requestStatusFilter !== 'all' ? requestStatusFilter : undefined
      );
      if (requestsResponse.success) {
        setRequests(requestsResponse.requests);
        
        // Calculer les statistiques avec les nouvelles données
        const totalOffers = offersResponse.offers.length;
        const activeOffers = offersResponse.offers.filter(o => o.isActive).length;
        const totalRequests = requestsResponse.requests.length;
        const pendingRequests = requestsResponse.requests.filter(r => r.status === 'pending').length;
        const approvedRequests = requestsResponse.requests.filter(r => r.status === 'approved');
        const rejectedRequests = requestsResponse.requests.filter(r => r.status === 'rejected');
        
        setStats({
          totalOffers,
          activeOffers,
          totalRequests,
          pendingRequests,
          approvedAmount: approvedRequests.reduce((sum, req) => sum + req.amount, 0),
          rejectionRate: totalRequests > 0 ? (rejectedRequests.length / totalRequests) * 100 : 0
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [requestStatusFilter]); // Seulement dépendre du filtre, pas des données

  useEffect(() => {
    let isActive = true;
    
    const initData = async () => {
      if (!isActive) return;
      await loadData();
      
      // Charger les données marketplace avec délai
      if (isActive) {
        await new Promise(resolve => setTimeout(resolve, 300));
        fetchMarketplacePosts();
      }
    };
    
    initData();
    
    return () => {
      isActive = false;
    };
  }, [loadData, fetchMarketplacePosts]);

  // Créer une nouvelle offre
  const handleCreateOffer = async () => {
    try {
      setLoading(true);
      const response = await bankerService.createOffer(newOffer);
      
      if (response.success) {
        setShowCreateOfferModal(false);
        setNewOffer({
          loanType: 'short-term',
          interestRate: 0,
          minAmount: 0,
          maxAmount: 0,
          minDuration: 0,
          maxDuration: 0,
          requirements: [],
          description: '',
          isActive: true
        });
        await loadData(); // Recharger les données
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  // Évaluer une demande de prêt
  const handleEvaluateRequest = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);
      const response = await bankerService.evaluateRequest(
        selectedRequest._id,
        evaluationData
      );
      
      if (response.success) {
        setShowEvaluateModal(false);
        setSelectedRequest(null);
        setEvaluationData({
          riskScore: 0,
          status: 'in-review',
          evaluationNotes: ''
        });
        await loadData(); // Recharger les données
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'évaluation');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les demandes
  const filteredRequests = requests.filter(request => {
    const matchesStatus = requestStatusFilter === 'all' || request.status === requestStatusFilter;
    const matchesSearch = request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.amount.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'in-review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading && offers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="banker-dashboard" onNavigate={(page) => navigateTo(page as any)} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des données bancaires...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage="banker-dashboard"
        onNavigate={(page) => navigateTo(page as any)}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={messages?.length || 0}
              professionalsCount={professionals?.length || 0}
              avgRating={4.5}
              activeOffers={stats.activeOffers}
              currentUserRole="banquier"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => navigateTo(path as any)}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offres actives</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeOffers}/{stats.totalOffers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Demandes en attente</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pendingRequests}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Montant approuvé</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.approvedAmount.toLocaleString()}€
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de rejet</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.rejectionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vue d'ensemble
            </button>
            
            <button
              onClick={() => setActiveTab('offers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'offers'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes offres
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-green-100 text-green-600">
                {offers.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Demandes de prêt
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-yellow-100 text-yellow-600">
                {stats.pendingRequests}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'marketplace'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Marketplace
            </button>
            
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informations
            </button>
          </nav>
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Offres récentes */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Offres récentes</h2>
                  <button
                    onClick={() => setActiveTab('offers')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Voir tout
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {offers.slice(0, 3).map((offer) => (
                  <div key={offer._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {offer.loanType}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {offer.interestRate}% - {offer.minAmount.toLocaleString()}€ à {offer.maxAmount.toLocaleString()}€
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        offer.isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                      }`}>
                        {offer.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demandes récentes */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Demandes récentes</h2>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Voir tout
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {requests.slice(0, 3).map((request) => (
                  <div key={request._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {request.amount.toLocaleString()}€
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.purpose}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.riskScore && (
                          <p className="text-xs mt-1">
                            Score: <span className={`font-medium ${getRiskColor(request.riskScore)}`}>
                              {request.riskScore}/100
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mes offres */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Mes offres de prêt</h2>
              <button
                onClick={() => setShowCreateOfferModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle offre
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offer.loanType}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      offer.isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {offer.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Taux:</strong> {offer.interestRate}%</p>
                    <p><strong>Montant:</strong> {offer.minAmount.toLocaleString()}€ - {offer.maxAmount.toLocaleString()}€</p>
                    <p><strong>Durée:</strong> {offer.minDuration} - {offer.maxDuration} mois</p>
                  </div>
                  
                  <p className="mt-4 text-gray-700 text-sm line-clamp-2">
                    {offer.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Créé le {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Demandes de prêt */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Demandes de prêt</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="in-review">En cours d'examen</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>

                <button
                  onClick={loadData}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">Aucune demande de prêt trouvée</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.amount.toLocaleString()}€
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          {request.riskScore && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(request.riskScore)}`}>
                              Score: {request.riskScore}/100
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          <strong>Objet:</strong> {request.purpose}
                        </p>
                        
                        <p className="text-sm text-gray-500">
                          Demande créée le {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        
                        {request.evaluationNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Notes d'évaluation:</strong> {request.evaluationNotes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex space-x-2">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowEvaluateModal(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Évaluer
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques des prêts</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total des demandes:</span>
                  <span className="font-medium">{stats.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant approuvé:</span>
                  <span className="font-medium text-green-600">{stats.approvedAmount.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux de rejet:</span>
                  <span className="font-medium text-red-600">{stats.rejectionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par type d'offre</h3>
              <div className="space-y-2">
                {Object.entries(offers.reduce((acc, offer) => {
                  acc[offer.loanType] = (acc[offer.loanType] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-gray-600">{type}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Marketplace */}
        {activeTab === 'marketplace' && (
          <div className="bg-white rounded-lg shadow p-6">
            <BankerMarketplaceSection />
          </div>
        )}
        
        {/* Informations */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow p-6">
            <BankerInfoSection />
          </div>
        )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création d'offre */}
      {showCreateOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Créer une nouvelle offre de prêt
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de prêt
                </label>
                <select
                  value={newOffer.loanType}
                  onChange={(e) => setNewOffer({...newOffer, loanType: e.target.value as 'short-term' | 'long-term' | 'equipment' | 'real-estate' | 'working-capital'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="short-term">Court terme</option>
                  <option value="long-term">Long terme</option>
                  <option value="equipment">Équipement</option>
                  <option value="real-estate">Immobilier</option>
                  <option value="working-capital">Fonds de roulement</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux d'intérêt (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newOffer.interestRate || ''}
                    onChange={(e) => setNewOffer({...newOffer, interestRate: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant minimum (€)
                  </label>
                  <input
                    type="number"
                    value={newOffer.minAmount || ''}
                    onChange={(e) => setNewOffer({...newOffer, minAmount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant maximum (€)
                  </label>
                  <input
                    type="number"
                    value={newOffer.maxAmount || ''}
                    onChange={(e) => setNewOffer({...newOffer, maxAmount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (mois)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={newOffer.minDuration || ''}
                      onChange={(e) => setNewOffer({...newOffer, minDuration: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={newOffer.maxDuration || ''}
                      onChange={(e) => setNewOffer({...newOffer, maxDuration: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Description de l'offre de prêt..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateOfferModal(false);
                  setNewOffer({
                    loanType: 'short-term',
                    interestRate: 0,
                    minAmount: 0,
                    maxAmount: 0,
                    minDuration: 0,
                    maxDuration: 0,
                    requirements: [],
                    description: '',
                    isActive: true
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateOffer}
                disabled={!newOffer.description.trim() || !newOffer.interestRate || !newOffer.minAmount || !newOffer.maxAmount}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300"
              >
                Créer l'offre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'évaluation */}
      {showEvaluateModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Évaluer la demande
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Montant:</strong> {selectedRequest.amount.toLocaleString()}€
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Objet:</strong> {selectedRequest.purpose}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score de risque (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={evaluationData.riskScore || ''}
                  onChange={(e) => setEvaluationData({...evaluationData, riskScore: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Décision
                </label>
                <select
                  value={evaluationData.status}
                  onChange={(e) => setEvaluationData({...evaluationData, status: e.target.value as 'in-review' | 'approved' | 'rejected'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="in-review">En cours d'examen</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes d'évaluation
                </label>
                <textarea
                  value={evaluationData.evaluationNotes}
                  onChange={(e) => setEvaluationData({...evaluationData, evaluationNotes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Commentaires sur l'évaluation..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowEvaluateModal(false);
                  setSelectedRequest(null);
                  setEvaluationData({
                    riskScore: 0,
                    status: 'in-review',
                    evaluationNotes: ''
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleEvaluateRequest}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Confirmer l'évaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankerDashboard;
