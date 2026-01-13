import React from 'react';

const QuoteForm: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          📋 Formulaire de devis
        </h1>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Formulaire en cours de développement
          </h3>
          <p className="text-gray-500">
            Le formulaire de création/modification de devis sera bientôt disponible
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;