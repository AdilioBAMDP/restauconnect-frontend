/**
 * Types pour le module Comptable
 */
import { EncryptedMessage } from './common.types';

export interface AccountantProfile {
  id: string;
  name: string;
  firm: string;
  siret: string;
  expertise: Array<'tva' | 'bilan' | 'social' | 'fiscalite' | 'conseil'>;
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
  type: 'declaration_tva' | 'bilan' | 'liasse_fiscale' | 'bulletin_paie' | 'contrat' | 'autre';
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isConfidential: boolean;
  dueDate?: string;
  status: 'draft' | 'sent' | 'reviewed' | 'validated' | 'archived';
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
  category: 'general' | 'declaration' | 'conseil' | 'litige' | 'urgent';
  status: 'active' | 'resolved' | 'closed';
  messages: EncryptedMessage[];
  documents: string[];
  alerts: Array<{
    id: string;
    type: 'deadline' | 'missing_doc' | 'validation_required';
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

export interface AccountingAlert {
  id: string;
  type: 'declaration_due' | 'document_missing' | 'payment_reminder' | 'deadline' | 'info';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'urgent';
  dueDate?: string;
  isRead: boolean;
  createdAt: string;
}
