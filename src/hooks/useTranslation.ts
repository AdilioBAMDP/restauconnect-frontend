import { useAppStore } from '@/stores/appStore';

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.search': 'Rechercher',
    'nav.offers': 'Offres',
    'nav.messages': 'Messages',
    'nav.calendar': 'Planning',
    'nav.dashboard': 'Tableau de bord',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.contact': 'Contacter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.location': 'Localisation',
    'common.price': 'Prix',
    'common.rating': 'Note',
    'common.reviews': 'Avis',
    'common.available': 'Disponible',
    'common.urgent': 'Urgent',
    'common.verified': 'Vérifié',
    'common.eco_friendly': 'Éco-responsable',
    
    // Auth
    'auth.login': 'Se connecter',
    'auth.register': 'S\'inscrire',
    'auth.logout': 'Se déconnecter',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom',
    'auth.phone': 'Téléphone',
    'auth.role': 'Rôle',
    'auth.choose_role': 'Choisissez votre rôle',
    
    // Roles
    'role.restaurant': 'Restaurant',
    'role.artisan': 'Artisan',
    'role.fournisseur': 'Fournisseur',
    'role.candidat': 'Candidat',
    'role.community_manager': 'Community Manager',
    'role.super_admin': 'Super Admin',
    
    // Home
    'home.title': 'La plateforme qui connecte l\'écosystème restaurant',
    'home.subtitle': 'Trouvez instantanément le personnel, les services et fournisseurs dont votre restaurant a besoin',
    'home.start_search': 'Commencer la recherche',
    'home.publish_offer': 'Publier une offre',
    
    // Search
    'search.title': 'Rechercher des professionnels',
    'search.subtitle': 'Trouvez le partenaire idéal pour votre activité',
    'search.placeholder': 'Rechercher par nom, spécialité...',
    'search.location_placeholder': 'Localisation',
    'search.advanced_filters': 'Filtres avancés',
    'search.results': 'résultat(s) trouvé(s)',
    'search.no_results': 'Aucun profil trouvé',
    'search.no_results_desc': 'Essayez de modifier vos critères de recherche ou contactez-nous pour publier une demande.',
    
    // Messages
    'messages.title': 'Messages',
    'messages.search_placeholder': 'Rechercher une conversation...',
    'messages.type_message': 'Tapez votre message...',
    'messages.online': 'En ligne',
    'messages.offline': 'Hors ligne',
    
    // Offers
    'offers.title': 'Offres & Demandes',
    'offers.subtitle': 'Trouvez ou publiez des opportunités',
    'offers.browse': 'Explorer les offres',
    'offers.my_offers': 'Mes offres',
    'offers.create': 'Créer une offre',
    'offers.new_offer': 'Nouvelle offre',
    'offers.apply_now': 'Postuler maintenant',
    'offers.save': 'Sauvegarder',
    
    // Calendar
    'calendar.title': 'Planning',
    'calendar.subtitle': 'Gérez vos rendez-vous et disponibilités',
    'calendar.new_appointment': 'Nouveau RDV',
    'calendar.today': 'Aujourd\'hui',
    'calendar.month': 'Mois',
    'calendar.week': 'Semaine',
    'calendar.day': 'Jour',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.subtitle': 'Vue d\'ensemble de votre activité',
    'dashboard.revenue': 'Revenus',
    'dashboard.missions': 'Missions réalisées',
    'dashboard.rating': 'Note moyenne',
    'dashboard.response_rate': 'Taux de réponse',
    'dashboard.recent_activity': 'Activité récente',
    'dashboard.upcoming_events': 'Prochains RDV',
    
    // Eco
    'eco.title': 'Mode Éco-responsable',
    'eco.description': 'Privilégiez les professionnels engagés dans une démarche durable',
    'eco.filter_eco': 'Filtrer par critères écologiques',
    'eco.carbon_footprint': 'Empreinte carbone',
    'eco.green_certified': 'Certifié vert',
    'eco.local_sourcing': 'Approvisionnement local',
    'eco.waste_reduction': 'Réduction des déchets',
    
    // Notifications
    'notif.new_message': 'Nouveau message',
    'notif.new_offer': 'Nouvelle offre correspondante',
    'notif.booking_confirmed': 'Réservation confirmée',
    'notif.review_received': 'Nouvel avis reçu',
    'notif.project_invitation': 'Invitation à un projet',
    
    // Errors
    'error.network': 'Erreur de connexion',
    'error.invalid_credentials': 'Identifiants invalides',
    'error.required_field': 'Ce champ est requis',
    'error.invalid_email': 'Email invalide',
    'error.password_too_short': 'Mot de passe trop court',
    'error.generic': 'Une erreur est survenue'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.offers': 'Offers',
    'nav.messages': 'Messages',
    'nav.calendar': 'Calendar',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.contact': 'Contact',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.location': 'Location',
    'common.price': 'Price',
    'common.rating': 'Rating',
    'common.reviews': 'Reviews',
    'common.available': 'Available',
    'common.urgent': 'Urgent',
    'common.verified': 'Verified',
    'common.eco_friendly': 'Eco-friendly',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.phone': 'Phone',
    'auth.role': 'Role',
    'auth.choose_role': 'Choose your role',
    
    // Roles
    'role.restaurant': 'Restaurant',
    'role.artisan': 'Craftsman',
    'role.fournisseur': 'Supplier',
    'role.candidat': 'Candidate',
    'role.community_manager': 'Community Manager',
    'role.super_admin': 'Super Admin',
    
    // Home
    'home.title': 'The platform that connects the restaurant ecosystem',
    'home.subtitle': 'Instantly find the staff, services and suppliers your restaurant needs',
    'home.start_search': 'Start searching',
    'home.publish_offer': 'Publish an offer',
    
    // Add more translations as needed...
  },
  es: {
    // Add Spanish translations...
  }
};

export const useTranslation = () => {
  const language = useAppStore((state) => state.language);
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { t, language };
};
