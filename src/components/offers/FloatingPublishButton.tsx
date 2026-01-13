import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PublishOfferModal from './PublishOfferModal';

const FloatingPublishButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
        title="Publier une offre"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Tooltip au survol */}
      <div className="fixed bottom-6 right-24 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Publier une offre
        </div>
      </div>

      {/* Modal */}
      <PublishOfferModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FloatingPublishButton;
