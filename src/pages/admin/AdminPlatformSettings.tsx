
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { apiClient } from '@/services/api';
import { RefreshCw, CheckCircle, XCircle, Info, BarChart2, Clock, LogOut, Settings, Loader2 } from 'lucide-react';
// Type pour l'historique (mock pour la démo)
interface ConfigHistoryEntry {
  date: string;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
  user: string;
}
// Composant Drawer pour détails avancés
const ConfigDetailDrawer: React.FC<{
  entry: ConfigEntry | null;
  open: boolean;
  onClose: () => void;
  onSave?: (updated: ConfigEntry) => void;
  startEditingForKey?: string | null;
  onStartedEditing?: () => void;
}> = ({ entry, open, onClose, onSave, startEditingForKey, onStartedEditing }) => {
  // Real history fetched from the backend
  const [realHistory, setRealHistory] = useState<ConfigHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  // Build stats from real history (if numeric values exist)
  const statsData = React.useMemo(() => {
    if (!realHistory || realHistory.length === 0) return [];
    // We map by created date and use newValue when numeric
    return realHistory
      .slice()
      .reverse()
      .map(h => ({ date: new Date(h.date).toLocaleDateString('fr-FR'), value: typeof h.newValue === 'number' ? h.newValue : (isNaN(Number(h.newValue)) ? null : Number(h.newValue)) }))
      .filter(d => d.value !== null) as { date: string; value: number }[];
  }, [realHistory]);
  // Données mockées pour le tableau de stats d'usage
  const usageStats = React.useMemo(() => {
    if (!entry) return [] as { label: string; value: string | number | boolean }[];
    const count = realHistory.length;
    const lastUser = realHistory[0]?.user || '—';
    // most frequent value (simple reduce)
    const freq: Record<string, number> = {};
    realHistory.forEach(h => {
      const v = String(h.newValue);
      freq[v] = (freq[v] || 0) + 1;
    });
    const mostFreq = Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] || String(entry.value);
    return [
      { label: 'Nombre de modifications', value: count },
      { label: 'Dernier utilisateur', value: lastUser },
      { label: 'Valeur la plus fréquente', value: mostFreq },
      { label: 'Valeur actuelle', value: String(entry.value) }
    ];
  }, [entry, realHistory]);

  // Fetch real history when entry changes
  useEffect(() => {
    if (!entry) {
      setRealHistory([]);
      return;
    }
    setHistoryLoading(true);
    apiClient.get(`/platform-config/${encodeURIComponent(entry.key)}/history`)
      .then(r => {
        // map to our local type
        type BackendHistoryItem = { createdAt?: string; oldValue?: unknown; newValue?: unknown; performedBy?: string; performedByRole?: string };
        const data = (r.data.data || []) as BackendHistoryItem[];
        const h = data.map(x => {
          const mapVal = (v: unknown) => (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') ? v : String(v);
          return { date: x.createdAt || new Date().toISOString(), oldValue: mapVal(x.oldValue) as string | number | boolean, newValue: mapVal(x.newValue) as string | number | boolean, user: x.performedByRole || (x.performedBy ? String(x.performedBy) : 'system') };
        });
        setRealHistory(h);
      })
      .catch(() => setRealHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [entry]);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string | number | boolean | ''>('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setEditValue(entry.value as string | number | boolean);
      setEditDescription(entry.description || '');
      setIsEditing(false);
      setSaveError(null);
      setSaveSuccess(null);
    }
    // handled by separate effect below
  }, [entry, open]);

  useEffect(() => {
    if (entry && startEditingForKey && startEditingForKey === entry._id) {
      setIsEditing(true);
      if (onStartedEditing) onStartedEditing();
    }
  }, [entry, startEditingForKey, onStartedEditing]);

  // Note: we also listen to startEditingForKey via a separate effect handled in parent prop

  const doSave = async () => {
    if (!entry) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Try to coerce string inputs to proper type where possible
      let valueToSend: string | number | boolean = editValue as string | number | boolean;
      if (typeof entry.value === 'number' && typeof editValue === 'string') {
        const n = Number(editValue);
        valueToSend = isNaN(n) ? editValue : n;
      }
      if (typeof entry.value === 'boolean' && typeof editValue === 'string') {
        if (editValue === 'true') valueToSend = true;
        else if (editValue === 'false') valueToSend = false;
      }

      const res = await apiClient.put(`/platform-config/${entry.key}`, {
        value: valueToSend,
        description: editDescription
      });

      if (res?.data?.success) {
        const updated: ConfigEntry = { ...entry, value: res.data.data.value, description: res.data.data.description, updatedAt: res.data.data.updatedAt };
        setSaveSuccess('Paramètre sauvegardé');
        setIsEditing(false);
        if (onSave) onSave(updated);
        // auto-clear
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setSaveError('Erreur lors de la sauvegarde');
      }
    } catch (err) {
      // handle unknown error shape safely
      const msg = (err && typeof err === 'object' && 'message' in err) ? (err as Error).message : String(err);
      setSaveError(msg || 'Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const navigateTo = useAppStore((state) => state.navigateTo);
  return (
    <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-50 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ transitionProperty: 'transform, box-shadow' }}
    >
      <div className="flex items-center justify-between p-4 border-b bg-blue-50">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-lg">Détail du paramètre</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">×</button>
      </div>
      {entry ? (
        <div className="p-4 space-y-4">
          <div>
            <div className="font-semibold text-blue-900">{entry.key}</div>
            <div className="text-xs text-gray-500 mb-2">{entry.description}</div>
            <div className="flex items-center gap-2 text-sm">
              {!isEditing ? (
                <>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{String(entry.value)}</span>
                  <span className="text-gray-400">Type: {typeof entry.value}</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {typeof entry.value === 'boolean' ? (
                    <select className="border px-2 py-1 rounded" value={String(editValue)} onChange={e => setEditValue(e.target.value === 'true')}>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <input className="border px-2 py-1 rounded w-36" value={String(editValue)} onChange={e => {
                      const v = e.target.value;
                      // keep as string for now; doSave will coerce for number if needed
                      setEditValue(v);
                    }} />
                  )}
                  <span className="text-gray-400 text-xs">(édition activée)</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">Dernière modification: {new Date(entry.updatedAt).toLocaleString()}</div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1 flex items-center gap-1"><Clock className="w-4 h-4" /> Historique des modifications</div>
            <ul className="text-xs space-y-1">
              {historyLoading ? (
                <li className="text-gray-400">Chargement…</li>
              ) : realHistory.length === 0 ? (
                <li className="text-gray-400">Aucune modification récente</li>
              ) : (
                realHistory.map((h, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <span className="text-gray-500">{new Date(h.date).toLocaleString()}</span>
                    <span className="text-gray-700">{h.user}</span>
                    <span className="text-gray-400">{String(h.oldValue)} → <b>{String(h.newValue)}</b></span>
                  </li>
                ))
              )}
            </ul>
          </div>
          {/* Bloc Statistiques d'usage avec graphique et tableau */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold mb-1 flex items-center gap-1"><BarChart2 className="w-4 h-4" /> Statistiques d'usage</div>
              <div className="text-xs text-gray-400">Affichage synthétique — cliquer sur Enregistrer mettra à jour les stats</div>
            </div>
            <div className="mb-2">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={statsData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} tick={{ fill: '#64748b' }} />
                  <YAxis fontSize={10} tick={{ fill: '#64748b' }} width={30} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table className="w-full text-xs border rounded">
              <tbody>
                {usageStats.map((stat, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-1 px-2 text-gray-500 font-medium w-1/2">{stat.label}</td>
                    <td className="py-1 px-2 text-gray-900 font-bold">{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1 flex items-center gap-1"><LogOut className="w-4 h-4" /> Actions</div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">✏️ Modifier</button>
              ) : (
                <>
                  <button onClick={doSave} disabled={saving} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">💾 Enregistrer</button>
                  <button onClick={() => { setIsEditing(false); if (entry) { setEditValue(entry.value as string | number | boolean); setEditDescription(entry.description||''); } }} disabled={saving} className="bg-gray-200 px-3 py-1 rounded text-xs hover:bg-gray-300">Annuler</button>
                </>
              )}

              <button onClick={() => {
                // Reset to default placeholder behaviour – for demo we'll set to empty or false/0
                if (!entry) return;
                if (typeof entry.value === 'boolean') setEditValue(false);
                else if (typeof entry.value === 'number') setEditValue(0);
                else setEditValue('');
              }} className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200">Réinitialiser valeur</button>

              <button className="ml-2 bg-gray-100 px-3 py-1 rounded text-xs hover:bg-gray-200" onClick={() => { /* expand logs modal - can integrate later */ }}>Voir les logs</button>
            </div>
            {saveError && <div className="text-xs text-red-600 mt-2">Erreur: {saveError}</div>}
            {saveSuccess && <div className="text-xs text-green-600 mt-2">{saveSuccess}</div>}
          </div>
        </div>
      ) : <div className="p-4 text-gray-400">Aucune donnée</div>}
    </div>
  );
};
// ...

interface ConfigEntry {
  _id: string;
  key: string;
  value: string | number | boolean;
  description?: string;
  updatedAt: string;
}

const valueTypeIcon = (value: string | number | boolean) => {
  if (typeof value === 'boolean') return value ? <CheckCircle className="inline w-4 h-4 text-green-500" /> : <XCircle className="inline w-4 h-4 text-red-400" />;
  if (typeof value === 'number') return <span className="inline-block w-4 h-4 text-blue-500 font-bold">#</span>;
  return <span className="inline-block w-4 h-4 text-gray-400 font-bold">""</span>;
};

const AdminPlatformSettings: React.FC = () => {
  const navigateTo = useAppStore((state) => state.navigateTo);
  const [configs, setConfigs] = useState<ConfigEntry[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all'|'string'|'number'|'boolean'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Suppression des hooks d'édition inutilisés
  const [detailEntry, setDetailEntry] = useState<ConfigEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [startEditingEntryKey, setStartEditingEntryKey] = useState<string | null>(null);

  const fetchConfigs = () => {
    setLoading(true);
    setError(null);
    apiClient.get('/platform-config')
      .then(res => {
        setConfigs(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement de la configuration');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleConfigUpdated = (updated: ConfigEntry) => {
    setConfigs(cfgs => cfgs.map(c => c._id === updated._id ? updated : c));
    setDetailEntry(updated);
  };

  // Calcul des stats visibles
  const stats = React.useMemo(() => {
    const total = configs.length;
    const counts = { string: 0, number: 0, boolean: 0 } as Record<string, number>;
    let latest = '';
    const byDate: Record<string, number> = {};

    configs.forEach(c => {
      const t = typeof c.value;
      if (t === 'number') counts.number++;
      else if (t === 'boolean') counts.boolean++;
      else counts.string++;

      if (!latest || new Date(c.updatedAt) > new Date(latest)) latest = c.updatedAt;

      const d = new Date(c.updatedAt).toISOString().slice(0,10);
      byDate[d] = (byDate[d] || 0) + 1;
    });

    // Convert to sorted array for sparkline
    const spark = Object.entries(byDate).sort((a,b) => a[0].localeCompare(b[0])).map(([date, value]) => ({ date, value }));
    return { total, counts, latest, spark };
  }, [configs]);

  const filteredConfigs = React.useMemo(() => {
    return configs.filter(c => {
      if (typeFilter !== 'all' && typeof c.value !== typeFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return String(c.key).toLowerCase().includes(s) || String(c.description || '').toLowerCase().includes(s) || String(c.value).toLowerCase().includes(s);
    });
  }, [configs, search, typeFilter]);

  // Suppression de startEdit car non utilisé

  // Suppression de cancelEdit car non utilisé

  // Suppression de saveEdit car non utilisé dans la nouvelle UI

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header professionnel */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-lg mb-10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <img src="/logo192.png" alt="RestauConnect" className="w-14 h-14 rounded-full shadow border-2 border-white bg-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">Paramétrage plateforme avancé</h1>
            <p className="text-blue-100 text-base mt-1 font-medium">Gérez dynamiquement les paramètres techniques et business de la plateforme.<br/>Modifiez les valeurs en toute sécurité, chaque changement est journalisé.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('admin-dashboard')} className="px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-50 border border-blue-200 transition">← Retour</button>
          <button onClick={fetchConfigs} className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold shadow hover:bg-blue-800 border border-blue-900 transition">
            <RefreshCw className="w-5 h-5" /> Rafraîchir
          </button>
        </div>
      </header>

      {/* successMsg supprimé car non utilisé */}
      {error && <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded px-4 py-2"><XCircle className="w-5 h-5" /> {error}</div>}

      {/* Section d'intro et statistiques visibles */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Settings className="w-7 h-7 text-blue-700" />
          <h2 className="text-xl font-bold text-gray-800">Paramètres de la plateforme</h2>
          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{configs.length} paramètres</span>
        </div>
        <p className="text-gray-500 mb-4">Retrouvez ici tous les paramètres techniques et métiers. Cliquez sur un paramètre pour voir son historique, ses stats et ses actions avancées.</p>

        {/* KPI summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-stretch mb-6">
          <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between border">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 text-blue-700 p-2 rounded-lg"><Settings className="w-5 h-5" /></div>
              <div>
                <div className="text-sm text-gray-500">Total paramètres</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3">Dernière mise à jour : {stats.latest ? new Date(stats.latest).toLocaleString() : '—'}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between border">
            <div className="flex items-start gap-3">
              <div className="bg-green-50 text-green-700 p-2 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
              <div>
                <div className="text-sm text-gray-500">Numériques</div>
                <div className="text-2xl font-bold text-gray-900">{stats.counts.number}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3">Valeurs numériques actives</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between border">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-50 text-yellow-700 p-2 rounded-lg"><XCircle className="w-5 h-5" /></div>
              <div>
                <div className="text-sm text-gray-500">Booléens</div>
                <div className="text-2xl font-bold text-gray-900">{stats.counts.boolean}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3">Paramètres activables/désactivables</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between border">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg"><BarChart2 className="w-5 h-5" /></div>
              <div>
                <div className="text-sm text-gray-500">Activité</div>
                <div className="text-2xl font-bold text-gray-900">{stats.spark.length ? stats.spark.reduce((a,b)=>a+b.value,0) : 0}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3">Modifications récentes (aperçu)</div>
          </div>
        </div>

        {/* Small sparkline */}
        <div className="bg-white rounded-xl shadow p-3 mb-6 border flex items-center gap-4">
          <div className="w-full h-20">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={stats.spark.length ? stats.spark : [{ date: '—', value: 0 }] }>
                <XAxis dataKey="date" hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-40 text-right text-xs text-gray-500">Évolution des modifications (dernier mois)</div>
        </div>

        {/* Recherche et filtres */}
        <div className="flex items-center gap-3 mb-6">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher (clé, description, valeur)" className="flex-1 px-3 py-2 border rounded-lg" />
          <select value={typeFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setTypeFilter(e.target.value as 'all'|'string'|'number'|'boolean')} className="px-3 py-2 border rounded-lg">
            <option value="all">Tous types</option>
            <option value="string">Chaîne</option>
            <option value="number">Nombre</option>
            <option value="boolean">Booléen</option>
          </select>
          <button onClick={() => { setSearch(''); setTypeFilter('all'); }} className="px-3 py-2 bg-gray-100 rounded-lg">Réinitialiser</button>
        </div>
      </section>

      {/* Liste des paramètres dans une carte moderne */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-blue-600"><Loader2 className="animate-spin w-6 h-6 mr-2" /> Chargement...</div>
        ) : error ? (
          <div className="text-red-600 font-semibold">Erreur : {error}</div>
        ) : configs.length === 0 ? (
          <div className="text-gray-400 italic text-center py-8">Aucun paramètre trouvé.</div>
        ) : filteredConfigs.length === 0 ? (
          <div className="text-gray-400 italic text-center py-8">Aucun paramètre ne correspond à votre recherche/filtre.</div>
        ) : (
          <div className="divide-y divide-blue-50">
            {filteredConfigs.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between py-4 px-2 hover:bg-blue-50/60 rounded-lg transition cursor-pointer group"
                onClick={() => { setDetailEntry(entry); setDrawerOpen(true); }}
              >
                <div className="flex items-center gap-4">
                  <Settings className="w-6 h-6 text-blue-400 group-hover:text-blue-700 transition" />
                  <div>
                    <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
                      {entry.key}
                      {/* Badge critique si besoin */}
                      {/* {entry.critical && <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">Critique</span>} */}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{entry.description || 'Aucune description.'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold shadow-sm border border-blue-200">{String(entry.value)}</span>
                  <span className="ml-2">{valueTypeIcon(entry.value)}</span>
                  <button onClick={(e) => { e.stopPropagation(); setDetailEntry(entry); setDrawerOpen(true); setStartEditingEntryKey(entry._id); }} className="ml-3 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700">Modifier</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Drawer détails avancés */}
        <ConfigDetailDrawer entry={detailEntry} open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleConfigUpdated} startEditingForKey={startEditingEntryKey} onStartedEditing={() => setStartEditingEntryKey(null)} />
      </div>

      <div className="mt-8 flex items-start gap-3 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <Info className="w-6 h-6 text-blue-400 mt-1" />
        <div>
          <div className="font-semibold text-blue-900 mb-1">À propos de cette page</div>
          <ul className="text-blue-800 text-sm list-disc pl-5 space-y-1">
            <li>Chaque paramètre impacte le fonctionnement global de la plateforme.</li>
            <li>Les modifications sont prises en compte immédiatement.</li>
            <li>Utilisez le bouton <b>Rafraîchir</b> pour recharger les valeurs en temps réel.</li>
            <li>En cas d’erreur, contactez le support technique.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPlatformSettings;
