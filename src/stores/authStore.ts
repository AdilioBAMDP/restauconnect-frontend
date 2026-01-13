import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, type User as ApiUser, type LoginRequest } from '@/services/api';
import { logger } from '@/utils/logger';

// Interface pour l'état d'authentification
interface AuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Action de connexion
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const authResponse = await apiService.auth.login(credentials);
          
          // Stocker le token avec tous les noms pour compatibilité
          localStorage.setItem('auth_token', authResponse.token);
          localStorage.setItem('authToken', authResponse.token);
          localStorage.setItem('token', authResponse.token);
          
          set({
            user: authResponse.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null
          });
          return false;
        }
      },

      // Connexion Admin directe (pour test)
      loginAsAdmin: () => {
        const adminUser: ApiUser = {
          id: 'admin-001',
          email: 'admin@restauconnect.fr',
          firstName: 'Admin',
          lastName: 'Test',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        // ✅ TOKEN DE TEST VALIDE - Le backend accepte les tokens qui commencent par "test-token-"
        // Format: test-token-{userId} où userId doit correspondre à un compte de test
        const testToken = 'test-token-admin-001';
        
        // Stocker le token avec tous les noms pour compatibilité
        localStorage.setItem('auth_token', testToken);
        localStorage.setItem('authToken', testToken);
        localStorage.setItem('token', testToken);
        
        logger.info('🔐 Admin login with test token:', testToken);
        
        set({
          user: adminUser,
          isAuthenticated: true,
          error: null
        });
      },

      // Action de déconnexion
      logout: () => {
        apiService.auth.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Rafraîchir les données utilisateur
      refreshUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;
        
        try {
          set({ isLoading: true });
          const currentUser = await apiService.auth.getCurrentUser();
          set({
            user: currentUser,
            isLoading: false
          });
        } catch (error) {
          logger.error('Erreur lors du rafraîchissement de l\'utilisateur', error);
          set({ isLoading: false });
        }
      },

      // Nettoyer les erreurs
      clearError: () => set({ error: null }),

      // Définir l'état de chargement
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
