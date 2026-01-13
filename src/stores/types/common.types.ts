/**
 * Types communs partagés entre plusieurs modules
 */

export type UserRole = 
  | 'restaurant' 
  | 'fournisseur' 
  | 'artisan' 
  | 'candidat' 
  | 'community_manager' 
  | 'banquier' 
  | 'investisseur' 
  | 'comptable' 
  | 'transporteur' 
  | 'auditeur';

export interface MessageAttachment {
  type: 'document' | 'image' | 'pdf';
  url: string;
  name: string;
  size: number;
}

export interface EncryptedMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'accountant' | 'bank';
  content: string;
  type: 'text' | 'document';
  isEncrypted: boolean;
  timestamp: string;
  isRead: boolean;
  readAt?: string;
  attachments?: MessageAttachment[];
}

export interface Professional {
  id: string;
  name: string;
  role: UserRole;
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
