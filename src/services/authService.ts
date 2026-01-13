import axios from 'axios';
import { UserRole } from '@/types';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Récupérer le token et l'utilisateur du localStorage au démarrage
    this.token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (error) {
        logger.error('Erreur lors du parsing de l\'utilisateur sauvegardé', error);
        localStorage.removeItem('auth_user');
      }
    }
  }

  // Connexion avec email et mot de passe
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const data = response.data;

      // Gérer les deux formats de réponse (avec ou sans data.data)
      const authData = data.data ? data.data : data;
      
      // Vérifier si nous avons un token et un utilisateur (succès)
      if (authData.token && authData.user) {
        // Transformer les données de l'API pour correspondre à l'interface frontend
        const transformedUser: User = {
          id: authData.user._id?.toString() || authData.user.id?.toString() || '0',
          email: authData.user.email,
          role: authData.user.role,
          name: authData.user.name || `${authData.user.firstName || ''} ${authData.user.lastName || ''}`.trim() || authData.user.email,
          avatar: authData.user.avatar
        };

        this.token = authData.token;
        this.user = transformedUser;
        
        // Sauvegarder dans localStorage
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('auth_user', JSON.stringify(transformedUser));
        
        logger.info('✅ Connexion réussie pour:', transformedUser.email);
        
        return {
          success: true,
          user: transformedUser,
          token: authData.token,
          message: authData.message || 'Connexion réussie'
        };
      } else {
        throw new Error(authData.message || 'Échec de la connexion - données manquantes');
      }
    } catch (error: unknown) {
      logger.error('❌ Erreur de connexion', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      
      throw new Error('Erreur de connexion au serveur');
    }
  }

  // Connexion rapide avec un rôle (pour les tests)
  async quickLogin(role: string): Promise<LoginResponse> {
    const testCredentials: { [key: string]: LoginCredentials } = {
      // Comptes avec données de test réelles (password123)
      restaurant: { email: 'restaurant@test.fr', password: 'password123' },
      artisan: { email: 'artisan@test.fr', password: 'password123' },
      driver: { email: 'driver1@test.fr', password: 'password123' },
      livreur: { email: 'driver1@test.fr', password: 'password123' },
      // Autres comptes de test
      supplier: { email: 'supplier@test.fr', password: 'supplier123' },
      fournisseur: { email: 'supplier@test.fr', password: 'supplier123' },
      candidat: { email: 'candidat@test.fr', password: 'candidat123' },
      banker: { email: 'banker@test.fr', password: 'banker123' },
      banquier: { email: 'banker@test.fr', password: 'banker123' },
      community_manager: { email: 'cm@test.fr', password: 'cm123' },
      admin: { email: 'admin@restauconnect.fr', password: 'admin123' }
    };

    const credentials = testCredentials[role];
    if (!credentials) {
      throw new Error(`Rôle "${role}" non reconnu`);
    }

    // Délai pour éviter l'erreur 429 (Too Many Requests)
    await new Promise(resolve => setTimeout(resolve, 300));

    return this.login(credentials);
  }

  // Déconnexion
  logout(): void {
    this.token = null;
    this.user = null;
    // Supprimer tous les tokens et données utilisateur possibles
    localStorage.removeItem('auth_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user');
    logger.info('🚪 Déconnexion effectuée - Tous les tokens supprimés');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.user;
  }

  // Obtenir le token
  getToken(): string | null {
    return this.token;
  }

  // Vérifier la validité du token
  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      return response.data.success === true;
    } catch (error) {
      logger.error('Token invalide', error);
      this.logout();
      return false;
    }
  }
}

// Instance singleton
export const authService = new AuthService();
export default authService;
