import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiClient } from '../../../services/api';

interface Partner {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

interface AdminRegistrationsProps {
  token?: string;
}

export const AdminRegistrations: React.FC<AdminRegistrationsProps> = ({ token }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/admin/registrations');
      // Gère différents formats de réponse (tableau direct ou objet)
      let arr = res.data.data || res.data;
      if (arr && typeof arr === 'object' && !Array.isArray(arr)) {
        if (Array.isArray(arr.partners)) arr = arr.partners;
        else if (Array.isArray(arr.data)) arr = arr.data;
        else if (Array.isArray(arr.results)) arr = arr.results;
        else arr = [];
      }
      // Normalize _id vs id - MongoDB peut retourner l'un ou l'autre
      const normalized = (Array.isArray(arr) ? arr : []).map((item: any) => ({
        ...item,
        _id: item._id || item.id
      }));
      setPartners(normalized);
    } catch (err: any) {
      setError('Erreur lors du chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [token]);

  const pending = partners.filter(p => p.status === 'pending');
  const approved = partners.filter(p => p.status === 'approved');
  const rejected = partners.filter(p => p.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inscriptions en Attente</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={fetchPartners}
        >Actualiser</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-green-600">{approved.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejetées</p>
              <p className="text-2xl font-bold text-red-600">{rejected.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Demandes Récentes</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-gray-500 text-center py-8">Chargement…</p>
          ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
          ) : pending.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune inscription en attente</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pending.map((p) => (
                <li key={p._id || p.email || p.name} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="font-semibold">{p.name}</span> — <span className="text-sm text-gray-600">{p.email}</span> — <span className="text-sm text-gray-600">{p.role}</span>
                  </div>
                  <div className="mt-2 md:mt-0 flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      onClick={async () => {
                        if (!p._id) {
                          alert('Erreur : identifiant utilisateur manquant.');
                          console.error('Données utilisateur:', p);
                          return;
                        }
                        try {
                          await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/approve-registration/${p._id}`, {}, {
                            headers: token ? { Authorization: `Bearer ${token}` } : undefined
                          });
                          await fetchPartners();
                        } catch (err) {
                          console.error('Erreur validation:', err);
                          setError('Erreur lors de la validation');
                        }
                      }}
                    >Valider</button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={async () => {
                        if (!p._id) {
                          alert('Erreur : identifiant utilisateur manquant.');
                          console.error('Données utilisateur:', p);
                          return;
                        }
                        try {
                          await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/reject-registration/${p._id}`, {}, {
                            headers: token ? { Authorization: `Bearer ${token}` } : undefined
                          });
                          await fetchPartners();
                        } catch (err) {
                          console.error('Erreur refus:', err);
                          setError('Erreur lors du refus');
                        }
                      }}
                    >Refuser</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
