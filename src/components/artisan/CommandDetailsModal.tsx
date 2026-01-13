import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, FileText, Printer, CheckCircle, Edit } from 'lucide-react';
import { Command } from '@/types/artisan';

interface CommandDetailsModalProps {
  command: Command;
  onClose: () => void;
  onModify: (command: Command) => void;
  onValidate: (command: Command) => void;
  onPrint: (command: Command) => void;
}

const CommandDetailsModal: React.FC<CommandDetailsModalProps> = ({
  command,
  onClose,
  onModify,
  onValidate,
  onPrint
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Détails de la commande</h2>
            <p className="text-gray-600 mt-1">{command.numero}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Statut et Urgence */}
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              command.status === 'devis' ? 'bg-yellow-100 text-yellow-800' :
              command.status === 'confirme' ? 'bg-blue-100 text-blue-800' :
              command.status === 'en_cours' ? 'bg-green-100 text-green-800' :
              command.status === 'termine' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {command.status.replace('_', ' ').toUpperCase()}
            </span>
            {command.urgence !== 'normale' && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                command.urgence === 'critique' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
              }`}>
                {command.urgence.toUpperCase()}
              </span>
            )}
          </div>

          {/* Informations client */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nom du client</p>
                  <p className="font-medium text-gray-900">{command.clientName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-medium text-gray-900">{command.clientAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date d'intervention */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Date d'intervention prévue</p>
              <p className="font-semibold text-gray-900">
                {command.dateIntervention 
                  ? new Date(command.dateIntervention).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'À planifier'}
              </p>
            </div>
          </div>

          {/* Détails de l'intervention */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails de l'intervention</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant HT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {command.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-center">{item.quantite}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        {item.totalHT.toLocaleString()}€ HT
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      Total TTC
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      {command.totalTTC.toLocaleString()}€
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Barre de progression */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Progression</p>
              <p className="text-sm font-semibold text-gray-900">
                {command.status === 'devis' ? '25%' :
                 command.status === 'confirme' ? '50%' :
                 command.status === 'en_cours' ? '75%' : '100%'}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  command.status === 'devis' ? 'bg-yellow-400 w-1/4' :
                  command.status === 'confirme' ? 'bg-blue-400 w-1/2' :
                  command.status === 'en_cours' ? 'bg-green-400 w-3/4' :
                  'bg-gray-400 w-full'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Fermer
          </button>
          
          <button
            onClick={() => onPrint(command)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center transition-colors"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>

          <button
            onClick={() => onModify(command)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </button>

          {command.status !== 'termine' && (
            <button
              onClick={() => onValidate(command)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider l'étape
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommandDetailsModal;
