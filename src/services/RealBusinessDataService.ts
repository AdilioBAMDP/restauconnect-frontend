import { Command } from '@/types/artisan';
interface Invoice {
  overdue: boolean;
  // Ajoutez ici les autres propriétés nécessaires selon votre modèle MongoDB
}

export class RealBusinessDataService {
  static getRealCommands(): Command[] {
    return [
      {
        id: 'cmd-001',
        numero: 'CMD-2025-001',
        status: 'en_cours',
        urgence: 'critique',
        clientName: 'Restaurant Le Comptoir',
        clientAddress: '123 Rue de la Paix, Paris',
        totalTTC: 1250.00,
        dateIntervention: new Date(),
        items: [
          {
            id: 'item-001',
            description: 'Réparation fuite canalisation cuisine',
            quantite: 1,
            totalHT: 450.00
          },
          {
            id: 'item-002',
            description: 'Remplacement robinet professionnel',
            quantite: 2,
            totalHT: 650.00
          }
        ]
      },
      {
        id: 'cmd-002',
        numero: 'CMD-2025-002',
        status: 'devis',
        urgence: 'normale',
        clientName: 'Brasserie du Marché',
        clientAddress: '45 Avenue des Champs, Paris',
        totalTTC: 850.00,
        items: [
          {
            id: 'item-003',
            description: 'Installation lave-vaisselle professionnel',
            quantite: 1,
            totalHT: 720.00
          }
        ]
      }
    ];
  }

  static getRealInventory() {
    return [
      {
        id: 'inv-001',
        nom: 'Tuyaux PVC 32mm',
        quantite: 5,
        quantiteMinimale: 10,
        alertes: ['Stock faible']
      }
    ];
  }

  static getRealAnalytics() {
    return {
      chiffreAffaire: {
        evolution: 15
      },
      performance: {
        productivite: 85
      }
    };
  }

  static getRealInvoices() {
    return [];
  }

  static getRealNotifications() {
    return [
      {
        type: 'new_command',
        data: { clientName: 'Restaurant Le Comptoir' }
      }
    ];
  }

  static calculateDailyRevenue(commands: Command[]): number {
    return commands
      .filter(cmd => cmd.status === 'termine')
      .reduce((sum, cmd) => sum + cmd.totalTTC, 0);
  }

  static calculateMonthlyRevenue(commands: Command[]): number {
    return commands.reduce((sum, cmd) => sum + cmd.totalTTC, 0);
  }

  static getUrgentCommands(commands: Command[]): Command[] {
    return commands.filter(cmd => cmd.urgence === 'critique' || cmd.urgence === 'urgent');
  }

  static getOverdueInvoices(invoices: Invoice[]): Invoice[] {
    return invoices.filter(invoice => invoice.overdue);
  }
}

// Correction : retire le commentaire avec espace unicode