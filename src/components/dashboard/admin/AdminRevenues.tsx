import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface PlatformWallet {
  balance: number;
  totalCommissionsCollected: number;
  monthlyRevenue: number;
  totalTransactions: number;
  monthlyTransactions: number;
}

interface AdminRevenuesProps {
  platformStats?: {
    totalCommissionsCollected?: number;
    totalFeesCollected?: number;
    monthlyStats?: {
      revenue?: number;
      transactions?: number;
    };
  } | null;
  loadingStats?: boolean;
  [key: string]: unknown;
}

export const AdminRevenues: React.FC<AdminRevenuesProps> = () => {
  const [wallet, setWallet] = useState<PlatformWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/platform-wallet`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      
      if (response.data.success) {
        setWallet(response.data.data);
      } else {
        throw new Error(response.data.error || 'Erreur de chargement');
      }
    } catch (err: any) {
      console.error('Erreur chargement wallet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const totalRevenue = wallet?.totalCommissionsCollected || 0;
  const monthlyRevenue = wallet?.monthlyRevenue || 0;
  const growth = wallet?.monthlyRevenue && wallet?.totalCommissionsCollected 
    ? ((wallet.monthlyRevenue / wallet.totalCommissionsCollected) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Revenus de la Plateforme</h2>
        <div className="flex gap-2">
          <button 
            onClick={loadWalletData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Totaux</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)} €</p>
              <p className="text-xs text-gray-500 mt-1">{wallet?.totalTransactions || 0} transactions</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ce Mois</p>
              <p className="text-2xl font-bold text-blue-600">{monthlyRevenue.toFixed(2)} €</p>
              <p className="text-xs text-gray-500 mt-1">{wallet?.monthlyTransactions || 0} transactions</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Part du Mois</p>
              <p className="text-2xl font-bold text-green-600">{growth}%</p>
              <p className="text-xs text-gray-500 mt-1">du total</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <p className="text-center text-gray-500">Chargement des statistiques...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Détails des Revenus</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Solde actuel</span>
                <span className="font-semibold text-lg">{(wallet?.balance || 0).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Total commissions collectées</span>
                <span className="font-semibold text-lg">{(wallet?.totalCommissionsCollected || 0).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Revenus ce mois</span>
                <span className="font-semibold text-lg text-blue-600">{(wallet?.monthlyRevenue || 0).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Nombre de transactions</span>
                <span className="font-semibold text-lg">{wallet?.totalTransactions || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
