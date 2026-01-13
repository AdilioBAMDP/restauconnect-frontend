import React from 'react';
import { Map } from 'lucide-react';

export const DriverMap: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Carte des Livraisons</h3>
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Map className="h-16 w-16 mx-auto mb-3" />
          <p>Carte des livraisons</p>
          <p className="text-sm">Intégration Google Maps à venir</p>
        </div>
      </div>
    </div>
  );
};
