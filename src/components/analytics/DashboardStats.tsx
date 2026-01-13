import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock,
  DollarSign,
  Star,
  Activity,
  Target,
  Award,
  ThumbsUp
} from 'lucide-react';
import { UserRole } from '@/components/types';

interface DashboardStatsProps {
  role: UserRole;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ role }) => {
  // Stats spécialisées selon le rôle
  const getStatsForRole = (userRole: UserRole) => {
    switch (userRole) {
      case 'restaurant':
        return [
          { 
            title: 'Commandes aujourd\'hui', 
            value: '47', 
            change: '+12%', 
            icon: TrendingUp, 
            color: 'bg-green-500',
            description: 'Commandes reçues'
          },
          { 
            title: 'Équipe active', 
            value: '8/12', 
            change: '67%', 
            icon: Users, 
            color: 'bg-blue-500',
            description: 'Personnel présent'
          },
          { 
            title: 'Réservations', 
            value: '23', 
            change: '+5%', 
            icon: Calendar, 
            color: 'bg-purple-500',
            description: 'Ce soir'
          },
          { 
            title: 'Note moyenne', 
            value: '4.8', 
            change: '+0.2', 
            icon: Star, 
            color: 'bg-yellow-500',
            description: 'Satisfaction client'
          }
        ];

      case 'artisan':
        return [
          { 
            title: 'Missions actives', 
            value: '5', 
            change: '+2', 
            icon: Activity, 
            color: 'bg-orange-500',
            description: 'En cours'
          },
          { 
            title: 'Missions urgentes', 
            value: '3', 
            change: '+1', 
            icon: Clock, 
            color: 'bg-red-500',
            description: 'À traiter rapidement'
          },
          { 
            title: 'Portfolio', 
            value: '24', 
            change: '+3', 
            icon: Award, 
            color: 'bg-indigo-500',
            description: 'Réalisations'
          },
          { 
            title: 'Évaluations', 
            value: '4.9', 
            change: '+0.1', 
            icon: ThumbsUp, 
            color: 'bg-green-500',
            description: 'Note clients'
          }
        ];

      case 'fournisseur':
        return [
          { 
            title: 'Commandes', 
            value: '15', 
            change: '+8', 
            icon: TrendingUp, 
            color: 'bg-blue-500',
            description: 'Nouvelles commandes'
          },
          { 
            title: 'Livraisons', 
            value: '12', 
            change: '+3', 
            icon: Clock, 
            color: 'bg-purple-500',
            description: 'Aujourd\'hui'
          },
          { 
            title: 'Produits', 
            value: '156', 
            change: '+12', 
            icon: Target, 
            color: 'bg-orange-500',
            description: 'En catalogue'
          },
          { 
            title: 'CA du mois', 
            value: '€8.5K', 
            change: '+15%', 
            icon: DollarSign, 
            color: 'bg-green-500',
            description: 'Chiffre d\'affaires'
          }
        ];

      case 'candidat':
        return [
          { 
            title: 'Candidatures', 
            value: '7', 
            change: '+2', 
            icon: Target, 
            color: 'bg-blue-500',
            description: 'En cours'
          },
          { 
            title: 'Réponses', 
            value: '3', 
            change: '+1', 
            icon: Activity, 
            color: 'bg-green-500',
            description: 'Reçues'
          },
          { 
            title: 'Entretiens', 
            value: '2', 
            change: '+2', 
            icon: Calendar, 
            color: 'bg-purple-500',
            description: 'Programmés'
          },
          { 
            title: 'Profil vu', 
            value: '45', 
            change: '+12', 
            icon: Users, 
            color: 'bg-orange-500',
            description: 'Cette semaine'
          }
        ];

      case 'community_manager':
        return [
          { 
            title: 'Publications', 
            value: '12', 
            change: '+4', 
            icon: Activity, 
            color: 'bg-indigo-500',
            description: 'Cette semaine'
          },
          { 
            title: 'Engagement', 
            value: '89%', 
            change: '+5%', 
            icon: ThumbsUp, 
            color: 'bg-green-500',
            description: 'Taux d\'interaction'
          },
          { 
            title: 'Messages', 
            value: '34', 
            change: '+12', 
            icon: Users, 
            color: 'bg-blue-500',
            description: 'À modérer'
          },
          { 
            title: 'Événements', 
            value: '3', 
            change: '+1', 
            icon: Calendar, 
            color: 'bg-purple-500',
            description: 'À organiser'
          }
        ];

      case 'super_admin':
        return [
          { 
            title: 'Utilisateurs', 
            value: '1,234', 
            change: '+45', 
            icon: Users, 
            color: 'bg-blue-500',
            description: 'Total actifs'
          },
          { 
            title: 'Transactions', 
            value: '€45.2K', 
            change: '+18%', 
            icon: DollarSign, 
            color: 'bg-green-500',
            description: 'Ce mois'
          },
          { 
            title: 'Rapports', 
            value: '8', 
            change: '+2', 
            icon: Activity, 
            color: 'bg-orange-500',
            description: 'À traiter'
          },
          { 
            title: 'Uptime', 
            value: '99.9%', 
            change: '0%', 
            icon: TrendingUp, 
            color: 'bg-indigo-500',
            description: 'Système'
          }
        ];

      default:
        return [];
    }
  };

  const stats = getStatsForRole(role);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <span className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-green-600' : 
              stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
