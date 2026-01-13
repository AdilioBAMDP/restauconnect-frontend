import React from 'react';

const InvoiceManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🧾 Gestion des factures
        </h1>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestionnaire de factures en cours de développement
          </h3>
          <p className="text-gray-500">
            La gestion complète des factures (progression, finales, retenues de garantie) sera bientôt disponible
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManager;