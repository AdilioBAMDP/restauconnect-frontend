/**
 * Common component types
 */

export type UserRole = 
  | 'restaurant'
  | 'supplier'
  | 'fournisseur'
  | 'artisan'
  | 'driver'
  | 'admin'
  | 'super_admin'
  | 'investor'
  | 'banker'
  | 'accountant'
  | 'candidat'
  | 'transporteur'
  | 'auditeur'
  | 'community-manager'
  | 'community_manager';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'contains' | 'in';
  value: any;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}
