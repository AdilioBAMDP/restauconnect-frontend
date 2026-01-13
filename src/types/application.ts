// Types pour le système de candidatures

export type ApplicationRole = 'restaurant' | 'artisan' | 'fournisseur' | 'candidat' | 'banker' | 'investor' | 'driver';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  _id: string;
  
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Informations professionnelles
  role: ApplicationRole;
  company?: string;
  experience?: string;
  
  // Message de motivation
  message: string;
  
  // CV (optionnel)
  cvUrl?: string;
  cvFilename?: string;
  
  // Statut
  status: ApplicationStatus;
  
  // Métadonnées
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: ApplicationRole;
  company?: string;
  experience?: string;
  message: string;
  cvUrl?: string;
  cvFilename?: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byRole: {
    [key in ApplicationRole]?: number;
  };
}

export interface ApplicationsResponse {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Labels pour les rôles
export const roleLabels: Record<ApplicationRole, string> = {
  restaurant: 'Restaurateur',
  artisan: 'Artisan',
  fournisseur: 'Fournisseur',
  candidat: 'Candidat',
  banker: 'Banquier',
  investor: 'Investisseur',
  driver: 'Livreur'
};

// Labels pour les statuts
export const statusLabels: Record<ApplicationStatus, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée'
};

// Couleurs pour les statuts
export const statusColors: Record<ApplicationStatus, string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red'
};
