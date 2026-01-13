import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useArtisanStore, useQuotes, useArtisanLoading, useArtisanError } from '@/stores/artisanStore';
import ArtisanService from '@/services/artisanService';
import QuoteForm from './QuoteForm';
import QuoteDetail from './QuoteDetail';
import { Quote } from '@/types/artisan.types';

const QuotesList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quotes = useQuotes();
  const { isLoadingQuotes } = useArtisanLoading();
  const error = useArtisanError();
  const { loadQuotes, setQuotesFilters, setQuotesPage, quotesFilters, quotesPage, quotesTotalPages } = useArtisanStore();
  
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      loadQuotes(user.id);
    }
  }, [user?.id, loadQuotes, quotesFilters]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setQuotesFilters({ status });
    if (user?.id) {
      loadQuotes(user.id, 1);
    }
  };

  const handlePageChange = (page: number) => {
    setQuotesPage(page);
    if (user?.id) {
      loadQuotes(user.id, page);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-orange-100 text-orange-800'
    };
    
    const labels = {
      'draft': 'Brouillon',
      'sent': 'Envoyé',
      'accepted': 'Accepté',
      'rejected': 'Refusé',
      'expired': 'Expiré'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || badges.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (isLoadingQuotes) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Chargement des devis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des devis</h1>
          <p className="text-gray-600">Créez et gérez vos devis conformes aux normes françaises</p>
        </div>
        <button
          onClick={() => navigate('/artisan/quotes/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          📋 Nouveau devis
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'draft', 'sent', 'accepted', 'rejected', 'expired'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusFilter === status
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tous' : 
               status === 'draft' ? 'Brouillons' :
               status === 'sent' ? 'Envoyés' :
               status === 'accepted' ? 'Acceptés' :
               status === 'rejected' ? 'Refusés' : 'Expirés'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des devis */}
      <div className="bg-white shadow rounded-lg">
        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devis</h3>
            <p className="text-gray-500 mb-4">Commencez par créer votre premier devis</p>
            <button
              onClick={() => navigate('/artisan/quotes/new')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Créer un devis
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro / Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote: Quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quote.quoteNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quote.customer.firstName} {quote.customer.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {quote.projectDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ArtisanService.formatCurrency(quote.totalTTC)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ArtisanService.formatDate(quote.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/artisan/quotes/${quote._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Voir
                      </button>
                      {quote.status === 'draft' && (
                        <button
                          onClick={() => navigate(`/artisan/quotes/${quote._id}/edit`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {quotesTotalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(quotesPage - 1)}
                disabled={quotesPage <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => handlePageChange(quotesPage + 1)}
                disabled={quotesPage >= quotesTotalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{quotesPage}</span> sur{' '}
                  <span className="font-medium">{quotesTotalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: quotesTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === quotesPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuoteManager: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<QuotesList />} />
      <Route path="/new" element={<QuoteForm />} />
      <Route path="/:id" element={<QuoteDetail />} />
      <Route path="/:id/edit" element={<QuoteForm />} />
    </Routes>
  );
};

export default QuoteManager;