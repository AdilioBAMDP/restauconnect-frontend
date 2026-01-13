import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Flag, CheckCircle, Eye, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AdminModerationProps {
  globalStats: unknown;
  professionals: unknown[];
  onTabChange: (tab: string) => void;
  messages?: unknown[];
  offers?: unknown[];
  applications?: unknown[];
  moderationFilter?: string;
  [key: string]: unknown; // Accept any additional props
}

export const AdminModeration: React.FC<AdminModerationProps> = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchModeration = async () => {
      setLoading(true);
      setError(null);
      try {
        // Messages à modérer
        const msgRes = await fetch(`http://localhost:5000/api/admin/moderation/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        const msgResult = await msgRes.json();
        if (msgResult.success) {
          setMessages(msgResult.data);
        } else {
          setError(msgResult.error || 'Erreur lors du chargement des messages à modérer');
        }
        // Offres à modérer
        const offerRes = await fetch(`http://localhost:5000/api/admin/moderation/offers`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        const offerResult = await offerRes.json();
        if (offerResult.success) {
          setOffers(offerResult.data);
        } else {
          setError(offerResult.error || 'Erreur lors du chargement des offres à modérer');
        }
        // Avis à modérer
        const reviewRes = await fetch(`http://localhost:5000/api/admin/moderation/reviews`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        const reviewResult = await reviewRes.json();
        if (reviewResult.success) {
          setReviews(reviewResult.data);
        } else {
          setError(reviewResult.error || 'Erreur lors du chargement des avis à modérer');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des éléments à modérer');
      } finally {
        setLoading(false);
      }
    };
    fetchModeration();
  }, []);

  const handleModeration = async (id: string, action: 'approve' | 'reject' | 'delete', reason?: string, type: 'message' | 'offer' | 'review' = 'message') => {
    setActionLoading(id + action + type);
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/`;
      if (type === 'offer') url += `offers/${id}`;
      else if (type === 'review') url += `reviews/${id}`;
      else url += `messages/${id}`;
      let method = 'PATCH';
      let body: any = undefined;
      if (action === 'approve') {
        url += '/approve';
      } else if (action === 'reject') {
        url += '/reject';
        body = JSON.stringify({ reason: reason || 'Rejeté par modération' });
      } else if (action === 'delete') {
        method = 'DELETE';
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        ...(body ? { body } : {})
      });
      const result = await response.json();
      if (result.success) {
        if (type === 'message') {
          setMessages(prev => prev.filter(m => m._id !== id));
        } else if (type === 'offer') {
          setOffers(prev => prev.filter(o => o._id !== id));
        } else if (type === 'review') {
          setReviews(prev => prev.filter(r => r._id !== id));
        }
      } else {
        alert(result.error || 'Erreur lors de la modération');
      }
    } catch (err) {
      alert('Erreur lors de la modération');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-900">Modération admin</h2>

      {loading && <div className="text-center text-gray-500">Chargement...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Bloc messages à modérer */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Messages à modérer</h3>
        </div>
        <div className="p-6">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun message à modérer.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contenu</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{msg.senderId}</td>
                    <td className="px-4 py-2 text-sm max-w-xs truncate" title={msg.content}>{msg.content}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${msg.moderationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : msg.moderationStatus === 'flagged' ? 'bg-red-100 text-red-800' : msg.moderationStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {msg.moderationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Approuver"
                        disabled={actionLoading === msg._id + 'approve' + 'message'}
                        onClick={() => handleModeration(msg._id, 'approve', undefined, 'message')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Rejeter"
                        disabled={actionLoading === msg._id + 'reject' + 'message'}
                        onClick={() => {
                          const reason = window.prompt('Raison du rejet ?');
                          if (reason !== null) handleModeration(msg._id, 'reject', reason, 'message');
                        }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Supprimer"
                        disabled={actionLoading === msg._id + 'delete' + 'message'}
                        onClick={() => {
                          if (window.confirm('Supprimer ce message ?')) handleModeration(msg._id, 'delete', undefined, 'message');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir"
                        onClick={() => window.alert(msg.content)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bloc offres à modérer */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Offres à modérer</h3>
        </div>
        <div className="p-6">
          {offers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune offre à modérer.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm max-w-xs truncate" title={offer.title}>{offer.title}</td>
                    <td className="px-4 py-2 text-sm">{offer.publishedByName || offer.publishedBy?.name || offer.publishedBy}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${offer.moderationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : offer.moderationStatus === 'flagged' ? 'bg-red-100 text-red-800' : offer.moderationStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {offer.moderationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Approuver"
                        disabled={actionLoading === offer._id + 'approve' + 'offer'}
                        onClick={() => handleModeration(offer._id, 'approve', undefined, 'offer')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Rejeter"
                        disabled={actionLoading === offer._id + 'reject' + 'offer'}
                        onClick={() => {
                          const reason = window.prompt('Raison du rejet ?');
                          if (reason !== null) handleModeration(offer._id, 'reject', reason, 'offer');
                        }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Supprimer"
                        disabled={actionLoading === offer._id + 'delete' + 'offer'}
                        onClick={() => {
                          if (window.confirm('Supprimer cette offre ?')) handleModeration(offer._id, 'delete', undefined, 'offer');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir"
                        onClick={() => window.alert(offer.description)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bloc avis à modérer */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Avis à modérer</h3>
        </div>
        <div className="p-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun avis à modérer.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cible</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{review.reviewerId?.name || review.reviewerId || '-'}</td>
                    <td className="px-4 py-2 text-sm">{review.reviewedId?.name || review.reviewedId || '-'}</td>
                    <td className="px-4 py-2 text-sm">{review.rating}</td>
                    <td className="px-4 py-2 text-sm max-w-xs truncate" title={review.comment}>{review.comment}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${review.moderationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : review.moderationStatus === 'flagged' ? 'bg-red-100 text-red-800' : review.moderationStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {review.moderationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Approuver"
                        disabled={actionLoading === review._id + 'approve' + 'review'}
                        onClick={() => handleModeration(review._id, 'approve', undefined, 'review')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Rejeter"
                        disabled={actionLoading === review._id + 'reject' + 'review'}
                        onClick={() => {
                          const reason = window.prompt('Raison du rejet ?');
                          if (reason !== null) handleModeration(review._id, 'reject', reason, 'review');
                        }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Supprimer"
                        disabled={actionLoading === review._id + 'delete' + 'review'}
                        onClick={() => {
                          if (window.confirm('Supprimer cet avis ?')) handleModeration(review._id, 'delete', undefined, 'review');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir"
                        onClick={() => window.alert(review.comment)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
