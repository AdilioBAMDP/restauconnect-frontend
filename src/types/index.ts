export type UserRole = 'restaurant' | 'artisan' | 'fournisseur' | 'candidat' | 'community_manager' | 'admin' | 'super_admin' | 'banquier' | 'comptable' | 'investisseur' | 'livreur' | 'transporteur' | 'auditeur';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  location: {
    address: string;
    city: string;
    coordinates?: [number, number];
  };
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  lastActive: string;
  preferences: UserPreferences;
  profile: UserProfile;
}

export interface UserPreferences {
  language: 'fr' | 'en' | 'es';
  currency: 'EUR' | 'USD' | 'GBP';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
    showLocation: boolean;
  };
  filters: {
    maxDistance: number;
    priceRange: [number, number];
    ecoFriendly: boolean;
  };
}

export interface UserProfile {
  description: string;
  specialties: string[];
  certifications: string[];
  portfolio: PortfolioItem[];
  availability: Availability;
  pricing: PricingInfo;
  businessInfo?: BusinessInfo;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  completedAt: string;
  clientName?: string;
  rating?: number;
}

export interface Availability {
  schedule: WeeklySchedule;
  exceptions: DateException[];
  urgentAvailable: boolean;
  advanceBooking: number; // days
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

export interface DaySchedule {
  available: boolean;
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  type: 'available' | 'busy' | 'preferred';
}

export interface DateException {
  date: string;
  available: boolean;
  reason?: string;
}

export interface PricingInfo {
  hourlyRate?: number;
  fixedPrices?: { [service: string]: number };
  negotiable: boolean;
  currency: string;
}

export interface BusinessInfo {
  companyName: string;
  siret?: string;
  vatNumber?: string;
  insurance: string;
  licenses: string[];
}

export interface Listing {
  id: string;
  authorId: string;
  author: User;
  title: string;
  description: string;
  category: ListingCategory;
  type: ListingType;
  location: Location;
  pricing: ListingPricing;
  requirements: string[];
  benefits: string[];
  images: string[];
  urgent: boolean;
  featured: boolean;
  status: ListingStatus;
  tags: string[];
  ecoFriendly: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  applicationsCount: number;
  viewsCount: number;
}

export type ListingCategory = 'personnel' | 'services' | 'fournitures' | 'equipement' | 'digital' | 'formation';
export type ListingType = 'offer' | 'demand' | 'collaboration';
export type ListingStatus = 'active' | 'paused' | 'completed' | 'expired';

export interface ListingPricing {
  type: 'hourly' | 'fixed' | 'negotiable' | 'free';
  amount?: number;
  currency: string;
  range?: [number, number];
}

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: [number, number];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: Attachment[];
  timestamp: string;
  read: boolean;
  edited?: boolean;
  editedAt?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  muted: boolean;
  listingId?: string;
  listing?: Listing;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  initiatorId: string;
  initiator: User;
  collaborators: User[];
  category: string;
  status: ProjectStatus;
  budget?: number;
  currency: string;
  deadline?: string;
  location: Location;
  requirements: string[];
  deliverables: string[];
  ecoFriendly: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  milestones: Milestone[];
}

