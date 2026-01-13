import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Coffee, 
  ChefHat, 
  ArrowRight, 
  Shield,
  Zap,
  Clock,
  Globe,
  Leaf
} from 'lucide-react';
// Truck, Users, UserCheck retirés des imports car non utilisés

import Button from '@/components/ui/Button';
import RoleSelector from '@/components/features/RoleSelector';
import { useTranslation } from '@/hooks/useTranslation';

interface WelcomePageProps {
  onSelectRole?: (role: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onSelectRole }) => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Zap,
      title: 'Matching Intelligent',
      description: 'Notre algorithme vous propose les meilleurs profils selon vos critères'
    },
    {
      icon: Clock,
      title: 'Urgence Express',
      description: 'Trouvez un prestataire en moins de 2h pour vos besoins urgents'
    },
    {
      icon: Shield,
      title: 'Profils Vérifiés',
      description: 'Tous nos professionnels sont vérifiés et évalués par la communauté'
    },
    {
      icon: Globe,
      title: 'Multilingue',
      description: 'Interface disponible en français, anglais et espagnol'
    },
    {
      icon: Leaf,
      title: 'Éco-responsable',
      description: 'Privilégiez les professionnels engagés dans une démarche durable'
    }
  ];
  const stats = [
    { label: 'Professionnels actifs', value: '10,000+' },
    { label: 'Missions réalisées', value: '50,000+' },
    { label: 'Satisfaction moyenne', value: '4.8/5' },
    { label: 'Temps de réponse', value: '< 2h' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-12"
          >
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <ChefHat className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Web Spider</h1>
          </motion.div>

          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              {t('home.title')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto"
            >
              {t('home.subtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                onClick={() => toast.success('Bienvenue sur Web Spider !')}
              >
                Commencer maintenant
              </Button>
              

            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Web Spider ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils intelligents pour optimiser vos recherches et collaborations
            </p>
          </motion.div>

          {/* Ajout du sélecteur de rôle */}
          <div className="mb-16">
            <RoleSelector onSelectRole={onSelectRole || (() => {})} showSuperAdmin={true} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-100 transition-colors">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Prêt à transformer votre activité ?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Rejoignez les milliers de professionnels qui font confiance à Web Spider
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                size="lg"
                onClick={() => toast.success('Bienvenue sur Web Spider !')}
              >
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
                size="lg"
                onClick={() => toast.success('Plus d\'infos à venir !')}
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
