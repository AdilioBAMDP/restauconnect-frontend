import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FEATURES } from '@/config/features';
import { apiClient } from '@/services/api';

// Configuration API centralisÃ©e
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import type { 
  CommunityManagerService, 
  CommunityManagerCampaign, 
  CommunityManagerClient, 
  CommunityManagerStats,
  CandidatProfile,
  CandidatJobApplication,
  JobOffer,
  SavedJobSearch,
  CandidatStats,
  GlobalAnnouncement,
  AnnouncementConfirmation,
  AnnouncementInteraction,
  MessageAttachment,
  EncryptedMessage,
  UserRole,
  BankPartner,
  LoanOffer,
  BankConversation,
  AccountantProfile,
  AccountingDocument,
  AccountantConversation,
  AccountingAlert
} from '@/types/index';

// Import des modules refactorisÃ©s
import { initialProfessionals, initialPartners } from './state/professionals.state';

// Types de donnÃ©es mÃ©tier
export interface RestaurantOffer {
  id: string;
  type: 'personnel' | 'service' | 'fourniture';
  title: string;
  description: string;
  category: string;
  urgent: boolean;
  budget?: string;
  location: string;
  requirements: string[];
  images?: string[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  expiresAt?: string;
  applicationsCount: number;
  restaurantId: string;
}

export interface Professional {
  id: string;
  name: string;
  role: 'artisan' | 'candidat' | 'fournisseur' | 'community_manager' | 'banquier' | 'investisseur' | 'comptable' | 'restaurant' | 'transporteur' | 'auditeur';
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  availability: string;
  verified: boolean;
  avatar?: string;
  badges: string[];
  description: string;
  ecoFriendly: boolean;
  portfolio?: string[];
  skills: string[];
  experience: string;
}

export interface Application {
  id: string;
  offerId: string;
  professionalId: string;
  message: string;
  proposedPrice?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Interface pour les posts de marketplace
export interface MarketplacePost {
  id: string;
  author: {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
    verified: boolean;
  };
  content: string;
  category: 'annonce' | 'conseil' | 'partenariat' | 'offre' | 'demande' | 'actualite';
  tags: string[];
  attachments?: {
    type: 'image' | 'document' | 'video';
    url: string;
    name: string;
  }[];
  timestamp: Date;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  likedBy: string[]; // IDs des utilisateurs qui ont likÃ©
  bookmarkedBy: string[]; // IDs des utilisateurs qui ont bookmarkÃ©
  visibility: 'public' | 'professionals' | 'role-specific';
  createdAt: string;
  updatedAt?: string;
}

// Types pour les fournisseurs
export interface SupplierProduct {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  priceType: 'unit' | 'kg' | 'lot' | 'service';
  stock: number;
  minOrder: number;
  image?: string;
  description: string;
  specifications: Record<string, string>;
  certifications: string[];
  availability: 'available' | 'limited' | 'out_of_stock';
  featured: boolean;
  views: number;
  orders: number;
  rating: number;
  createdAt: string;
  lastUpdated: string;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  restaurantId: string;
  restaurantName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface SupplierClient {
  id: string;
  restaurantName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'blocked';
  rating: number;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  relatedOfferId?: string;
}

interface BusinessState {
  // DonnÃ©es
  offers: RestaurantOffer[];
  professionals: Professional[];
  applications: Application[];
  messages: Message[];
  
  // DonnÃ©es partenaires par catÃ©gorie
  partners: Professional[];
  
  // DonnÃ©es fournisseur
  supplierProducts: SupplierProduct[];
  supplierOrders: SupplierOrder[];
  supplierClients: SupplierClient[];
  
  // DonnÃ©es Community Manager
  cmServices: CommunityManagerService[];
  cmCampaigns: CommunityManagerCampaign[];
  cmClients: CommunityManagerClient[];
  cmStats: CommunityManagerStats;
  
  // DonnÃ©es Candidat
  candidatProfile: CandidatProfile;
  candidatApplications: CandidatJobApplication[];
  jobOffers: JobOffer[];
  savedSearches: SavedJobSearch[];
  candidatStats: CandidatStats;
  
  // Stats restaurateur
  stats: {
    dailyOrders: number;
    activeStaff: number;
    todayReservations: number;
    averageRating: number;
    monthlyRevenue: number;
    pendingApplications: number;
    unreadMessages: number;
  };
  
  // Stats fournisseur
  supplierStats: {
    totalProducts: number;
    totalOrders: number;
    totalClients: number;
    monthlyRevenue: number;
    averageRating: number;
    totalViews: number;
    pendingOrders: number;
  };

  // Actions pour les offres
  createOffer: (offer: Omit<RestaurantOffer, 'id' | 'createdAt' | 'applicationsCount'>) => void;
  updateOffer: (id: string, updates: Partial<RestaurantOffer>) => void;
  deleteOffer: (id: string) => void;
  
  // Actions pour la recherche
  searchProfessionals: (query: string, filters?: {
    role?: string;
    location?: string;
    urgent?: boolean;
    ecoFriendly?: boolean;
  }) => Professional[];
  
  // Actions pour les candidatures
  applyToOffer: (offerId: string, professionalId: string, message: string, proposedPrice?: string) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  
  // Actions pour les messages
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Actions pour les professionnels (Admin CRUD)
  createProfessional: (professional: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, updates: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  toggleProfessionalVerification: (id: string) => void;
  suspendProfessional: (id: string, reason?: string) => void;
  
  // Actions de modÃ©ration (Admin)
  approveMessage: (messageId: string) => void;
  rejectMessage: (messageId: string, reason?: string) => void;
  validateOffer: (offerId: string) => void;
  rejectOffer: (offerId: string, reason?: string) => void;
  flagContent: (type: 'message' | 'offer' | 'professional', id: string, reason: string) => void;
  
  // Actions pour les stats
  updateStats: (stats: Partial<BusinessState['stats']>) => void;
  
  // Actions pour les fournisseurs
  createProduct: (product: Omit<SupplierProduct, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updates: Partial<SupplierProduct>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, stock: number) => void;
  
  createOrder: (order: Omit<SupplierOrder, 'id' | 'orderDate'>) => void;
  updateOrderStatus: (id: string, status: SupplierOrder['status']) => void;
  
  addClient: (client: Omit<SupplierClient, 'id'>) => void;
  updateClient: (id: string, updates: Partial<SupplierClient>) => void;
  
  updateSupplierStats: (stats: Partial<BusinessState['supplierStats']>) => void;
  
  // Actions Community Manager  
  createCMService: (service: Omit<CommunityManagerService, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCMService: (id: string, updates: Partial<CommunityManagerService>) => void;
  deleteCMService: (id: string) => void;
  
  createCMCampaign: (campaign: Omit<CommunityManagerCampaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCMCampaign: (id: string, updates: Partial<CommunityManagerCampaign>) => void;
  deleteCMCampaign: (id: string) => void;
  updateCampaignMetrics: (id: string, metrics: Partial<CommunityManagerCampaign['metrics']>) => void;
  
  addCMClient: (client: Omit<CommunityManagerClient, 'id'>) => void;
  updateCMClient: (id: string, updates: Partial<CommunityManagerClient>) => void;
  
  updateCMStats: (stats: Partial<CommunityManagerStats>) => void;
  
  // Actions Candidat
  updateCandidatProfile: (profile: Partial<CandidatProfile>) => void;
  addJobApplication: (application: Omit<CandidatJobApplication, 'id'>) => void;
  updateJobApplication: (id: string, application: Partial<CandidatJobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  addSavedSearch: (search: Omit<SavedJobSearch, 'id'>) => void;
  updateSavedSearch: (id: string, search: Partial<SavedJobSearch>) => void;
  deleteSavedSearch: (id: string) => void;
  updateCandidatStats: (stats: Partial<CandidatStats>) => void;
  
  // DonnÃ©es Annonces Globales
  globalAnnouncements: GlobalAnnouncement[];
  announcementConfirmations: AnnouncementConfirmation[];
  announcementInteractions: AnnouncementInteraction[];
  
  // DonnÃ©es Marketplace
  marketplacePosts: MarketplacePost[];
  
  // Actions Annonces Globales
  fetchGlobalAnnouncements: () => Promise<void>;
  createAnnouncement: (announcement: Omit<GlobalAnnouncement, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'clickCount' | 'contactCount'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<GlobalAnnouncement>) => void;
  deleteAnnouncement: (id: string) => void;
  confirmAnnouncementActive: (id: string, isActive: boolean) => void;
  recordAnnouncementInteraction: (interaction: Omit<AnnouncementInteraction, 'id' | 'timestamp'>) => void;
  getAnnouncementsForRole: (userRole: UserRole) => GlobalAnnouncement[];
  
  // Actions Marketplace
  addMarketplacePost: (post: Omit<MarketplacePost, 'id' | 'createdAt' | 'timestamp' | 'likes' | 'comments' | 'views' | 'likedBy' | 'bookmarkedBy'>) => Promise<string>;
  updateMarketplacePost: (id: string, updates: Partial<MarketplacePost>) => Promise<void>;
  deleteMarketplacePost: (id: string) => Promise<void>;
  likeMarketplacePost: (postId: string, userId: string) => Promise<void>;
  bookmarkMarketplacePost: (postId: string, userId: string) => Promise<void>;
  getMarketplacePostsByRole: (userRole?: UserRole) => MarketplacePost[];
  fetchMarketplacePosts: () => Promise<void>;

  // ========== NOUVEAUX MODULES ==========
  
  // Module Banques - DonnÃ©es
  bankPartners: BankPartner[];
  loanOffers: LoanOffer[];
  bankConversations: BankConversation[];
  
  // Module Banques - Actions
  getBanksByLocation: (city?: string, region?: string) => BankPartner[];
  getLoanOffersByType: (type?: LoanOffer['type']) => LoanOffer[];
  createBankConversation: (bankId: string, subject: string, message: string) => string;
  sendBankMessage: (conversationId: string, content: string, attachments?: MessageAttachment[]) => string;
  markBankMessageRead: (conversationId: string, messageId: string) => void;
  
  // Module Comptable - DonnÃ©es (Restaurant uniquement)
  accountantProfile: AccountantProfile | null;
  accountingDocuments: AccountingDocument[];
  accountantConversations: AccountantConversation[];
  accountingAlerts: AccountingAlert[];
  
  // Module Comptable - Actions
  assignAccountant: (accountantData: Partial<AccountantProfile>) => void;
  createAccountingConversation: (subject: string, message: string, category?: AccountantConversation['category'], priority?: AccountantConversation['priority']) => string;
  sendAccountingMessage: (conversationId: string, content: string, attachments?: MessageAttachment[]) => string;
  uploadAccountingDocument: (documentData: Omit<AccountingDocument, 'id' | 'createdAt' | 'updatedAt'>) => string;
  markAccountingAlertRead: (alertId: string) => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      // Ã‰tat initial
      offers: [
        {
          id: '1',
          type: 'personnel',
          title: 'Serveur expÃ©rimentÃ© recherchÃ©',
          description: 'Nous recherchons un serveur expÃ©rimentÃ© pour notre restaurant dans le 11e arrondissement. ExpÃ©rience en service de qualitÃ© requise.',
          category: 'Service en salle',
          urgent: true,
          budget: '1800-2200â‚¬/mois',
          location: 'Paris 11e',
          requirements: ['ExpÃ©rience 2+ ans', 'Disponible soirs et weekends', 'Excellente prÃ©sentation'],
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
          budget: '200-300â‚¬',
          location: 'Paris 11e',
          requirements: ['Disponible immÃ©diatement', 'ExpÃ©rience restauration', 'Assurance pro'],
          status: 'active',
          createdAt: new Date().toISOString(),
          applicationsCount: 3,
          restaurantId: 'restaurant-1'
        },
        {
          id: '3',
          type: 'fourniture',
          title: 'Fournisseur lÃ©gumes bio',
          description: 'Recherche fournisseur de lÃ©gumes bio locaux pour livraisons rÃ©guliÃ¨res.',
          category: 'Alimentation',
          urgent: false,
          location: 'Paris et rÃ©gion',
          requirements: ['Certification bio', 'Livraison 3x/semaine', 'Prix compÃ©titifs'],
          status: 'active',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          applicationsCount: 8,
          restaurantId: 'restaurant-1'
        }
      ],

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // PROFESSIONALS - MODULE REFACTORISÃ‰ âœ…
      // Ã‰tat chargÃ© depuis: ./state/professionals.state.ts
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      professionals: initialProfessionals,

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // PARTNERS - MODULE REFACTORISÃ‰ âœ…
      // Ã‰tat chargÃ© depuis: ./state/professionals.state.ts
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      partners: initialPartners,

      applications: [
        {
          id: 'app-1',
          offerId: '1',
          professionalId: 'pro-3',
          message: 'Bonjour, je suis intÃ©ressÃ© par ce poste de serveur. J\'ai 8 ans d\'expÃ©rience en restauration gastronomique.',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'app-2',
          offerId: '2',
          professionalId: 'pro-1',
          message: 'Je peux intervenir dans l\'heure. Plombier spÃ©cialisÃ© restaurants avec matÃ©riel d\'urgence.',
          proposedPrice: '250â‚¬',
          status: 'pending',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 'app-3',
          offerId: '3',
          professionalId: 'pro-4',
          message: 'Nous pouvons vous fournir des lÃ©gumes bio locaux. Devis personnalisÃ© selon vos besoins.',
          status: 'pending',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ],

      messages: [
        {
          id: 'msg-1',
          fromId: 'pro-3',
          toId: 'restaurant-1',
          fromName: 'Thomas Leclerc',
          toName: 'Restaurant Le Comptoir',
          subject: 'Candidature poste serveur',
          content: 'Bonjour, suite Ã  votre offre, je souhaiterais discuter de mes motivations. Disponible pour un entretien.',
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
          content: 'Je peux intervenir dans 30 minutes. MatÃ©riel disponible pour rÃ©paration immÃ©diate.',
          read: false,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          relatedOfferId: '2'
        }
      ],

      stats: {
        dailyOrders: 47,
        activeStaff: 8,
        todayReservations: 23,
        averageRating: 4.8,
        monthlyRevenue: 45000,
        pendingApplications: 5,
        unreadMessages: 3
      },

      // DonnÃ©es fournisseur
      supplierProducts: [
        {
          id: '1',
          supplierId: 'supplier-1',
          name: 'LÃ©gumes Bio Assortis Premium',
          category: 'Produits Frais',
          subcategory: 'LÃ©gumes Bio',
          price: 25,
          priceType: 'kg',
          stock: 150,
          minOrder: 5,
          image: 'ðŸ¥¬',
          description: 'Assortiment de lÃ©gumes bio de saison cultivÃ©s localement. FraÃ®cheur garantie, livraison quotidienne possible.',
          specifications: {
            'Origine': 'Local - Rayon 50km',
            'Conservation': '2-5Â°C, 5-7 jours',
            'VariÃ©tÃ©s': 'Carottes, Courgettes, Tomates, Salade',
            'Certification': 'AB Bio France'
          } as Record<string, string>,
          certifications: ['Bio', 'Local', 'Ã‰co-responsable', 'FraÃ®cheur Garantie'],
          availability: 'available',
          featured: true,
          views: 245,
          orders: 34,
          rating: 4.8,
          createdAt: '2024-01-10T10:00:00Z',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          supplierId: 'supplier-1',
          name: 'Fourneau Professionnel 6 Feux',
          category: 'Ã‰quipement Cuisine',
          subcategory: 'Appareils de Cuisson',
          price: 2500,
          priceType: 'unit',
          stock: 5,
          minOrder: 1,
          image: 'ðŸ”¥',
          description: 'Fourneau professionnel 6 feux gaz avec four. IdÃ©al pour restaurant 50-100 couverts.',
          specifications: {
            'Puissance': '6 x 3.5 kW + Four 7 kW',
            'Dimensions': '120 x 80 x 85 cm',
            'MatÃ©riau': 'Inox 304',
            'Installation': 'Raccordement gaz obligatoire'
          } as Record<string, string>,
          certifications: ['CE', 'Garantie Pro 2 ans', 'Installation Incluse'],
          availability: 'limited',
          featured: true,
          views: 128,
          orders: 8,
          rating: 4.9,
          createdAt: '2024-01-08T14:00:00Z',
          lastUpdated: '2024-01-14T16:00:00Z'
        },
        {
          id: '3',
          supplierId: 'supplier-1',
          name: 'Viande Premium BÅ“uf Local',
          category: 'Produits Frais',
          subcategory: 'Viandes',
          price: 35,
          priceType: 'kg',
          stock: 80,
          minOrder: 2,
          image: 'ðŸ¥©',
          description: 'Viande de bÅ“uf local, Ã©levage traditionnel. TraÃ§abilitÃ© complÃ¨te de la ferme Ã  l\'assiette.',
          specifications: {
            'Race': 'Charolaise et Limousine',
            'Ã‰levage': 'PÃ¢turage libre, alimentation naturelle',
            'Maturation': '21 jours minimum',
            'DÃ©coupe': 'Sur mesure selon besoins'
          } as Record<string, string>,
          certifications: ['Label Rouge', 'Origine France', 'TraÃ§abilitÃ©'],
          availability: 'available',
          featured: true,
          views: 312,
          orders: 28,
          rating: 4.9,
          createdAt: '2024-01-05T09:00:00Z',
          lastUpdated: '2024-01-15T11:00:00Z'
        }
      ],

      supplierOrders: [
        {
          id: '1',
          supplierId: 'supplier-1',
          restaurantId: 'rest-1',
          restaurantName: 'Restaurant Le Gourmet',
          items: [
            {
              productId: '1',
              productName: 'LÃ©gumes Bio Assortis Premium',
              quantity: 10,
              unitPrice: 25,
              total: 250
            },
            {
              productId: '3',  
              productName: 'Viande Premium BÅ“uf Local',
              quantity: 15,
              unitPrice: 35,
              total: 525
            }
          ],
          totalAmount: 775,
          status: 'preparing',
          orderDate: '2024-01-15T08:30:00Z',
          expectedDelivery: '2024-01-16T10:00:00Z',
          notes: 'Livraison impÃ©rative avant 10h pour le service midi'
        },
        {
          id: '2',
          supplierId: 'supplier-1',
          restaurantId: 'rest-2',
          restaurantName: 'Bistrot du Coin',
          items: [
            {
              productId: '1',
              productName: 'LÃ©gumes Bio Assortis Premium',
              quantity: 8,
              unitPrice: 25,
              total: 200
            }
          ],
          totalAmount: 200,
          status: 'confirmed',
          orderDate: '2024-01-14T15:45:00Z',
          expectedDelivery: '2024-01-15T14:00:00Z'
        }
      ],

      supplierClients: [
        {
          id: '1',
          restaurantName: 'Restaurant Le Gourmet',
          contactName: 'Marie Dubois',
          email: 'marie@legourmet.fr',
          phone: '01 23 45 67 89',
          address: '15 rue de la Paix, 75001 Paris',
          totalOrders: 12,
          totalSpent: 4580,
          lastOrder: '2024-01-15T08:30:00Z',
          status: 'active',
          rating: 4.9
        },
        {
          id: '2',
          restaurantName: 'Bistrot du Coin',
          contactName: 'Jean Martin',
          email: 'contact@bistrotducoin.fr',
          phone: '01 98 76 54 32',
          address: '32 avenue des Champs, 75008 Paris',
          totalOrders: 8,
          totalSpent: 2140,
          lastOrder: '2024-01-14T15:45:00Z',
          status: 'active',
          rating: 4.6
        }
      ],

      supplierStats: {
        totalProducts: 3,
        totalOrders: 23,
        totalClients: 8,
        monthlyRevenue: 12450,
        averageRating: 4.8,
        totalViews: 685,
        pendingOrders: 2
      },

      // DonnÃ©es Community Manager avec vraies donnÃ©es
      cmServices: [
        {
          id: 'cm-service-1',
          name: 'Gestion RÃ©seaux Sociaux Premium',
          category: 'social-media',
          description: 'Gestion complÃ¨te de vos rÃ©seaux sociaux avec stratÃ©gie, contenus crÃ©atifs et community management professionnel',
          price: 899,
          priceType: 'per-month',
          duration: '3 mois minimum',
          deliverables: [
            '20 posts Instagram/Facebook par mois',
            '8 stories par semaine',
            '1 campagne publicitaire mensuelle',
            'Rapport d\'analytiques mensuel',
            'RÃ©ponses aux commentaires 7j/7'
          ],
          features: [
            'StratÃ©gie de contenu personnalisÃ©e',
            'CrÃ©ation graphique professionnelle',
            'Hashtags optimisÃ©s',
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
          description: 'Campagnes publicitaires ciblÃ©es pour augmenter votre visibilitÃ© et attirer plus de clients',
          price: 450,
          priceType: 'per-campaign',
          duration: '1 mois',
          deliverables: [
            'Audit concurrentiel',
            'CrÃ©ation des annonces',
            'Configuration du ciblage',
            'Optimisation quotidienne',
            'Rapport de performance'
          ],
          features: [
            'Ciblage gÃ©ographique prÃ©cis',
            'Mots-clÃ©s optimisÃ©s',
            'A/B testing des annonces',
            'Retargeting avancÃ©',
            'Budget optimisÃ©'
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
          description: 'SÃ©ance photo professionnelle de vos plats et de votre restaurant pour un contenu visuel de qualitÃ©',
          price: 350,
          priceType: 'fixed',
          duration: 'Demi-journÃ©e',
          deliverables: [
            '50 photos haute rÃ©solution',
            'Retouche professionnelle',
            '10 photos optimisÃ©es rÃ©seaux sociaux',
            'Photos de l\'ambiance du restaurant',
            'Livraison sous 48h'
          ],
          features: [
            'Ã‰quipement professionnel',
            'Ã‰clairage studio',
            'Retouche avancÃ©e',
            'Formats multiples',
            'Droits d\'usage complets'
          ],
          status: 'active',
          clientsCount: 15,
          successRate: 98,
          createdAt: '2024-01-05T09:30:00Z',
          updatedAt: '2024-01-22T13:45:00Z'
        }
      ],

      cmCampaigns: [
        {
          id: 'cm-campaign-1',
          restaurantId: 'restaurant-1',
          restaurantName: 'Le Petit Bistrot',
          serviceId: 'cm-service-1',
          serviceName: 'Gestion RÃ©seaux Sociaux Premium',
          title: 'Lancement Menu Automne 2024',
          description: 'Campagne de lancement du nouveau menu automnal avec focus sur les produits de saison',
          status: 'active',
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-04-15T00:00:00Z',
          budget: 2700,
          spent: 1850,
          objectives: [
            {
              type: 'followers',
              target: 1000,
              current: 743
            },
            {
              type: 'engagement',
              target: 85,
              current: 78
            },
            {
              type: 'bookings',
              target: 150,
              current: 98
            }
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
              title: 'Post Menu Automne - Soupe de ChÃ¢taignes',
              description: 'Photo + texte engageant sur la soupe signature',
              platform: 'Instagram',
              status: 'completed',
              dueDate: '2024-01-18T18:00:00Z',
              completedAt: '2024-01-18T15:30:00Z',
              metrics: {
                likes: 234,
                comments: 18,
                shares: 12,
                views: 2150
              }
            },
            {
              id: 'deliv-2',
              type: 'video',
              title: 'Stories - Behind the scenes cuisine',
              description: 'VidÃ©o courte de prÃ©paration en cuisine',
              platform: 'Instagram Stories',
              status: 'completed',
              dueDate: '2024-01-20T12:00:00Z',
              completedAt: '2024-01-20T10:45:00Z',
              metrics: {
                likes: 89,
                comments: 5,
                shares: 23,
                views: 1450
              }
            },
            {
              id: 'deliv-3',
              type: 'ad',
              title: 'PublicitÃ© Facebook - RÃ©servation Menu',
              description: 'Campagne publicitaire ciblÃ©e rÃ©servations',
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
          title: 'Augmentation Livraison Ã  Domicile',
          description: 'Campagne pour promouvoir le service de livraison et attirer de nouveaux clients',
          status: 'active',
          startDate: '2024-01-10T00:00:00Z',
          endDate: '2024-02-10T00:00:00Z',
          budget: 450,
          spent: 287,
          objectives: [
            {
              type: 'sales',
              target: 500,
              current: 312
            },
            {
              type: 'reach',
              target: 10000,
              current: 7850
            }
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
              description: 'Campagne promotion livraison gratuite > 25â‚¬',
              platform: 'Google Ads',
              status: 'completed',
              dueDate: '2024-01-12T08:00:00Z',
              completedAt: '2024-01-12T07:30:00Z'
            }
          ],
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-23T09:15:00Z'
        }
      ],

      cmClients: [
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
          notes: 'Client trÃ¨s satisfait, demande extension contrat. Excellent taux d\'engagement sur Instagram.'
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
          notes: 'TrÃ¨s bon ROI sur Google Ads. IntÃ©ressÃ© par la gestion rÃ©seaux sociaux pour le prochain contrat.'
        },
        {
          id: 'cm-client-3',
          restaurantId: 'restaurant-3',
          restaurantName: 'La Table du Chef',
          contactPerson: 'Sophie Martin',
          email: 'sophie@latableduchef.fr',
          phone: '01 56 78 90 23',
          location: '12 place VendÃ´me, 75001 Paris',
          restaurantType: 'Gastronomique',
          activeCampaigns: 0,
          totalSpent: 3200,
          contractStartDate: '2023-11-01T00:00:00Z',
          contractEndDate: '2024-01-31T00:00:00Z',
          status: 'completed',
          servicesUsed: ['cm-service-1', 'cm-service-2', 'cm-service-3'],
          satisfactionRating: 4.9,
          lastActivity: '2024-01-20T14:30:00Z',
          notes: 'Contrat terminÃ© avec excellent retour. Cliente souhaite renouveler pour 6 mois supplÃ©mentaires.'
        }
      ],

      cmStats: {
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
      },

      // DonnÃ©es candidat initiales
      candidatProfile: {
        id: 'candidat-001',
        personalInfo: {
          firstName: 'Alexandre',
          lastName: 'Dubois',
          email: 'alexandre.dubois@email.com',
          phone: '+33 6 12 34 56 78',
          birthDate: '1992-03-15',
          nationality: 'FranÃ§aise',
          address: '45 rue de la RÃ©publique',
          city: 'Paris',
          postalCode: '75011'
        },
        professionalInfo: {
          currentStatus: 'seeking',
          experience: 'expert',
          yearsExperience: 8,
          targetPosition: ['Chef de partie', 'Sous-chef', 'Chef de cuisine'],
          targetSalary: {
            min: 2200,
            max: 2800,
            negotiable: true
          },
          availability: {
            immediateStart: false,
            startDate: '2024-02-01',
            workingSchedule: 'full-time',
            weekends: true,
            evenings: true
          }
        },
        skills: {
          technical: ['Cuisine franÃ§aise', 'Gestion d\'Ã©quipe', 'HACCP', 'CrÃ©ativitÃ© culinaire', 'Gestion des coÃ»ts'],
          languages: [
            { name: 'FranÃ§ais', level: 'natif' },
            { name: 'Anglais', level: 'intermediaire' },
            { name: 'Espagnol', level: 'debutant' }
          ],
          certifications: ['Permis d\'exploitation', 'Formation HACCP'],
          software: ['Caisse', 'Excel', 'Logiciel de rÃ©servation']
        },
        preferences: {
          contractTypes: ['CDI', 'CDD'],
          locations: ['Paris', 'RÃ©gion parisienne'],
          maxDistance: 50,
          restaurantTypes: ['Gastronomique', 'Brasserie', 'Bistrot'],
          teamSize: 'medium',
          workEnvironment: ['cuisine', 'service', 'management']
        },
        documents: {
          cv: 'CV_Alexandre_Dubois_2024.pdf',
          coverLetter: 'Lettre_motivation_Alexandre.pdf',
          portfolio: [],
          references: [
            {
              name: 'Jean-Pierre Vigato',
              position: 'Chef exÃ©cutif',
              company: 'Restaurant Le Meurice',
              phone: '+33 1 44 58 10 10',
              email: 'jp.vigato@lemeurice.fr'
            }
          ]
        },
        statistics: {
          profileViews: 127,
          applicationsCount: 8,
          interviewsCount: 3,
          successRate: 25,
          responseRate: 75
        },
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-20T15:45:00Z'
      },

      candidatApplications: [
        {
          id: 'app-001',
          candidatId: 'candidat-001',
          offerId: 'job-001',
          restaurantId: 'rest-001',
          restaurantName: 'Le Grand VÃ©four',
          position: 'Chef de partie - Restaurant gastronomique',
          location: 'Paris 1er',
          appliedDate: '2024-01-18T14:30:00Z',
          status: 'pending',
          contractType: 'CDI',
          message: 'Bonjour, je suis trÃ¨s intÃ©ressÃ© par le poste de Chef de partie dans votre restaurant Ã©toilÃ©...',
          cv: 'CV_Alexandre_Dubois_2024.pdf',
          coverLetter: 'Lettre_motivation_Alexandre.pdf',
          priority: 'high',
          lastUpdate: '2024-01-18T14:30:00Z'
        },
        {
          id: 'app-002',
          candidatId: 'candidat-001',
          offerId: 'job-002',
          restaurantId: 'rest-002',
          restaurantName: 'Brasserie Lipp',
          position: 'Sous-chef - Brasserie moderne',
          location: 'Paris 6Ã¨me',
          appliedDate: '2024-01-16T10:15:00Z',
          status: 'interview',
          contractType: 'CDI',
          salary: '2600-3200â‚¬/mois',
          message: 'Madame, Monsieur, fort de mes 8 annÃ©es d\'expÃ©rience en cuisine...',
          cv: 'CV_Alexandre_Dubois_2024.pdf',
          interviewDate: '2024-01-25T15:00:00Z',
          interviewNotes: 'Entretien avec le chef exÃ©cutif et le directeur',
          priority: 'urgent',
          lastUpdate: '2024-01-20T11:00:00Z'
        },
        {
          id: 'app-003',
          candidatId: 'candidat-001',
          offerId: 'job-003',
          restaurantId: 'rest-003',
          restaurantName: 'Restaurant Septime',
          position: 'Chef de partie - Cuisine moderne',
          location: 'Paris 11Ã¨me',
          appliedDate: '2024-01-14T16:45:00Z',
          status: 'rejected',
          contractType: 'CDI',
          message: 'Bonjour, votre restaurant Ã©tant reconnu pour sa cuisine crÃ©ative...',
          cv: 'CV_Alexandre_Dubois_2024.pdf',
          coverLetter: 'Lettre_motivation_Alexandre.pdf',
          feedback: 'Profil intÃ©ressant mais recherche candidat avec expÃ©rience cuisine vÃ©gÃ©tarienne',
          priority: 'medium',
          lastUpdate: '2024-01-19T14:20:00Z'
        }
      ],

      jobOffers: [
        {
          id: 'job-001',
          restaurantId: 'rest-001',
          restaurantName: 'Le Grand VÃ©four',
          restaurantType: 'Restaurant gastronomique',
          title: 'Chef de partie - Restaurant gastronomique',
          position: 'Chef de partie',
          description: 'Nous recherchons un Chef de partie expÃ©rimentÃ© pour rejoindre notre brigade dans un restaurant Ã©toilÃ© au cÅ“ur de Paris.',
          location: 'Paris 1er arrondissement',
          contractType: 'CDI',
          salary: {
            min: 2400,
            max: 2800,
            currency: 'EUR',
            period: 'monthly',
            negotiable: true
          },
          requirements: {
            experience: 'expert',
            skills: ['Cuisine franÃ§aise', 'Gestion d\'Ã©quipe', 'HACCP', 'CrÃ©ativitÃ©'],
            languages: ['FranÃ§ais'],
            certifications: ['HACCP', 'Permis d\'exploitation'],
            education: 'CAP Cuisine minimum'
          },
          conditions: {
            workingHours: '48h/semaine',
            schedule: ['mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
            benefits: ['Mutuelle entreprise', 'Tickets restaurant', '5 semaines congÃ©s', 'Formation continue'],
            startDate: '2024-03-01'
          },
          contact: {
            personName: 'Marie Dubois',
            email: 'recrutement@grandvefour.fr',
            phone: '+33 1 42 86 87 88'
          },
          status: 'active',
          urgent: false,
          featured: true,
          applicationsCount: 12,
          viewsCount: 89,
          postedDate: '2024-01-15T09:00:00Z',
          expiryDate: '2024-02-15T23:59:59Z',
          tags: ['gastronomique', 'Ã©toilÃ©', 'paris', 'expÃ©rience']
        },
        {
          id: 'job-002',
          restaurantId: 'rest-002',
          restaurantName: 'Brasserie Lipp',
          restaurantType: 'Brasserie',
          title: 'Sous-chef - Brasserie moderne',
          position: 'Sous-chef',
          description: 'Brasserie parisienne historique recherche un Sous-chef pour seconder le chef exÃ©cutif et manager l\'Ã©quipe de cuisine.',
          location: 'Saint-Germain-des-PrÃ©s, Paris 6Ã¨me',
          contractType: 'CDI',
          salary: {
            min: 2600,
            max: 3200,
            currency: 'EUR',
            period: 'monthly',
            negotiable: false
          },
          requirements: {
            experience: 'senior',
            skills: ['Management', 'Cuisine franÃ§aise', 'Gestion des coÃ»ts', 'Organisation'],
            languages: ['FranÃ§ais'],
            certifications: ['HACCP'],
            education: 'CAP Cuisine + formation management'
          },
          conditions: {
            workingHours: '45h/semaine',
            schedule: ['mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
            benefits: ['Mutuelle et prÃ©voyance', 'Prime de performance', 'Formation et Ã©volution'],
            startDate: '2024-02-15'
          },
          contact: {
            personName: 'Jean-Pierre Martin',
            email: 'jp.martin@brasserielipp.fr',
            phone: '+33 1 45 48 53 91'
          },
          status: 'active',
          urgent: true,
          featured: false,
          applicationsCount: 8,
          viewsCount: 156,
          postedDate: '2024-01-12T14:00:00Z',
          expiryDate: '2024-01-30T23:59:59Z',
          tags: ['sous-chef', 'management', 'brasserie', 'urgent']
        }
      ],

      savedSearches: [
        {
          id: 'search-001',
          candidatId: 'candidat-001',
          name: 'Chef de partie Paris gastronomique',
          filters: {
            keywords: 'chef de partie cuisine gastronomique',
            position: ['Chef de partie'],
            location: ['Paris', 'RÃ©gion parisienne'],
            contractType: ['CDI'],
            salaryMin: 2200,
            salaryMax: 3000,
            experience: 'expert',
            restaurantType: ['Gastronomique']
          },
          alertsEnabled: true,
          lastChecked: '2024-01-20T08:00:00Z',
          newOffersCount: 3,
          createdAt: '2024-01-15T16:30:00Z'
        },
        {
          id: 'search-002',
          candidatId: 'candidat-001',
          name: 'Sous-chef brasserie Paris',
          filters: {
            keywords: 'sous-chef management',
            position: ['Sous-chef', 'Chef de cuisine'],
            location: ['Paris'],
            contractType: ['CDI', 'CDD'],
            salaryMin: 2500,
            salaryMax: 3500,
            experience: 'senior',
            restaurantType: ['Brasserie']
          },
          alertsEnabled: true,
          lastChecked: '2024-01-18T08:00:00Z',
          newOffersCount: 1,
          createdAt: '2024-01-10T12:00:00Z'
        }
      ],

      candidatStats: {
        totalApplications: 8,
        pendingApplications: 3,
        interviewsScheduled: 1,
        offersReceived: 0,
        profileViews: 127,
        searchAlerts: 2,
        successRate: 25,
        averageResponseTime: 3.2,
        lastActivity: '2024-01-20T15:45:00Z',
        recommendedOffers: 5
      },

      // Annonces Globales - ChargÃ©es depuis MongoDB
      globalAnnouncements: [],

      announcementConfirmations: [],
      announcementInteractions: [],
      
      // Marketplace Posts - ChargÃ©s depuis MongoDB via /api/marketplace/posts
      marketplacePosts: [],

      // ========== DONNÃ‰ES MODULES BANQUES & COMPTABLE ==========
      
      // Module Banques - DonnÃ©es rÃ©elles
      bankPartners: [
        {
          id: 'bank-001',
          name: 'BNP Paribas Professionnels',
          logo: '/logos/bnp-paribas.png',
          type: 'banque_traditionnelle',
          location: {
            city: 'Paris',
            region: 'ÃŽle-de-France',
            address: '16 Boulevard des Italiens, 75009 Paris',
            coordinates: [2.3392, 48.8718]
          },
          contact: {
            phone: '01 42 98 12 34',
            email: 'pro.paris9@bnpparibas.fr',
            website: 'https://professionnels.bnpparibas.fr',
            agentName: 'Marie Dupont'
          },
          rating: 4.2,
          reviewCount: 234,
          specialties: ['CrÃ©dit professionnel', 'Financement Ã©quipement', 'CrÃ©dit trÃ©sorerie'],
          isActive: true,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'bank-002',
          name: 'CrÃ©dit Mutuel Restauration',
          logo: '/logos/credit-mutuel.png',
          type: 'credit_mutuel',
          location: {
            city: 'Paris',
            region: 'ÃŽle-de-France',
            address: '45 Avenue de la RÃ©publique, 75011 Paris',
            coordinates: [2.3686, 48.8648]
          },
          contact: {
            phone: '01 48 06 78 90',
            email: 'contact.pro@creditmutuel.fr',
            website: 'https://pro.creditmutuel.fr',
            agentName: 'Jean-Pierre Martin'
          },
          rating: 4.5,
          reviewCount: 189,
          specialties: ['PrÃªt restauration', 'Leasing Ã©quipement', 'Financement travaux'],
          isActive: true,
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'bank-003',
          name: 'Banque Populaire Entreprises',
          logo: '/logos/banque-populaire.png',
          type: 'banque_populaire',
          location: {
            city: 'Paris',
            region: 'ÃŽle-de-France',
            address: '28 Rue de Rivoli, 75004 Paris',
            coordinates: [2.3567, 48.8566]
          },
          contact: {
            phone: '01 44 94 56 78',
            email: 'entreprises@bpop.fr',
            website: 'https://entreprises.banquepopulaire.fr',
            agentName: 'Sophie Leroy'
          },
          rating: 4.1,
          reviewCount: 156,
          specialties: ['CrÃ©dit court terme', 'Affacturage', 'PrÃªt immobilier pro'],
          isActive: true,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],

      loanOffers: [
        {
          id: 'loan-001',
          bankId: 'bank-001',
          bankName: 'BNP Paribas Professionnels',
          type: 'credit_professionnel',
          title: 'CrÃ©dit Professionnel Restaurant Express',
          description: 'Financement rapide pour Ã©quipement et fonds de roulement. DÃ©blocage sous 48h aprÃ¨s accord.',
          conditions: {
            minAmount: 5000,
            maxAmount: 150000,
            minDuration: 12,
            maxDuration: 84,
            interestRateMin: 2.8,
            interestRateMax: 5.2,
            processingFee: 200,
            guaranteeRequired: true,
            minTurnover: 50000
          },
          eligibility: {
            businessAge: 1,
            targetSectors: ['Restauration', 'HÃ´tellerie', 'Traiteur'],
            creditScoreMin: 650,
            turnoverMin: 50000
          },
          documents: ['Bilans 2 derniÃ¨res annÃ©es', 'RelevÃ©s bancaires 6 mois', 'Kbis rÃ©cent', 'PrÃ©visionnels'],
          processingTime: '48h Ã  5 jours',
          advantages: ['Taux prÃ©fÃ©rentiel restauration', 'DÃ©blocage express', 'Report premier remboursement'],
          status: 'active',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'loan-002',
          bankId: 'bank-002',
          bankName: 'CrÃ©dit Mutuel Restauration',
          type: 'pret_equipement',
          title: 'PrÃªt Ã‰quipement Cuisine Pro',
          description: 'Financement spÃ©cialisÃ© pour Ã©quipement de cuisine professionnelle. Partenariats avec les grands fournisseurs.',
          conditions: {
            minAmount: 3000,
            maxAmount: 80000,
            minDuration: 24,
            maxDuration: 60,
            interestRateMin: 2.1,
            interestRateMax: 4.8,
            processingFee: 150,
            guaranteeRequired: false,
            minTurnover: 30000
          },
          eligibility: {
            businessAge: 0.5,
            targetSectors: ['Restauration', 'Boulangerie', 'PÃ¢tisserie'],
            turnoverMin: 30000
          },
          documents: ['Devis Ã©quipement', 'Kbis', 'RelevÃ©s bancaires 3 mois'],
          processingTime: '3 Ã  7 jours',
          advantages: ['Taux attractif Ã©quipement', 'Financement Ã  100%', 'Maintenance incluse'],
          status: 'active',
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'loan-003',
          bankId: 'bank-003',
          bankName: 'Banque Populaire Entreprises',
          type: 'credit_tresorerie',
          title: 'CrÃ©dit TrÃ©sorerie SaisonnalitÃ©',
          description: 'Solution de financement court terme pour faire face aux variations saisonniÃ¨res.',
          conditions: {
            minAmount: 10000,
            maxAmount: 200000,
            minDuration: 3,
            maxDuration: 18,
            interestRateMin: 3.2,
            interestRateMax: 6.5,
            processingFee: 300,
            guaranteeRequired: true,
            minTurnover: 100000
          },
          eligibility: {
            businessAge: 2,
            targetSectors: ['Restauration', 'Tourism', 'Ã‰vÃ©nementiel'],
            creditScoreMin: 700,
            turnoverMin: 100000
          },
          documents: ['Historique activitÃ© 3 ans', 'PrÃ©visionnel saisonnier', 'Garanties'],
          processingTime: '5 Ã  10 jours',
          advantages: ['Utilisation flexible', 'IntÃ©rÃªts sur utilisÃ© uniquement', 'Renouvellement automatique'],
          status: 'active',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],

      bankConversations: [],

      // Module Comptable - DonnÃ©es rÃ©elles (Restaurant uniquement)
      accountantProfile: {
        id: 'accountant-001',
        name: 'Claire Moreau',
        firm: 'Cabinet Moreau & AssociÃ©s',
        siret: '48392847291847',
        expertise: ['tva', 'bilan', 'social', 'fiscalite'],
        certifications: ['Expert-comptable mÃ©morialiste', 'Commissaire aux comptes'],
        location: {
          address: '25 Rue du Commerce, 75015 Paris',
          city: 'Paris',
          postalCode: '75015'
        },
        contact: {
          phone: '01 45 67 89 12',
          email: 'claire.moreau@cabinet-moreau.fr',
          website: 'https://cabinet-moreau.fr'
        },
        rating: 4.7,
        reviewCount: 89,
        yearsExperience: 12,
        specializations: ['Restauration', 'Commerce de dÃ©tail', 'PME'],
        isActive: true,
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
      },

      accountingDocuments: [
        {
          id: 'doc-001',
          accountantId: 'accountant-001',
          userId: 'restaurant-user-001',
          type: 'declaration_tva',
          title: 'DÃ©claration TVA - Septembre 2025',
          description: 'DÃ©claration de TVA pour le mois de septembre 2025, Ã  valider et signer.',
          fileName: 'TVA_Sept2025_Restaurant.pdf',
          fileSize: 1024000,
          mimeType: 'application/pdf',
          isConfidential: true,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          tags: ['TVA', 'DÃ©claration', 'Urgent'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'doc-002',
          accountantId: 'accountant-001',
          userId: 'restaurant-user-001',
          type: 'bilan',
          title: 'Bilan Comptable 2024',
          description: 'Bilan comptable annuel 2024 - Version finale pour approbation.',
          fileName: 'Bilan_2024_Final.xlsx',
          fileSize: 2048000,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          isConfidential: true,
          status: 'reviewed',
          tags: ['Bilan', 'Annuel', '2024'],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],

      accountantConversations: [
        {
          id: 'conv-001',
          accountantId: 'accountant-001',
          userId: 'restaurant-user-001',
          subject: 'Questions TVA sur livraisons Ã  domicile',
          priority: 'medium',
          category: 'declaration',
          status: 'active',
          messages: [
            {
              id: 'msg-001',
              senderId: 'restaurant-user-001',
              senderName: 'Restaurant Manager',
              senderType: 'user',
              content: 'Bonjour Claire, j\'ai une question sur la TVA applicable aux livraisons Ã  domicile. Devons-nous appliquer un taux diffÃ©rent ?',
              type: 'text',
              isEncrypted: true,
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              isRead: true,
              readAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-002',
              senderId: 'accountant-001',
              senderName: 'Claire Moreau',
              senderType: 'accountant',
              content: 'Bonjour, pour les livraisons Ã  domicile, le taux reste inchangÃ© Ã  10% pour la restauration. Cependant, il faut distinguer les frais de livraison qui sont Ã  20%.',
              type: 'text',
              isEncrypted: true,
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              isRead: true,
              readAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            }
          ],
          documents: [],
          alerts: [],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ],

      accountingAlerts: [
        {
          id: 'alert-001',
          type: 'declaration_due',
          title: 'DÃ©claration TVA Ã  Ã©chÃ©ance',
          message: 'La dÃ©claration de TVA de septembre doit Ãªtre validÃ©e avant le 6 octobre.',
          severity: 'warning',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'alert-002',
          type: 'document_missing',
          title: 'Documents manquants bilan',
          message: 'Il manque les factures fournisseurs de dÃ©cembre pour finaliser le bilan.',
          severity: 'info',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],

      // ========== ACTIONS MODULES BANQUES & COMPTABLE ==========
      
      // Actions Module Banques
      getBanksByLocation: (city?: string, region?: string) => {
        const { bankPartners } = get();
        if (!city && !region) return bankPartners;
        return bankPartners.filter(bank => 
          (city && bank.location.city === city) || 
          (region && bank.location.region === region)
        );
      },

      getLoanOffersByType: (type?: LoanOffer['type']) => {
        const { loanOffers } = get();
        if (!type) return loanOffers.filter(offer => offer.status === 'active');
        return loanOffers.filter(offer => offer.type === type && offer.status === 'active');
      },

      createBankConversation: (bankId: string, subject: string, message: string) => {
        const conversationId = `conv-bank-${Date.now()}`;
        const messageId = `msg-${Date.now()}`;
        
        const newConversation: BankConversation = {
          id: conversationId,
          bankId,
          userId: 'current-user', // Ã€ remplacer par l'ID utilisateur rÃ©el
          subject,
          status: 'active',
          messages: [{
            id: messageId,
            senderId: 'current-user',
            senderName: 'Restaurant Manager',
            senderType: 'user',
            content: message,
            type: 'text',
            isEncrypted: true,
            timestamp: new Date().toISOString(),
            isRead: false
          }],
          documents: [],
          loanOfferId: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        set(state => ({
          bankConversations: [...state.bankConversations, newConversation]
        }));

        return conversationId;
      },

      sendBankMessage: (conversationId: string, content: string, attachments: MessageAttachment[] = []) => {
        const messageId = `msg-${Date.now()}`;
        
        const newMessage: EncryptedMessage = {
          id: messageId,
          senderId: 'current-user',
          senderName: 'Restaurant Manager',
          senderType: 'user' as const,
          content,
          type: attachments.length > 0 ? 'document' as const : 'text' as const,
          isEncrypted: true,
          timestamp: new Date().toISOString(),
          isRead: false,
          attachments
        };

        set(state => ({
          bankConversations: state.bankConversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date().toISOString(),
                  lastActivity: new Date().toISOString()
                }
              : conv
          )
        }));

        return messageId;
      },

      markBankMessageRead: (conversationId: string, messageId: string) => {
        set(state => ({
          bankConversations: state.bankConversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === messageId
                      ? { ...msg, isRead: true, readAt: new Date().toISOString() }
                      : msg
                  )
                }
              : conv
          )
        }));
      },

      // Actions Module Comptable (Restaurant uniquement)
      assignAccountant: (accountantData: Partial<AccountantProfile>) => {
        set(() => ({
          accountantProfile: {
            ...accountantData,
            isActive: true,
            createdAt: new Date().toISOString()
          } as AccountantProfile
        }));
      },

      createAccountingConversation: (subject: string, message: string, category: AccountantConversation['category'] = 'general', priority: AccountantConversation['priority'] = 'medium') => {
        const conversationId = `conv-acc-${Date.now()}`;
        const messageId = `msg-${Date.now()}`;
        
        const newConversation: AccountantConversation = {
          id: conversationId,
          accountantId: get().accountantProfile?.id || 'accountant-001',
          userId: 'current-user',
          subject,
          priority,
          category,
          status: 'active',
          messages: [{
            id: messageId,
            senderId: 'current-user',
            senderName: 'Restaurant Manager',
            senderType: 'user',
            content: message,
            type: 'text',
            isEncrypted: true,
            timestamp: new Date().toISOString(),
            isRead: false
          }],
          documents: [],
          alerts: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        set(state => ({
          accountantConversations: [...state.accountantConversations, newConversation]
        }));

        return conversationId;
      },

      sendAccountingMessage: (conversationId: string, content: string, attachments: MessageAttachment[] = []) => {
        const messageId = `msg-${Date.now()}`;
        
        const newMessage: EncryptedMessage = {
          id: messageId,
          senderId: 'current-user',
          senderName: 'Restaurant Manager',
          senderType: 'user' as const,
          content,
          type: attachments.length > 0 ? 'document' as const : 'text' as const,
          isEncrypted: true,
          timestamp: new Date().toISOString(),
          isRead: false,
          attachments
        };

        set(state => ({
          accountantConversations: state.accountantConversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date().toISOString(),
                  lastActivity: new Date().toISOString()
                }
              : conv
          )
        }));

        return messageId;
      },

      uploadAccountingDocument: (documentData: Omit<AccountingDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
        const documentId = `doc-${Date.now()}`;
        
        const newDocument: AccountingDocument = {
          ...documentData,
          id: documentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          accountingDocuments: [...state.accountingDocuments, newDocument]
        }));

        return documentId;
      },

      markAccountingAlertRead: (alertId: string) => {
        set(state => ({
          accountingAlerts: state.accountingAlerts.map(alert =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
          )
        }));
      },

      // Actions principales (existantes)
      createOffer: (offerData) => {
        const newOffer: RestaurantOffer = {
          ...offerData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          applicationsCount: 0,
          restaurantId: 'restaurant-1'
        };
        set((state) => ({
          offers: [newOffer, ...state.offers]
        }));
      },

      updateOffer: (id, updates) => {
        set((state) => ({
          offers: state.offers.map(offer => 
            offer.id === id ? { ...offer, ...updates } : offer
          )
        }));
      },

      deleteOffer: (id) => {
        set((state) => ({
          offers: state.offers.filter(offer => offer.id !== id)
        }));
      },

      searchProfessionals: (query, filters = {}) => {
        const { professionals } = get();
        let results = professionals;

        if (query) {
          results = results.filter(pro => 
            pro.name.toLowerCase().includes(query.toLowerCase()) ||
            pro.specialty.toLowerCase().includes(query.toLowerCase()) ||
            pro.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
          );
        }

        if (filters.role && filters.role !== 'all') {
          results = results.filter(pro => pro.role === filters.role);
        }

        if (filters.location) {
          results = results.filter(pro => 
            pro.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }

        if (filters.urgent) {
          results = results.filter(pro => 
            pro.availability.toLowerCase().includes('disponible') ||
            pro.badges.some(badge => badge.toLowerCase().includes('urgence'))
          );
        }

        if (filters.ecoFriendly) {
          results = results.filter(pro => pro.ecoFriendly);
        }

        return results.sort((a, b) => b.rating - a.rating);
      },

      applyToOffer: (offerId, professionalId, message, proposedPrice) => {
        const newApplication: Application = {
          id: Date.now().toString(),
          offerId,
          professionalId,
          message,
          proposedPrice,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          applications: [newApplication, ...state.applications],
          offers: state.offers.map(offer => 
            offer.id === offerId 
              ? { ...offer, applicationsCount: offer.applicationsCount + 1 }
              : offer
          ),
          stats: {
            ...state.stats,
            pendingApplications: state.stats.pendingApplications + 1
          }
        }));
      },

      updateApplicationStatus: (applicationId, status) => {
        set((state) => ({
          applications: state.applications.map(app => 
            app.id === applicationId ? { ...app, status } : app
          )
        }));
      },

      sendMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          read: false
        };

        set((state) => ({
          messages: [newMessage, ...state.messages],
          stats: {
            ...state.stats,
            unreadMessages: state.stats.unreadMessages + 1
          }
        }));
      },

      markMessageAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          ),
          stats: {
            ...state.stats,
            unreadMessages: Math.max(0, state.stats.unreadMessages - 1)
          }
        }));
      },

      updateStats: (newStats) => {
        set((state) => ({
          stats: { ...state.stats, ...newStats }
        }));
      },

      // Actions CRUD pour les professionnels (Admin)
      createProfessional: (professionalData) => {
        const newProfessional: Professional = {
          ...professionalData,
          id: Date.now().toString(),
        };

        set((state) => ({
          professionals: [newProfessional, ...state.professionals]
        }));
      },

      updateProfessional: (id, updates) => {
        set((state) => ({
          professionals: state.professionals.map(pro => 
            pro.id === id ? { ...pro, ...updates } : pro
          )
        }));
      },

      deleteProfessional: (id) => {
        set((state) => ({
          professionals: state.professionals.filter(pro => pro.id !== id),
          // Supprimer aussi ses candidatures et messages
          applications: state.applications.filter(app => app.professionalId !== id),
          messages: state.messages.filter(msg => msg.fromId !== id && msg.toId !== id)
        }));
      },

      toggleProfessionalVerification: (id) => {
        set((state) => ({
          professionals: state.professionals.map(pro => 
            pro.id === id ? { ...pro, verified: !pro.verified } : pro
          )
        }));
      },

      suspendProfessional: (id, reason = 'Suspension administrative') => {
        set((state) => ({
          professionals: state.professionals.map(pro => 
            pro.id === id ? { 
              ...pro, 
              verified: false,
              description: `[SUSPENDU: ${reason}] ${pro.description}`
            } : pro
          )
        }));
      },

