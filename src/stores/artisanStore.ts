import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Quote, Invoice, ArtisanStats, QuoteFormData, InvoiceFormData } from '@/types/artisan.types';
import ArtisanService from '@/services/artisanService';

interface SignatureData {
  clientSignature: {
    signatureData: string;
    ipAddress: string;
  };
  workStartDate?: Date;
  workEndDate?: Date;
}

interface PaymentData {
  paidAmount?: number;
  paymentMethod?: string;
}

interface QuotesFilters {
  status: string;
  dateRange?: { start: Date; end: Date };
}

interface InvoicesFilters {
  status: string;
  type: string;
  quoteId?: string;
}

interface ArtisanStore {
  // 📊 État des données
  quotes: Quote[];
  invoices: Invoice[];
  currentQuote: Quote | null;
  currentInvoice: Invoice | null;
  stats: ArtisanStats | null;
  
  // 🔄 États de chargement
  isLoading: boolean;
  isLoadingQuotes: boolean;
  isLoadingInvoices: boolean;
  isLoadingStats: boolean;
  
  // 📄 Pagination et filtres
  quotesPage: number;
  quotesLimit: number;
  quotesTotalPages: number;
  quotesFilters: QuotesFilters;
  
  invoicesPage: number;
  invoicesLimit: number;
  invoicesTotalPages: number;
  invoicesFilters: InvoicesFilters;
  
  // ❌ Gestion des erreurs
  error: string | null;
  
  // 🎯 Actions - Devis
  loadQuotes: (artisanId: string, page?: number) => Promise<void>;
  createQuote: (quoteData: QuoteFormData) => Promise<Quote>;
  updateQuote: (quoteId: string, updateData: Partial<Quote>) => Promise<void>;
  acceptQuote: (quoteId: string, signatureData: SignatureData) => Promise<void>;
  deleteQuote: (quoteId: string) => Promise<void>;
  setCurrentQuote: (quote: Quote | null) => void;
  
  // 🎯 Actions - Factures
  loadInvoices: (artisanId: string, page?: number) => Promise<void>;
  createInvoice: (invoiceData: InvoiceFormData & { quoteId: string }) => Promise<Invoice>;
  updateInvoiceStatus: (invoiceId: string, status: string, paymentData?: PaymentData) => Promise<void>;
  releaseGuarantee: (invoiceId: string) => Promise<void>;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  
  // 🎯 Actions - Statistiques
  loadStats: (artisanId: string) => Promise<void>;
  
  // 🎯 Actions - Filtres et pagination
  setQuotesFilters: (filters: Partial<QuotesFilters>) => void;
  setInvoicesFilters: (filters: Partial<InvoicesFilters>) => void;
  setQuotesPage: (page: number) => void;
  setInvoicesPage: (page: number) => void;
  
  // 🎯 Actions - Utilitaires
  clearError: () => void;
  reset: () => void;
}

const initialFilters = {
  quotes: {
    status: 'all'
  },
  invoices: {
    status: 'all',
    type: 'all'
  }
};

const handleError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const errorObj = error as { response?: { data?: { message?: string } } };
    return errorObj.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

