import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Send, FileText } from 'lucide-react';
import { Quote } from '../ArtisanQuotes';

interface QuotePreviewModalProps {
  quote: Quote;
  onClose: () => void;
  onDownload: () => void;
  onSend?: () => void;
}

const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({
  quote,
  onClose,
  onDownload,
  onSend
}) => {
  const calculateSubtotal = () => {
    return quote.details.laborCost + quote.details.materialCost + quote.details.travelCost;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Aperçu du Devis</h2>
              <p className="text-sm text-gray-600">{quote.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content - Format Devis Professionnel */}
        <div className="p-8 bg-gray-50">
          <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-3xl mx-auto shadow-sm">
            {/* En-tête entreprise */}
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">DEVIS</h1>
                <p className="text-gray-600">Numéro: DEV-{quote.id.toUpperCase()}</p>
                <p className="text-gray-600">Date: {formatDate(quote.createdAt)}</p>
                <p className="text-gray-600">Valide jusqu'au: {formatDate(quote.validUntil)}</p>
              </div>
              <div className="text-right">
                <h2 className="font-bold text-lg text-gray-900">Votre Entreprise</h2>
                <p className="text-gray-600">123 Rue de l'Artisan</p>
                <p className="text-gray-600">75001 Paris</p>
                <p className="text-gray-600">Tél: 01 23 45 67 89</p>
                <p className="text-gray-600">Email: contact@artisan.fr</p>
                <p className="text-gray-600 mt-2">SIRET: 123 456 789 00012</p>
              </div>
            </div>

            {/* Informations client */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
              <p className="font-medium text-gray-900">{quote.client}</p>
              <p className="text-gray-600">{quote.clientEmail}</p>
              <p className="text-gray-600">{quote.location}</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description des travaux</h3>
              <p className="text-gray-700">{quote.description}</p>
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
                  <td className="p-3 text-right text-gray-900">{quote.details.laborCost.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-700">Matériaux et fournitures</td>
                  <td className="p-3 text-right text-gray-900">{quote.details.materialCost.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-700">Frais de déplacement</td>
                  <td className="p-3 text-right text-gray-900">{quote.details.travelCost.toFixed(2)}€</td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-gray-300">
                <tr className="bg-gray-50">
                  <td className="p-3 font-semibold text-gray-900">Total HT</td>
                  <td className="p-3 text-right font-semibold text-gray-900">{calculateSubtotal().toFixed(2)}€</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-gray-700">TVA (20%)</td>
                  <td className="p-3 text-right text-gray-900">{quote.details.vat.toFixed(2)}€</td>
                </tr>
                <tr className="bg-blue-600 text-white">
                  <td className="p-3 font-bold text-lg">Total TTC</td>
                  <td className="p-3 text-right font-bold text-lg">{quote.amount.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>

            {/* Conditions */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-sm text-gray-600 space-y-2">
              <p><strong>Validité du devis :</strong> 30 jours à compter de la date d'émission</p>
              <p><strong>Conditions de paiement :</strong> 30% d'acompte à la commande, solde à la fin des travaux</p>
              <p><strong>Délai d'exécution :</strong> À définir selon planning</p>
              <p className="mt-4"><strong>Signature du client (précédée de la mention "Bon pour accord") :</strong></p>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </button>

          {onSend && (
            <button
              onClick={onSend}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer au client
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuotePreviewModal;
