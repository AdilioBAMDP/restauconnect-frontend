import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Wrench, 
  Truck, 
  UserCheck, 
  Megaphone,
  DollarSign,
  Calculator,
  Clock,
  Shield,
  Zap,
  LogIn
} from 'lucide-react';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import { ApplicationForm } from '../../components/applications/ApplicationForm';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onShowAuth?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onShowAuth }) => {
  const [showRegistrationForm, setShowRegistrationForm] = React.useState(false);

  // ⚠️ DÉSACTIVÉ - App.tsx gère déjà la redirection automatique

  // Afficher la page d'accueil
  return (
    <>
      <PublicHomePage 
        onNavigate={onNavigate} 
        onShowRegistration={() => setShowRegistrationForm(true)}
        onShowAuth={onShowAuth}
      />
      {showRegistrationForm && (
        <ProfessionalRegistrationForm 
          onClose={() => setShowRegistrationForm(false)}
        />
      )}
    </>
  );
};





// Page d'accueil publique pour visiteurs non connectés
const PublicHomePage: React.FC<{ 
  onNavigate: (page: string) => void; 
  onShowRegistration: () => void;
  onShowAuth?: () => void;
}> = ({ onNavigate, onShowRegistration, onShowAuth }) => {
  const userTypes = [
    {
      id: 'restaurant',
      title: 'Restaurants',
      description: 'Trouvez du personnel, des services et des fournisseurs',
      icon: Users,
      color: 'bg-blue-500',
      count: '2,400+'
    },
    {
      id: 'artisan',
      title: 'Artisans & Services',
      description: 'Plombiers, électriciens, chauffagistes, nettoyeurs...',
      icon: Wrench,
      color: 'bg-green-500',
      count: '850+'
    },
    {
      id: 'fournisseur',
      title: 'Fournisseurs',
      description: 'Matériel, équipement, matières premières',
      icon: Truck,
      color: 'bg-purple-500',
      count: '1,200+'
    },
    {
      id: 'candidat',
      title: 'Candidats',
      description: 'Personnel temporaire ou permanent',
      icon: UserCheck,
      color: 'bg-orange-500',
      count: '3,100+'
    },
    {
      id: 'community_manager',
      title: 'Community Managers',
      description: 'Animation et gestion de communautés',
      icon: Megaphone,
      color: 'bg-pink-500',
      count: '120+'
    },
    {
      id: 'banquier',
      title: 'Banquiers',
      description: 'Offres de financement et solutions bancaires',
      icon: DollarSign,
      color: 'bg-emerald-500',
      count: '45+'
    },
    {
      id: 'comptable',
      title: 'Comptables',
      description: 'Services comptables et expertise fiscale',
      icon: Calculator,
      color: 'bg-teal-500',
      count: '80+'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-extrabold text-gray-900">Web Spider</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              {onShowAuth && (
                <button
                  onClick={onShowAuth}
                  className="px-6 py-2 text-gray-700 font-semibold hover:text-orange-600 transition-colors"
                >
                  Se connecter
                </button>
              )}
              <button
                onClick={onShowRegistration}
                className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-md"
              >
                Rejoindre maintenant
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="px-6 py-2 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
              >
                Explorer la plateforme
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white relative overflow-hidden mt-16">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-extrabold mb-6 tracking-tight"
            >
              Web Spider
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-orange-50 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              La plateforme qui connecte tous les acteurs de la restauration : 
              restaurants, artisans, fournisseurs, candidats et community managers
            </motion.p>

            {/* Statistiques améliorées */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto"
            >
              {[
                { value: '10,247', label: 'Professionnels actifs', icon: Users },
                { value: '50,380', label: 'Missions réalisées', icon: Zap },
                { value: '4.8⭐', label: 'Note moyenne', icon: Shield },
                { value: '< 2h', label: 'Temps de réponse', icon: Clock }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-orange-200 hover:shadow-xl transition-all"
                >
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-3xl font-bold text-orange-600 mb-1">{stat.value}</div>
                  <div className="text-orange-500 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Boutons d'action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {onShowAuth && (
                <button
                  onClick={onShowAuth}
                  className="px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center shadow-lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Se connecter
                </button>
              )}
              <button
                onClick={onShowRegistration}
                className="px-10 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center transform hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                Rejoindre maintenant
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-orange-600 transition-all transform hover:scale-105"
              >
                Explorer la plateforme
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4"
          >
            Pour tous les professionnels
          </motion.div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Qui peut rejoindre Web Spider ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une plateforme adaptée à tous les acteurs de la restauration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-2xl hover:border-orange-200 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-start mb-5">
                <div className={`p-4 rounded-2xl ${type.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                  <type.icon className={`h-7 w-7 ${type.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-5 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{type.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {type.count} membres
                  </span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{type.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nouvelle section "Pourquoi choisir RestauConnect ?" */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4"
            >
              Nos avantages
            </motion.div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Pourquoi choisir Web Spider ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils intelligents pour optimiser vos recherches et collaborations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Matching Intelligent',
                description: 'Notre algorithme vous propose les meilleurs profils selon vos critères',
                gradient: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100'
              },
              {
                icon: Clock,
                title: 'Urgence Express',
                description: 'Trouvez un prestataire en moins de 2h pour vos besoins urgents',
                gradient: 'from-red-500 to-red-600',
                bgColor: 'from-red-50 to-red-100'
              },
              {
                icon: Shield,
                title: 'Profils Vérifiés',
                description: 'Tous nos professionnels sont vérifiés et évalués par la communauté',
                gradient: 'from-green-500 to-green-600',
                bgColor: 'from-green-50 to-green-100'
              },
              {
                icon: Users,
                title: 'Multilingue',
                description: 'Interface disponible en français, anglais et espagnol',
                gradient: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100'
              },
              {
                icon: UserCheck,
                title: 'Éco-responsable',
                description: 'Privilégiez les professionnels engagés dans une démarche durable',
                gradient: 'from-emerald-500 to-emerald-600',
                bgColor: 'from-emerald-50 to-emerald-100'
              },
              {
                icon: Zap,
                title: 'Support 24/7',
                description: 'Une équipe disponible pour vous accompagner à tout moment',
                gradient: 'from-orange-500 to-orange-600',
                bgColor: 'from-orange-50 to-orange-100'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`group bg-gradient-to-br ${feature.bgColor} rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white`}
              >
                <div className="flex items-center mb-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats détaillées et conformité */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4"
            >
              Chiffres clés
            </motion.div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Web Spider en chiffres
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme de confiance, certifiée et conforme RGPD
            </p>
          </motion.div>

          {/* Grid de statistiques détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { value: '10,247', label: 'Professionnels vérifiés', trend: '+12% ce mois', color: 'blue', icon: Users },
              { value: '50,380', label: 'Missions réussies', trend: '+8% ce mois', color: 'green', icon: Zap },
              { value: '4.8/5', label: 'Satisfaction client', trend: '⭐⭐⭐⭐⭐', color: 'purple', icon: Shield },
              { value: '< 2h', label: 'Temps de réponse', trend: 'Support 24/7', color: 'orange', icon: Clock }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`group bg-gradient-to-br from-${stat.color}-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-${stat.color}-100`}
              >
                <div className={`w-12 h-12 bg-${stat.color}-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-4xl font-extrabold text-${stat.color}-600 mb-2`}>{stat.value}</div>
                <div className="text-gray-700 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-green-600 font-semibold">{stat.trend}</div>
              </motion.div>
            ))}
          </div>

          {/* Informations de conformité et RGPD */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl p-10 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: Shield,
                  title: 'Certifié RGPD',
                  description: 'Vos données personnelles sont protégées selon les standards européens les plus stricts',
                  color: 'green'
                },
                {
                  icon: Zap,
                  title: 'Sécurité renforcée',
                  description: 'Cryptage SSL, authentification à 2 facteurs et sauvegarde automatique de vos données',
                  color: 'blue'
                },
                {
                  icon: Clock,
                  title: 'Disponibilité 99.9%',
                  description: 'Plateforme haute disponibilité avec monitoring en temps réel et support technique 24/7',
                  color: 'purple'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className={`w-20 h-20 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                    <feature.icon className={`w-10 h-10 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Liens RGPD et légaux */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-base text-gray-600 mb-6 font-medium">
                🇪🇺 Entreprise européenne conforme au RGPD depuis 2018
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {[
                  { label: 'Politique de confidentialité', url: '/privacy-policy' },
                  { label: 'Conditions générales', url: '/terms-conditions' },
                  { label: 'Gestion des cookies', url: '/cookies-policy' },
                  { label: 'Vos droits RGPD', url: '/gdpr-rights' }
                ].map((link, index) => (
                  <button 
                    key={index}
                    onClick={() => window.open(link.url, '_blank')} 
                    className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer bg-transparent border-none transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo et description */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold">Web Spider</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                La plateforme de référence qui connecte tous les professionnels de la restauration.
              </p>
              <div className="flex space-x-3">
                {['f', 't', 'in', 'ig'].map((social, index) => (
                  <div 
                    key={index}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all cursor-pointer transform hover:scale-110 shadow-md"
                  >
                    <span className="text-sm font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-orange-400">Services</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                {[
                  { label: 'Recherche de professionnels', path: '/search-professionals' },
                  { label: 'Gestion des missions', path: '/missions' },
                  { label: 'Messagerie intégrée', path: '/messages' },
                  { label: 'Calendrier partagé', path: '/calendar' },
                  { label: 'Système d\'évaluation', path: '/reviews' }
                ].map((item, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => onNavigate(item.path)} 
                      className="hover:text-orange-400 transition-colors bg-transparent border-none cursor-pointer text-left hover:translate-x-1 transform transition-transform"
                    >
                      → {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professionnels */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-orange-400">Professionnels</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                {[
                  { label: 'Restaurateurs', type: 'restaurant' },
                  { label: 'Artisans & Ouvriers', type: 'artisan' },
                  { label: 'Fournisseurs', type: 'fournisseur' },
                  { label: 'Community Managers', type: 'community-manager' },
                  { label: 'Banquiers', type: 'banquier' }
                ].map((item, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => onNavigate(`/register?type=${item.type}`)} 
                      className="hover:text-orange-400 transition-colors bg-transparent border-none cursor-pointer text-left hover:translate-x-1 transform transition-transform"
                    >
                      → {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-orange-400">Support</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                {[
                  { label: 'Centre d\'aide', path: '/help' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'CGU', url: '/terms-conditions' },
                  { label: 'Politique de confidentialité', url: '/privacy-policy' },
                  { label: 'RGPD', url: '/gdpr-rights' }
                ].map((item, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => item.url ? window.open(item.url, '_blank') : onNavigate(item.path)} 
                      className="hover:text-orange-400 transition-colors bg-transparent border-none cursor-pointer text-left hover:translate-x-1 transform transition-transform"
                    >
                      → {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-xs mb-2">Support 24/7</p>
                <p className="text-orange-400 text-sm font-bold">contact@restauconnect.fr</p>
                <p className="text-gray-400 text-xs mt-2">+33 1 23 45 67 89</p>
              </div>
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 Web Spider. Tous droits réservés.
              </div>
              <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-orange-400 text-sm transition-colors bg-transparent border-none cursor-pointer">
                  🇫🇷 Français
                </button>
                <button className="text-gray-400 hover:text-orange-400 text-sm transition-colors bg-transparent border-none cursor-pointer">
                  🇬🇧 English
                </button>
                <button className="text-gray-400 hover:text-orange-400 text-sm transition-colors bg-transparent border-none cursor-pointer">
                  🇪🇸 Español
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
