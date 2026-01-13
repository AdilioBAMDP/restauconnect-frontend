import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/components/utils/logger';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Euro,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'transactions' | 'payouts';
type PayoutPriority = 'standard' | 'fast' | 'instant';

interface WalletComponentProps {
  userType: string;
  onNavigate?: (page: string) => void;
}

interface Transaction {
  id: string;
  amount: number;
  netAmount: number;
  commission: number;
  type: string;
  description: string;
  status: string;
  direction: 'in' | 'out';
  date: string;
  from?: { firstName: string; lastName: string; companyName?: string };
  to?: { firstName: string; lastName: string; companyName?: string };
}

interface WalletData {
  balance: number;
  pendingPayouts: number;
  status: string;
  monthlyStats: {
    earnings: number;
    transactions: number;
    averageAmount: number;
  };
}

const WalletComponent: React.FC<WalletComponentProps> = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutPriority, setPayoutPriority] = useState<PayoutPriority>('standard');

  useEffect(() => {
    loadWalletData();
    loadTransactions();
  }, []);

  const loadWalletData = async () => {
    try {
      const response = await fetch('/api/wallet/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWalletData(data.wallet);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement du portefeuille', error);
      toast.error('Erreur lors du chargement du portefeuille');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/wallet/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des transactions', error);
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast.error('Veuillez saisir un montant valide');
      return;
    }

    if (walletData && parseFloat(payoutAmount) > walletData.balance) {
      toast.error('Solde insuffisant');
      return;
    }

    try {
      const response = await fetch('/api/wallet/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(payoutAmount),
          priority: payoutPriority
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Virement de ${data.payout.amount}€ demandé avec succès`);
        setPayoutAmount('');
        loadWalletData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors du virement');
      }
    } catch (error) {
      logger.error('Erreur lors de la demande de virement', error);
      toast.error('Erreur lors de la demande de virement');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getPayoutFees = (priority: string) => {
    const fees = {
      'standard': { fee: 0, time: '2-3 jours' },
      'fast': { fee: 1.50, time: '24h' },
      'instant': { fee: 3.00, time: 'Immédiat' }
    };
    return fees[priority as keyof typeof fees] || fees.standard;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="text-center py-12">
        <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Portefeuille non configuré</h3>
        <p className="text-gray-600 mb-4">Configurez votre portefeuille pour recevoir des paiements</p>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Configurer le portefeuille
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du portefeuille */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Mon Portefeuille</h2>
              <p className="text-orange-100">Gestion de vos finances</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-100">Solde disponible</p>
            <p className="text-3xl font-bold">{formatCurrency(walletData.balance)}</p>
          </div>
        </div>

        {walletData.pendingPayouts > 0 && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm">
              <Clock className="h-4 w-4 inline mr-1" />
              {formatCurrency(walletData.pendingPayouts)} en cours de virement
            </p>
          </div>
        )}
      </div>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(walletData.monthlyStats.earnings)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ArrowDownLeft className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {walletData.monthlyStats.transactions}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Euro className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(walletData.monthlyStats.averageAmount)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Aperçu', icon: Wallet },
            { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
            { id: 'payouts', label: 'Virements', icon: Download }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
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
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg shadow-md border">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Historique des transactions</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filtrer
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.direction === 'in' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.direction === 'in' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {transaction.direction === 'in' 
                          ? `De ${transaction.from?.companyName || `${transaction.from?.firstName} ${transaction.from?.lastName}`}`
                          : `Vers ${transaction.to?.companyName || `${transaction.to?.firstName} ${transaction.to?.lastName}`}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.direction === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.direction === 'in' ? '+' : '-'}{formatCurrency(transaction.netAmount)}
                    </p>
                    {transaction.commission > 0 && (
                      <p className="text-xs text-gray-500">
                        Commission: {formatCurrency(transaction.commission)}
                      </p>
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? 'Complétée' : 
                       transaction.status === 'pending' ? 'En attente' : 'Échouée'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Demander un virement</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant à virer
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={walletData.balance}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-8"
                />
                <Euro className="h-5 w-5 text-gray-400 absolute left-2 top-4" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Solde disponible: {formatCurrency(walletData.balance)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rapidité du virement
              </label>
              <div className="space-y-3">
                {['standard', 'fast', 'instant'].map((priority) => {
                  const feeInfo = getPayoutFees(priority);
                  return (
                    <label
                      key={priority}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        payoutPriority === priority
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={payoutPriority === priority}
                          onChange={(e) => setPayoutPriority(e.target.value as PayoutPriority)}
                          className="sr-only"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {priority === 'standard' ? 'Standard' :
                             priority === 'fast' ? 'Rapide' : 'Instantané'}
                          </p>
                          <p className="text-sm text-gray-600">{feeInfo.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {feeInfo.fee === 0 ? 'Gratuit' : formatCurrency(feeInfo.fee)}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePayout}
              disabled={!payoutAmount || parseFloat(payoutAmount) <= 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                payoutAmount && parseFloat(payoutAmount) > 0
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              Demander le virement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletComponent;
