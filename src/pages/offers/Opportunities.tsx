import React, { useState, useCallback } from 'react';
import { ArrowLeft, TrendingUp, MapPin, Users, Target, DollarSign, Calendar, Star, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';

interface Opportunity {
  id: string;
  name: string;
  type: 'restaurant' | 'artisan' | 'fournisseur';
  description: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  minInvestment: number;
  expectedReturn: number;
  duration: number; // mois
  investorsCount: number;
  rating: number;
  imageUrl?: string;
  tags: string[];
}

const OpportunitiesPage: React.FC = () => {
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as any);
  }, [navigateTo]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [opportunities] = useState<Opportunity[]>([
    {
      id: '1',
      name: 'Bistrot Moderne - Paris 11ème',
      type: 'restaurant',
      description: 'Restaurant gastronomique en plein cœur du 11ème arrondissement. Cuisine française moderne avec produits bio.',
      location: 'Paris, 75011',
      fundingGoal: 150000,
      currentFunding: 95000,
      minInvestment: 5000,
      expectedReturn: 18.5,
      duration: 36,
      investorsCount: 12,
      rating: 4.8,
      tags: ['Bio', 'Gastronomie', 'Paris']
    },
    {
      id: '2',
      name: 'Boulangerie Artisanale Bio',
      type: 'artisan',
      description: 'Boulangerie artisanale utilisant uniquement des farines biologiques et des méthodes traditionnelles.',
      location: 'Lyon, 69002',
      fundingGoal: 80000,
      currentFunding: 62000,
      minInvestment: 3000,
      expectedReturn: 15.2,
      duration: 24,
      investorsCount: 8,
      rating: 4.6,
      tags: ['Bio', 'Artisanat', 'Lyon']
    },
    {
      id: '3',
      name: 'Fournisseur Produits Régionaux',
      type: 'fournisseur',
      description: 'Plateforme de distribution de produits régionaux vers les restaurants et commerces de proximité.',
      location: 'Bordeaux, 33000',
      fundingGoal: 200000,
      currentFunding: 145000,
      minInvestment: 10000,
      expectedReturn: 22.0,
      duration: 48,
      investorsCount: 15,
      rating: 4.9,
      tags: ['Distribution', 'Produits locaux', 'Bordeaux']
    },
    {
      id: '4',
      name: 'Pizzeria Napolitaine',
      type: 'restaurant',
      description: 'Pizzeria authentique napolitaine avec four à bois et recettes traditionnelles italiennes.',
      location: 'Marseille, 13001',
      fundingGoal: 100000,
      currentFunding: 38000,
      minInvestment: 2500,
      expectedReturn: 16.5,
      duration: 30,
      investorsCount: 6,
      rating: 4.5,
      tags: ['Italien', 'Authentique', 'Marseille']
    },
    {
      id: '5',
      name: 'Chocolaterie Artisanale',
      type: 'artisan',
      description: 'Chocolaterie artisanale spécialisée dans les chocolats fins et les créations originales.',
      location: 'Nice, 06000',
      fundingGoal: 65000,
      currentFunding: 52000,
      minInvestment: 2000,
      expectedReturn: 14.8,
      duration: 24,
      investorsCount: 11,
      rating: 4.7,
      tags: ['Chocolat', 'Artisanat', 'Nice']
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant': return 'bg-blue-100 text-blue-600';
      case 'artisan': return 'bg-purple-100 text-purple-600';
      case 'fournisseur': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'restaurant': return 'Restaurant';
      case 'artisan': return 'Artisan';
      case 'fournisseur': return 'Fournisseur';
      default: return type;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleInvest = (opportunity: Opportunity) => {
    setErrorMessage(`Investissement dans "${opportunity.name}" - Montant minimum: ${opportunity.minInvestment.toLocaleString()}€, Retour attendu: ${opportunity.expectedReturn}% - Fonctionnalité complète à venir`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      
      <Header currentPage="opportunities" onNavigate={navigateToString} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('investor-dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunités d'Investissement</h1>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une opportunité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-400 self-center" />
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedType('restaurant')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'restaurant' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Restaurants
              </button>
              <button
                onClick={() => setSelectedType('artisan')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'artisan' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Artisans
              </button>
              <button
                onClick={() => setSelectedType('fournisseur')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'fournisseur' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Fournisseurs
              </button>
            </div>
          </div>
        </div>

        {/* Liste des opportunités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity, index) => {
            const fundingPercentage = (opportunity.currentFunding / opportunity.fundingGoal) * 100;

            return (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{opportunity.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                          {getTypeLabel(opportunity.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {opportunity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {opportunity.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{opportunity.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Financement actuel</span>
                      <span className="font-semibold text-gray-900">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all"
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2 text-gray-600">
                      <span>{opportunity.currentFunding.toLocaleString()}€ collectés</span>
                      <span>Objectif: {opportunity.fundingGoal.toLocaleString()}€</span>
                    </div>
                  </div>

                  {/* Infos clés */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Retour attendu</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">+{opportunity.expectedReturn}%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Investissement min.</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{opportunity.minInvestment.toLocaleString()}€</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Durée</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{opportunity.duration} mois</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <Users className="w-4 h-4" />
                        <span>Investisseurs</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{opportunity.investorsCount}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleInvest(opportunity)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Target className="w-5 h-5" />
                    Investir maintenant
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune opportunité trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;
