import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook pour accéder au contexte d'authentification
 * Doit être utilisé dans un composant enfant de AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
