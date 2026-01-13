/**
 * Types pour le module Candidat
 */

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
    currentStatus: 'seeking' | 'employed' | 'available';
    experience: 'junior' | 'intermediate' | 'senior' | 'expert';
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
    technical: string[];
    languages: Array<{ name: string; level: string }>;
    certifications: string[];
    software: string[];
  };
  preferences: {
    contractTypes: string[];
    locations: string[];
    maxDistance: number;
    restaurantTypes: string[];
    teamSize: string;
    workEnvironment: string[];
  };
  documents: {
    cv?: string;
    coverLetter?: string;
    portfolio: string[];
    references: Array<{
      name: string;
      position: string;
      company: string;
      phone: string;
      email: string;
    }>;
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
  contractType: string;
  salary?: string;
  message: string;
  cv?: string;
  coverLetter?: string;
  interviewDate?: string;
  interviewNotes?: string;
  feedback?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lastUpdate: string;
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
  contractType: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
    negotiable: boolean;
  };
  requirements: {
    experience: string;
    skills: string[];
    languages: string[];
    certifications: string[];
    education: string;
  };
  conditions: {
    workingHours: string;
    schedule: string[];
    benefits: string[];
    startDate: string;
  };
  contact: {
    personName: string;
    email: string;
    phone: string;
  };
  status: 'active' | 'paused' | 'closed';
  urgent: boolean;
  featured: boolean;
  applicationsCount: number;
  viewsCount: number;
  postedDate: string;
  expiryDate: string;
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
  averageResponseTime: number;
  lastActivity: string;
  recommendedOffers: number;
}
