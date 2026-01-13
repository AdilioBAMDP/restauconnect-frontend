// Services pour les APIs des rôles financiers
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configuration axios avec token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  // Chercher le token dans tous les noms possibles (compatibilité)
  const token = localStorage.getItem('auth_token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Financial API - Token found and added to request');
  } else {
    console.warn('⚠️ Financial API - No token found in localStorage');
  }
  return config;
});

// Types pour les données financières
export interface LoanOffer {
  _id: string;
  loanType: 'short-term' | 'long-term' | 'equipment' | 'real-estate' | 'working-capital';
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  requirements: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoanRequest {
  _id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  riskScore?: number;
  evaluationNotes?: string;
  createdAt: string;
}

export interface InvestmentOpportunity {
  _id: string;
  restaurantId: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  expectedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  sector: string;
  status: 'open' | 'funded' | 'closed';
  deadline: string;
  createdAt: string;
}

export interface Investment {
  _id: string;
  investorId: string;
  opportunityId: string;
  amount: number;
  shares: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  roi: number;
  startDate: string;
}

export interface AccountingDocument {
  _id: string;
  clientId: string;
  type: 'invoice' | 'tax-declaration' | 'balance-sheet' | 'income-statement' | 'other';
  fiscalYear: number;
  documentUrl: string;
  notes: string;
  uploadedBy: string;
  createdAt: string;
}

export interface TaxAlert {
  _id: string;
  clientId: string;
  type: 'deadline' | 'missing-document' | 'audit' | 'payment' | 'other';
  description: string;
  deadline?: string;
  status: 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// Types additionnels pour corriger les 'any'
export interface AccountingClient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending';
  documentsCount?: number;
  lastActivity: string;
  createdAt: string;
}

export interface JobExperience {
  company: string;
  position: string;
  duration: string;
  description?: string;
}

export interface Language {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
}

export interface CandidatProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  skills: string[];
  languages: Language[];
  experience: JobExperience[];
  expectedSalary?: number;
  availabilityDate: string;
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ProofOfDelivery {
  type: 'photo' | 'signature' | 'code';
  data: string;
  timestamp: string;
}

// Services Banquier
export const bankerService = {
  // Offres de prêt
  async getOffers(): Promise<{ success: boolean; offers: LoanOffer[] }> {
    const response = await api.get('/banker/offers');
    return response.data;
  },

  async createOffer(offerData: Omit<LoanOffer, '_id' | 'createdAt'>): Promise<{ success: boolean; offer: LoanOffer }> {
    const response = await api.post('/banker/offers', offerData);
    return response.data;
  },

  // Demandes de prêt
  async getRequests(status?: string): Promise<{ success: boolean; requests: LoanRequest[] }> {
    const params = status ? { status } : {};
    const response = await api.get('/banker/requests', { params });
    return response.data;
  },

  async evaluateRequest(requestId: string, evaluation: {
    riskScore?: number;
    status: 'approved' | 'rejected' | 'in-review';
    evaluationNotes?: string;
  }): Promise<{ success: boolean; request: LoanRequest }> {
    const response = await api.post('/banker/evaluate', {
      requestId,
      ...evaluation
    });
    return response.data;
  },

  // Clients
  async getClients(): Promise<{ success: boolean; clients: BankerClient[] }> {
    const response = await api.get('/banker/clients');
    return response.data;
  },

  // Prêts
  async getLoans(status?: string): Promise<{ success: boolean; loans: BankerLoan[] }> {
    const params = status ? { status } : {};
    const response = await api.get('/banker/loans', { params });
    return response.data;
  }
};

// Interfaces additionnelles pour Banker
export interface BankerClient {
  id: string;
  name: string;
  type: 'restaurant' | 'artisan' | 'fournisseur' | 'autre';
  email: string;
  phone: string;
  location: string;
  creditScore: number;
  totalLoans: number;
  activeLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  paymentHistory: 'excellent' | 'good' | 'average' | 'poor';
  riskLevel: 'low' | 'medium' | 'high';
  joinDate: string;
  lastActivity: string;
}

export interface BankerLoan {
  id: string;
  _id: string;
  clientName: string;
  clientType: 'restaurant' | 'artisan' | 'fournisseur';
  amount: number;
  interestRate: number;
  duration: number;
  monthlyPayment: number;
  startDate: string;
  status: 'active' | 'pending' | 'completed' | 'defaulted';
  remainingBalance: number;
  nextPaymentDate: string;
  paymentsMade: number;
  totalPayments: number;
}

// Services Investisseur
export const investorService = {
  // Opportunités d'investissement
  async getOpportunities(filters?: {
    riskLevel?: string;
    minROI?: number;
    sector?: string;
    status?: string;
  }): Promise<{ success: boolean; opportunities: InvestmentOpportunity[] }> {
    const response = await api.get('/investor/opportunities', { params: filters });
    return response.data;
  },

  // Investir
  async invest(investmentData: {
    opportunityId: string;
    amount: number;
    shares: number;
  }): Promise<{ success: boolean; investment: Investment }> {
    const response = await api.post('/investor/invest', investmentData);
    return response.data;
  },

  // Portfolio
  async getPortfolio(status?: string): Promise<{ 
    success: boolean; 
    investments: Investment[];
    totalInvested: number;
    totalConfirmed: number;
  }> {
    const params = status ? { status } : {};
    const response = await api.get('/investor/portfolio', { params });
    return response.data;
  }
};

// Services Comptable
export const accountantService = {
  // Clients
  async getClients(): Promise<{ success: boolean; clients: AccountingClient[] }> {
    const response = await api.get('/accountant/clients');
    return response.data;
  },

  // Documents
  async getDocuments(clientId: string, filters?: {
    type?: string;
    fiscalYear?: number;
  }): Promise<{ success: boolean; documents: AccountingDocument[]; client: AccountingClient }> {
    const params = filters || {};
    const response = await api.get(`/accountant/documents/${clientId}`, { params });
    return response.data;
  },

  async uploadDocument(documentData: {
    clientId: string;
    type: string;
    fiscalYear: number;
    documentUrl: string;
    notes?: string;
  }): Promise<{ success: boolean; document: AccountingDocument }> {
    const response = await api.post('/accountant/documents', documentData);
    return response.data;
  },

  // Alertes fiscales
  async getAlerts(filters?: {
    status?: string;
    priority?: string;
    clientId?: string;
  }): Promise<{ success: boolean; alerts: TaxAlert[] }> {
    const response = await api.get('/accountant/alerts', { params: filters });
    return response.data;
  },

  async createAlert(alertData: {
    clientId: string;
    type: string;
    description: string;
    deadline?: string;
    priority?: string;
  }): Promise<{ success: boolean; alert: TaxAlert }> {
    const response = await api.post('/accountant/alerts', alertData);
    return response.data;
  },

  // Récupérer tous les documents
  async getAllDocuments(): Promise<{ success: boolean; documents: AccountingDocument[] }> {
    const response = await api.get('/accountant/all-documents');
    return response.data;
  },

  // Créer un document
  async createDocument(documentData: {
    clientId: string;
    type: string;
    fiscalYear: number;
    documentUrl?: string;
    notes?: string;
  }): Promise<{ success: boolean; document: AccountingDocument }> {
    const response = await api.post('/accountant/documents', documentData);
    return response.data;
  },

  // Résoudre une alerte
  async resolveAlert(alertId: string): Promise<{ success: boolean }> {
    const response = await api.put(`/accountant/alerts/${alertId}/resolve`);
    return response.data;
  }
};

// Services Candidat (emploi)
export const candidatService = {
  // Recherche d'emploi
  async searchJobs(filters?: {
    category?: string;
    contractType?: string;
    workingTime?: string;
    experienceLevel?: string;
    city?: string;
    minSalary?: number;
    urgent?: boolean;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/candidat/jobs', { params: filters });
    return response.data;
  },

  // Détails offre
  async getJobDetails(jobId: string) {
    const response = await api.get(`/candidat/jobs/${jobId}`);
    return response.data;
  },

  // Postuler
  async applyToJob(applicationData: {
    jobOfferId: string;
    coverLetter: string;
    cvUrl?: string;
    portfolioUrls?: string[];
    availabilityDate: string;
    expectedSalary?: number;
    experience: JobExperience[];
    skills?: string[];
    languages?: Language[];
    motivation: string;
    references?: Reference[];
  }) {
    const response = await api.post('/candidat/apply', applicationData);
    return response.data;
  },

  // Mes candidatures
  async getMyApplications(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/candidat/applications', { params: filters });
    return response.data;
  },

  // Recommandations
  async getRecommendations(limit?: number) {
    const response = await api.get('/candidat/recommendations', { params: { limit } });
    return response.data;
  },

  // Profil
  async updateProfile(profileData: CandidatProfile) {
    const response = await api.put('/candidat/profile', profileData);
    return response.data;
  }
};

// Services Livreur
export const livreurService = {
  // Livraisons disponibles
  async getAvailableDeliveries(filters?: {
    latitude?: number;
    longitude?: number;
    maxDistance?: number;
    priority?: string;
    limit?: number;
  }) {
    const response = await api.get('/livreur/available-deliveries', { params: filters });
    return response.data;
  },

  // Accepter livraison
  async acceptDelivery(deliveryId: string) {
    const response = await api.post(`/livreur/accept-delivery/${deliveryId}`);
    return response.data;
  },

  // Mes livraisons
  async getMyDeliveries(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/livreur/my-deliveries', { params: filters });
    return response.data;
  },

  // Mettre à jour statut
  async updateDeliveryStatus(deliveryId: string, statusData: {
    status: string;
    note?: string;
    location?: DeliveryLocation;
    proofOfDelivery?: ProofOfDelivery;
  }) {
    const response = await api.put(`/livreur/update-status/${deliveryId}`, statusData);
    return response.data;
  },

  // Détails livraison
  async getDeliveryDetails(deliveryId: string) {
    const response = await api.get(`/livreur/delivery/${deliveryId}`);
    return response.data;
  },

  // Disponibilité
  async updateAvailability(availabilityData: {
    available: boolean;
    location?: DeliveryLocation;
    vehicleType?: string;
    maxDistance?: number;
  }) {
    const response = await api.put('/livreur/availability', availabilityData);
    return response.data;
  },

  // Gains
  async getEarnings(period?: string) {
    const response = await api.get('/livreur/earnings', { params: { period } });
    return response.data;
  }
};
