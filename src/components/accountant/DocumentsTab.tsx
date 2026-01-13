import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, FileText, Eye, Download } from 'lucide-react';

interface MockDocument {
  _id: string;
  clientId: string;
  clientName: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsTabProps {
  documents: MockDocument[];
  searchTerm: string;
  documentFilter: string;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: string) => void;
  onCreateDocument: () => void;
  onRefresh: () => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = memo(({
  documents,
  searchTerm,
  documentFilter,
  onSearchChange,
  onFilterChange,
  onCreateDocument,
  onRefresh,
  getStatusColor,
  getPriorityColor,
  formatDate
}) => {
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = documentFilter === 'all' || doc.status === documentFilter;
      return matchesSearch && matchesFilter;
    });
  }, [documents, searchTerm, documentFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Gestion des documents</h2>
          <button
            onClick={onCreateDocument}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={documentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="overdue">En retard</option>
          </select>

          <button
            onClick={onRefresh}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDocuments.map((document) => (
          <motion.div
            key={document._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {document.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                    {document.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(document.priority)}`}>
                    {document.priority}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">
                  <strong>Type:</strong> {document.type} • <strong>Client:</strong> {document.clientName}
                </p>
                
                <p className="text-gray-600 mb-2">
                  {document.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Créé le {formatDate(document.createdAt)}</span>
                  {document.dueDate && (
                    <span>Échéance le {formatDate(document.dueDate)}</span>
                  )}
                </div>
              </div>
              
              <div className="ml-6 flex space-x-2">
                <button className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </button>
                <button className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

DocumentsTab.displayName = 'DocumentsTab';

export default DocumentsTab;
