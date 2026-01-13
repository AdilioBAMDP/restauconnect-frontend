import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Users, Eye, Download } from 'lucide-react';

interface GlobalStats {
  totalUsers: number;
  totalTransactions?: number;
  totalRevenue?: number;
  [key: string]: unknown;
}

interface AdminTransactionsProps {
  globalStats: GlobalStats;
  [key: string]: unknown;
}

export const AdminTransactions: React.FC<AdminTransactionsProps> = ({ 
  globalStats = {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // ✅ CORRIGÉ: Utilisation de globalStats quand disponible
  console.log('AdminTransactions globalStats:', globalStats);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/admin/transactions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTransactions(result.data);
        } else {
          throw new Error(result.error || 'Erreur lors du chargement des transactions');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.to.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      case 'subscription': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calculs des statistiques - Utilise globalStats si disponible, sinon calculs locaux
  const totalTransactions = globalStats.totalTransactions || filteredTransactions.length;
  const totalRevenue = globalStats.totalRevenue || filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommissions = filteredTransactions.reduce((sum, t) => sum + t.commission, 0);
  const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Transactions</h2>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => {
              if (!filteredTransactions.length) {
                alert('Aucune transaction à exporter.');
                return;
              }
              // Générer le CSV
              const headers = [
                'ID', 'Description', 'Type', 'De', 'Vers', 'Montant', 'Commission', 'Statut', 'Date'
              ];
              const rows = filteredTransactions.map(t => [
                t.id,
                t.description,
                t.type,
                t.from?.name || '',
                t.to?.name || '',
                t.amount,
                t.commission,
                t.status,
                t.date
              ]);
              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}` + '"').join(','))
              ].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commissions</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCommissions)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgTransactionValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par ID, nom d'utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Terminée</option>
            <option value="pending">En attente</option>
            <option value="failed">Échouée</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="service">Service</option>
            <option value="product">Produit</option>
            <option value="subscription">Abonnement</option>
          </select>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transactions récentes ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  De / Vers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-sm text-gray-500">{transaction.description}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.from.name}</div>
                      <div className="text-sm text-gray-500">→ {transaction.to.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(transaction.commission)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? 'Terminée' : 
                       transaction.status === 'pending' ? 'En attente' : 'Échouée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      <Download className="w-4 h-4" />
                    </button>
                    {transaction.status === 'pending' && (
                      <button
                        className="text-blue-700 hover:text-blue-900 mr-3"
                        title="Valider la transaction"
                        onClick={async () => {
                          if (!window.confirm('Valider cette transaction ?')) return;
                          try {
                            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/wallet/transactions/${transaction.id}/validate`, {
                              method: 'PATCH',
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                'Content-Type': 'application/json'
                              }
                            });
                            const result = await response.json();
                            if (result.success) {
                              setTransactions(prev => prev.map(t => t.id === transaction.id ? { ...t, status: 'completed' } : t));
                            } else {
                              alert(result.error || 'Erreur lors de la validation');
                            }
                          } catch (err) {
                            alert('Erreur lors de la validation');
                          }
                        }}
                      >
                        <span className="sr-only">Valider</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer la transaction"
                      onClick={async () => {
                        if (!window.confirm('Supprimer cette transaction ?')) return;
                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/wallet/transactions/${transaction.id}`, {
                            method: 'DELETE',
                            headers: {
                              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                              'Content-Type': 'application/json'
                            }
                          });
                          const result = await response.json();
                          if (result.success) {
                            setTransactions(prev => prev.filter(t => t.id !== transaction.id));
                          } else {
                            alert(result.error || 'Erreur lors de la suppression');
                          }
                        } catch (err) {
                          alert('Erreur lors de la suppression');
                        }
                      }}
                    >
                      <span className="sr-only">Supprimer</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</h3>
            <p className="text-gray-500">Aucune transaction ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};
