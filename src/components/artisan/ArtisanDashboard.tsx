import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useArtisanStore, useArtisanStats, useArtisanLoading } from '@/stores/artisanStore';
import ArtisanService from '@/services/artisanService';

const ArtisanDashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = useArtisanStats();
  const { isLoadingStats } = useArtisanLoading();
  const { loadStats, loadQuotes, loadInvoices } = useArtisanStore();

  useEffect(() => {
    if (user?.id) {
      // Charger toutes les données au montage
      loadStats(user.id);
      loadQuotes(user.id);
      loadInvoices(user.id);
    }
  }, [user?.id, loadStats, loadQuotes, loadInvoices]);

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Chargement des statistiques...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tableau de bord artisan
          </h1>
          <p className="text-gray-600">
            Bienvenue dans votre espace professionnel de gestion des devis et factures
          </p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* CA mensuel */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    CA ce mois
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {ArtisanService.formatCurrency(stats?.revenue.currentMonth || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Devis en attente */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Devis en attente
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.quotesCount.pending || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Factures impayées */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚠️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Factures impayées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats ? (stats.invoicesCount.total - stats.invoicesCount.paid) : 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Retenues de garantie */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🔒</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Retenues garantie
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {ArtisanService.formatCurrency(stats?.guaranteeRetentionsTotal || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => window.location.href = '/artisan/quotes/new'}
              className="relative block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
              <span className="block text-sm font-medium text-gray-900">
                Créer un devis
              </span>
              <span className="block text-sm text-gray-500">
                Nouveau devis pour un client
              </span>
            </button>

            <button
              onClick={() => window.location.href = '/artisan/invoices/new'}
              className="relative block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧾</div>
              <span className="block text-sm font-medium text-gray-900">
                Créer une facture
              </span>
              <span className="block text-sm text-gray-500">
                Nouvelle facture de progression
              </span>
            </button>

            <button
              onClick={() => window.location.href = '/artisan/stats'}
              className="relative block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <span className="block text-sm font-medium text-gray-900">
                Voir les statistiques
              </span>
              <span className="block text-sm text-gray-500">
                Analyse détaillée des performances
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      {((stats?.quotesCount?.pending || 0) > 0 || (stats && (stats.invoicesCount.total - stats.invoicesCount.paid) > 0)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Actions requises
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc space-y-1 pl-5">
                  {stats && stats.quotesCount.pending > 0 && (
                    <li>
                      Vous avez {stats.quotesCount.pending} devis en attente de réponse client
                    </li>
                  )}
                  {stats && (stats.invoicesCount.total - stats.invoicesCount.paid) > 0 && (
                    <li>
                      {stats.invoicesCount.total - stats.invoicesCount.paid} factures sont en attente de paiement
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations légales */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-xl">ℹ️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Conformité française
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Tous vos devis et factures sont automatiquement conformes aux normes françaises : 
              mentions légales obligatoires, numérotation chronologique, retenue de garantie de 5% 
              pour les travaux BTP selon le Code de la consommation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;