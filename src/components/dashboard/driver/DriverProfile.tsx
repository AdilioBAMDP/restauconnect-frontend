import React from 'react';
import { Star } from 'lucide-react';

interface DriverStats {
  week: {
    avgRating: number;
  };
}

interface DriverProfileProps {
  driverStats: DriverStats | null;
}

export const DriverProfile: React.FC<DriverProfileProps> = ({ driverStats }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Profil Livreur</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <p className="text-sm text-gray-600">Livreur TMS Web Spider</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Note moyenne</label>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{driverStats?.week.avgRating || 4.8}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
