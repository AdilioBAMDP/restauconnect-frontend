import axios from 'axios';
import { Quote, QuoteFormData, InvoiceFormData, ArtisanStats } from '@/types/artisan.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration axios avec token d'authentification
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  // Chercher le token dans tous les noms possibles (compatibilité)
  const token = localStorage.getItem('auth_token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ArtisanService {
  // 📋 GESTION DES DEVIS
  
  static async getQuotes(artisanId: string, status?: string, page = 1, limit = 20) {
    try {
      const params = new URLSearchParams({
        artisanId,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status && status !== 'all') {
        params.append('status', status);
      }
      
      const response = await apiClient.get(`/artisan/quotes?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération devis:', error);
      throw error;
    }
  }
  
  static async createQuote(quoteData: QuoteFormData) {
    try {
      const response = await apiClient.post('/artisan/quotes', quoteData);
      return response.data;
    } catch (error) {
      console.error('Erreur création devis:', error);
      throw error;
    }
  }
  
  static async getQuote(quoteId: string) {
    try {
      const response = await apiClient.get(`/artisan/quotes/${quoteId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération devis:', error);
      throw error;
    }
  }
  
  static async updateQuote(quoteId: string, updateData: Partial<Quote>) {
    try {
      const response = await apiClient.put(`/artisan/quotes/${quoteId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour devis:', error);
      throw error;
    }
  }
  
  static async acceptQuote(quoteId: string, signatureData: {
    clientSignature: {
      signatureData: string;
      ipAddress: string;
    };
    workStartDate?: Date;
    workEndDate?: Date;
  }) {
    try {
      const response = await apiClient.put(`/artisan/quotes/${quoteId}/accept`, signatureData);
      return response.data;
    } catch (error) {
      console.error('Erreur acceptation devis:', error);
      throw error;
    }
  }
  
  static async deleteQuote(quoteId: string) {
    try {
      const response = await apiClient.delete(`/artisan/quotes/${quoteId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression devis:', error);
      throw error;
    }
  }
  
  // 🧾 GESTION DES FACTURES
  
  static async getInvoices(artisanId: string, filters?: {
    quoteId?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const params = new URLSearchParams({
        artisanId,
        page: (filters?.page || 1).toString(),
        limit: (filters?.limit || 20).toString(),
      });
      
      if (filters?.quoteId) params.append('quoteId', filters.quoteId);
      if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      
      const response = await apiClient.get(`/artisan/invoices?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération factures:', error);
      throw error;
    }
  }
  
  static async createInvoice(invoiceData: InvoiceFormData & { quoteId: string }) {
    try {
      const response = await apiClient.post('/artisan/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Erreur création facture:', error);
      throw error;
    }
  }
  
  static async getInvoice(invoiceId: string) {
    try {
      const response = await apiClient.get(`/artisan/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération facture:', error);
      throw error;
    }
  }
  
  static async updateInvoiceStatus(invoiceId: string, status: string, paymentData?: {
    paidAmount?: number;
    paymentMethod?: string;
  }) {
    try {
      const response = await apiClient.put(`/artisan/invoices/${invoiceId}/status`, {
        status,
        ...paymentData,
        paidAt: status === 'paid' ? new Date() : undefined
      });
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour facture:', error);
      throw error;
    }
  }
  
  static async releaseGuarantee(invoiceId: string) {
    try {
      const response = await apiClient.put(`/artisan/invoices/${invoiceId}/release-guarantee`);
      return response.data;
    } catch (error) {
      console.error('Erreur libération garantie:', error);
      throw error;
    }
  }
  
  // 📊 STATISTIQUES ET REPORTING
  
  static async getArtisanStats(artisanId: string): Promise<{ success: boolean; stats: ArtisanStats }> {
    try {
      const response = await apiClient.get(`/artisan/stats?artisanId=${artisanId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }
  
  static async getMonthlyRevenue(artisanId: string, year: number) {
    try {
      const response = await apiClient.get(`/artisan/revenue?artisanId=${artisanId}&year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération CA mensuel:', error);
      throw error;
    }
  }
  
  static async getGuaranteeRetentions(artisanId: string) {
    try {
      const response = await apiClient.get(`/artisan/guarantees?artisanId=${artisanId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération retenues:', error);
      throw error;
    }
  }
  
  // 📄 GÉNÉRATION DE DOCUMENTS
  
  static async generateQuotePDF(quoteId: string) {
    try {
      const response = await apiClient.get(`/artisan/quotes/${quoteId}/pdf`, {
        responseType: 'blob'
      });
      
      // Création du blob et téléchargement
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${quoteId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Devis téléchargé avec succès' };
    } catch (error) {
      console.error('Erreur génération PDF devis:', error);
      throw error;
    }
  }
  
  static async generateInvoicePDF(invoiceId: string) {
    try {
      const response = await apiClient.get(`/artisan/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Facture téléchargée avec succès' };
    } catch (error) {
      console.error('Erreur génération PDF facture:', error);
      throw error;
    }
  }
  
  // 🔧 UTILITAIRES
  
  static calculateTotals(items: Array<{
    quantity: number;
    unitPriceHT: number;
    tvaRate: number;
  }>) {
    let subtotalHT = 0;
    let totalTVA = 0;
    
    const processedItems = items.map(item => {
      const totalHT = item.quantity * item.unitPriceHT;
      const tvaAmount = totalHT * (item.tvaRate / 100);
      const totalTTC = totalHT + tvaAmount;
      
      subtotalHT += totalHT;
      totalTVA += tvaAmount;
      
      return {
        ...item,
        totalHT,
        totalTTC
      };
    });
    
    const totalTTC = subtotalHT + totalTVA;
    
    return {
      items: processedItems,
      subtotalHT: Math.round(subtotalHT * 100) / 100,
      totalTVA: Math.round(totalTVA * 100) / 100,
      totalTTC: Math.round(totalTTC * 100) / 100
    };
  }
  
  static validateQuoteData(data: QuoteFormData): string[] {
    const errors: string[] = [];
    
    if (!data.customer?.firstName) errors.push('Prénom client requis');
    if (!data.customer?.lastName) errors.push('Nom client requis');
    if (!data.customer?.email) errors.push('Email client requis');
    if (!data.customer?.phone) errors.push('Téléphone client requis');
    if (!data.projectDescription) errors.push('Description projet requise');
    if (!data.items || data.items.length === 0) errors.push('Au moins un article requis');
    
    // Validation articles
    data.items?.forEach((item, index) => {
      if (!item.description) errors.push(`Description article ${index + 1} requise`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Quantité article ${index + 1} invalide`);
      if (!item.unitPriceHT || item.unitPriceHT <= 0) errors.push(`Prix unitaire article ${index + 1} invalide`);
    });
    
    return errors;
  }
  
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
  
  static formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR');
  }
}

export default ArtisanService;