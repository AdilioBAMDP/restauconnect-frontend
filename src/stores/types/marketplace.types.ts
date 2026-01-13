/**
 * Types pour le module Marketplace
 */
import { UserRole } from './common.types';

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

export interface GlobalAnnouncement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  type: 'offer' | 'urgent' | 'promotion' | 'partnership';
  status: 'active' | 'expired' | 'deleted';
  targetAudience: UserRole[] | 'all';
  excludeRoles?: UserRole[];
  isSponsored: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags: string[];
  contactPhone?: string;
  contactEmail?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  lastConfirmedAt: string;
  nextConfirmationDue: string;
  viewCount: number;
  clickCount: number;
  contactCount: number;
}

export interface AnnouncementConfirmation {
  id: string;
  announcementId: string;
  confirmedAt: string;
  isActive: boolean;
  nextConfirmationDue: string;
}

export interface AnnouncementInteraction {
  id: string;
  announcementId: string;
  userId: string;
  type: 'view' | 'click' | 'contact';
  timestamp: string;
}
