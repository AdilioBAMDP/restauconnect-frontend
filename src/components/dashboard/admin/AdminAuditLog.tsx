import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AuditLogEntry {
  _id: string;
  action: string;
  targetType: string;
  targetId: string;
  performedBy: string;
  performedByRole: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/admin/audit-logs`, {
        params: { search, page },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      .then((res) => {
        setLogs(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des logs');
        setLoading(false);
      });
  }, [search, page]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Journal d’audit des actions admin</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Recherche action, utilisateur, cible..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-64"
        />
        <button
          onClick={() => setPage(1)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >Rechercher</button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Action</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Cible</th>
                <th className="border px-2 py-1">Par</th>
                <th className="border px-2 py-1">Rôle</th>
                <th className="border px-2 py-1">Détails</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="border px-2 py-1">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="border px-2 py-1">{log.action}</td>
                  <td className="border px-2 py-1">{log.targetType}</td>
                  <td className="border px-2 py-1">{log.targetId}</td>
                  <td className="border px-2 py-1">{log.performedBy}</td>
                  <td className="border px-2 py-1">{log.performedByRole}</td>
                  <td className="border px-2 py-1">
                    <pre className="whitespace-pre-wrap text-xs">{log.details ? JSON.stringify(log.details, null, 2) : ''}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >Précédent</button>
            <span>Page {page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >Suivant</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLog;
