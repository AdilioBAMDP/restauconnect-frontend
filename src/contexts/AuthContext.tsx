import React, { createContext, useState, ReactNode } from 'react';
import authService from '@/services/authService';
import { logger } from '@/utils/logger';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Récupérer l'utilisateur du localStorage au démarrage (même clé que authService)
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  const [isLoading, setIsLoading] = useState(false);

  // ✅ CORRIGÉ: login async qui appelle authService
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      logger.info('🔐 Tentative de connexion via AuthContext:', email);
      const response = await authService.login({ email, password });
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        // ✅ Stocker le token avec TOUS les noms pour compatibilité avec l'intercepteur API
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('token', response.token);
        logger.info('✅ AuthContext: Connexion réussie', response.user.role);
        logger.info('✅ AuthContext: Token stocké:', response.token.substring(0, 20) + '...');
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      logger.error('❌ AuthContext: Erreur de connexion', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // ✅ Supprimer TOUS les tokens
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Aussi supprimer 'user' si présent
    logger.info('🚪 Déconnexion effectuée');
    // Rediriger vers la page welcome (publique) pour éviter toute boucle sur login inconnu
    window.location.hash = '#welcome';
    // Forcer un reload pour réinitialiser tout l'état React si besoin
    setTimeout(() => window.location.reload(), 100);
  };

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// Export nommé pour useAuth et AuthContextType
export { AuthContext };
export type { AuthContextType };
export default AuthContext;

