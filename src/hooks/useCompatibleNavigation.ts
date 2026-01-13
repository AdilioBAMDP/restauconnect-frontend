import { useNavigation } from './useNavigation';
import type { PageName } from '@/services/NavigationManager';

/**
 * Hook de navigation compatible pour les anciens composants
 * Permet d'utiliser la navigation avec string au lieu de PageName
 */
export const useCompatibleNavigation = () => {
  const { navigateTo: originalNavigateTo, currentPage } = useNavigation();
  
  // Version compatible qui accepte string
  const navigateTo = (page: string | PageName, options?: { queryParams?: Record<string, string>; preserveHistory?: boolean; }) => {
    originalNavigateTo(page as PageName, options);
  };
  
  // Version stricte qui force PageName  
  const navigateToStrict = (page: PageName, options?: { queryParams?: Record<string, string>; preserveHistory?: boolean; }) => {
    originalNavigateTo(page, options);
  };
  
  return {
    navigateTo,
    navigateToStrict,
    currentPage
  };
};
