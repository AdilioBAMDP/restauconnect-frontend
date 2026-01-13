import React, { memo, useMemo } from 'react';
import { Mail, Plus } from 'lucide-react';
import { AccountingClient } from '@/services/financialServices';

interface MockDocument {
  _id: string;
  clientId: string;
  type: string;
  title: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

interface ClientDetailModalProps {
  isOpen: boolean;
  client: AccountingClient | null;
  documents: MockDocument[];
  onClose: () => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

const ClientDetailModal: React.FC<ClientDetailModalProps> = memo(({
  isOpen,
  client,
  documents,
  onClose,
  getStatusColor,
  formatDate
}) => {
  const clientDocuments = useMemo(() => {
    if (!client) return [];
    return documents
      .filter(doc => doc.clientId === client._id)
      .slice(0, 5);
  }, [client, documents]);

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Détails du client
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Informations générales</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium">{client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{client.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="font-medium">{client.phone || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entreprise:</span>
                  <span className="font-medium">{client.company || 'Particulier'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Activité</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium">{client.documentsCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière activité:</span>
                  <span className="font-medium">{formatDate(client.lastActivity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client depuis:</span>
                  <span className="font-medium">{formatDate(client.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Documents récents</h4>
              <div className="space-y-2">
                {clientDocuments.map(doc => (
                  <div key={doc._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {formatDate(doc.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                Contacter
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ClientDetailModal.displayName = 'ClientDetailModal';

export default ClientDetailModal;
