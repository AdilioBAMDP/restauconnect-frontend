import axios from 'axios';
import { logger } from '@/utils/logger';

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interface pour les réponses de l'API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Interface pour l'utilisateur
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'restaurant' | 'artisan' | 'fournisseur' | 'candidat' | 'community_manager' | 'admin';
  isActive: boolean;
  createdAt: string;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  token: string;
  user: User;
}

// Interface pour la requête de connexion
export interface LoginRequest {
  email: string;
  password: string;
}

// Instance Axios configurée
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Pas besoin de cookies, on utilise JWT
});

// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    // Chercher le token dans tous les noms possibles (compatibilité)
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Compteur de 401 consécutifs sur routes protégées (détection token invalide)
let consecutive401Count = 0;
let logoutScheduled = false;

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Reset le compteur sur succès
    consecutive401Count = 0;
    return response;
  },
  (error) => {
    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Routes qui ne nécessitent pas d'auth (peuvent échouer silencieusement)
      const optionalRoutes = ['/marketplace/posts', '/marketplace/posts/ranked', '/auth/login', '/auth/register'];
      const isOptionalRoute = optionalRoutes.some(route => url.includes(route));
      
      if (!isOptionalRoute) {
        consecutive401Count++;
        logger.warn(`API 401 (${consecutive401Count}/3) - Token invalide ou expiré`, url);
        
        // Après 3 erreurs 401 consécutives sur routes protégées → token invalide
        // Déconnecter l'utilisateur pour éviter la boucle infinie
        if (consecutive401Count >= 3 && !logoutScheduled) {
          logoutScheduled = true;
          logger.warn('🔒 Token invalide détecté - Déconnexion automatique');
          // Nettoyer le localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('auth_user');
          // Notifier l'application via un événement custom
          window.dispatchEvent(new CustomEvent('auth:force-logout', { 
            detail: { reason: 'Token invalide ou expiré - reconnectez-vous' } 
          }));
          // Rediriger après un court délai
          setTimeout(() => {
            consecutive401Count = 0;
            logoutScheduled = false;
            // Recharger la page pour réinitialiser l'état React
            window.location.href = '/';
          }, 1000);
        }
      }
    }
    
    // ⚠️ IMPORTANT: Rejeter l'erreur complète pour préserver response.data.details
    // Ne pas créer un nouveau Error qui perdrait les informations
    return Promise.reject(error);
  }
);

// Services API
export const apiService = {
  // Service d'authentification
  auth: {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.data!;
    },
    
    logout: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
    },
    
    getCurrentUser: async (): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>('/users/profile');
      return response.data.data!;
    }
  },
  
  // Service utilisateurs
  users: {
    getAll: async (): Promise<User[]> => {
      const response = await apiClient.get<ApiResponse<User[]>>('/users');
      return response.data.data || [];
    },
    
    getById: async (id: string): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>(`/api/users/${id}`);
      return response.data.data!;
    },
    
    updateProfile: async (userData: Partial<User>): Promise<User> => {
      const response = await apiClient.put<ApiResponse<User>>('/users/profile', userData);
      return response.data.data!;
    }
  },
  
  // Service annonces (préparé pour l'implémentation future)
  listings: {
    getAll: async () => {
      const response = await apiClient.get<ApiResponse>('/listings');
      return response.data.data || [];
    }
  },
  
  // Service messages (préparé pour l'implémentation future)
  messages: {
    getAll: async () => {
      const response = await apiClient.get<ApiResponse>('/messages');
      return response.data.data || [];
    }
  },
  
  // Service notifications (préparé pour l'implémentation future)
  notifications: {
    getAll: async () => {
      const response = await apiClient.get<ApiResponse>('/notifications');
      return response.data.data || [];
    }
  },

  // Service dashboard
  dashboard: {
    getStats: async () => {
      const response = await apiClient.get<ApiResponse>('/dashboard/stats');
      return response.data.data;
    },
    
    getActivity: async (limit = 20) => {
      const response = await apiClient.get<ApiResponse>(`/dashboard/activity?limit=${limit}`);
      return response.data.data;
    },
    
    getAnalytics: async (period = '30d', metric = 'views') => {
      const response = await apiClient.get<ApiResponse>(`/dashboard/analytics?period=${period}&metric=${metric}`);
      return response.data.data;
    }
  },

  // Service calendar
  calendar: {
    getEvents: async (start?: string, end?: string) => {
      const query = start && end ? `?start=${start}&end=${end}` : '';
      const response = await apiClient.get<ApiResponse>(`/calendar/events${query}`);
      return response.data.data || [];
    }
  },
  
  // Service utilitaires
  health: async () => {
    const response = await apiClient.get<ApiResponse>('/health');
    return response.data;
  }
};

// Configuration des endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/users/profile'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile'
  },
  LISTINGS: '/listings',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  HEALTH: '/health'
};

// Utilitaires
export const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('auth_token');

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user: User) => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem('auth_user');
};

export default apiService;
