import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  FunnelIcon,
  BellIcon
} from '@heroicons/react/24/solid';
import moment from 'moment';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  total: number;
  pdfUrl?: string;
  items: Array<{
    description: string;
    distance: number;
    basePrice: number;
    extraCharges?: Array<{ name: string; amount: number }>;
    total: number;
  }>;
}

interface InvoiceStats {
  totalIssued: number;
  totalPaid: number;
  totalOverdue: number;
  totalRevenue: number;
  paidRevenue: number;
  outstandingRevenue: number;
  averagePaymentDelay: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token dynamiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMonthlyGenModal, setShowMonthlyGenModal] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const response = await api.get('/transporteur-tms/invoices', { params });
      if (response.data.success) {
        setInvoices(response.data.invoices);
      }
    } catch {
      toast.error('Erreur chargement factures');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  const loadStats = useCallback(async () => {
    try {
      const response = await api.get('/transporteur-tms/invoices/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch {
      // Erreur silencieuse
    }
  }, []);

  useEffect(() => {
    loadInvoices();
    loadStats();
  }, [loadInvoices, loadStats]);

  const handleGeneratePDF = async (invoiceId: string) => {
    try {
      const response = await api.post(`/transporteur-tms/invoices/${invoiceId}/generate-pdf`);
      if (response.data.success) {
        toast.success('PDF généré avec succès');
        window.open(response.data.pdfUrl, '_blank');
        loadInvoices();
      }
    } catch {
      toast.error('Erreur génération PDF');
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      const response = await api.put(`/transporteur-tms/invoices/${invoiceId}/mark-paid`, {
        paymentMethod: 'transfer',
        paidDate: new Date()
      });
      if (response.data.success) {
        toast.success('Facture marquée comme payée');
        loadInvoices();
        loadStats();
      }
    } catch {
      toast.error('Erreur mise à jour facture');
    }
  };

  const handleSendReminders = async () => {
    try {
      const response = await api.post('/transporteur-tms/invoices/send-reminders');
      if (response.data.success) {
        toast.success(`${response.data.message}`);
      }
    } catch {
      toast.error('Erreur envoi relances');
    }
  };

  const handleGenerateMonthly = async (month: number, year: number) => {
    try {
      const response = await api.post('/transporteur-tms/invoices/generate-monthly', {
        month,
        year
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowMonthlyGenModal(false);
        loadInvoices();
        loadStats();
      }
    } catch {
      toast.error('Erreur génération factures mensuelles');
    }
  };

  const handleExportAccounting = async () => {
    try {
      const now = new Date();
      const response = await api.get('/transporteur-tms/export/accounting', {
        params: {
          month: now.getMonth() + 1,
          year: now.getFullYear()
        }
      });
      if (response.data.success) {
        toast.success('Export comptable généré');
        window.open(response.data.fileUrl, '_blank');
      }
    } catch {
      toast.error('Erreur export comptable');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Brouillon', icon: DocumentTextIcon },
      sent: { color: 'bg-blue-100 text-blue-800', label: 'Envoyée', icon: CheckCircleIcon },
      paid: { color: 'bg-green-100 text-green-800', label: 'Payée', icon: CheckCircleIcon },
      overdue: { color: 'bg-red-100 text-red-800', label: 'En retard', icon: ClockIcon },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Annulée', icon: XCircleIcon }
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Facturation</h2>
              <p className="text-sm text-gray-500">Gestion des factures et paiements</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSendReminders}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <BellIcon className="h-5 w-5" />
              <span>Relances</span>
            </button>
            <button
              onClick={() => setShowMonthlyGenModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Génération mensuelle</span>
            </button>
            <button
              onClick={handleExportAccounting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total émises</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalIssued}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Payées</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalPaid}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">En retard</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalOverdue}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">CA total</p>
              <p className="text-xl font-bold text-purple-600">{stats.totalRevenue.toFixed(2)}€</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Encaissé</p>
              <p className="text-xl font-bold text-emerald-600">{stats.paidRevenue.toFixed(2)}€</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">En attente</p>
              <p className="text-xl font-bold text-amber-600">{stats.outstandingRevenue.toFixed(2)}€</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Délai moyen</p>
              <p className="text-xl font-bold text-indigo-600">{stats.averagePaymentDelay}j</p>
            </div>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Toutes' :
                 status === 'draft' ? 'Brouillons' :
                 status === 'sent' ? 'Envoyées' :
                 status === 'paid' ? 'Payées' :
                 'En retard'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-500 mt-4">Chargement...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune facture trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Facture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date émission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900">{invoice.clientName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {moment(invoice.issueDate).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {moment(invoice.dueDate).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">{invoice.total.toFixed(2)}€</p>
                      <p className="text-xs text-gray-500">HT: {invoice.subtotal.toFixed(2)}€</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        
                        {(invoice.status === 'draft' || invoice.status === 'sent') && (
                          <button
                            onClick={() => handleGeneratePDF(invoice._id)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Générer PDF"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                        )}

                        {invoice.pdfUrl && (
                          <a
                            href={invoice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                            title="Télécharger PDF"
                          >
                            <DocumentTextIcon className="h-5 w-5" />
                          </a>
                        )}

                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button
                            onClick={() => handleMarkPaid(invoice._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Marquer payée"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal génération mensuelle */}
      {showMonthlyGenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Génération factures mensuelles
            </h3>
            <p className="text-gray-600 mb-6">
              Générer automatiquement les factures pour toutes les livraisons du mois sélectionné.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mois
                </label>
                <select
                  id="month-select"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  defaultValue={new Date().getMonth() + 1}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {moment().month(i).format('MMMM')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année
                </label>
                <select
                  id="year-select"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  defaultValue={new Date().getFullYear()}
                >
                  {Array.from({ length: 3 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMonthlyGenModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const month = parseInt((document.getElementById('month-select') as HTMLSelectElement).value);
                  const year = parseInt((document.getElementById('year-select') as HTMLSelectElement).value);
                  handleGenerateMonthly(month, year);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Générer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails facture */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 my-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Facture {selectedInvoice.invoiceNumber}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-semibold text-gray-900">{selectedInvoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date émission</p>
                  <p className="text-gray-900">{moment(selectedInvoice.issueDate).format('DD/MM/YYYY')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date échéance</p>
                  <p className="text-gray-900">{moment(selectedInvoice.dueDate).format('DD/MM/YYYY')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Détails</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Distance</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Prix base</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{item.distance} km</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{item.basePrice.toFixed(2)}€</td>
                          <td className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">{item.total.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total HT</span>
                    <span className="font-medium">{selectedInvoice.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (20%)</span>
                    <span className="font-medium">{selectedInvoice.taxAmount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total TTC</span>
                    <span>{selectedInvoice.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