export const useArtisanStore = create<ArtisanStore>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        quotes: [],
        invoices: [],
        currentQuote: null,
        currentInvoice: null,
        stats: null,
        
        isLoading: false,
        isLoadingQuotes: false,
        isLoadingInvoices: false,
        isLoadingStats: false,
        
        quotesPage: 1,
        quotesLimit: 20,
        quotesTotalPages: 1,
        quotesFilters: initialFilters.quotes,
        
        invoicesPage: 1,
        invoicesLimit: 20,
        invoicesTotalPages: 1,
        invoicesFilters: initialFilters.invoices,
        
        error: null,
        
        // Actions - Devis
        loadQuotes: async (artisanId: string, page?: number) => {
          const currentPage = page || get().quotesPage;
          const { quotesLimit, quotesFilters } = get();
          
          set({ isLoadingQuotes: true, error: null });
          
          try {
            const response = await ArtisanService.getQuotes(
              artisanId,
              quotesFilters.status,
              currentPage,
              quotesLimit
            );
            
            set({
              quotes: response.quotes || [],
              quotesPage: currentPage,
              quotesTotalPages: response.totalPages || 1,
              isLoadingQuotes: false
            });
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors du chargement des devis'),
              isLoadingQuotes: false
            });
          }
        },
        
        createQuote: async (quoteData: QuoteFormData): Promise<Quote> => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await ArtisanService.createQuote(quoteData);
            const newQuote = response.quote;
            
            set((state) => ({
              quotes: [newQuote, ...state.quotes],
              isLoading: false
            }));
            
            return newQuote;
          } catch (error: unknown) {
            const errorMessage = handleError(error, 'Erreur lors de la création du devis');
            set({
              error: errorMessage,
              isLoading: false
            });
            throw error;
          }
        },
        
        updateQuote: async (quoteId: string, updateData: Partial<Quote>) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await ArtisanService.updateQuote(quoteId, updateData);
            const updatedQuote = response.quote;
            
            set((state) => ({
              quotes: state.quotes.map(q => q._id === quoteId ? updatedQuote : q),
              currentQuote: state.currentQuote?._id === quoteId ? updatedQuote : state.currentQuote,
              isLoading: false
            }));
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors de la mise à jour du devis'),
              isLoading: false
            });
            throw error;
          }
        },
        
        acceptQuote: async (quoteId: string, signatureData: SignatureData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await ArtisanService.acceptQuote(quoteId, signatureData);
            const acceptedQuote = response.quote;
            
            set((state) => ({
              quotes: state.quotes.map(q => q._id === quoteId ? acceptedQuote : q),
              currentQuote: state.currentQuote?._id === quoteId ? acceptedQuote : state.currentQuote,
              isLoading: false
            }));
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors de l\'acceptation du devis'),
              isLoading: false
            });
            throw error;
          }
        },
        
        deleteQuote: async (quoteId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            await ArtisanService.deleteQuote(quoteId);
            
            set((state) => ({
              quotes: state.quotes.filter(q => q._id !== quoteId),
              currentQuote: state.currentQuote?._id === quoteId ? null : state.currentQuote,
              isLoading: false
            }));
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors de la suppression du devis'),
              isLoading: false
            });
            throw error;
          }
        },
        
        setCurrentQuote: (quote: Quote | null) => {
          set({ currentQuote: quote });
        },
        
        // Actions - Factures
        loadInvoices: async (artisanId: string, page?: number) => {
          const currentPage = page || get().invoicesPage;
          const { invoicesLimit, invoicesFilters } = get();
          
          set({ isLoadingInvoices: true, error: null });
          
          try {
            const response = await ArtisanService.getInvoices(artisanId, {
              ...invoicesFilters,
              page: currentPage,
              limit: invoicesLimit
            });
            
            set({
              invoices: response.invoices || [],
              invoicesPage: currentPage,
              invoicesTotalPages: response.totalPages || 1,
              isLoadingInvoices: false
            });
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors du chargement des factures'),
              isLoadingInvoices: false
            });
          }
        },
        
        createInvoice: async (invoiceData: InvoiceFormData & { quoteId: string }): Promise<Invoice> => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await ArtisanService.createInvoice(invoiceData);
            const newInvoice = response.invoice;
            
            set((state) => ({
              invoices: [newInvoice, ...state.invoices],
              isLoading: false
            }));
            
            return newInvoice;
          } catch (error: unknown) {
            const errorMessage = handleError(error, 'Erreur lors de la création de la facture');
            set({
              error: errorMessage,
              isLoading: false
            });
            throw error;
          }
        },
        
        updateInvoiceStatus: async (invoiceId: string, status: string, paymentData?: PaymentData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await ArtisanService.updateInvoiceStatus(invoiceId, status, paymentData);
            const updatedInvoice = response.invoice;
            
            set((state) => ({
              invoices: state.invoices.map(inv => inv._id === invoiceId ? updatedInvoice : inv),
              currentInvoice: state.currentInvoice?._id === invoiceId ? updatedInvoice : state.currentInvoice,
              isLoading: false
            }));
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors de la mise à jour de la facture'),
              isLoading: false
            });
            throw error;
          }
        },
        
        releaseGuarantee: async (invoiceId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await ArtisanService.releaseGuarantee(invoiceId);
            const updatedInvoice = response.invoice;
            
            set((state) => ({
              invoices: state.invoices.map(inv => inv._id === invoiceId ? updatedInvoice : inv),
              currentInvoice: state.currentInvoice?._id === invoiceId ? updatedInvoice : state.currentInvoice,
              isLoading: false
            }));
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors de la libération de garantie'),
              isLoading: false
            });
            throw error;
          }
        },
        
        setCurrentInvoice: (invoice: Invoice | null) => {
          set({ currentInvoice: invoice });
        },
        
        // Actions - Statistiques
        loadStats: async (artisanId: string) => {
          set({ isLoadingStats: true, error: null });
          
          try {
            const response = await ArtisanService.getArtisanStats(artisanId);
            
            set({
              stats: response.stats,
              isLoadingStats: false
            });
          } catch (error: unknown) {
            set({
              error: handleError(error, 'Erreur lors du chargement des statistiques'),
              isLoadingStats: false
            });
          }
        },
        
        // Actions - Filtres et pagination
        setQuotesFilters: (filters) => {
          set((state) => ({
            quotesFilters: { ...state.quotesFilters, ...filters },
            quotesPage: 1
          }));
        },
        
        setInvoicesFilters: (filters) => {
          set((state) => ({
            invoicesFilters: { ...state.invoicesFilters, ...filters },
            invoicesPage: 1
          }));
        },
        
        setQuotesPage: (page: number) => {
          set({ quotesPage: page });
        },
        
        setInvoicesPage: (page: number) => {
          set({ invoicesPage: page });
        },
        
        // Actions - Utilitaires
        clearError: () => {
          set({ error: null });
        },
        
        reset: () => {
          set({
            quotes: [],
            invoices: [],
            currentQuote: null,
            currentInvoice: null,
            stats: null,
            isLoading: false,
            isLoadingQuotes: false,
            isLoadingInvoices: false,
            isLoadingStats: false,
            quotesPage: 1,
            quotesTotalPages: 1,
            quotesFilters: initialFilters.quotes,
            invoicesPage: 1,
            invoicesTotalPages: 1,
            invoicesFilters: initialFilters.invoices,
            error: null
          });
        }
      }),
      {
        name: 'artisan-store',
        partialize: (state) => ({
          quotesFilters: state.quotesFilters,
          invoicesFilters: state.invoicesFilters,
          quotesLimit: state.quotesLimit,
          invoicesLimit: state.invoicesLimit
        })
      }
    ),
    {
      name: 'artisan-store'
    }
  )
);

// Sélecteurs optimisés
export const useQuotes = () => useArtisanStore(state => state.quotes);
export const useInvoices = () => useArtisanStore(state => state.invoices);
export const useCurrentQuote = () => useArtisanStore(state => state.currentQuote);
export const useCurrentInvoice = () => useArtisanStore(state => state.currentInvoice);
export const useArtisanStats = () => useArtisanStore(state => state.stats);
export const useArtisanLoading = () => useArtisanStore(state => ({
  isLoading: state.isLoading,
  isLoadingQuotes: state.isLoadingQuotes,
  isLoadingInvoices: state.isLoadingInvoices,
  isLoadingStats: state.isLoadingStats
}));
export const useArtisanError = () => useArtisanStore(state => state.error);

export default useArtisanStore;