import React, { useState, useCallback } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar, Download, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';

interface Transaction {
  id: string;
  type: 'investment' | 'dividend' | 'withdrawal';
  projectName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  description: string;
}

const TransactionsPage: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as any);
  }, [navigateTo]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'investment',
      projectName: 'Restaurant Le Gourmet',
      amount: 25000,
      date: '2024-06-15',
      status: 'completed',
      description: 'Investissement initial - 15 parts'
    },
    {
      id: '2',
      type: 'dividend',
      projectName: 'Restaurant Le Gourmet',
      amount: 1200,
      date: '2024-09-30',
      status: 'completed',
      description: 'Dividendes Q3 2024'
    },
    {
      id: '3',
      type: 'investment',
      projectName: 'Boulangerie Artisan Bio',
      amount: 15000,
      date: '2024-08-20',
      status: 'completed',
      description: 'Investissement initial - 10 parts'
    },
    {
      id: '4',
      type: 'dividend',
      projectName: 'Boulangerie Artisan Bio',
      amount: 850,
      date: '2024-10-01',
      status: 'pending',
      description: 'Dividendes Q3 2024'
    },
    {
      id: '5',
      type: 'investment',
      projectName: 'Fournisseur Produits Locaux',
      amount: 30000,
      date: '2024-09-10',
      status: 'completed',
      description: 'Investissement initial - 20 parts'
    },
    {
      id: '6',
      type: 'dividend',
      projectName: 'Pizzeria Napoli',
      amount: 980,
      date: '2024-09-25',
      status: 'completed',
      description: 'Dividendes Q3 2024'
    },
    {
      id: '7',
      type: 'withdrawal',
      projectName: 'Compte Principal',
      amount: 5000,
      date: '2024-10-05',
      status: 'pending',
      description: 'Retrait vers compte bancaire'
    }
  ]);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'investment':
        return { label: 'Investissement', color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp };
      case 'dividend':
        return { label: 'Dividende', color: 'text-green-600', bg: 'bg-green-100', icon: DollarSign };
      case 'withdrawal':
        return { label: 'Retrait', color: 'text-orange-600', bg: 'bg-orange-100', icon: TrendingDown };
      default:
        return { label: type, color: 'text-gray-600', bg: 'bg-gray-100', icon: DollarSign };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Complété', color: 'text-green-700', bg: 'bg-green-100' };
      case 'pending':
        return { label: 'En attente', color: 'text-orange-700', bg: 'bg-orange-100' };
      case 'cancelled':
        return { label: 'Annulé', color: 'text-red-700', bg: 'bg-red-100' };
      default:
        return { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalInvestments = transactions
    .filter(tx => tx.type === 'investment' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDividends = transactions
    .filter(tx => tx.type === 'dividend' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      
      <Header currentPage="transactions" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('investor-dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Transactions</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Investi</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalInvestments.toLocaleString()}€</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Dividendes</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{totalDividends.toLocaleString()}€</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Retraits</span>
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{totalWithdrawals.toLocaleString()}€</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-400 self-center" />
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg font-medium ${selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                Tout
              </button>
              <button
                onClick={() => setSelectedType('investment')}
                className={`px-4 py-2 rounded-lg font-medium ${selectedType === 'investment' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                Investissements
              </button>
              <button
                onClick={() => setSelectedType('dividend')}
                className={`px-4 py-2 rounded-lg font-medium ${selectedType === 'dividend' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
              >
                Dividendes
              </button>
              <button
                onClick={() => setSelectedType('withdrawal')}
                className={`px-4 py-2 rounded-lg font-medium ${selectedType === 'withdrawal' ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}
              >
                Retraits
              </button>
            </div>
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((tx, index) => {
              const typeConfig = getTypeConfig(tx.type);
              const statusConfig = getStatusConfig(tx.status);
              const Icon = typeConfig.icon;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`${typeConfig.bg} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{tx.projectName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig.color} ${typeConfig.bg}`}>
                            {typeConfig.label}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{tx.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(tx.date).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${
                        tx.type === 'investment' || tx.type === 'withdrawal' 
                          ? 'text-gray-900' 
                          : 'text-green-600'
                      }`}>
                        {tx.type === 'dividend' ? '+' : ''}
                        {tx.amount.toLocaleString()}€
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bouton export */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => alert('📥 Export CSV - Fonctionnalité à venir')}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Exporter en CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
