import React from 'react';
import { Receipt, MapPin, Euro, Calendar, Eye, Download, Send } from 'lucide-react';
import { formatDate, getStatusBadge } from './quoteHelpers.tsx';

export interface Invoice {
  id: string;
  quoteId: string;
  invoiceNumber: string;
  title: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  description: string;
  location: string;
  details: {
    laborCost: number;
    materialCost: number;
    travelCost: number;
    vat: number;
  };
}

interface InvoiceListProps {
  invoices: Invoice[];
  onPreview: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onRemind: (invoice: Invoice) => void;
  onMarkPaid: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onPreview,
  onDownload,
  onRemind,
  onMarkPaid
}) => {
  return (
    <div className="grid gap-6">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{invoice.title}</h3>
                {getStatusBadge(invoice.status)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center font-medium">
                  <Receipt className="w-4 h-4 mr-1" />
                  {invoice.invoiceNumber}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {invoice.location}
                </span>
                <span className="flex items-center">
                  <Euro className="w-4 h-4 mr-1" />
                  {invoice.amount}€ TTC
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {invoice.status === 'paid' && invoice.paidAt ? `Payée le ${formatDate(invoice.paidAt)}` : `Échéance ${formatDate(invoice.dueDate)}`}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{invoice.description}</p>
            </div>
          </div>
          {/* ... détails et boutons ... */}
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={() => onPreview(invoice)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </button>
            <button onClick={() => onDownload(invoice)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button onClick={() => onRemind(invoice)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1">
              <Send className="w-4 h-4" />
              <span>Relancer</span>
            </button>
            {invoice.status === 'pending' && (
              <button onClick={() => onMarkPaid(invoice)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                <Euro className="w-4 h-4" />
                <span>Marquer payée</span>
              </button>
            )}
          </div>
        </div>
      ))}
      {invoices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture créée</h3>
          <p className="text-gray-600 mb-4">Les factures sont générées automatiquement à partir des devis acceptés</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
