import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Download } from 'lucide-react';
import axios from 'axios';
import DocumentCard from './DocumentCard.tsx';
import DocumentQRCode from './DocumentQRCode.tsx';

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
  signatures: {
    sender?: { name: string; signature: string; date: string };
    driver?: { name: string; signature: string; date: string };
    recipient?: { name: string; signature: string; date: string };
  };
  qrCode: string;
  pdfUrl?: string;
  issueDate: string;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<TransportDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedQRCode, setSelectedQRCode] = useState<{ documentNumber: string; qrCode: string } | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowQRCode = (documentNumber: string, qrCode: string) => {
    setSelectedQRCode({ documentNumber, qrCode });
  };

  const handleDownloadPDF = async (documentId: string, documentNumber: string) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/transporteur-tms/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const doc = response.data.data;
      if (doc.pdfUrl) {
        window.open(doc.pdfUrl, '_blank');
      } else {
        alert('PDF non disponible pour ce document');
      }
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('Erreur lors du téléchargement du PDF');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.sender.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.recipient.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.documentType === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    inTransit: documents.filter(d => d.status === 'in_transit').length,
    delivered: documents.filter(d => d.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents de Transport</h2>
          <p className="text-gray-600 mt-1">CMR, lettres de voiture et bons de livraison</p>
        </div>
        <button
          onClick={() => alert('Formulaire création document à implémenter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Créer un document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total documents</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-yellow-700">En attente</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-blue-700">En transit</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inTransit}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-green-700">Livrés</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.delivered}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (numéro, expéditeur, destinataire)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="CMR">CMR</option>
            <option value="Lettre de voiture">Lettre de voiture</option>
            <option value="Bon de livraison">Bon de livraison</option>
            <option value="Manifeste">Manifeste</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_transit">En transit</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Liste des documents */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Aucun document trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              onShowQRCode={() => handleShowQRCode(document.documentNumber, document.qrCode)}
              onDownloadPDF={() => handleDownloadPDF(document._id, document.documentNumber)}
            />
          ))}
        </div>
      )}

      {/* Modal QR Code */}
      {selectedQRCode && (
        <DocumentQRCode
          documentNumber={selectedQRCode.documentNumber}
          qrCodeDataUrl={selectedQRCode.qrCode}
          onClose={() => setSelectedQRCode(null)}
        />
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Astuce:</strong> Chaque document CMR génère automatiquement un QR code unique 
          pour vérification lors des contrôles routiers. Les signatures électroniques sont horodatées.
        </p>
      </div>
    </div>
  );
};

export default DocumentsList;
