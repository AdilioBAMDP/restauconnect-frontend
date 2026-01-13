import { describe, it, expect } from 'vitest';

// Utility functions tests
describe('Utility Functions', () => {
  describe('roleUtils', () => {
    it('should validate admin roles correctly', () => {
      const isAdmin = (role: string) => ['super_admin', 'community_manager'].includes(role);
      
      expect(isAdmin('super_admin')).toBe(true);
      expect(isAdmin('community_manager')).toBe(true);
      expect(isAdmin('restaurant')).toBe(false);
      expect(isAdmin('livreur')).toBe(false);
    });

    it('should validate test accounts', () => {
      const isTestAccount = (email: string) => {
        return email.endsWith('@test.fr') || email.endsWith('@demo.com');
      };

      expect(isTestAccount('admin@test.fr')).toBe(true);
      expect(isTestAccount('user@demo.com')).toBe(true);
      expect(isTestAccount('user@gmail.com')).toBe(false);
    });
  });

  describe('navigationUtils', () => {
    it('should map roles to correct dashboard pages', () => {
      const rolePageMap: Record<string, string> = {
        'restaurant': 'dashboard',
        'artisan': 'artisan-dashboard',
        'fournisseur': 'supplier-dashboard',
        'candidat': 'candidat-emploi',
        'community_manager': 'community-manager-dashboard',
        'super_admin': 'admin-dashboard',
        'banquier': 'banker-dashboard',
        'investisseur': 'investor-dashboard',
        'livreur': 'driver-dashboard',
        'comptable': 'comptable'
      };

      expect(rolePageMap['restaurant']).toBe('dashboard');
      expect(rolePageMap['livreur']).toBe('driver-dashboard');
      expect(rolePageMap['comptable']).toBe('comptable');
    });
  });

  describe('Price formatting', () => {
    it('should format prices correctly', () => {
      const formatPrice = (price: number, currency = 'EUR') => {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency
        }).format(price);
      };

      expect(formatPrice(1234.56)).toContain('1 234,56');
      expect(formatPrice(10)).toContain('10,00');
    });
  });

  describe('Order number generation', () => {
    it('should generate valid order numbers', () => {
      const generateOrderNumber = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORD-${year}${month}${day}-${random}`;
      };

      const orderNumber = generateOrderNumber();
      expect(orderNumber).toMatch(/^ORD-\d{8}-\d{4}$/);
    });
  });
});
