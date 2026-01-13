/**
 * Utilitaires d'authentification
 */

/**
 * Récupère le token JWT depuis localStorage
 * Cherche dans plusieurs clés pour compatibilité
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('authToken') || 
         localStorage.getItem('token');
};

/**
 * Génère les headers d'authentification pour axios
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
