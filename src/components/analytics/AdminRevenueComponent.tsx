import React, { useState, useEffect, useCallback } from 'react';
import { logger } from '@/components/utils/logger';
import { 
  TrendingUp, 
  ArrowUpRight,
  CreditCard,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Euro,
  Building,
  BarChart3,
  PieChart
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminRevenueComponentProps {
  onNavigate?: (page: string) => void;
}

interface PlatformStats {
  balance: number;
  totalCommissionsCollected: number;
  totalFeesCollected: number;
  totalTransferredToCompany: number;
  monthlyStats: {
    commissions: number;
    fees: number;
    revenue: number;
    transactions: number;
  };
  revenueByUserType: {
    [key: string]: {
      totalCommissions: number;
      totalTransactions: number;
      monthlyCommissions: number;
      avgCommissionPerTransaction: number;
    };
  };
  lastTransfer?: {
    amount: number;
    date: string;
    type: string;
  };
  autoTransferSettings: {
    enabled: boolean;
    threshold: number;
    frequency: string;
    retainPercentage: number;
  };
  commissionSettings: {
    defaultRate: number;
    feeSettings: {
      payoutStandard: number;
      payoutFast: number;
      payoutInstant: number;
    };
  };
}

interface TopUser {
  userId: string;
  userName: string;
  companyName?: string;
  userType: string;
  totalCommissions: number;
  transactionCount: number;
  avgCommission: number;
}

const AdminRevenueComponent: React.FC<AdminRevenueComponentProps> = () => {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'transfers' | 'settings'>('overview');
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState(5);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const loadTopUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/top-commission-generators?period=${selectedPeriod}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTopUsers(data.topUsers);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des top users', error);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadPlatformStats();
    loadTopUsers();
  }, [selectedPeriod, loadTopUsers]);

  const loadPlatformStats = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/admin/platform-wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlatformStats(data.platform);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des statistiques platform', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };



  const handleManualTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error('Veuillez saisir un montant valide');
      return;
    }

    if (platformStats && parseFloat(transferAmount) > platformStats.balance) {
      toast.error('Montant supérieur au solde disponible');
      return;
    }

    try {
      const response = await fetch('/api/admin/company-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(transferAmount),
          type: 'manual'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Virement de ${data.transfer.amount}€ initié avec succès`);
        setTransferAmount('');
        setShowTransferModal(false);
        loadPlatformStats();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors du virement');
      }
    } catch (error) {
      logger.error('Erreur lors de la demande de virement', error);
      toast.error('Erreur lors de la demande de virement');
    }
  };

  const updateCommissionRate = async () => {
    try {
      const response = await fetch('/api/admin/commission-rates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          defaultRate: newCommissionRate / 100
        })
      });

      if (response.ok) {
        toast.success('Taux de commission mis à jour avec succès');
        loadPlatformStats();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du taux de commission', error);
      toast.error('Erreur lors de la mise à jour du taux');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getUserTypeIcon = (userType: string) => {
    const icons = {
      restaurant: '🍽️',
      artisan: '🔨',
      fournisseur: '📦',
      candidat: '👤',
      banquier: '🏦',
      communityManager: '👥'
    };
    return icons[userType as keyof typeof icons] || '👤';
  };

  const getUserTypeName = (userType: string) => {
    const names = {
      restaurant: 'Restaurant',
      artisan: 'Artisan',
      fournisseur: 'Fournisseur',
      candidat: 'Candidat',
      banquier: 'Banquier',
      communityManager: 'Community Manager'
    };
    return names[userType as keyof typeof names] || userType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!platformStats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Données non disponibles</h3>
        <p className="text-gray-600 mb-4">Impossible de charger les statistiques de la plateforme</p>
        <button 
          onClick={loadPlatformStats}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 inline mr-2" />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec KPIs principaux */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">💰 Revenus Platform</h2>
            <p className="text-green-100">Gestion financière RestauConnect</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={loadPlatformStats}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Virement Entreprise
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <Euro className="h-8 w-8 mr-3" />
              <div>
                <p className="text-sm text-green-100">Solde Platform</p>
                <p className="text-2xl font-bold">{formatCurrency(platformStats.balance)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 mr-3" />
              <div>
                <p className="text-sm text-green-100">Commissions ce mois</p>
                <p className="text-2xl font-bold">{formatCurrency(platformStats.monthlyStats.commissions)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 mr-3" />
              <div>
                <p className="text-sm text-green-100">Frais collectés</p>
                <p className="text-2xl font-bold">{formatCurrency(platformStats.monthlyStats.fees)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 mr-3" />
              <div>
                <p className="text-sm text-green-100">Total transféré</p>
                <p className="text-2xl font-bold">{formatCurrency(platformStats.totalTransferredToCompany)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'commissions', label: 'Commissions', icon: PieChart },
            { id: 'transfers', label: 'Virements', icon: ArrowUpRight },
            { id: 'settings', label: 'Configuration', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'commissions' | 'transfers' | 'settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenus par type d'utilisateur */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus par Type d'Utilisateur</h3>
            <div className="space-y-4">
              {Object.entries(platformStats.revenueByUserType).map(([userType, stats]) => (
                <div key={userType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getUserTypeIcon(userType)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{getUserTypeName(userType)}</p>
                      <p className="text-sm text-gray-600">{stats.totalTransactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(stats.totalCommissions)}</p>
                    <p className="text-sm text-gray-600">
                      Moy: {formatCurrency(stats.avgCommissionPerTransaction)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top utilisateurs générateurs de commissions */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Générateurs de Commissions</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div className="space-y-3">
              {topUsers.slice(0, 8).map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.userName}</p>
                      <p className="text-sm text-gray-600">
                        {user.companyName || getUserTypeName(user.userType)} • {user.transactionCount} trans.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(user.totalCommissions)}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(user.avgCommission)}/trans.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuration des Commissions</h3>
          
          <div className="space-y-6">
            {/* Taux de commission par défaut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux de commission par défaut
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <span className="text-gray-600">%</span>
                <button
                  onClick={updateCommissionRate}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Mettre à jour
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Actuellement: {(platformStats.commissionSettings.defaultRate * 100).toFixed(1)}%
              </p>
            </div>

            {/* Configuration auto-virement */}
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Virements Automatiques</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seuil de déclenchement
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={platformStats.autoTransferSettings.threshold}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                    <span className="ml-2 text-gray-600">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <div className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 ${
                      platformStats.autoTransferSettings.enabled 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                    }`} />
                    <span className={
                      platformStats.autoTransferSettings.enabled 
                        ? 'text-green-600 font-medium' 
                        : 'text-gray-600'
                    }>
                      {platformStats.autoTransferSettings.enabled ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de virement manuel */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Virement vers Compte Entreprise</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant à virer
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={platformStats.balance}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-8"
                  />
                  <Euro className="h-5 w-5 text-gray-400 absolute left-2 top-4" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Solde disponible: {formatCurrency(platformStats.balance)}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleManualTransfer}
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    transferAmount && parseFloat(transferAmount) > 0
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmer le virement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRevenueComponent;
