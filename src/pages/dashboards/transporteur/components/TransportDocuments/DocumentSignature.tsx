import React, { useRef, useState } from 'react';
import { PenTool, Trash2, Check, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface DocumentSignatureProps {
  documentId: string;
  documentTitle: string;
  signerRole: 'sender' | 'driver' | 'recipient';
  onSign: (signatureData: string) => void;
  onCancel: () => void;
}

const DocumentSignature: React.FC<DocumentSignatureProps> = ({
  documentId,
  documentTitle,
  signerRole,
  onSign,
  onCancel
}) => {
  const signatureRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const getRoleLabel = () => {
    const labels = {
      sender: 'Expéditeur',
      driver: 'Transporteur / Chauffeur',
      recipient: 'Destinataire'
    };
    return labels[signerRole];
  };

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSign = () => {
    if (signatureRef.current && !isEmpty) {
      const signatureData = signatureRef.current.toDataURL();
      onSign(signatureData);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PenTool className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Signature électronique</h3>
                <p className="text-sm text-gray-500">{documentTitle}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Rôle:</strong> {getRoleLabel()}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Veuillez signer dans le cadre ci-dessous en utilisant votre souris, trackpad ou écran tactile
            </p>
          </div>

          {/* Zone de signature */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: 'w-full h-64',
                style: { touchAction: 'none' }
              }}
              onBegin={handleBegin}
              backgroundColor="white"
              penColor="black"
            />
          </div>

          {/* Instructions */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              📝 Signez dans le cadre ci-dessus
            </p>
            <p className="text-xs text-gray-500">
              Document ID: {documentId}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Effacer
          </button>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSign}
              disabled={isEmpty}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              Valider la signature
            </button>
          </div>
        </div>

        {/* Notice légale */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            ⚖️ Cette signature électronique a la même valeur juridique qu'une signature manuscrite conformément au règlement eIDAS
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentSignature;
