import React from 'react';
import { FileText, MapPin, Euro, Calendar, Edit, Eye, Download, Send, Trash2, Receipt } from 'lucide-react';
import { formatDate, getStatusBadge } from './quoteHelpers.tsx';

export interface Quote {
  id: string;
  title: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  validUntil: string;
  description: string;
  location: string;
  details: {
    laborCost: number;
    materialCost: number;
    travelCost: number;
    vat: number;
  };
}

interface QuoteListProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onPreview: (quote: Quote) => void;
  onDownload: (quote: Quote) => void;
  onSend: (quoteId: string) => void;
  onDelete: (quoteId: string) => void;
  onCreateInvoice: (quote: Quote) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  onEdit,
  onPreview,
  onDownload,
  onSend,
  onDelete,
  onCreateInvoice
}) => {
  return (
    <div className="grid gap-6">
      {quotes.map((quote) => (
        <div key={quote.id} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{quote.title}</h3>
                {getStatusBadge(quote.status)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {quote.location}
                </span>
                <span className="flex items-center">
                  <Euro className="w-4 h-4 mr-1" />
                  {quote.amount}€ TTC
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Créé le {formatDate(quote.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{quote.description}</p>
            </div>
          </div>
          {/* ... détails et boutons ... */}
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={() => onEdit(quote)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
              <Edit className="w-4 h-4" />
              <span>Éditer</span>
            </button>
            <button onClick={() => onPreview(quote)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </button>
            <button onClick={() => onDownload(quote)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            {quote.status === 'accepted' && (
              <button onClick={() => onCreateInvoice(quote)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                <Receipt className="w-4 h-4" />
                <span>Générer facture</span>
              </button>
            )}
            {quote.status === 'draft' && (
              <button onClick={() => onSend(quote.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                <Send className="w-4 h-4" />
                <span>Envoyer</span>
              </button>
            )}
            {quote.status === 'draft' && (
              <button onClick={() => onDelete(quote.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            )}
          </div>
        </div>
      ))}
      {quotes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devis créé</h3>
          <p className="text-gray-600 mb-4">Créez votre premier devis pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default QuoteList;
