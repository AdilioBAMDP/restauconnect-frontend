import { create } from 'zustand';
import axios from 'axios';
import type { Application, ApplicationFormData, ApplicationStats, ApplicationsResponse, ApplicationStatus, ApplicationRole } from '../types/application';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApplicationState {
  applications: Application[];
  stats: ApplicationStats | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchApplications: (filters?: { status?: ApplicationStatus; role?: ApplicationRole; page?: number; limit?: number }) => Promise<void>;
  fetchStats: () => Promise<void>;
  submitApplication: (data: ApplicationFormData) => Promise<void>;
  approveApplication: (id: string, notes?: string) => Promise<void>;
  rejectApplication: (id: string, notes?: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  stats: null,
  loading: false,
  error: null,
  
  fetchApplications: async (filters = {}) => {
    set({ loading: true, error: null });
    
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      const response = await axios.get<ApplicationsResponse>(
        `${API_URL}/applications?${params.toString()}`,
        {
          headers: getAuthHeaders()
        }
      );
      
      set({ applications: response.data.applications, loading: false });
      
    } catch (error) {
      console.error('❌ Erreur fetchApplications:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de la récupération des candidatures';
      set({ 
        error: message,
        loading: false 
      });
    }
  },
  
  fetchStats: async () => {
    try {
      const response = await axios.get<ApplicationStats>(
        `${API_URL}/applications/stats`,
        {
          headers: getAuthHeaders()
        }
      );
      
      set({ stats: response.data });
      
    } catch (error) {
      console.error('❌ Erreur fetchStats:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques';
      set({ error: message });
    }
  },
  
  submitApplication: async (data: ApplicationFormData) => {
    set({ loading: true, error: null });
    
    try {
      await axios.post(
        `${API_URL}/applications`,
        data
      );
      
      set({ loading: false });
      
    } catch (error) {
      console.error('❌ Erreur submitApplication:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de la soumission de la candidature';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },
  
  approveApplication: async (id: string, notes?: string) => {
    set({ loading: true, error: null });
    
    try {
      await axios.patch(
        `${API_URL}/applications/${id}/approve`,
        { notes },
        {
          headers: getAuthHeaders()
        }
      );
      
      // Mettre à jour l'application dans la liste
      const applications = get().applications.map(app => 
        app._id === id 
          ? { ...app, status: 'approved' as ApplicationStatus, reviewedAt: new Date().toISOString() }
          : app
      );
      
      set({ applications, loading: false });
      
      // Recharger les stats
      get().fetchStats();
      
    } catch (error) {
      console.error('❌ Erreur approveApplication:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'approbation de la candidature';
      set({ error: message, loading: false });
      throw error;
    }
  },
  
  rejectApplication: async (id: string, notes?: string) => {
    set({ loading: true, error: null });
    
    try {
      await axios.patch(
        `${API_URL}/applications/${id}/reject`,
        { notes },
        {
          headers: getAuthHeaders()
        }
      );
      
      // Mettre à jour l'application dans la liste
      const applications = get().applications.map(app => 
        app._id === id 
          ? { ...app, status: 'rejected' as ApplicationStatus, reviewedAt: new Date().toISOString() }
          : app
      );
      
      set({ applications, loading: false });
      
      // Recharger les stats
      get().fetchStats();
      
    } catch (error) {
      console.error('❌ Erreur rejectApplication:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors du rejet de la candidature';
      set({ error: message, loading: false });
      throw error;
    }
  },
  
  deleteApplication: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await axios.delete(
        `${API_URL}/applications/${id}`,
        {
          headers: getAuthHeaders()
        }
      );
      
      // Retirer l'application de la liste
      const applications = get().applications.filter(app => app._id !== id);
      
      set({ applications, loading: false });
      
      // Recharger les stats
      get().fetchStats();
      
    } catch (error) {
      console.error('❌ Erreur deleteApplication:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression de la candidature';
      set({ error: message, loading: false });
      throw error;
    }
  },
  
  clearError: () => set({ error: null })
}));
