import React from 'react';
import { FileText, Download, Eye, QrCode, Printer } from 'lucide-react';

interface TransportDocument {
  _id: string;
  documentNumber: string;
  documentType: 'CMR' | 'Lettre de voiture' | 'Bon de livraison' | 'Manifeste';
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  sender: {
    companyName: string;
    address: string;
    contact: string;
  };
  recipient: {
    companyName: string;
    address: string;
    contact: string;
  };
  cargo: {
    description: string;
    quantity: number;
    weight: number;
    volume: number;
  };
  vehicle?: {
    registrationNumber: string;
    type: string;
  };
  signatures?: {
    sender?: { name: string; signature: string; date: string };
    driver?: { name: string; signature: string; date: string };
    recipient?: { name: string; signature: string; date: string };
  };
  createdAt?: string;
  updatedAt?: string;
}

interface DocumentCardProps {
  document: TransportDocument;
  onView?: (doc: TransportDocument) => void;
  onShowQRCode?: (doc: TransportDocument) => void;
  onDownloadPDF?: () => void | Promise<void>;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onView, onShowQRCode }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return type;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold">{document.documentNumber}</h3>
          </div>
          <p className="text-sm text-gray-600">{getDocumentTypeLabel(document.documentType)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
          {getStatusLabel(document.status)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Expéditeur</p>
          <p className="text-sm font-medium">{document.sender.companyName}</p>
          <p className="text-xs text-gray-600">{document.sender.address}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Destinataire</p>
          <p className="text-sm font-medium">{document.recipient.companyName}</p>
          <p className="text-xs text-gray-600">{document.recipient.address}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Marchandise</p>
          <p className="text-sm">{document.cargo.description}</p>
          <div className="flex gap-4 mt-1 text-xs text-gray-600">
            <span>Qté: {document.cargo.quantity}</span>
            <span>Poids: {document.cargo.weight} kg</span>
            <span>Volume: {document.cargo.volume} m³</span>
          </div>
        </div>

        {document.vehicle && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Véhicule</p>
            <p className="text-sm">{document.vehicle.registrationNumber} - {document.vehicle.type}</p>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 mb-1">Signatures</p>
          <div className="flex gap-3 text-xs">
            <span className={document.signatures.sender ? 'text-green-600' : 'text-gray-400'}>
              ✓ Expéditeur
            </span>
            <span className={document.signatures.driver ? 'text-green-600' : 'text-gray-400'}>
              ✓ Chauffeur
            </span>
            <span className={document.signatures.recipient ? 'text-green-600' : 'text-gray-400'}>
              ✓ Destinataire
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={() => onView?.(document)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          <Eye size={16} />
          Voir
        </button>
        <button
          onClick={() => onShowQRCode?.(document)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
        >
          <QrCode size={16} />
        </button>
        <button
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
        >
          <Download size={16} />
        </button>
        <button
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
        >
          <Printer size={16} />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
