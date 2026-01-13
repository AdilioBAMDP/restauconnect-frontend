import { RestaurantOffer, Application, Message, RestaurantStats } from '../types/business.types';

export const initialRestaurantOffers: RestaurantOffer[] = [
  {
    id: '1',
    type: 'personnel',
    title: 'Serveur expérimenté recherché',
    description: 'Nous recherchons un serveur expérimenté pour notre restaurant dans le 11e arrondissement. Expérience en service de qualité requise.',
    category: 'Service en salle',
    urgent: true,
    budget: '1800-2200€/mois',
    location: 'Paris 11e',
    requirements: ['Expérience 2+ ans', 'Disponible soirs et weekends', 'Excellente présentation'],
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    applicationsCount: 5,
    restaurantId: 'restaurant-1'
  },
  {
    id: '2',
    type: 'service',
    title: 'Plombier urgence - Fuite cuisine',
    description: 'Fuite importante dans la cuisine principale. Intervention urgente requise aujourd\'hui.',
    category: 'Plomberie',
    urgent: true,
    budget: '200-300€',
    location: 'Paris 11e',
    requirements: ['Disponible immédiatement', 'Expérience restauration', 'Assurance pro'],
    status: 'active',
    createdAt: new Date().toISOString(),
    applicationsCount: 3,
    restaurantId: 'restaurant-1'
  },
  {
    id: '3',
    type: 'fourniture',
    title: 'Fournisseur légumes bio',
    description: 'Recherche fournisseur de légumes bio locaux pour livraisons régulières.',
    category: 'Alimentation',
    urgent: false,
    location: 'Paris et région',
    requirements: ['Certification bio', 'Livraison 3x/semaine', 'Prix compétitifs'],
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicationsCount: 8,
    restaurantId: 'restaurant-1'
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    offerId: '1',
    professionalId: 'pro-3',
    message: 'Bonjour, je suis intéressé par ce poste de serveur. J\'ai 8 ans d\'expérience en restauration gastronomique.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-2',
    offerId: '2',
    professionalId: 'pro-1',
    message: 'Je peux intervenir dans l\'heure. Plombier spécialisé restaurants avec matériel d\'urgence.',
    proposedPrice: '250€',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'app-3',
    offerId: '3',
    professionalId: 'pro-4',
    message: 'Nous pouvons vous fournir des légumes bio locaux. Devis personnalisé selon vos besoins.',
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    fromId: 'pro-3',
    toId: 'restaurant-1',
    fromName: 'Thomas Leclerc',
    toName: 'Restaurant Le Comptoir',
    subject: 'Candidature poste serveur',
    content: 'Bonjour, suite à votre offre, je souhaiterais discuter de mes motivations. Disponible pour un entretien.',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    relatedOfferId: '1'
  },
  {
    id: 'msg-2',
    fromId: 'pro-1',
    toId: 'restaurant-1',
    fromName: 'Marc Dubois',
    toName: 'Restaurant Le Comptoir',
    subject: 'Intervention plomberie urgente',
    content: 'Je peux intervenir dans 30 minutes. Matériel disponible pour réparation immédiate.',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    relatedOfferId: '2'
  }
];

export const initialRestaurantStats: RestaurantStats = {
  dailyOrders: 47,
  activeStaff: 8,
  todayReservations: 23,
  averageRating: 4.8,
  monthlyRevenue: 45000,
  pendingApplications: 5,
  unreadMessages: 3
};
