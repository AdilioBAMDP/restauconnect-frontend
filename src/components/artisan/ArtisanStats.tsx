import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useArtisanStore, useArtisanStats, useArtisanLoading } from '@/stores/artisanStore';
import ArtisanService from '@/services/artisanService';

const ArtisanStats: React.FC = () => {
  const { user } = useAuth();
  const stats = useArtisanStats();
  const { isLoadingStats } = useArtisanLoading();
  const { loadStats } = useArtisanStore();

  useEffect(() => {
    if (user?.id) {
      loadStats(user.id);
    }
  }, [user?.id, loadStats]);

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
            📈 Statistiques détaillées
          </h1>
          <p className="text-gray-600">
            Analyse complète de votre activité d'artisan
          </p>
        </div>
      </div>

      {/* Statistiques financières */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chiffre d'affaires total
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {ArtisanService.formatCurrency(stats?.revenue.currentYear || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    CA ce mois
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {ArtisanService.formatCurrency(stats?.revenue.currentMonth || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">🏦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Retenues de garantie
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {ArtisanService.formatCurrency(stats?.guaranteeRetentionsTotal || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques de devis */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            📋 Statistiques des devis
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {stats?.quotesCount.total || 0}
              </div>
              <div className="text-sm text-gray-500">Total devis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats?.quotesCount.pending || 0}
              </div>
              <div className="text-sm text-gray-500">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats?.quotesCount.accepted || 0}
              </div>
              <div className="text-sm text-gray-500">Acceptés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats?.conversionRate ? `${Math.round(stats.conversionRate)}%` : '0%'}
              </div>
              <div className="text-sm text-gray-500">Taux d'acceptation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques de factures */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            🧾 Statistiques des factures
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {stats?.invoicesCount.total || 0}
              </div>
              <div className="text-sm text-gray-500">Total factures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats?.invoicesCount.paid || 0}
              </div>
              <div className="text-sm text-gray-500">Payées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {(stats?.invoicesCount.total || 0) - (stats?.invoicesCount.paid || 0)}
              </div>
              <div className="text-sm text-gray-500">Impayées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats?.invoicesCount.overdue || 0}
              </div>
              <div className="text-sm text-gray-500">En retard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations légales et conformité */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-4">
          ⚖️ Conformité légale française
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">✅ Normes respectées :</h4>
            <ul className="space-y-1">
              <li>• Code de la consommation</li>
              <li>• Mentions légales obligatoires</li>
              <li>• Numérotation chronologique</li>
              <li>• Délai de rétractation de 14 jours</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🏗️ BTP / Construction :</h4>
            <ul className="space-y-1">
              <li>• Retenue de garantie 5% automatique</li>
              <li>• Acompte maximum 30%</li>
              <li>• Facturation par avancement</li>
              <li>• Garanties décennales mentionnées</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conseils et optimisations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-green-800 mb-4">
          💡 Optimisations suggérées
        </h3>
        <div className="space-y-3 text-sm text-green-700">
          {stats?.conversionRate && stats.conversionRate < 50 && (
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <span>
                Votre taux d'acceptation est de {Math.round(stats.conversionRate)}%. 
                Considérez réviser vos prix ou améliorer vos descriptions.
              </span>
            </div>
          )}
          {stats && (stats.invoicesCount.total - stats.invoicesCount.paid) > 0 && (
            <div className="flex items-start">
              <span className="text-red-500 mr-2">🔴</span>
              <span>
                {stats.invoicesCount.total - stats.invoicesCount.paid} factures impayées nécessitent un suivi client.
              </span>
            </div>
          )}
          {stats && stats.guaranteeRetentionsTotal > 0 && (
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">🔒</span>
              <span>
                {ArtisanService.formatCurrency(stats.guaranteeRetentionsTotal)} en retenue de garantie 
                pourront être libérés après la période de garantie.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanStats;