/**
 * USER DIRECTORY STORE - Répertoire utilisateurs pour messagerie
 * 
 * Gère :
 * - Liste des utilisateurs (filtres géographiques + rôle)
 * - Filtres : Pays, Région, Ville, Rayon KM, Rôle
 * - Recherche par nom
 */

import { create } from 'zustand';

// Types
export interface DirectoryUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  location: {
    city: string;
    region?: string;
    country?: string;
    coordinates?: [number, number];
  };
  verified: boolean;
  companyName?: string;
}

export interface DirectoryFilters {
  country: string;
  region: string;
  city: string;
  radius: number; // en km
  role: string;
  search: string;
}

interface UserDirectoryState {
  // État
  users: DirectoryUser[];
  isLoading: boolean;
  error: string | null;
  filters: DirectoryFilters;
  
  // Actions
  fetchUsers: () => Promise<void>;
  setFilters: (filters: Partial<DirectoryFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
}

const initialFilters: DirectoryFilters = {
  country: '',
  region: '',
  city: '',
  radius: 0, // 0 = pas de filtre rayon
  role: 'all',
  search: ''
};

export const useUserDirectoryStore = create<UserDirectoryState>((set, get) => ({
  // État initial
  users: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  
  // Récupérer les utilisateurs avec filtres
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { filters } = get();
      
      // 🔧 MOCK DATA: Retourner TOUS les comptes test disponibles
      const mockUsers: DirectoryUser[] = [
        { _id: 'restaurant-001', name: 'Restaurant Test', role: 'restaurant', email: 'restaurant@test.fr', location: { city: 'Paris', country: 'France' }, verified: true },
        { _id: 'fournisseur-001', name: 'Fournisseur Test', role: 'fournisseur', email: 'fournisseur@test.fr', location: { city: 'Lyon', country: 'France' }, verified: true },
        { _id: 'artisan-001', name: 'Artisan Test', role: 'artisan', email: 'artisan@test.fr', location: { city: 'Marseille', country: 'France' }, verified: true },
        { _id: 'candidat-001', name: 'Candidat Test', role: 'candidat', email: 'candidat@test.fr', location: { city: 'Toulouse', country: 'France' }, verified: true },
        { _id: 'banker-001', name: 'Banquier Test', role: 'banker', email: 'banker@test.fr', location: { city: 'Nice', country: 'France' }, verified: true },
        { _id: 'investor-001', name: 'Investisseur Test', role: 'investisseur', email: 'investor@test.fr', location: { city: 'Bordeaux', country: 'France' }, verified: true },
        { _id: 'driver-001', name: 'Livreur Test', role: 'driver', email: 'driver@test.fr', location: { city: 'Nantes', country: 'France' }, verified: true },
        { _id: 'supplier-001', name: 'Fournisseur Général Test', role: 'supplier', email: 'supplier@test.fr', location: { city: 'Strasbourg', country: 'France' }, verified: true }
      ];
      
      // Filtrer : Exclure l'utilisateur connecté
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = currentUser.id || currentUser.userId || currentUser._id;
      
      // Filtrer selon les critères
      let filteredUsers = mockUsers.filter(u => u._id !== currentUserId); // Ne pas afficher soi-même
      
      if (filters.role && filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.name.toLowerCase().includes(search) || 
          u.email.toLowerCase().includes(search)
        );
      }
      
      // Simuler délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({
        users: filteredUsers,
        isLoading: false
      });
      
    } catch (error: unknown) {
      console.error('❌ Erreur fetch directory:', error);
      const err = error as { response?: { data?: { error?: string } } };
      set({
        error: err.response?.data?.error || 'Erreur lors du chargement du répertoire',
        isLoading: false,
        users: []
      });
    }
  },
  
  // Modifier filtres
  setFilters: (newFilters: Partial<DirectoryFilters>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters
      }
    }));
    
    // Re-fetch automatiquement
    setTimeout(() => get().fetchUsers(), 100);
  },
  
  // Réinitialiser filtres
  clearFilters: () => {
    set({ filters: initialFilters });
    get().fetchUsers();
  },
  
  // Effacer erreur
  clearError: () => {
    set({ error: null });
  }
}));
