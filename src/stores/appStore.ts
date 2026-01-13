// Helpers de chiffrement/déchiffrement simulés (pour conformité RGPD)
function encryptData(data: unknown): string {
  // Simulation simple (base64)
  return btoa(JSON.stringify(data));
}

function decryptData(data: string): unknown {
  try {
    return JSON.parse(atob(data));
  } catch {
    return null;
  }
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PageName, NavigationManager } from '@/services/NavigationManager';

interface AppState {
  language: 'fr' | 'en' | 'es';
  currency: 'EUR' | 'USD' | 'GBP';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: boolean;
  geolocation: boolean;
  ecoMode: boolean;
  currentPage: PageName;
  setLanguage: (language: 'fr' | 'en' | 'es') => void;
  setCurrency: (currency: 'EUR' | 'USD' | 'GBP') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  toggleNotifications: () => void;
  toggleGeolocation: () => void;
  toggleEcoMode: () => void;
  navigateTo: (page: PageName, options?: { queryParams?: Record<string, string>; preserveHistory?: boolean; }) => void;
  saveEncryptedState: () => void;
  loadEncryptedState: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'fr',
      currency: 'EUR',
      theme: 'light',
      sidebarOpen: false,
      notifications: true,
      geolocation: true,
      ecoMode: false,
      currentPage: 'home',

      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleGeolocation: () => set((state) => ({ geolocation: !state.geolocation })),
      toggleEcoMode: () => set((state) => ({ ecoMode: !state.ecoMode })),
      navigateTo: (page, options) => {
        set({ currentPage: page });
        NavigationManager.navigateTo(page, options);
      },

      // Exemples d'utilisation du chiffrement simulé
      saveEncryptedState: () => {
        const state = get();
        const encrypted = encryptData(state);
        localStorage.setItem('app-encrypted', encrypted);
      },
      loadEncryptedState: () => {
        const encrypted = localStorage.getItem('app-encrypted');
        if (encrypted) {
          const state = decryptData(encrypted);
          if (state) set(state);
        }
      }
    }),
    {
      name: 'app-storage'
    }
  )
);
