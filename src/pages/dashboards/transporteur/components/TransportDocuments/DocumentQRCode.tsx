import React from 'react';
import { X, Download, Printer } from 'lucide-react';

interface DocumentQRCodeProps {
  documentNumber?: string;
  qrCodeDataUrl?: string;
  document?: {
    _id: string;
    documentNumber: string;
    documentType: string;
  };
  onClose: () => void;
}

const DocumentQRCode: React.FC<DocumentQRCodeProps> = ({ document: doc, documentNumber, qrCodeDataUrl, onClose }) => {
  const docNumber = documentNumber || doc?.documentNumber || 'N/A';
  const qrData = qrCodeDataUrl || JSON.stringify({
    id: doc._id,
    number: doc.documentNumber,
    type: doc.documentType,
    timestamp: new Date().toISOString()
  });

  const handleDownload = () => {
    const svg = window.document.querySelector('#qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = window.document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = window.document.createElement('a');
      downloadLink.download = `QR_${doc.documentNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">QR Code - {doc.documentNumber}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex justify-center mb-6 p-8 bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="mb-2">QR Code:</p>
            <pre className="text-xs bg-white p-4 rounded border max-h-40 overflow-auto">
              {qrData}
            </pre>
          </div>
        </div>

        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <p><strong>Document:</strong> {doc.documentNumber}</p>
          <p><strong>Type:</strong> {doc.documentType}</p>
          <p className="text-xs text-gray-500">Scannez ce code pour accéder aux détails du document</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Télécharger
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <Printer size={18} />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentQRCode;
