import React, { memo } from 'react';
import { AccountingClient } from '@/services/financialServices';

interface NewDocument {
  clientId: string;
  type: 'bilan' | 'compte-resultat' | 'tva-declaration' | 'paie' | 'fiscale' | 'autre';
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface CreateDocumentModalProps {
  isOpen: boolean;
  clients: AccountingClient[];
  newDocument: NewDocument;
  onClose: () => void;
  onChange: (document: NewDocument) => void;
  onSubmit: () => void;
}

const CreateDocumentModal: React.FC<CreateDocumentModalProps> = memo(({
  isOpen,
  clients,
  newDocument,
  onClose,
  onChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Créer un nouveau document comptable
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <select
              value={newDocument.clientId}
              onChange={(e) => onChange({...newDocument, clientId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de document
            </label>
            <select
              value={newDocument.type}
              onChange={(e) => onChange({...newDocument, type: e.target.value as NewDocument['type']})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bilan">Bilan comptable</option>
              <option value="compte-resultat">Compte de résultat</option>
              <option value="tva-declaration">Déclaration TVA</option>
              <option value="paie">Bulletins de paie</option>
              <option value="fiscale">Déclaration fiscale</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du document
            </label>
            <input
              type="text"
              value={newDocument.title}
              onChange={(e) => onChange({...newDocument, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Bilan 2024 - Restaurant ABC"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newDocument.description}
              onChange={(e) => onChange({...newDocument, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description du document ou instructions spécifiques..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance
              </label>
              <input
                type="date"
                value={newDocument.dueDate}
                onChange={(e) => onChange({...newDocument, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={newDocument.priority}
                onChange={(e) => onChange({...newDocument, priority: e.target.value as NewDocument['priority']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={!newDocument.clientId || !newDocument.title.trim()}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
          >
            Créer le document
          </button>
        </div>
      </div>
    </div>
  );
});

CreateDocumentModal.displayName = 'CreateDocumentModal';

export default CreateDocumentModal;
