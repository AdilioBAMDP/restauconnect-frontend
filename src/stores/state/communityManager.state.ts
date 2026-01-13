/**
 * =============================================
 * COMMUNITY MANAGER - STATE MODULE
 * État initial pour le module Community Manager
 * =============================================
 */

import type { 
  CommunityManagerService, 
  CommunityManagerCampaign, 
  CommunityManagerClient, 
  CommunityManagerStats 
} from '@/types/index';

export const initialCMServices: CommunityManagerService[] = [
  {
    id: 'cm-service-1',
    name: 'Gestion Réseaux Sociaux Premium',
    category: 'social-media',
    description: 'Gestion complète de vos réseaux sociaux avec stratégie, contenus créatifs et community management professionnel',
    price: 899,
    priceType: 'per-month',
    duration: '3 mois minimum',
    deliverables: [
      '20 posts Instagram/Facebook par mois',
      '8 stories par semaine',
      '1 campagne publicitaire mensuelle',
      'Rapport d\'analytiques mensuel',
      'Réponses aux commentaires 7j/7'
    ],
    features: [
      'Stratégie de contenu personnalisée',
      'Création graphique professionnelle',
      'Hashtags optimisés',
      'Planification automatique',
      'Suivi des performances'
    ],
    status: 'active',
    clientsCount: 12,
    successRate: 94,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z'
  },
  {
    id: 'cm-service-2',
    name: 'Campagne Publicitaire Google Ads',
    category: 'advertising',
    description: 'Campagnes publicitaires ciblées pour augmenter votre visibilité et attirer plus de clients',
    price: 450,
    priceType: 'per-campaign',
    duration: '1 mois',
    deliverables: [
      'Audit concurrentiel',
      'Création des annonces',
      'Configuration du ciblage',
      'Optimisation quotidienne',
      'Rapport de performance'
    ],
    features: [
      'Ciblage géographique précis',
      'Mots-clés optimisés',
      'A/B testing des annonces',
      'Retargeting avancé',
      'Budget optimisé'
    ],
    status: 'active',
    clientsCount: 8,
    successRate: 87,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-18T11:15:00Z'
  },
  {
    id: 'cm-service-3',
    name: 'Shooting Photo Professionnel',
    category: 'photography',
    description: 'Séance photo professionnelle de vos plats et de votre restaurant pour un contenu visuel de qualité',
    price: 350,
    priceType: 'fixed',
    duration: 'Demi-journée',
    deliverables: [
      '50 photos haute résolution',
      'Retouche professionnelle',
      '10 photos optimisées réseaux sociaux',
      'Photos de l\'ambiance du restaurant',
      'Livraison sous 48h'
    ],
    features: [
      'Équipement professionnel',
      'Éclairage studio',
      'Retouche avancée',
      'Formats multiples',
      'Droits d\'usage complets'
    ],
    status: 'active',
    clientsCount: 15,
    successRate: 98,
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-01-22T13:45:00Z'
  }
];