      // Actions de modÃ©ration
      approveMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { 
              ...msg, 
              content: `[APPROUVÃ‰] ${msg.content}`
            } : msg
          )
        }));
      },

      rejectMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== messageId)
        }));
      },

      validateOffer: (offerId) => {
        set((state) => ({
          offers: state.offers.map(offer => 
            offer.id === offerId ? { 
              ...offer, 
              status: 'active' as const,
              description: `[VALIDÃ‰] ${offer.description}`
            } : offer
          )
        }));
      },

      rejectOffer: (offerId, reason = 'Non conforme aux conditions') => {
        set((state) => ({
          offers: state.offers.map(offer => 
            offer.id === offerId ? { 
              ...offer, 
              status: 'paused' as const,
              description: `[REJETÃ‰: ${reason}] ${offer.description}`
            } : offer
          )
        }));
      },

      flagContent: (type, id, reason) => {
        // Dans un vrai systÃ¨me, cela crÃ©erait un rapport de modÃ©ration
        
        if (type === 'professional') {
          set((state) => ({
            professionals: state.professionals.map(pro => 
              pro.id === id ? { 
                ...pro, 
                description: `[SIGNALÃ‰: ${reason}] ${pro.description}`
              } : pro
            )
          }));
        }
      },

      // Actions pour les fournisseurs
      createProduct: (productData) => {
        const newProduct: SupplierProduct = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          views: 0,
          orders: 0,
          rating: 0
        };

        set((state) => ({
          supplierProducts: [newProduct, ...state.supplierProducts],
          supplierStats: {
            ...state.supplierStats,
            totalProducts: state.supplierStats.totalProducts + 1
          }
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          supplierProducts: state.supplierProducts.map(product =>
            product.id === id ? { 
              ...product, 
              ...updates, 
              lastUpdated: new Date().toISOString() 
            } : product
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          supplierProducts: state.supplierProducts.filter(product => product.id !== id),
          supplierStats: {
            ...state.supplierStats,
            totalProducts: Math.max(0, state.supplierStats.totalProducts - 1)
          }
        }));
      },

      updateProductStock: (id, stock) => {
        set((state) => ({
          supplierProducts: state.supplierProducts.map(product =>
            product.id === id ? { 
              ...product, 
              stock,
              availability: stock > 0 ? (stock > 10 ? 'available' : 'limited') : 'out_of_stock',
              lastUpdated: new Date().toISOString() 
            } : product
          )
        }));
      },

      createOrder: (orderData) => {
        const newOrder: SupplierOrder = {
          ...orderData,
          id: Date.now().toString(),
          orderDate: new Date().toISOString()
        };

        set((state) => ({
          supplierOrders: [newOrder, ...state.supplierOrders],
          supplierStats: {
            ...state.supplierStats,
            totalOrders: state.supplierStats.totalOrders + 1,
            pendingOrders: state.supplierStats.pendingOrders + 1,
            monthlyRevenue: state.supplierStats.monthlyRevenue + newOrder.totalAmount
          }
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => {
          const order = state.supplierOrders.find(o => o.id === id);
          const wasPending = order?.status === 'pending' || order?.status === 'confirmed';
          const isNowCompleted = status === 'delivered';

          return {
            supplierOrders: state.supplierOrders.map(order =>
              order.id === id ? { ...order, status } : order
            ),
            supplierStats: {
              ...state.supplierStats,
              pendingOrders: wasPending && isNowCompleted 
                ? Math.max(0, state.supplierStats.pendingOrders - 1)
                : state.supplierStats.pendingOrders
            }
          };
        });
      },

      addClient: (clientData) => {
        const newClient: SupplierClient = {
          ...clientData,
          id: Date.now().toString()
        };

        set((state) => ({
          supplierClients: [newClient, ...state.supplierClients],
          supplierStats: {
            ...state.supplierStats,
            totalClients: state.supplierStats.totalClients + 1
          }
        }));
      },

      updateClient: (id, updates) => {
        set((state) => ({
          supplierClients: state.supplierClients.map(client =>
            client.id === id ? { ...client, ...updates } : client
          )
        }));
      },

      updateSupplierStats: (stats) => {
        set((state) => ({
          supplierStats: {
            ...state.supplierStats,
            ...stats
          }
        }));
      },

      // Actions Community Manager
      createCMService: (serviceData) => {
        const newService: CommunityManagerService = {
          ...serviceData,
          id: `cm-service-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          cmServices: [newService, ...state.cmServices],
          cmStats: {
            ...state.cmStats,
            totalServices: state.cmStats.totalServices + 1,
            activeServices: serviceData.status === 'active' ? state.cmStats.activeServices + 1 : state.cmStats.activeServices
          }
        }));
      },

      updateCMService: (id, updates) => {
        set((state) => ({
          cmServices: state.cmServices.map(service =>
            service.id === id ? { 
              ...service, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } : service
          )
        }));
      },

      deleteCMService: (id) => {
        set((state) => ({
          cmServices: state.cmServices.filter(service => service.id !== id),
          cmStats: {
            ...state.cmStats,
            totalServices: Math.max(0, state.cmStats.totalServices - 1)
          }
        }));
      },

      createCMCampaign: (campaignData) => {
        const newCampaign: CommunityManagerCampaign = {
          ...campaignData,
          id: `cm-campaign-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          cmCampaigns: [newCampaign, ...state.cmCampaigns],
          cmStats: {
            ...state.cmStats,
            totalCampaigns: state.cmStats.totalCampaigns + 1,
            activeCampaigns: campaignData.status === 'active' ? state.cmStats.activeCampaigns + 1 : state.cmStats.activeCampaigns
          }
        }));
      },

      updateCMCampaign: (id, updates) => {
        set((state) => ({
          cmCampaigns: state.cmCampaigns.map(campaign =>
            campaign.id === id ? { 
              ...campaign, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } : campaign
          )
        }));
      },

      deleteCMCampaign: (id) => {
        set((state) => ({
          cmCampaigns: state.cmCampaigns.filter(campaign => campaign.id !== id),
          cmStats: {
            ...state.cmStats,
            totalCampaigns: Math.max(0, state.cmStats.totalCampaigns - 1)
          }
        }));
      },

      updateCampaignMetrics: (id, metrics) => {
        set((state) => ({
          cmCampaigns: state.cmCampaigns.map(campaign =>
            campaign.id === id ? { 
              ...campaign, 
              metrics: { ...campaign.metrics, ...metrics },
              updatedAt: new Date().toISOString() 
            } : campaign
          )
        }));
      },

      addCMClient: (clientData) => {
        const newClient: CommunityManagerClient = {
          ...clientData,
          id: `cm-client-${Date.now()}`
        };
        set((state) => ({
          cmClients: [newClient, ...state.cmClients],
          cmStats: {
            ...state.cmStats,
            totalClients: state.cmStats.totalClients + 1,
            activeClients: clientData.status === 'active' ? state.cmStats.activeClients + 1 : state.cmStats.activeClients
          }
        }));
      },

      updateCMClient: (id, updates) => {
        set((state) => ({
          cmClients: state.cmClients.map(client =>
            client.id === id ? { ...client, ...updates } : client
          )
        }));
      },

      updateCMStats: (stats) => {
        set((state) => ({
          cmStats: {
            ...state.cmStats,
            ...stats
          }
        }));
      },

      // Actions Candidat
      updateCandidatProfile: (profile) => {
        set((state) => ({
          candidatProfile: {
            ...state.candidatProfile,
            ...profile,
            updatedAt: new Date().toISOString()
          }
        }));
      },

      addJobApplication: (application) => {
        const newApplication: CandidatJobApplication = {
          ...application,
          id: `app-${Date.now()}`,
          lastUpdate: new Date().toISOString()
        };
        
        set((state) => ({
          candidatApplications: [...state.candidatApplications, newApplication],
          candidatStats: {
            ...state.candidatStats,
            totalApplications: state.candidatStats.totalApplications + 1,
            pendingApplications: state.candidatStats.pendingApplications + 1,
            lastActivity: new Date().toISOString()
          }
        }));
      },

      updateJobApplication: (id, application) => {
        set((state) => ({
          candidatApplications: state.candidatApplications.map((app) =>
            app.id === id
              ? { ...app, ...application, lastUpdate: new Date().toISOString() }
              : app
          )
        }));
      },

      deleteJobApplication: (id) => {
        set((state) => ({
          candidatApplications: state.candidatApplications.filter((app) => app.id !== id),
          candidatStats: {
            ...state.candidatStats,
            totalApplications: Math.max(0, state.candidatStats.totalApplications - 1),
            lastActivity: new Date().toISOString()
          }
        }));
      },

      addSavedSearch: (search) => {
        const newSearch: SavedJobSearch = {
          ...search,
          id: `search-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          savedSearches: [...state.savedSearches, newSearch],
          candidatStats: {
            ...state.candidatStats,
            searchAlerts: state.candidatStats.searchAlerts + 1,
            lastActivity: new Date().toISOString()
          }
        }));
      },

      updateSavedSearch: (id, search) => {
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, ...search } : s
          )
        }));
      },

      deleteSavedSearch: (id) => {
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
          candidatStats: {
            ...state.candidatStats,
            searchAlerts: Math.max(0, state.candidatStats.searchAlerts - 1),
            lastActivity: new Date().toISOString()
          }
        }));
      },

      updateCandidatStats: (stats) => {
        set((state) => ({
          candidatStats: {
            ...state.candidatStats,
            ...stats,
            lastActivity: new Date().toISOString()
          }
        }));
      },

      // Actions Annonces Globales
      fetchGlobalAnnouncements: async () => {
        try {
          const token = localStorage.getItem('token');
          console.log('ðŸ” [fetchAnnouncements] Token prÃ©sent:', !!token);
          
          const response = await fetch(`${API_BASE_URL}/announcements`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('ðŸ” [fetchAnnouncements] Status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error('âŒ [fetchAnnouncements] Erreur:', response.status, errorData);
            return;
          }

          const result = await response.json();
          console.log('âœ… [fetchAnnouncements] RÃ©sultat:', result.count, 'annonces');
          
          if (result.success && result.data) {
            set({ globalAnnouncements: result.data });
          }
        } catch (error) {
          console.error('âŒ [fetchAnnouncements] Exception:', error);
        }
      },

      createAnnouncement: (announcementData) => {
        const newAnnouncement: GlobalAnnouncement = {
          ...announcementData,
          id: `ann-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastConfirmedAt: new Date().toISOString(),
          nextConfirmationDue: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4h
          viewCount: 0,
          clickCount: 0,
          contactCount: 0
        };
        
        set((state) => ({
          globalAnnouncements: [newAnnouncement, ...state.globalAnnouncements]
        }));
      },

      updateAnnouncement: (id, announcementData) => {
        set((state) => ({
          globalAnnouncements: state.globalAnnouncements.map((ann) =>
            ann.id === id 
              ? { ...ann, ...announcementData, updatedAt: new Date().toISOString() }
              : ann
          )
        }));
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          globalAnnouncements: state.globalAnnouncements.filter((ann) => ann.id !== id)
        }));
      },

      confirmAnnouncementActive: (id, isActive) => {
        const now = new Date();
        if (isActive) {
          // L'annonce reste active, programmer prochaine confirmation dans 4h
          set((state) => ({
            globalAnnouncements: state.globalAnnouncements.map((ann) =>
              ann.id === id 
                ? {
                    ...ann,
                    status: 'active',
                    lastConfirmedAt: now.toISOString(),
                    nextConfirmationDue: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()
                  }
                : ann
            )
          }));
        } else {
          // Supprimer l'annonce car elle n'est plus d'actualitÃ©
          set((state) => ({
            globalAnnouncements: state.globalAnnouncements.filter((ann) => ann.id !== id)
          }));
        }
      },

      recordAnnouncementInteraction: (interactionData) => {
        const newInteraction: AnnouncementInteraction = {
          ...interactionData,
          id: `int-${Date.now()}`,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          announcementInteractions: [newInteraction, ...state.announcementInteractions],
          globalAnnouncements: state.globalAnnouncements.map((ann) => {
            if (ann.id === interactionData.announcementId) {
              const updates: Partial<GlobalAnnouncement> = {};
              switch (interactionData.type) {
                case 'view':
                  updates.viewCount = ann.viewCount + 1;
                  break;
                case 'click':
                  updates.clickCount = ann.clickCount + 1;
                  break;
                case 'contact':
                  updates.contactCount = ann.contactCount + 1;
                  break;
              }
              return { ...ann, ...updates };
            }
            return ann;
          })
        }));
      },

      getAnnouncementsForRole: (userRole) => {
        const state = get();
        return state.globalAnnouncements.filter((ann) => {
          // VÃ©rifier si l'annonce est active
          if (ann.status !== 'active') return false;
          
          // VÃ©rifier si l'annonce n'a pas expirÃ©
          if (ann.expiresAt && new Date(ann.expiresAt) < new Date()) return false;
          
          // VÃ©rifier les rÃ¨gles d'exclusion
          if (ann.excludeRoles && ann.excludeRoles.includes(userRole)) return false;
          
          // VÃ©rifier le ciblage
          if (ann.targetAudience === 'all') return true;
          if (Array.isArray(ann.targetAudience) && ann.targetAudience.includes(userRole)) return true;
          
          return false;
        }).sort((a, b) => {
          // Tri par prioritÃ© puis par date
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff !== 0) return priorityDiff;
          
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      },

      // ========== ACTIONS MARKETPLACE ==========
      
      fetchMarketplacePosts: async () => {
        try {
          console.log('ðŸ” [fetchMarketplace] Chargement des posts...');
          
          // Utiliser scoring intelligent si feature flag activÃ©
          const endpoint = FEATURES.SMART_RANKING 
            ? '/marketplace/posts/ranked'
            : '/marketplace/posts';
          
          const response = await apiClient.get(endpoint);
          console.log('âœ… [fetchMarketplace] RÃ©ponse:', response.data);
          
          // L'API retourne { success, data: { posts: [...] } }
          if (response.data?.success && response.data?.data?.posts) {
            set({ marketplacePosts: response.data.data.posts });
            console.log('âœ… [fetchMarketplace] Posts chargÃ©s:', response.data.data.posts.length);
          } else {
            // Format alternatif si l'API retourne directement un tableau
            set({ marketplacePosts: Array.isArray(response.data) ? response.data : [] });
          }
        } catch (error: unknown) {
          const apiError = error as { response?: { status?: number } };
          
          // Si erreur 401, réessayer SANS token (token expiré mais API accepte anonyme)
          if (apiError.response?.status === 401) {
            console.log('🔄 [fetchMarketplace] Token expiré, retry sans auth...');
            try {
              const endpoint = FEATURES.SMART_RANKING 
                ? '/marketplace/posts/ranked'
                : '/marketplace/posts';
              
              // Appel direct sans passer par apiClient (qui ajoute le token)
              const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
              const response = await fetch(`${baseURL}${endpoint}`);
              const data = await response.json();
              
              if (data?.success && data?.data?.posts) {
                set({ marketplacePosts: data.data.posts });
                console.log('✅ [fetchMarketplace] Posts chargés sans auth:', data.data.posts.length);
                return;
              }
            } catch (retryError) {
              console.error('❌ [fetchMarketplace] Retry failed:', retryError);
            }
            set({ marketplacePosts: [] });
          } else {
            console.error('❌ [fetchMarketplace] Erreur:', error);
            set({ marketplacePosts: [] });
          }
        }
      },

      addMarketplacePost: async (postData) => {
        const newPost: MarketplacePost = {
          ...postData,
          id: `post-${Date.now()}`,
          timestamp: new Date(),
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: 0,
          views: 0,
          likedBy: [],
          bookmarkedBy: []
        };

        try {
          const response = await apiClient.post('/marketplace/posts', newPost);
          
          set((state) => ({
            marketplacePosts: [response.data, ...state.marketplacePosts]
          }));
          return response.data.id;
        } catch (error) {
          console.error('Erreur lors de la crÃ©ation du post:', error);
        }

        // Fallback: update locally
        set((state) => ({
          marketplacePosts: [newPost, ...state.marketplacePosts]
        }));
        return newPost.id;
      },

      updateMarketplacePost: async (id, updates) => {
        try {
          const response = await apiClient.put(`/marketplace/posts/${id}`, { 
            ...updates, 
            updatedAt: new Date().toISOString() 
          });
          
          set((state) => ({
            marketplacePosts: state.marketplacePosts.map((post) =>
              post.id === id ? response.data : post
            )
          }));
          return;
        } catch (error) {
          console.error('Erreur lors de la mise Ã  jour du post:', error);
        }

        // Fallback: update locally
        set((state) => ({
          marketplacePosts: state.marketplacePosts.map((post) =>
            post.id === id 
              ? { ...post, ...updates, updatedAt: new Date().toISOString() }
              : post
          )
        }));
      },

      deleteMarketplacePost: async (id) => {
        try {
          await apiClient.delete(`/marketplace/posts/${id}`);
          
          set((state) => ({
            marketplacePosts: state.marketplacePosts.filter((post) => post.id !== id)
          }));
          return;
        } catch (error) {
          console.error('Erreur lors de la suppression du post:', error);
        }

        // Fallback: update locally
        set((state) => ({
          marketplacePosts: state.marketplacePosts.filter((post) => post.id !== id)
        }));
      },

      likeMarketplacePost: async (postId, userId) => {
        const state = get();
        const post = state.marketplacePosts.find(p => p.id === postId);
        if (!post) return;

        const isLiked = post.likedBy.includes(userId);
        const newLikedBy = isLiked 
          ? post.likedBy.filter(id => id !== userId)
          : [...post.likedBy, userId];

        try {
          const response = await apiClient.post(`/marketplace/posts/${postId}/like`, { 
            userId, 
            isLiked: !isLiked 
          });
          
          set((state) => ({
            marketplacePosts: state.marketplacePosts.map((p) =>
              p.id === postId ? response.data : p
            )
          }));
          return;
        } catch (error) {
          console.error('Erreur lors du like:', error);
        }

        // Fallback: update locally
        set((state) => ({
          marketplacePosts: state.marketplacePosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likedBy: newLikedBy,
                  likes: newLikedBy.length,
                  isLiked: !isLiked
                }
              : p
          )
        }));
      },

      bookmarkMarketplacePost: async (postId, userId) => {
        const state = get();
        const post = state.marketplacePosts.find(p => p.id === postId);
        if (!post) return;

        const isBookmarked = post.bookmarkedBy.includes(userId);
        const newBookmarkedBy = isBookmarked
          ? post.bookmarkedBy.filter(id => id !== userId)
          : [...post.bookmarkedBy, userId];

        try {
          const response = await fetch(`${API_BASE_URL}/marketplace/posts/${postId}/bookmark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, isBookmarked: !isBookmarked })
          });

          if (response.ok) {
            const updatedPost = await response.json();
            set((state) => ({
              marketplacePosts: state.marketplacePosts.map((p) =>
                p.id === postId ? updatedPost : p
              )
            }));
            return;
          }
        } catch (error) {
          console.error('Erreur lors du bookmark:', error);
        }

        // Fallback: update locally
        set((state) => ({
          marketplacePosts: state.marketplacePosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  bookmarkedBy: newBookmarkedBy,
                  isBookmarked: !isBookmarked
                }
              : p
          )
        }));
      },

      getMarketplacePostsByRole: (userRole) => {
        const state = get();
        if (!userRole) return state.marketplacePosts;
        
        return state.marketplacePosts.filter((post) => {
          if (post.visibility === 'public') return true;
          if (post.visibility === 'professionals') return true;
          if (post.visibility === 'role-specific' && post.author.role === userRole) return true;
          return false;
        }).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }
    }),
    {
      name: 'business-storage'
    }
  )
);


