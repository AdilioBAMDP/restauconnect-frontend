import React from 'react';
import { Star, Wrench } from 'lucide-react';

interface ArtisanInfo {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  availability: string;
  badges: string[];
}

interface ArtisanHeaderProps {
  artisan: ArtisanInfo;
}

const ArtisanHeader: React.FC<ArtisanHeaderProps> = ({ artisan }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{artisan.name}</h1>
          <p className="text-gray-600">{artisan.specialty} • {artisan.location}</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">{artisan.rating}/5 ({artisan.reviewCount} avis)</span>
            </div>
            <div className="flex items-center space-x-2">
              {artisan.badges.map((badge, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm text-gray-600">Statut</div>
          <div className="text-lg font-semibold text-green-600">{artisan.availability}</div>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default ArtisanHeader;