// Types pour le système de devis/facturation des artisans
// Conforme aux normes françaises (Code de la consommation, BTP)

export interface ArtisanCompany {
  name: string;
  siret: string;
  tvaNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  insurance: {
    decennale: {
      company: string;
      policyNumber: string;
      expiryDate: Date;
    };
    liability: {
      company: string;
      policyNumber: string;
      expiryDate: Date;
    };
  };
}

export interface Customer {
  _id?: string;
  type: 'particular' | 'professional';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  siret?: string; // Pour les professionnels
  tvaNumber?: string; // Pour les professionnels
}

export interface QuoteItem {
  _id?: string;
  description: string;
  quantity: number;
  unit: string; // m², h, forfait, etc.
  unitPriceHT: number;
  totalHT: number;
  tvaRate: number; // 10% ou 20% selon prestations
  totalTTC: number;
  category: 'materials' | 'labor' | 'equipment' | 'other';
}

export interface Quote {
  _id?: string;
  quoteNumber: string; // DEV-2025-001
  artisanId: string;
  customer: Customer;
  projectDescription: string;
  workLocation: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: QuoteItem[];
  subtotalHT: number;
  totalTVA: number;
  totalTTC: number;
  validityDays: number; // Durée de validité (défaut 30j)
  createdAt: Date;
  expiresAt: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  clientSignature?: {
    signedAt: Date;
    ipAddress: string;
    signatureData: string;
  };
  workStartDate?: Date;
  workEndDate?: Date;
  specialConditions?: string;
  paymentTerms: string;
}

export interface PaymentSchedule {
  _id?: string;
  invoiceId: string;
  dueDate: Date;
  amount: number;
  type: 'deposit' | 'progress' | 'balance' | 'guarantee_release';
  percentage?: number; // % du total pour factures de situation
  isPaid: boolean;
  paidAt?: Date;
  paidAmount?: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string; // FACT-2025-001
  quoteId: string;
  artisanId: string;
  customer: Customer;
  type: 'deposit' | 'progress' | 'final' | 'guarantee_release';
  items: QuoteItem[];
  subtotalHT: number;
  totalTVA: number;
  totalTTC: number;
  
  // Spécifique factures de situation
  progressPercentage?: number; // % d'avancement du chantier
  previousInvoicesTotal?: number; // Montant déjà facturé
  currentWorkValue?: number; // Valeur travaux période actuelle
  
  // Retenue de garantie (5% obligatoire BTP)
  guaranteeRetention?: {
    rate: number; // 5%
    amount: number;
    releaseDate: Date; // 1 an après réception
    isReleased: boolean;
    releasedAt?: Date;
  };
  
  createdAt: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidAt?: Date;
  paidAmount?: number;
  paymentMethod?: string;
  
  // Mentions légales obligatoires
  legalMentions: {
    latePaymentPenalty: number; // Pénalités de retard
    recoveryIndemnity: number; // Indemnité forfaitaire de recouvrement (40€)
    paymentTerms: string;
    discountConditions?: string;
  };
}

export interface WorkProgress {
  _id?: string;
  quoteId: string;
  date: Date;
  percentage: number; // % d'avancement global
  description: string;
  photos?: string[]; // URLs des photos
  validatedByClient?: boolean;
  clientSignature?: {
    signedAt: Date;
    signatureData: string;
  };
}

export interface DocumentTemplate {
  _id?: string;
  type: 'quote' | 'invoice';
  name: string;
  template: string; // HTML template
  isDefault: boolean;
  artisanId: string;
}

// Types pour les statistiques artisan
export interface ArtisanStats {
  quotesCount: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  invoicesCount: {
    total: number;
    paid: number;
    overdue: number;
  };
  revenue: {
    currentMonth: number;
    lastMonth: number;
    currentYear: number;
    lastYear: number;
  };
  averageQuoteValue: number;
  conversionRate: number; // % devis acceptés
  guaranteeRetentionsTotal: number;
}

// Types pour les formulaires
export interface QuoteFormData {
  customer: Partial<Customer>;
  projectDescription: string;
  workLocation: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Partial<QuoteItem>[];
  validityDays: number;
  workStartDate?: Date;
  workEndDate?: Date;
  specialConditions?: string;
  paymentTerms: string;
}

export interface InvoiceFormData {
  type: 'deposit' | 'progress' | 'final' | 'guarantee_release';
  progressPercentage?: number;
  dueDate: Date;
  paymentMethod?: string;
  items?: Partial<QuoteItem>[]; // Pour factures modifiées
}