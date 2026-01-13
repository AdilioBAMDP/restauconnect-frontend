/**
 * 🎯 CANDIDAT STORE - Store pour les candidats
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CandidatProfile,
  CandidatJobApplication,
  JobOffer,
  SavedJobSearch,
  CandidatStats
} from '../types/candidat.types';

interface CandidatState {
  // Data
  profile: CandidatProfile | null;
  applications: CandidatJobApplication[];
  jobOffers: JobOffer[];
  savedSearches: SavedJobSearch[];
  stats: CandidatStats;
  
  // Actions
  updateProfile: (profile: Partial<CandidatProfile>) => void;
  addApplication: (application: Omit<CandidatJobApplication, 'id'>) => void;
  updateApplication: (id: string, application: Partial<CandidatJobApplication>) => void;
  deleteApplication: (id: string) => void;
  addSavedSearch: (search: Omit<SavedJobSearch, 'id'>) => void;
  updateSavedSearch: (id: string, search: Partial<SavedJobSearch>) => void;
  deleteSavedSearch: (id: string) => void;
  updateStats: (stats: Partial<CandidatStats>) => void;
}

export const useCandidatStore = create<CandidatState>()(
  persist(
    (set) => ({
      profile: null,
      applications: [],
      jobOffers: [],
      savedSearches: [],
      stats: {
        totalApplications: 0,
        pendingApplications: 0,
        interviewsScheduled: 0,
        offersReceived: 0,
        profileViews: 0,
        searchAlerts: 0,
        successRate: 0,
        averageResponseTime: 0,
        lastActivity: new Date().toISOString(),
        recommendedOffers: 0
      },

      updateProfile: (profileData) => {
        set((state) => ({
          profile: {
            ...state.profile!,
            ...profileData,
            updatedAt: new Date().toISOString()
          }
        }));
      },

      addApplication: (applicationData) => {
        const newApplication: CandidatJobApplication = {
          ...applicationData,
          id: `app-${Date.now()}`,
          lastUpdate: new Date().toISOString()
        };
        
        set((state) => ({
          applications: [...state.applications, newApplication],
          stats: {
            ...state.stats,
            totalApplications: state.stats.totalApplications + 1,
            pendingApplications: state.stats.pendingApplications + 1,
            lastActivity: new Date().toISOString()
          }
        }));
      },

      updateApplication: (id, applicationData) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...applicationData, lastUpdate: new Date().toISOString() }
              : app
          )
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          stats: {
            ...state.stats,
            totalApplications: Math.max(0, state.stats.totalApplications - 1),
            lastActivity: new Date().toISOString()
          }
        }));
      },

      addSavedSearch: (searchData) => {
        const newSearch: SavedJobSearch = {
          ...searchData,
          id: `search-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          savedSearches: [...state.savedSearches, newSearch],
          stats: {
            ...state.stats,
            searchAlerts: state.stats.searchAlerts + 1,
            lastActivity: new Date().toISOString()
          }
        }));
      },

      updateSavedSearch: (id, searchData) => {
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, ...searchData } : s
          )
        }));
      },

      deleteSavedSearch: (id) => {
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
          stats: {
            ...state.stats,
            searchAlerts: Math.max(0, state.stats.searchAlerts - 1),
            lastActivity: new Date().toISOString()
          }
        }));
      },

      updateStats: (statsData) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...statsData,
            lastActivity: new Date().toISOString()
          }
        }));
      }
    }),
    {
      name: 'candidat-storage'
    }
  )
);
