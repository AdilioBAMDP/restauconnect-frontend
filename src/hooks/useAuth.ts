import { useState, useEffect } from 'react';
import authService, { type User, type LoginCredentials, type LoginResponse } from '@/services/authService';
import { logger } from '@/utils/logger';

// Hook pour l'authentification
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Vérifier que le token est toujours valide
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authResponse: LoginResponse = await authService.login(credentials);
      
      if (authResponse.success) {
        // ✅ FIX: Uniformiser nom token (auth_token partout)
        localStorage.setItem('auth_token', authResponse.token);
        localStorage.setItem('user', JSON.stringify(authResponse.user));
        
        setUser(authResponse.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        return true;
      } else {
        setError(authResponse.message || 'Erreur de connexion');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    // Rediriger vers la page d'accueil
    window.location.hash = '#welcome';
    // Forcer un reload pour réinitialiser l'état
    setTimeout(() => window.location.reload(), 100);
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      logger.error('Erreur lors du rafraîchissement de l\'utilisateur', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  };
};

// Hook générique pour les appels API
export const useApi = <T>(
  apiCall: () => Promise<T>
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// Hook pour le profil utilisateur
export const useUserProfile = () => {
  const { user } = useAuth();
  return {
    data: user,
    loading: false,
    error: null,
    refetch: async () => {}
  };
};

// Hook pour vérifier le token
export const useTokenVerification = () => {
  return useApi(() => authService.verifyToken());
};
