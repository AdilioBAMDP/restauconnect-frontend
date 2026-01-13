import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Send, FileText } from 'lucide-react';
import { Invoice } from '../ArtisanQuotes';

interface InvoicePreviewModalProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
  onRemind?: () => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  onClose,
  onDownload,
  onRemind
}) => {
  const calculateSubtotal = () => {
    return invoice.details.laborCost + invoice.details.materialCost + invoice.details.travelCost;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = () => {
    switch (invoice.status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (invoice.status) {
      case 'paid':
        return 'PAYÉE';
      case 'pending':
        return 'EN ATTENTE';
      case 'overdue':
        return 'EN RETARD';
      default:
        return String(invoice.status).toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Aperçu de la Facture</h2>
              <p className="text-sm text-gray-600">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content - Format Facture Professionnel */}
        <div className="p-8 bg-gray-50">
          <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-3xl mx-auto shadow-sm">
            {/* En-tête entreprise */}
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">FACTURE</h1>
                <p className="text-gray-600 font-semibold">N° {invoice.invoiceNumber}</p>
                <p className="text-gray-600">Date: {formatDate(invoice.createdAt)}</p>
                <p className="text-gray-600">Échéance: {formatDate(invoice.dueDate)}</p>
                {invoice.paidAt && (
                  <p className="text-green-600 font-semibold">Payée le: {formatDate(invoice.paidAt)}</p>
                )}
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              <div className="text-right">
                <h2 className="font-bold text-lg text-gray-900">Votre Entreprise</h2>
                <p className="text-gray-600">123 Rue de l'Artisan</p>
                <p className="text-gray-600">75001 Paris</p>
                <p className="text-gray-600">Tél: 01 23 45 67 89</p>
                <p className="text-gray-600">Email: contact@artisan.fr</p>
                <p className="text-gray-600 mt-2">SIRET: 123 456 789 00012</p>
                <p className="text-gray-600">TVA: FR 12 345 678 901</p>
              </div>
            </div>

            {/* Informations client */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Facturé à</h3>
              <p className="font-medium text-gray-900">{invoice.client}</p>
              <p className="text-gray-600">{invoice.clientEmail}</p>
              <p className="text-gray-600">{invoice.location}</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Objet de la facture</h3>
              <p className="text-gray-700">{invoice.description}</p>
            </div>

            {/* Détail des prestations */}
            <table className="w-full mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-900">Désignation</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Montant HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3 text-gray-700">Main d'œuvre</td>
                  <td className="p-3 text-right text-gray-900">{invoice.details.laborCost.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-700">Matériaux et fournitures</td>
                  <td className="p-3 text-right text-gray-900">{invoice.details.materialCost.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-700">Frais de déplacement</td>
                  <td className="p-3 text-right text-gray-900">{invoice.details.travelCost.toFixed(2)}€</td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-gray-300">
                <tr className="bg-gray-50">
                  <td className="p-3 font-semibold text-gray-900">Total HT</td>
                  <td className="p-3 text-right font-semibold text-gray-900">{calculateSubtotal().toFixed(2)}€</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-gray-700">TVA (20%)</td>
                  <td className="p-3 text-right text-gray-900">{invoice.details.vat.toFixed(2)}€</td>
                </tr>
                <tr className="bg-green-600 text-white">
                  <td className="p-3 font-bold text-lg">Montant Total TTC</td>
                  <td className="p-3 text-right font-bold text-lg">{invoice.amount.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>

            {/* Informations de paiement */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-3">Modalités de paiement</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
                <p><strong>Mode de paiement :</strong> Virement bancaire</p>
                <p><strong>IBAN :</strong> FR76 1234 5678 9012 3456 7890 123</p>
                <p><strong>BIC :</strong> BNPAFRPPXXX</p>
                <p><strong>Échéance de paiement :</strong> {formatDate(invoice.dueDate)}</p>
                <p className="text-xs text-gray-600 mt-4">
                  En cas de retard de paiement, des pénalités de 3 fois le taux d'intérêt légal seront appliquées,
                  ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40€ (Article L441-6 du Code de Commerce).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Fermer
          </button>
          
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </button>

          {onRemind && invoice.status === 'pending' && (
            <button
              onClick={onRemind}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer rappel
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InvoicePreviewModal;
