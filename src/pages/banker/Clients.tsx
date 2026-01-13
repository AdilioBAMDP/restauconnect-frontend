import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Award,
  Loader2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useNavigation } from '@/hooks/useNavigation';
import { bankerService, BankerClient } from '@/services/financialServices';

const BankerClientsPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [clients, setClients] = useState<BankerClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les clients depuis l'API
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await bankerService.getClients();
        if (response.success) {
          setClients(response.clients);
        } else {
          setError('Erreur lors du chargement des clients');
        }
      } catch (err) {
        console.error('Error loading clients:', err);
        setError('Impossible de charger les clients');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Statistiques
  const totalClients = clients.length;
  const avgCreditScore = Math.round(clients.reduce((sum, c) => sum + c.creditScore, 0) / clients.length);
  const lowRiskClients = clients.filter(c => c.riskLevel === 'low').length;
  const highRiskClients = clients.filter(c => c.riskLevel === 'high').length;

  // Filtrage
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;
    return matchesSearch && matchesType && matchesRisk;
  });

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return risk;
    }
  };

  const getPaymentHistoryColor = (history: string) => {
    switch (history) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentHistoryLabel = (history: string) => {
    switch (history) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bon';
      case 'average': return 'Moyen';
      case 'poor': return 'Mauvais';
      default: return history;
    }
  };

  const getClientTypeLabel = (type: string) => {
    switch (type) {
      case 'restaurant': return 'Restaurant';
      case 'artisan': return 'Artisan';
      case 'fournisseur': return 'Fournisseur';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="banker-clients" onNavigate={navigateTo} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Gestion des Clients
              </h1>
              <p className="text-gray-600 mt-2">
                Profils clients et historiques financiers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Score Moyen</p>
                <p className="text-2xl font-bold text-green-600">{avgCreditScore}</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Risque Faible</p>
                <p className="text-2xl font-bold text-green-600">{lowRiskClients}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Risque Élevé</p>
                <p className="text-2xl font-bold text-red-600">{highRiskClients}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>
        </div>

        {/* Filtres et Recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="restaurant">Restaurants</option>
                <option value="artisan">Artisans</option>
                <option value="fournisseur">Fournisseurs</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les risques</option>
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Message de chargement */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Chargement des clients...</span>
          </div>
        )}

        {/* Message d'erreur */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Message si aucun client */}
        {!loading && !error && clients.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucun client trouvé</p>
            <p className="text-sm text-gray-500 mt-1">Les clients apparaîtront ici une fois qu'ils auront fait une demande de prêt</p>
          </div>
        )}

        {/* Liste des clients */}
        {!loading && !error && filteredClients.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-600">{getClientTypeLabel(client.type)} • ID: {client.id}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(client.riskLevel)}`}>
                        Risque: {getRiskLabel(client.riskLevel)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentHistoryColor(client.paymentHistory)}`}>
                        {getPaymentHistoryLabel(client.paymentHistory)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{client.location}</span>
                    </div>
                  </div>

                  {/* Score de crédit */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Score de Crédit</span>
                      <span className={`text-2xl font-bold ${getCreditScoreColor(client.creditScore)}`}>
                        {client.creditScore}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          client.creditScore >= 800 ? 'bg-green-600' :
                          client.creditScore >= 700 ? 'bg-blue-600' :
                          client.creditScore >= 600 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${(client.creditScore / 850) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Statistiques financières */}
                <div className="md:w-1/3 border-l border-gray-200 pl-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Historique Financier</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prêts Actifs</span>
                      <span className="font-semibold text-gray-900">{client.activeLoans}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Prêts</span>
                      <span className="font-semibold text-gray-900">{client.totalLoans}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Emprunté</span>
                      <span className="font-semibold text-gray-900">
                        {client.totalBorrowed.toLocaleString()}€
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Remboursé</span>
                      <div className="flex items-center gap-1">
                        {client.totalRepaid >= client.totalBorrowed / 2 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-orange-600" />
                        )}
                        <span className="font-semibold text-gray-900">
                          {client.totalRepaid.toLocaleString()}€
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Client depuis</span>
                        <span>{client.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>Dernière activité</span>
                        <span>{client.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Message si recherche vide */}
        {!loading && !error && clients.length > 0 && filteredClients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucun client ne correspond à vos critères de recherche</p>
            <p className="text-sm text-gray-500 mt-2">Essayez de modifier vos filtres</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BankerClientsPage;