export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewer: User;
  reviewedId: string;
  reviewed: User;
  listingId?: string;
  projectId?: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  verified: boolean;
  helpful: number;
  createdAt: string;
  response?: ReviewResponse;
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface ReviewResponse {
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type NotificationType = 
  | 'message' 
  | 'listing_match' 
  | 'project_invitation' 
  | 'review_received' 
  | 'booking_confirmed' 
  | 'payment_received' 
  | 'system_update';

export interface SearchFilters {
  query?: string;
  category?: ListingCategory;
  type?: ListingType;
  location?: {
    city?: string;
    radius?: number;
    coordinates?: [number, number];
  };
  pricing?: {
    min?: number;
    max?: number;
    type?: 'hourly' | 'fixed';
  };
  availability?: {
    urgent?: boolean;
    dateRange?: [string, string];
  };
  rating?: number;
  verified?: boolean;
  ecoFriendly?: boolean;
  tags?: string[];
}

export interface DashboardStats {
  totalListings: number;
  activeConversations: number;
  completedProjects: number;
  averageRating: number;
  totalEarnings: number;
  monthlyGrowth: number;
  upcomingBookings: number;
  profileViews: number;
}

// Types pour Community Manager Services
export interface CommunityManagerService {
  id: string;
  name: string;
  category: 'social-media' | 'advertising' | 'content-creation' | 'seo' | 'photography' | 'video' | 'branding';
  description: string;
  price: number;
  priceType: 'per-month' | 'per-campaign' | 'per-post' | 'per-hour' | 'fixed';
  duration: string; // "1 mois", "3 mois", "ponctuel"
  deliverables: string[];
  features: string[];
  status: 'active' | 'paused' | 'draft';
  clientsCount: number; // Nombre de restaurants qui utilisent ce service
  successRate: number; // % de satisfaction
  createdAt: string;
  updatedAt: string;
}

export interface CommunityManagerCampaign {
  id: string;
  restaurantId: string;
  restaurantName: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  objectives: {
    type: 'followers' | 'engagement' | 'reach' | 'sales' | 'bookings';
    target: number;
    current: number;
  }[];
  platforms: ('facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'google-ads' | 'website')[];
  metrics: CampaignMetrics;
  deliverables: CampaignDeliverable[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMetrics {
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  followers: number;
  cost_per_click: number;
  return_on_ad_spend: number;
}

export interface CampaignDeliverable {
  id: string;
  type: 'post' | 'video' | 'story' | 'ad' | 'article' | 'photo-shoot' | 'report';
  title: string;
  description: string;
  platform: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved' | 'revision-needed';
  dueDate: string;
  completedAt?: string;
  fileUrl?: string;
  previewUrl?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
}

export interface CommunityManagerClient {
  id: string;
  restaurantId: string;
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  restaurantType: string; // "restaurant traditionnel", "fast-food", "brasserie", etc.
  activeCampaigns: number;
  totalSpent: number;
  contractStartDate: string;
  contractEndDate?: string;
  status: 'active' | 'pending' | 'paused' | 'completed';
  servicesUsed: string[]; // IDs des services utilisés
  satisfactionRating: number;
  lastActivity: string;
  notes: string;
}

export interface CommunityManagerStats {
  totalServices: number;
  activeServices: number;
  totalClients: number;
  activeClients: number;
  totalCampaigns: number;
  activeCampaigns: number;
  monthlyRevenue: number;
  averageClientSatisfaction: number;
  totalReach: number;
  totalEngagement: number;
  conversionRate: number;
  retentionRate: number;
}

// Types pour Candidat Emploi
export interface CandidatJobApplication {
  id: string;
  candidatId: string;
  offerId: string;
  restaurantId: string;
  restaurantName: string;
  position: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'viewed' | 'interview' | 'accepted' | 'rejected';
  salary?: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Apprentissage' | 'Interim' | 'Temps partiel';
  message: string;
  cv?: string;
  coverLetter?: string;
  interviewDate?: string;
  interviewNotes?: string;
  feedback?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lastUpdate: string;
}

export interface CandidatProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    nationality: string;
    address: string;
    city: string;
    postalCode: string;
  };
  professionalInfo: {
    currentStatus: 'employed' | 'unemployed' | 'student' | 'seeking';
    experience: 'junior' | 'intermediaire' | 'senior' | 'expert';
    yearsExperience: number;
    targetPosition: string[];
    targetSalary: {
      min: number;
      max: number;
      negotiable: boolean;
    };
    availability: {
      immediateStart: boolean;
      startDate?: string;
      workingSchedule: 'full-time' | 'part-time' | 'flexible';
      weekends: boolean;
      evenings: boolean;
    };
  };
  skills: {
    technical: string[]; // "Service en salle", "Cuisine", "Pâtisserie"
    languages: { name: string; level: 'debutant' | 'intermediaire' | 'courant' | 'natif' }[];
    certifications: string[]; // "Permis de conduire", "HACCP", "Hygiène alimentaire"
    software: string[]; // "Caisse", "Excel", "Logiciel de réservation"
  };
  preferences: {
    contractTypes: ('CDI' | 'CDD' | 'Stage' | 'Apprentissage' | 'Interim' | 'Temps partiel')[];
    locations: string[];
    maxDistance: number; // km
    restaurantTypes: string[]; // "Gastronomique", "Bistrot", "Fast-food"
    teamSize: 'small' | 'medium' | 'large' | 'any';
    workEnvironment: string[];
  };
  documents: {
    cv?: string;
    coverLetter?: string;
    portfolio?: string[];
    references?: {
      name: string;
      position: string;
      company: string;
      phone: string;
      email: string;
    }[];
  };
  statistics: {
    profileViews: number;
    applicationsCount: number;
    interviewsCount: number;
    successRate: number;
    responseRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobOffer {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantType: string;
  title: string;
  position: string;
  description: string;
  location: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Apprentissage' | 'Interim' | 'Temps partiel';
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
    negotiable: boolean;
  };
  requirements: {
    experience: 'junior' | 'intermediaire' | 'senior' | 'expert';
    skills: string[];
    languages: string[];
    certifications: string[];
    education?: string;
  };
  conditions: {
    workingHours: string;
    schedule: string[];
    benefits: string[];
    startDate: string;
    duration?: string; // pour CDD
  };
  contact: {
    personName: string;
    email: string;
    phone?: string;
  };
  status: 'active' | 'paused' | 'closed' | 'filled';
  urgent: boolean;
  featured: boolean;
  applicationsCount: number;
  viewsCount: number;
  postedDate: string;
  expiryDate?: string;
  tags: string[];
}

export interface SavedJobSearch {
  id: string;
  candidatId: string;
  name: string;
  filters: {
    keywords?: string;
    position?: string[];
    location?: string[];
    contractType?: string[];
    salaryMin?: number;
    salaryMax?: number;
    experience?: string;
    restaurantType?: string[];
  };
  alertsEnabled: boolean;
  lastChecked: string;
  newOffersCount: number;
  createdAt: string;
}

export interface CandidatStats {
  totalApplications: number;
  pendingApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  profileViews: number;
  searchAlerts: number;
  successRate: number;
  averageResponseTime: number; // en jours
  lastActivity: string;
  recommendedOffers: number;
}

// ============ SYSTÈME D'ANNONCES GLOBALES ============

export type AnnouncementType = 'promotion' | 'urgent' | 'collaboration' | 'event' | 'offer' | 'sponsored';
export type AnnouncementStatus = 'active' | 'expired' | 'pending' | 'archived';
export type TargetAudience = UserRole[] | 'all';

export interface GlobalAnnouncement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  targetAudience: TargetAudience;
  excludeRoles?: UserRole[]; // Rôles à exclure (ex: restaurateurs n'voient pas les annonces d'autres restaurateurs)
  
  // Média
  image?: string;
  
  // Métadonnées
  isSponsored: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  
  // Contact
  contactPhone?: string;
  contactEmail?: string;
  
  // Géolocalisation
  location?: string;
  
  // Temporalité
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  lastConfirmedAt: string;
  nextConfirmationDue: string; // Toutes les 4h
  
  // Statistiques
  viewCount: number;
  clickCount: number;
  contactCount: number;
}

export interface AnnouncementConfirmation {
  id: string;
  announcementId: string;
  authorId: string;
  confirmedAt: string;
  isStillActive: boolean;
  nextReminderAt: string;
}

export interface AnnouncementInteraction {
  id: string;
  announcementId: string;
  userId: string;
  userRole: UserRole;
  type: 'view' | 'click' | 'contact' | 'share';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ========== NOUVEAUX MODULES ==========

// Module Banques
export interface BankPartner {
  id: string;
  name: string;
  logo?: string;
  type: 'banque_traditionnelle' | 'banque_en_ligne' | 'credit_mutuel' | 'caisse_epargne' | 'banque_populaire';
  location: {
    city: string;
    region: string;
    address: string;
    coordinates?: [number, number];
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    agentName?: string;
  };
  rating: number;
  reviewCount: number;
  specialties: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoanOffer {
  id: string;
  bankId: string;
  bankName: string;
  type: 'credit_professionnel' | 'pret_equipement' | 'credit_tresorerie' | 'pret_immobilier_pro' | 'leasing';
  title: string;
  description: string;
  conditions: {
    minAmount: number;
    maxAmount: number;
    minDuration: number; // en mois
    maxDuration: number; // en mois
    interestRateMin: number;
    interestRateMax: number;
    processingFee?: number;
    guaranteeRequired: boolean;
    minTurnover?: number;
  };
  eligibility: {
    businessAge: number; // en années
    targetSectors: string[];
    creditScoreMin?: number;
    turnoverMin?: number;
  };
  documents: string[];
  processingTime: string; // ex: "5-10 jours"
  advantages: string[];
  status: 'active' | 'suspended' | 'expired';
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankConversation {
  id: string;
  bankId: string;
  userId: string;
  loanOfferId?: string;
  subject: string;
  status: 'active' | 'closed' | 'pending';
  messages: EncryptedMessage[];
  documents: SharedDocument[];
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

// Module Comptable
export interface AccountantProfile {
  id: string;
  name: string;
  firm: string;
  siret: string;
  expertise: ('tva' | 'bilan' | 'social' | 'fiscalite' | 'gestion' | 'audit')[];
  certifications: string[];
  location: {
    address: string;
    city: string;
    postalCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  specializations: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AccountingDocument {
  id: string;
  accountantId: string;
  userId: string;
  type: 'facture' | 'devis' | 'bilan' | 'declaration_tva' | 'bulletin_salaire' | 'rapport' | 'contrat';
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isConfidential: boolean;
  dueDate?: string;
  status: 'draft' | 'sent' | 'reviewed' | 'approved' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountantConversation {
  id: string;
  accountantId: string;
  userId: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'declaration' | 'conseil' | 'document' | 'bilan' | 'social' | 'general';
  status: 'active' | 'resolved' | 'waiting_response' | 'archived';
  messages: EncryptedMessage[];
  documents: AccountingDocument[];
  alerts: AccountingAlert[];
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

export interface AccountingAlert {
  id: string;
  type: 'declaration_due' | 'document_missing' | 'payment_reminder' | 'deadline_approaching';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  dueDate?: string;
  isRead: boolean;
  createdAt: string;
}

// Messages chiffrés pour communication sécurisée
export interface EncryptedMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'bank' | 'accountant';
  content: string; // Contenu chiffré
  type: 'text' | 'document' | 'image' | 'audio';
  attachments?: MessageAttachment[];
  isEncrypted: boolean;
  timestamp: string;
  isRead: boolean;
  readAt?: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isConfidential: boolean;
  downloadUrl?: string;
  uploadedAt: string;
}

export interface SharedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  isConfidential: boolean;
  accessLevel: 'read' | 'write' | 'admin';
}
