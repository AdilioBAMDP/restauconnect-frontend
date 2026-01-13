import React, { useState } from 'react';
import { FileText, Download, Printer, ZoomIn, ZoomOut, X } from 'lucide-react';

interface DocumentViewerProps {
  documentId: string;
  documentTitle: string;
  documentType: 'CMR' | 'invoice' | 'contract' | 'certificate';
  documentUrl?: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  documentTitle,
  documentType,
  documentUrl,
  onClose
}) => {
  const [zoom, setZoom] = useState(100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${documentTitle}.pdf`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-900">{documentTitle}</h3>
              <p className="text-sm text-gray-500">Type: {documentType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Barre d'outils */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom avant"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Visualisateur de document */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div 
            className="bg-white shadow-lg mx-auto"
            style={{ 
              width: `${zoom}%`,
              minHeight: '100%'
            }}
          >
            {documentUrl ? (
              <iframe
                src={documentUrl}
                className="w-full h-full min-h-[800px]"
                title={documentTitle}
              />
            ) : (
              <div className="p-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    Aperçu du document CMR
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">
                    Document ID: {documentId}
                  </p>
                  
                  {/* Simulation de contenu CMR */}
                  <div className="text-left bg-gray-50 p-6 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-4 text-center">
                      CONVENTION RELATIVE AU CONTRAT DE TRANSPORT INTERNATIONAL DE MARCHANDISES PAR ROUTE (CMR)
                    </h5>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500">EXPÉDITEUR</p>
                          <p className="text-sm text-gray-900">Nom et adresse complète</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500">DESTINATAIRE</p>
                          <p className="text-sm text-gray-900">Nom et adresse complète</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-semibold text-gray-500">LIEU ET DATE DE PRISE EN CHARGE</p>
                        <p className="text-sm text-gray-900">Paris, {new Date().toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-semibold text-gray-500">MARCHANDISES</p>
                        <table className="w-full text-sm border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border border-gray-300 p-2">Désignation</th>
                              <th className="border border-gray-300 p-2">Poids</th>
                              <th className="border border-gray-300 p-2">Volume</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 p-2">Produits alimentaires</td>
                              <td className="border border-gray-300 p-2">1200 kg</td>
                              <td className="border border-gray-300 p-2">8 m³</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-300">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-500 mb-2">SIGNATURE EXPÉDITEUR</p>
                          <div className="h-16 border border-gray-300 rounded"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-500 mb-2">SIGNATURE TRANSPORTEUR</p>
                          <div className="h-16 border border-gray-300 rounded"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-500 mb-2">SIGNATURE DESTINATAIRE</p>
                          <div className="h-16 border border-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