export const initialCMCampaigns: CommunityManagerCampaign[] = [
  {
    id: 'cm-campaign-1',
    restaurantId: 'restaurant-1',
    restaurantName: 'Le Petit Bistrot',
    serviceId: 'cm-service-1',
    serviceName: 'Gestion Réseaux Sociaux Premium',
    title: 'Lancement Menu Automne 2024',
    description: 'Campagne de lancement du nouveau menu automnal avec focus sur les produits de saison',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-04-15T00:00:00Z',
    budget: 2700,
    spent: 1850,
    objectives: [
      { type: 'followers', target: 1000, current: 743 },
      { type: 'engagement', target: 85, current: 78 },
      { type: 'bookings', target: 150, current: 98 }
    ],
    platforms: ['instagram', 'facebook', 'google-ads'],
    metrics: {
      impressions: 45670,
      reach: 23450,
      engagement: 3567,
      clicks: 892,
      conversions: 98,
      followers: 743,
      cost_per_click: 2.07,
      return_on_ad_spend: 3.4
    },
    deliverables: [
      {
        id: 'deliv-1',
        type: 'post',
        title: 'Post Menu Automne - Soupe de Châtaignes',
        description: 'Photo + texte engageant sur la soupe signature',
        platform: 'Instagram',
        status: 'completed',
        dueDate: '2024-01-18T18:00:00Z',
        completedAt: '2024-01-18T15:30:00Z',
        metrics: { likes: 234, comments: 18, shares: 12, views: 2150 }
      },
      {
        id: 'deliv-2',
        type: 'video',
        title: 'Stories - Behind the scenes cuisine',
        description: 'Vidéo courte de préparation en cuisine',
        platform: 'Instagram Stories',
        status: 'completed',
        dueDate: '2024-01-20T12:00:00Z',
        completedAt: '2024-01-20T10:45:00Z',
        metrics: { likes: 89, comments: 5, shares: 23, views: 1450 }
      },
      {
        id: 'deliv-3',
        type: 'ad',
        title: 'Publicité Facebook - Réservation Menu',
        description: 'Campagne publicitaire ciblée réservations',
        platform: 'Facebook Ads',
        status: 'in-progress',
        dueDate: '2024-01-25T10:00:00Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-22T14:20:00Z'
  },
  {
    id: 'cm-campaign-2',
    restaurantId: 'restaurant-2',
    restaurantName: 'Chez Mario',
    serviceId: 'cm-service-2',
    serviceName: 'Campagne Publicitaire Google Ads',
    title: 'Augmentation Livraison à Domicile',
    description: 'Campagne pour promouvoir le service de livraison et attirer de nouveaux clients',
    status: 'active',
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-02-10T00:00:00Z',
    budget: 450,
    spent: 287,
    objectives: [
      { type: 'sales', target: 500, current: 312 },
      { type: 'reach', target: 10000, current: 7850 }
    ],
    platforms: ['google-ads'],
    metrics: {
      impressions: 28450,
      reach: 7850,
      engagement: 892,
      clicks: 445,
      conversions: 89,
      followers: 0,
      cost_per_click: 0.64,
      return_on_ad_spend: 4.8
    },
    deliverables: [
      {
        id: 'deliv-4',
        type: 'ad',
        title: 'Annonce Google - Livraison Gratuite',
        description: 'Campagne promotion livraison gratuite > 25€',
        platform: 'Google Ads',
        status: 'completed',
        dueDate: '2024-01-12T08:00:00Z',
        completedAt: '2024-01-12T07:30:00Z'
      }
    ],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-23T09:15:00Z'
  }
];

export const initialCMClients: CommunityManagerClient[] = [
  {
    id: 'cm-client-1',
    restaurantId: 'restaurant-1',
    restaurantName: 'Le Petit Bistrot',
    contactPerson: 'Jean Dupont',
    email: 'jean@petitbistrot.fr',
    phone: '01 42 88 55 77',
    location: '15 rue de la Paix, 75001 Paris',
    restaurantType: 'Bistrot traditionnel',
    activeCampaigns: 2,
    totalSpent: 4500,
    contractStartDate: '2024-01-15T00:00:00Z',
    contractEndDate: '2024-07-15T00:00:00Z',
    status: 'active',
    servicesUsed: ['cm-service-1', 'cm-service-3'],
    satisfactionRating: 4.8,
    lastActivity: '2024-01-22T16:45:00Z',
    notes: 'Client très satisfait, demande extension contrat. Excellent taux d\'engagement sur Instagram.'
  },
  {
    id: 'cm-client-2',
    restaurantId: 'restaurant-2',
    restaurantName: 'Chez Mario',
    contactPerson: 'Mario Rossi',
    email: 'mario@chezmario.fr',
    phone: '01 45 67 89 12',
    location: '28 avenue des Italiens, 75009 Paris',
    restaurantType: 'Pizzeria italienne',
    activeCampaigns: 1,
    totalSpent: 1200,
    contractStartDate: '2024-01-10T00:00:00Z',
    status: 'active',
    servicesUsed: ['cm-service-2'],
    satisfactionRating: 4.5,
    lastActivity: '2024-01-23T11:20:00Z',
    notes: 'Très bon ROI sur Google Ads. Intéressé par la gestion réseaux sociaux pour le prochain contrat.'
  },
  {
    id: 'cm-client-3',
    restaurantId: 'restaurant-3',
    restaurantName: 'La Table du Chef',
    contactPerson: 'Sophie Martin',
    email: 'sophie@latableduchef.fr',
    phone: '01 56 78 90 23',
    location: '12 place Vendôme, 75001 Paris',
    restaurantType: 'Gastronomique',
    activeCampaigns: 0,
    totalSpent: 3200,
    contractStartDate: '2023-11-01T00:00:00Z',
    contractEndDate: '2024-01-31T00:00:00Z',
    status: 'completed',
    servicesUsed: ['cm-service-1', 'cm-service-2', 'cm-service-3'],
    satisfactionRating: 4.9,
    lastActivity: '2024-01-20T14:30:00Z',
    notes: 'Contrat terminé avec excellent retour. Cliente souhaite renouveler pour 6 mois supplémentaires.'
  }
];

export const initialCMStats: CommunityManagerStats = {
  totalServices: 3,
  activeServices: 3,
  totalClients: 8,
  activeClients: 5,
  totalCampaigns: 12,
  activeCampaigns: 7,
  monthlyRevenue: 8450,
  averageClientSatisfaction: 4.7,
  totalReach: 125000,
  totalEngagement: 9800,
  conversionRate: 12.8,
  retentionRate: 85
};
