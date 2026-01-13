import React, { useState } from 'react';
import { FileText, Plus, Upload, Download, Eye, Trash2 } from 'lucide-react';

interface Document {
  _id: string;
  title: string;
  type: 'CMR' | 'invoice' | 'contract' | 'certificate';
  uploadedAt: string;
  status: 'pending' | 'validated' | 'rejected';
  size: number;
}

const DocumentForm: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'CMR' as 'CMR' | 'invoice' | 'contract' | 'certificate',
    file: null as File | null
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument({ ...newDocument, file: e.target.files[0] });
    }
  };

  const handleUpload = async () => {
    if (!newDocument.file || !newDocument.title) return;

    const mockDoc: Document = {
      _id: Date.now().toString(),
      title: newDocument.title,
      type: newDocument.type,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      size: newDocument.file.size
    };

    setDocuments([mockDoc, ...documents]);
    setNewDocument({ title: '', type: 'CMR', file: null });
    setShowUploadForm(false);
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      CMR: { color: 'bg-blue-100 text-blue-700', label: 'CMR' },
      invoice: { color: 'bg-green-100 text-green-700', label: 'Facture' },
      contract: { color: 'bg-purple-100 text-purple-700', label: 'Contrat' },
      certificate: { color: 'bg-orange-100 text-orange-700', label: 'Certificat' }
    };
    return badges[type] || badges.CMR;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente', icon: '⏳' },
      validated: { color: 'bg-green-100 text-green-700', label: 'Validé', icon: '✅' },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Rejeté', icon: '❌' }
    };
    return badges[status] || badges.pending;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Gestion des Documents</h3>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nouveau document
        </button>
      </div>

      {/* Formulaire d'upload */}
      {showUploadForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
          <h4 className="font-semibold text-gray-900 mb-4">Téléverser un document</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: CMR-2025-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
              <select
                value={newDocument.type}
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="CMR">CMR</option>
                <option value="invoice">Facture</option>
                <option value="contract">Contrat</option>
                <option value="certificate">Certificat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {newDocument.file ? newDocument.file.name : 'Cliquez pour sélectionner un fichier'}
                    </p>
                    {newDocument.file && (
                      <p className="text-xs text-gray-500 mt-1">{formatFileSize(newDocument.file.size)}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!newDocument.file || !newDocument.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Téléverser
              </button>
              <button
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des documents */}
      {documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucun document téléversé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const typeBadge = getTypeBadge(doc.type);
            const statusBadge = getStatusBadge(doc.status);

            return (
              <div key={doc._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeBadge.color}`}>
                        {typeBadge.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon} {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</span>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Télécharger">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentForm;
