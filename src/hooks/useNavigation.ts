/**
 * Hook personnalisé pour la navigation avec mise à jour d'URL
 * Remplace l'utilisation directe de navigateTo
 */

import { useCallback } from 'react';
import { NavigationManager, type PageName } from '@/services/NavigationManager';
import { useAppStore } from '@/stores/appStore';

export const useNavigation = () => {
  const appStore = useAppStore();

  // Navigation qui met à jour l'URL
  const navigateTo = useCallback((page: PageName, options?: { 
    queryParams?: Record<string, string>;
    preserveHistory?: boolean;
  }) => {
    NavigationManager.navigateTo(page, options);
  }, []);

  return {
    // ✅ Navigation recommandée (avec URL)
    navigateTo,
    
    // État actuel
    currentPage: appStore.currentPage
  };
};

export default useNavigation;
