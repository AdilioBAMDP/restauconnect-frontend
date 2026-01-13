import React from 'react';
import { Star, Award, Briefcase, Euro, Edit, Settings } from 'lucide-react';

interface ArtisanStats {
  totalApplications: number;
  acceptedMissions: number;
  pendingApplications: number;
  unreadMessages: number;
  monthlyRevenue: number;
  rating: number;
  reviewCount: number;
}

interface CurrentArtisan {
  id: string;
  name: string;
  specialty: string;
  location: string;
  price: string;
  rating: number;
  reviewCount: number;
}

interface ArtisanProfileProps {
  currentArtisan: CurrentArtisan;
  stats: ArtisanStats;
}

export const ArtisanProfile: React.FC<ArtisanProfileProps> = ({ currentArtisan, stats }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil Professionnel</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
              <button className="text-blue-600 hover:text-blue-700">
                <Edit className="w-4 h-4 inline mr-1" />
                Modifier
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <p className="text-gray-900">{currentArtisan.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <p className="text-gray-900">{currentArtisan.specialty}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <p className="text-gray-900">{currentArtisan.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire</label>
                <p className="text-gray-900">{currentArtisan.price}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compétences</h3>
              <button className="text-blue-600 hover:text-blue-700">
                <Edit className="w-4 h-4 inline mr-1" />
                Modifier
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['Plomberie', 'Sanitaire', 'Urgence 24h/7', 'Maintenance préventive', 'Restaurants', 'Normes HACCP'].map((skill) => (
                <span key={skill} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <button className="text-blue-600 hover:text-blue-700">
                <Edit className="w-4 h-4 inline mr-1" />
                Modifier
              </button>
            </div>
            
            <p className="text-gray-700">
              Plombier spécialisé dans l'intervention d'urgence pour les restaurants. 15 ans d'expérience 
              dans la réparation et maintenance des équipements de cuisine professionnelle. Disponible 
              24h/24 pour les interventions urgentes. Connaissance des normes HACCP et de l'hygiène alimentaire.
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes performances</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Note moyenne</span>
                </div>
                <span className="font-semibold text-gray-900">{currentArtisan.rating}/5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Avis clients</span>
                </div>
                <span className="font-semibold text-gray-900">{currentArtisan.reviewCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Missions réalisées</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.acceptedMissions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Euro className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">CA ce mois</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.monthlyRevenue}€</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges & Certifications</h3>
            
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Professionnel vérifié</p>
                  <p className="text-xs text-green-600">Identité et assurances validées</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  🚨
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-900">Intervention urgence</p>
                  <p className="text-xs text-orange-600">Disponible sous 2h</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Expert restaurants</p>
                  <p className="text-xs text-blue-600">Spécialisé cuisine pro</p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres du compte
          </button>
        </div>
      </div>
    </div>
  );
};
