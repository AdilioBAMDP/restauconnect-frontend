import { 
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

// Types de données métier
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
  likedBy: string[];
  bookmarkedBy: string[];
  visibility: 'public' | 'professionals' | 'role-specific';
  createdAt: string;
  updatedAt?: string;
}

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

export interface RestaurantStats {
  dailyOrders: number;
  activeStaff: number;
  todayReservations: number;
  averageRating: number;
  monthlyRevenue: number;
  pendingApplications: number;
  unreadMessages: number;
}

export interface SupplierStats {
  totalProducts: number;
  totalOrders: number;
  totalClients: number;
  monthlyRevenue: number;
  averageRating: number;
  totalViews: number;
  pendingOrders: number;
}

// Export all imported types for convenience
export type {
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
};
