import React, { useState } from 'react';
import { FileDown, Table, FileText, BarChart3, DollarSign } from 'lucide-react';

const exportOptions = [
  {
    type: 'users',
    title: 'Utilisateurs',
    description: 'Export des comptes utilisateurs',
    icon: <Table className="w-5 h-5" />, 
    color: 'bg-blue-100 text-blue-600'
  },
  {
    type: 'transactions',
    title: 'Transactions',
    description: 'Export des transactions',
    icon: <DollarSign className="w-5 h-5" />, 
    color: 'bg-green-100 text-green-600'
  },
  {
    type: 'analytics',
    title: 'Analytics',
    description: 'Export des statistiques',
    icon: <BarChart3 className="w-5 h-5" />, 
    color: 'bg-purple-100 text-purple-600'
  }
];

const AdminExport = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async ({ type, format, filename }: { type: string; format: string; filename: string }) => {
    setIsExporting(true);
    // TODO: Adapter l'URL selon l'API backend
    const url = `/api/export/${type}?format=${format}`;
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${filename}.${format}`;
    link.click();
    setIsExporting(false);
  };

  return (
    <div className="relative">
      {/* Bouton d'export */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        disabled={isExporting}
      >
        <FileDown className="w-4 h-4 mr-2" />
        {isExporting ? 'Export...' : 'Export Données'}
      </button>

      {/* Panel d'export */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Exporter les Données</h3>
            <p className="text-sm text-gray-600 mt-1">Choisissez le type de données et le format</p>
          </div>

          <div className="p-4 space-y-4">
            {exportOptions.map((option) => (
              <div key={option.type} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${option.color}`}>
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{option.title}</h4>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData({
                      type: option.type,
                      format: 'csv',
                      filename: `restauconnect_${option.type}_${new Date().toISOString().split('T')[0]}`
                    })}
                    className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center"
                    disabled={isExporting}
                  >
                    <Table className="w-3 h-3 mr-1" />
                    CSV
                  </button>
                  <button
                    onClick={() => exportData({
                      type: option.type,
                      format: 'excel',
                      filename: `restauconnect_${option.type}_${new Date().toISOString().split('T')[0]}`
                    })}
                    className="flex-1 px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center justify-center"
                    disabled={isExporting}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Excel
                  </button>
                  <button
                    onClick={() => exportData({
                      type: option.type,
                      format: 'pdf',
                      filename: `restauconnect_${option.type}_${new Date().toISOString().split('T')[0]}`
                    })}
                    className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center justify-center"
                    disabled={isExporting}
                  >
                    <FileDown className="w-3 h-3 mr-1" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setShowPanel(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExport;
