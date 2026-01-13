// Types de base pour l'artisan
export interface Command {
  id: string;
  numero: string;
  status: 'devis' | 'confirme' | 'en_cours' | 'termine' | 'annule';
  urgence: 'normale' | 'urgent' | 'critique';
  clientName: string;
  clientAddress: string;
  totalTTC: number;
  dateIntervention?: Date;
  items: CommandItem[];
}

export interface CommandItem {
  id: string;
  description: string;
  quantite: number;
  totalHT: number;
}

export interface InventoryItem {
  id: string;
  nom: string;
  quantite: number;
  quantiteMinimale: number;
  alertes: string[];
}

export interface Employee {
  id: string;
  nom: string;
  planning: PlanningSlot[];
}

export interface PlanningSlot {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  statut: 'planifie' | 'en_cours' | 'termine';
  notes: string;
}

export interface Route {
  id: string;
  nom: string;
  distance: number;
}

export interface BusinessAnalytics {
  chiffreAffaire: {
    evolution: number;
  };
  performance: {
    productivite: number;
  };
}

export interface FactureSituation {
  id: string;
  numero: string;
  numeroSituation: number;
  client: {
    nom: string;
    adresse: {
      rue: string;
    };
    telephone: string;
    email: string;
  };
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  tauxTVA: number;
  avancementPourcentage: number;
  statut: 'emise' | 'payee' | 'retard';
  conforme: boolean;
  dateEcheance: Date;
  etapesRealisees: EtapeRealisee[];
  attestationsJointes: Attestation[];
}

export interface EtapeRealisee {
  libelle: string;
  description: string;
  pourcentageAvancement: number;
  mainOeuvre: MainOeuvre[];
  materiaux: Materiau[];
}

export interface MainOeuvre {
  totalHT: number;
}

export interface Materiau {
  totalHT: number;
}

export interface Attestation {
  type: 'decennale' | 'responsabilite_civile' | string;
  dateExpiration: Date;
  valide: boolean;
}