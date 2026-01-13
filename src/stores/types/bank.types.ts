/**
 * Types pour le module Banque
 */
import { EncryptedMessage } from './common.types';

export interface BankPartner {
  id: string;
  name: string;
  logo: string;
  type: 'banque_traditionnelle' | 'credit_mutuel' | 'banque_populaire' | 'neo_banque';
  location: {
    city: string;
    region: string;
    address: string;
    coordinates: [number, number];
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    agentName: string;
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
  type: 'credit_professionnel' | 'pret_equipement' | 'credit_tresorerie' | 'pret_immobilier';
  title: string;
  description: string;
  conditions: {
    minAmount: number;
    maxAmount: number;
    minDuration: number;
    maxDuration: number;
    interestRateMin: number;
    interestRateMax: number;
    processingFee: number;
    guaranteeRequired: boolean;
    minTurnover?: number;
  };
  eligibility: {
    businessAge: number;
    targetSectors: string[];
    creditScoreMin?: number;
    turnoverMin?: number;
  };
  documents: string[];
  processingTime: string;
  advantages: string[];
  status: 'active' | 'paused' | 'expired';
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankConversation {
  id: string;
  bankId: string;
  userId: string;
  subject: string;
  status: 'active' | 'closed' | 'archived';
  messages: EncryptedMessage[];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  loanOfferId?: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}
