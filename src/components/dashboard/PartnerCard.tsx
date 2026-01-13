import React from 'react';
import { 
  Building2, 
  Truck, 
  Wrench, 
  MessageSquare, 
  Building, 
  Calculator, 
  DollarSign, 
  FileSearch, 
  Users,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PartnerCardProps {
  category: string;
  count: number;
  onNavigate: (category: string) => void;
}

/**
 * Carte partenaire avec icône représentative
 * Affiche le nombre de partenaires par catégorie
 * Clic → Redirige vers la liste complète des partenaires
 */
const PartnerCard: React.FC<PartnerCardProps> = ({ category, count, onNavigate }) => {
  // Mapping des catégories avec leurs icônes et couleurs
  const categoryConfig: Record<string, { 
    icon: React.ReactNode; 
    label: string;
    gradient: string;
    iconBg: string;
    borderColor: string;
  }> = {
    restaurant: {
      icon: <Building2 className="w-8 h-8" />,
      label: 'Restaurants',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-100',
      borderColor: 'border-orange-200'
    },
    fournisseur: {
      icon: <Truck className="w-8 h-8" />,
      label: 'Fournisseurs',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    artisan: {
      icon: <Wrench className="w-8 h-8" />,
      label: 'Artisans',
      gradient: 'from-yellow-500 to-orange-500',
      iconBg: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    transporteur: {
      icon: <Truck className="w-8 h-8" />,
      label: 'Transporteurs',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    'community-manager': {
      icon: <MessageSquare className="w-8 h-8" />,
      label: 'Community Managers',
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-pink-100',
      borderColor: 'border-pink-200'
    },
    banquier: {
      icon: <Building className="w-8 h-8" />,
      label: 'Banquiers',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    comptable: {
      icon: <Calculator className="w-8 h-8" />,
      label: 'Comptables',
      gradient: 'from-indigo-500 to-blue-500',
      iconBg: 'bg-indigo-100',
      borderColor: 'border-indigo-200'
    },
    investisseur: {
      icon: <DollarSign className="w-8 h-8" />,
      label: 'Investisseurs',
      gradient: 'from-green-600 to-teal-500',
      iconBg: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    auditeur: {
      icon: <FileSearch className="w-8 h-8" />,
      label: 'Auditeurs',
      gradient: 'from-gray-600 to-slate-500',
      iconBg: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    'demandeur-emploi': {
      icon: <Users className="w-8 h-8" />,
      label: 'Demandeurs d\'emploi',
      gradient: 'from-violet-500 to-purple-500',
      iconBg: 'bg-violet-100',
      borderColor: 'border-violet-200'
    }
  };

  const config = categoryConfig[category] || categoryConfig.restaurant;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={() => onNavigate(category)}
    >
      <div className={`bg-white rounded-2xl shadow-md border ${config.borderColor} p-6 h-full transition-all duration-300 group-hover:shadow-xl`}>
        {/* Icône avec gradient */}
        <div className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
          <div className={`bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`}>
            {config.icon}
          </div>
        </div>

        {/* Contenu */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {config.label}
          </h3>
          <p className="text-gray-600 text-sm">
            Trouvez vos partenaires
          </p>
        </div>

        {/* Nombre de partenaires */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {count}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {count > 1 ? 'partenaires' : 'partenaire'}
            </p>
          </div>
          
          {/* Bouton Accéder */}
          <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Badge "Nouveau" optionnel */}
        {count > 20 && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              Populaire
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PartnerCard;
